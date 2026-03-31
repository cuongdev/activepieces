import { PieceAuth, Property } from '@activepieces/pieces-framework';

export const openprojectAuth = PieceAuth.CustomAuth({
  required: true,
  description: `
To connect OpenProject:
1. Log in to your OpenProject instance
2. Go to **My Account** (top-right avatar) → **Access Tokens**
3. Click **Generate** next to "API" token
4. Copy the generated token
  `,
  props: {
    baseUrl: Property.ShortText({
      displayName: 'Instance URL',
      description: 'Your OpenProject URL (e.g., https://openproject.example.com)',
      required: true,
    }),
    apiKey: PieceAuth.SecretText({
      displayName: 'API Key',
      description: 'Your OpenProject API token',
      required: true,
    }),
  },
});

export type OpenProjectAuth = {
  baseUrl: string;
  apiKey: string;
};
