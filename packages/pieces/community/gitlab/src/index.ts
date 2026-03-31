import { createCustomApiCallAction } from '@activepieces/pieces-common';
import {
  createPiece,
  OAuth2PropertyValue,
} from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { createIssueAction } from './lib/actions/create-issue-action';
import { gitlabAuth } from './lib/auth';
import { issuesEventTrigger } from './lib/trigger/issue-event';
import { pushEventTrigger } from './lib/trigger/push-event';
import { tagPushEventTrigger } from './lib/trigger/tag-push-event';
import { mergeRequestEventTrigger } from './lib/trigger/merge-request-event';
import { pipelineEventTrigger } from './lib/trigger/pipeline-event';
import { noteEventTrigger } from './lib/trigger/note-event';
import { jobEventTrigger } from './lib/trigger/job-event';
import { releaseEventTrigger } from './lib/trigger/release-event';
import { deploymentEventTrigger } from './lib/trigger/deployment-event';
import { wikiPageEventTrigger } from './lib/trigger/wiki-page-event';

export const gitlab = createPiece({
  displayName: 'GitLab',
  description: 'Collaboration tool for developers',

  auth: gitlabAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/gitlab.png',
  categories: [PieceCategory.DEVELOPER_TOOLS],
  authors: ['kishanprmr', 'MoShizzle', 'khaledmashaly', 'abuaboud'],
  actions: [
    createIssueAction,
    createCustomApiCallAction({
      baseUrl: (auth) => {
        const baseUrl = ((auth as OAuth2PropertyValue).props?.['baseUrl'] as string | undefined) ?? 'https://gitlab.com';
        return `${baseUrl.replace(/\/$/, '')}/api/v4`;
      },
      auth: gitlabAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as OAuth2PropertyValue).access_token}`,
      }),
    }),
  ],
  triggers: [
    issuesEventTrigger,
    pushEventTrigger,
    tagPushEventTrigger,
    mergeRequestEventTrigger,
    pipelineEventTrigger,
    noteEventTrigger,
    jobEventTrigger,
    releaseEventTrigger,
    deploymentEventTrigger,
    wikiPageEventTrigger,
  ],
});
