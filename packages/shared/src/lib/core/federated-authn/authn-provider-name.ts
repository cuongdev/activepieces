export enum ThirdPartyAuthnProviderEnum {
    GOOGLE = 'google',
    SAML = 'saml',
    MICROSOFT = 'microsoft',
}

export type ThirdPartyAuthnProvidersToShowMap = {
    [k in ThirdPartyAuthnProviderEnum]: boolean;
}