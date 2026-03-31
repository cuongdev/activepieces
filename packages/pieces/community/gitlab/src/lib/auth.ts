import { PieceAuth, Property } from '@activepieces/pieces-framework';

export const gitlabAuth = PieceAuth.OAuth2({
  description:
    'To connect GitLab, create an OAuth2 application: **User Settings → Applications** (or **Admin → Applications** for system-wide). Set the redirect URI to the one provided by Activepieces and select **api** + **read_user** scopes.',
  props: {
    baseUrl: Property.ShortText({
      displayName: 'Base URL',
      description:
        'Your GitLab instance URL. Use https://gitlab.com for GitLab.com or your self-hosted URL (e.g., https://gitlab.example.com).',
      required: true,
      defaultValue: 'https://gitlab.com',
    }),
  },
  authUrl: '{baseUrl}/oauth/authorize',
  tokenUrl: '{baseUrl}/oauth/token',
  required: true,
  scope: ['api', 'read_user'],
});
