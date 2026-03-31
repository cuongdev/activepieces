import { getAccessTokenOrThrow } from '@activepieces/pieces-common';
import { OAuth2PropertyValue, Property } from '@activepieces/pieces-framework';
import { GitlabApi } from './client';
import { gitlabAuth } from '../auth';

export const gitlabCommon = {
  projectId: (required = true) =>
    Property.Dropdown({
      auth: gitlabAuth,
      displayName: 'Project',
      required,
      refreshers: ['auth'],
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            placeholder: 'Setup authentication first',
            options: [],
          };
        }
        const client = makeClient(auth as OAuth2PropertyValue);
        const res = await client.listProjects({
          simple: true,
          membership: true,
        });
        return {
          disabled: false,
          options: res.map((project) => ({
            label: project.name,
            value: project.id,
          })),
        };
      },
    }),
};

export function makeClient(auth: OAuth2PropertyValue): GitlabApi {
  const token = getAccessTokenOrThrow(auth);
  const baseUrl = (auth.props?.['baseUrl'] as string | undefined) ?? 'https://gitlab.com';
  return new GitlabApi(token, baseUrl);
}
