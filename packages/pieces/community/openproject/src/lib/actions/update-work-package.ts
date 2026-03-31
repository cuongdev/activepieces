import { createAction, Property } from '@activepieces/pieces-framework';
import { openprojectAuth, OpenProjectAuth } from '../auth';
import { makeClient, openprojectProps } from '../common';

export const updateWorkPackageAction = createAction({
  auth: openprojectAuth,
  name: 'update_work_package',
  displayName: 'Update Work Package',
  description: 'Updates an existing work package.',
  props: {
    workPackageId: Property.ShortText({
      displayName: 'Work Package ID',
      required: true,
    }),
    subject: Property.ShortText({
      displayName: 'Subject',
      required: false,
    }),
    projectId: openprojectProps.projectId(),
    statusId: openprojectProps.statusId(false),
    assigneeId: openprojectProps.assigneeId(false),
    description: Property.LongText({
      displayName: 'Description',
      required: false,
    }),
    dueDate: Property.ShortText({
      displayName: 'Due Date',
      description: 'Format: YYYY-MM-DD',
      required: false,
    }),
  },

  async run({ auth, propsValue }) {
    const client = makeClient(auth as unknown as OpenProjectAuth);
    const { workPackageId, subject, statusId, assigneeId, description, dueDate } = propsValue;

    // Must fetch current lockVersion first
    const current = await client.getWorkPackage(workPackageId);
    const lockVersion = current['lockVersion'] as number;

    const body: Record<string, unknown> = {
      lockVersion,
      _links: {
        ...(statusId ? { status: { href: `/api/v3/statuses/${statusId}` } } : {}),
        ...(assigneeId ? { assignee: { href: `/api/v3/users/${assigneeId}` } } : {}),
      },
      ...(subject ? { subject } : {}),
      ...(description ? { description: { format: 'markdown', raw: description } } : {}),
      ...(dueDate ? { dueDate } : {}),
    };

    return await client.updateWorkPackage(workPackageId, body);
  },
});
