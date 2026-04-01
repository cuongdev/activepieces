import { AppConnectionValueForAuthProperty, PieceAuth, Property } from '@activepieces/pieces-framework';

export const gitlabAuth = [
  PieceAuth.OAuth2({
    description:
      'Connect GitLab via OAuth2: create an application in **User Settings → Applications** (or **Admin → Applications** for system-wide). Set the redirect URI provided by Activepieces and select **api** + **read_user** scopes.',
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
  }),
  PieceAuth.CustomAuth({
    displayName: 'Personal Access Token',
    description:
      'Connect GitLab using a Personal Access Token. Generate one at **User Settings → Access Tokens** (or a project/group access token). Grant **api** and **read_user** scopes.',
    required: true,
    props: {
      baseUrl: Property.ShortText({
        displayName: 'Base URL',
        description:
          'Your GitLab instance URL. Use https://gitlab.com for GitLab.com or your self-hosted URL (e.g., https://gitlab.example.com).',
        required: true,
        defaultValue: 'https://gitlab.com',
      }),
      access_token: PieceAuth.SecretText({
        displayName: 'Personal Access Token',
        description: 'GitLab personal access token with api and read_user scopes.',
        required: true,
      }),
    },
  }),
];

export type GitlabAuthValue = AppConnectionValueForAuthProperty<typeof gitlabAuth>;
