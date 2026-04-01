import { z } from 'zod'
import { Nullable } from '../common'
import { ThirdPartyAuthnProviderEnum } from './authn-provider-name'

export * from './authn-provider-name'

export const federatedAuthnLoginResponse = z.object({
    loginUrl: z.string(),
})
export type FederatedAuthnLoginResponse = z.infer<typeof federatedAuthnLoginResponse>


export const ClaimTokenRequest = z.object({
    providerName: z.nativeEnum(ThirdPartyAuthnProviderEnum),
    code: z.string(),
})

export type ClaimTokenRequest = z.infer<typeof ClaimTokenRequest>

export const GoogleAuthnProviderConfig = z.object({
    clientId: z.string(),
    clientSecret: z.string(),
})
export type GoogleAuthnProviderConfig = z.infer<typeof GoogleAuthnProviderConfig>

export const GithubAuthnProviderConfig = z.object({
    clientId: z.string(),
    clientSecret: z.string(),
})
export type GithubAuthnProviderConfig = z.infer<typeof GithubAuthnProviderConfig>

export const SAMLAuthnProviderConfig = z.object({
    idpMetadata: z.string(),
    idpCertificate: z.string(),
})
export type SAMLAuthnProviderConfig = z.infer<typeof SAMLAuthnProviderConfig>

export const MicrosoftEntraAuthnProviderConfig = z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    tenantId: z.string(),
})
export type MicrosoftEntraAuthnProviderConfig = z.infer<typeof MicrosoftEntraAuthnProviderConfig>

export const FederatedAuthnProviderConfig = z.object({
    google: Nullable(GoogleAuthnProviderConfig),
    github: Nullable(GithubAuthnProviderConfig),
    saml: Nullable(SAMLAuthnProviderConfig),
    microsoft: Nullable(MicrosoftEntraAuthnProviderConfig),
})
export type FederatedAuthnProviderConfig = z.infer<typeof FederatedAuthnProviderConfig>

export const FederatedAuthnProviderConfigWithoutSensitiveData = z.object({
    google: Nullable(GoogleAuthnProviderConfig.pick({ clientId: true })),
    github: Nullable(GithubAuthnProviderConfig.pick({ clientId: true })),
    saml: Nullable(z.object({})),
    microsoft: Nullable(MicrosoftEntraAuthnProviderConfig.pick({ clientId: true, tenantId: true })),
})

export type FederatedAuthnProviderConfigWithoutSensitiveData = z.infer<typeof FederatedAuthnProviderConfigWithoutSensitiveData>
