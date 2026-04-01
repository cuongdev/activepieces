import { getAccessTokenOrThrow } from '@activepieces/pieces-common';
import { Property } from '@activepieces/pieces-framework';
import { AppConnectionType } from '@activepieces/shared';
import { GitlabApi } from './client';
import { GitlabAuthValue, gitlabAuth } from '../auth';

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
        const client = makeClient(auth as GitlabAuthValue);
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

export function makeClient(auth: GitlabAuthValue): GitlabApi {
  if (auth.type === AppConnectionType.CUSTOM_AUTH) {
    return new GitlabApi(auth.props.access_token, auth.props.baseUrl ?? 'https://gitlab.com');
  }
  // OAuth2
  const token = getAccessTokenOrThrow(auth);
  const baseUrl = (auth.props?.['baseUrl'] as string | undefined) ?? 'https://gitlab.com';
  return new GitlabApi(token, baseUrl);
}
