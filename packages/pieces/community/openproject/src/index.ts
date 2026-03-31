import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { createPiece } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { openprojectAuth, OpenProjectAuth } from './lib/auth';
import { createWorkPackageAction } from './lib/actions/create-work-package';
import { getWorkPackageAction } from './lib/actions/get-work-package';
import { updateWorkPackageAction } from './lib/actions/update-work-package';
import { workPackageEventTrigger } from './lib/triggers/work-package-event';
import { projectEventTrigger } from './lib/triggers/project-event';
import { timeEntryEventTrigger } from './lib/triggers/time-entry-event';
import { wikiPageEventTrigger } from './lib/triggers/wiki-page-event';
import { memberEventTrigger } from './lib/triggers/member-event';
import { attachmentEventTrigger } from './lib/triggers/attachment-event';

export const openproject = createPiece({
  displayName: 'OpenProject',
  description: 'Open source project management software',
  auth: openprojectAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://www.openproject.org/assets/images/press/openproject-icon-original-color-850606ea.svg',
  categories: [PieceCategory.DEVELOPER_TOOLS, PieceCategory.PRODUCTIVITY],
  authors: [],
  actions: [
    createWorkPackageAction,
    getWorkPackageAction,
    updateWorkPackageAction,
    createCustomApiCallAction({
      baseUrl: (auth) => {
        const a = auth as unknown as OpenProjectAuth;
        return `${a.baseUrl.replace(/\/$/, '')}/api/v3`;
      },
      auth: openprojectAuth,
      authMapping: async (auth) => {
        const a = auth as unknown as OpenProjectAuth;
        const token = Buffer.from(`apikey:${a.apiKey}`).toString('base64');
        return { Authorization: `Basic ${token}` };
      },
    }),
  ],
  triggers: [
    workPackageEventTrigger,
    projectEventTrigger,
    timeEntryEventTrigger,
    wikiPageEventTrigger,
    memberEventTrigger,
    attachmentEventTrigger,
  ],
});
