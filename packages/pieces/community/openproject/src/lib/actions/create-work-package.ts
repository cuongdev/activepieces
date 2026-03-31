import { createAction, Property } from '@activepieces/pieces-framework';
import { openprojectAuth, OpenProjectAuth } from '../auth';
import { makeClient, openprojectProps } from '../common';

export const createWorkPackageAction = createAction({
  auth: openprojectAuth,
  name: 'create_work_package',
  displayName: 'Create Work Package',
  description: 'Creates a new work package (task, bug, feature, etc.) in a project.',
  props: {
    projectId: openprojectProps.projectId(),
    subject: Property.ShortText({
      displayName: 'Subject',
      required: true,
    }),
    typeId: openprojectProps.typeId(false),
    statusId: openprojectProps.statusId(false),
    assigneeId: openprojectProps.assigneeId(false),
    description: Property.LongText({
      displayName: 'Description',
      required: false,
    }),
    startDate: Property.ShortText({
      displayName: 'Start Date',
      description: 'Format: YYYY-MM-DD',
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
    const { projectId, subject, typeId, statusId, assigneeId, description, startDate, dueDate } = propsValue;

    const body: Record<string, unknown> = {
      subject,
      _links: {
        ...(typeId ? { type: { href: `/api/v3/types/${typeId}` } } : {}),
        ...(statusId ? { status: { href: `/api/v3/statuses/${statusId}` } } : {}),
        ...(assigneeId ? { assignee: { href: `/api/v3/users/${assigneeId}` } } : {}),
      },
      ...(description ? { description: { format: 'markdown', raw: description } } : {}),
      ...(startDate ? { startDate } : {}),
      ...(dueDate ? { dueDate } : {}),
    };

    return await client.createWorkPackage(projectId as string, body);
  },
});
