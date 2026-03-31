import {
  createTrigger,
  TriggerStrategy,
  Property,
} from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_issue_trigger';

export const issuesEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'project_issue_event',
  displayName: 'New Issue Event',
  description:
    'Triggers when an issue is opened, updated, closed, or reopened.',
  props: {
    projectId: gitlabCommon.projectId(),
    actiontype: Property.StaticDropdown({
      displayName: 'Issue Event',
      description: 'Filter by issue action type',
      defaultValue: 'all',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'All', value: 'all' },
          { label: 'Opened', value: 'open' },
          { label: 'Closed', value: 'close' },
          { label: 'Updated', value: 'update' },
          { label: 'Reopened', value: 'reopen' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    object_kind: 'issue',
    event_type: 'issue',
    object_attributes: { state: 'opened', action: 'open' },
  },

  async onEnable({ store, auth, propsValue, webhookUrl }) {
    await subscribeWebhook(
      propsValue.projectId as string,
      auth,
      webhookUrl,
      STORE_KEY,
      { issues_events: true, confidential_issues_events: true },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    const objectKind = payload['object_kind'];
    if (objectKind !== 'issue' && objectKind !== 'confidential_issue') return [];

    const { actiontype } = context.propsValue;
    if (actiontype === 'all') return [payload];

    const action = (payload['object_attributes'] as Record<string, unknown>)?.['action'];
    return action === actiontype ? [payload] : [];
  },
});
