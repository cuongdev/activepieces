import {
    assertNotNullOrUndefined,
    AuthenticationResponse,
    FederatedAuthnLoginResponse,
    isNil,
    ThirdPartyAuthnProviderEnum,
    UserIdentityProvider,
} from '@activepieces/shared'
import { FastifyBaseLogger } from 'fastify'
import { authenticationService } from '../../../authentication/authentication.service'
import { system } from '../../../helper/system/system'
import { AppSystemProp } from '../../../helper/system/system-props'
import { platformService } from '../../../platform/platform.service'
import { domainHelper } from '../../custom-domains/domain-helper'
import { googleAuthnProvider } from './google-authn-provider'
import { microsoftEntraAuthnProvider } from './microsoft-entra-authn-provider'

export const federatedAuthnService = (log: FastifyBaseLogger) => ({
    async login({
        platformId,
        providerName,
    }: LoginParams): Promise<FederatedAuthnLoginResponse> {
        if (providerName === ThirdPartyAuthnProviderEnum.MICROSOFT) {
            const config = await getMicrosoftConfig(platformId, log)
            const loginUrl = await microsoftEntraAuthnProvider(log).getLoginUrl({ config, platformId })
            return { loginUrl }
        }

        // Default: Google
        const { clientId } = await getGoogleClientIdAndSecret(platformId, log)
        const loginUrl = await googleAuthnProvider(log).getLoginUrl({
            clientId,
            platformId,
        })
        return { loginUrl }
    },

    async claim({
        platformId,
        code,
        providerName,
    }: ClaimParams): Promise<AuthenticationResponse> {
        if (providerName === ThirdPartyAuthnProviderEnum.MICROSOFT) {
            const config = await getMicrosoftConfig(platformId, log)
            const idToken = await microsoftEntraAuthnProvider(log).authenticate({
                config,
                authorizationCode: code,
                platformId,
            })
            return authenticationService(log).federatedAuthn({
                email: idToken.email,
                firstName: idToken.firstName,
                lastName: idToken.lastName,
                trackEvents: true,
                newsLetter: false,
                provider: UserIdentityProvider.MICROSOFT,
                predefinedPlatformId: platformId ?? null,
                imageUrl: idToken.imageUrl,
            })
        }

        // Default: Google
        const { clientId, clientSecret } = await getGoogleClientIdAndSecret(platformId, log)
        const idToken = await googleAuthnProvider(log).authenticate({
            clientId,
            clientSecret,
            authorizationCode: code,
            platformId,
        })
        return authenticationService(log).federatedAuthn({
            email: idToken.email,
            firstName: idToken.firstName ?? 'john',
            lastName: idToken.lastName ?? 'doe',
            trackEvents: true,
            newsLetter: true,
            provider: UserIdentityProvider.GOOGLE,
            predefinedPlatformId: platformId ?? null,
            imageUrl: idToken.imageUrl,
        })
    },

    async getThirdPartyRedirectUrl(platformId: string | undefined): Promise<string> {
        return domainHelper.getInternalUrl({
            path: '/redirect',
            platformId,
        })
    },
})

async function getGoogleClientIdAndSecret(platformId: string | undefined, log: FastifyBaseLogger) {
    if (isNil(platformId)) {
        return {
            clientId: system.getOrThrow(AppSystemProp.GOOGLE_CLIENT_ID),
            clientSecret: system.getOrThrow(AppSystemProp.GOOGLE_CLIENT_SECRET),
        }
    }
    const platform = await platformService(log).getOneOrThrow(platformId)
    const clientInformation = platform.federatedAuthProviders.google
    assertNotNullOrUndefined(clientInformation, 'Google client information is not defined')
    return {
        clientId: clientInformation.clientId,
        clientSecret: clientInformation.clientSecret,
    }
}

async function getMicrosoftConfig(platformId: string | undefined, log: FastifyBaseLogger) {
    assertNotNullOrUndefined(platformId, 'Platform ID is required for Microsoft Entra SSO')
    const platform = await platformService(log).getOneOrThrow(platformId)
    const config = platform.federatedAuthProviders.microsoft
    assertNotNullOrUndefined(config, 'Microsoft Entra configuration is not set for this platform')
    return config
}

type LoginParams = {
    platformId: string | undefined
    providerName: ThirdPartyAuthnProviderEnum
}

type ClaimParams = {
    platformId: string | undefined
    code: string
    providerName: ThirdPartyAuthnProviderEnum
}
