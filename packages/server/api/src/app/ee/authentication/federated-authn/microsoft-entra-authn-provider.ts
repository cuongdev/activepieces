import {
    ActivepiecesError,
    ErrorCode,
    isNil,
    MicrosoftEntraAuthnProviderConfig,
} from '@activepieces/shared'
import { FastifyBaseLogger } from 'fastify'
import jwksClient from 'jwks-rsa'
import { JwtSignAlgorithm, jwtUtils } from '../../../helper/jwt-utils'
import { federatedAuthnService } from './federated-authn-service'

export const microsoftEntraAuthnProvider = (log: FastifyBaseLogger) => ({
    async getLoginUrl(params: GetLoginUrlParams): Promise<string> {
        const { config, platformId } = params
        const loginUrl = new URL(
            `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/authorize`,
        )
        loginUrl.searchParams.set('client_id', config.clientId)
        loginUrl.searchParams.set(
            'redirect_uri',
            await federatedAuthnService(log).getThirdPartyRedirectUrl(platformId),
        )
        loginUrl.searchParams.set('scope', 'openid profile email')
        loginUrl.searchParams.set('response_type', 'code')
        loginUrl.searchParams.set('response_mode', 'query')
        return loginUrl.href
    },

    async authenticate(params: AuthenticateParams): Promise<MicrosoftEntraIdToken> {
        const { config, authorizationCode, platformId } = params
        const idToken = await exchangeCodeForIdToken(log, config, authorizationCode, platformId)
        return verifyIdToken(config, idToken)
    },
})

async function exchangeCodeForIdToken(
    log: FastifyBaseLogger,
    config: MicrosoftEntraAuthnProviderConfig,
    code: string,
    platformId: string | undefined,
): Promise<string> {
    const response = await fetch(
        `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: config.clientId,
                client_secret: config.clientSecret,
                redirect_uri: await federatedAuthnService(log).getThirdPartyRedirectUrl(platformId),
                grant_type: 'authorization_code',
                scope: 'openid profile email',
            }),
        },
    )

    const body = await response.json() as { id_token?: string; error_description?: string }
    if (isNil(body.id_token)) {
        throw new ActivepiecesError(
            { code: ErrorCode.INVALID_CREDENTIALS, params: null },
            `Microsoft Entra token exchange failed: ${body.error_description ?? 'no id_token returned'}`,
        )
    }
    return body.id_token
}

async function verifyIdToken(
    config: MicrosoftEntraAuthnProviderConfig,
    idToken: string,
): Promise<MicrosoftEntraIdToken> {
    const { header } = jwtUtils.decode({ jwt: idToken })

    const keyLoader = jwksClient({
        rateLimit: true,
        cache: true,
        jwksUri: `https://login.microsoftonline.com/${config.tenantId}/discovery/v2.0/keys`,
    })

    const signingKey = await keyLoader.getSigningKey(header.kid)
    const publicKey = signingKey.getPublicKey()

    const payload = await jwtUtils.decodeAndVerify<IdTokenPayloadRaw>({
        jwt: idToken,
        key: publicKey,
        issuer: [
            `https://login.microsoftonline.com/${config.tenantId}/v2.0`,
            `https://sts.windows.net/${config.tenantId}/`,
        ],
        algorithm: JwtSignAlgorithm.RS256,
        audience: config.clientId,
    })

    const email = payload.email ?? payload.preferred_username
    if (isNil(email)) {
        throw new ActivepiecesError(
            { code: ErrorCode.INVALID_CREDENTIALS, params: null },
            'Microsoft Entra ID token missing email claim',
        )
    }

    return {
        email,
        firstName: payload.given_name ?? payload.name?.split(' ')[0] ?? 'User',
        lastName: payload.family_name ?? payload.name?.split(' ').slice(1).join(' ') ?? '',
        imageUrl: undefined,
    }
}

type IdTokenPayloadRaw = {
    email?: string
    preferred_username?: string
    name?: string
    given_name?: string
    family_name?: string
    sub: string
    oid: string
    tid: string
    aud: string
    iss: string
}

type GetLoginUrlParams = {
    config: MicrosoftEntraAuthnProviderConfig
    platformId: string | undefined
}

type AuthenticateParams = {
    config: MicrosoftEntraAuthnProviderConfig
    authorizationCode: string
    platformId: string | undefined
}

export type MicrosoftEntraIdToken = {
    email: string
    firstName: string
    lastName: string
    imageUrl?: string
}
