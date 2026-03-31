import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_mr_trigger';

export const mergeRequestEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'merge_request_event',
  displayName: 'New Merge Request Event',
  description: 'Triggers when a merge request is opened, updated, merged, or closed.',
  props: {
    projectId: gitlabCommon.projectId(),
    actiontype: Property.StaticDropdown({
      displayName: 'MR Event',
      description: 'Filter by merge request action',
      defaultValue: 'all',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'All', value: 'all' },
          { label: 'Opened', value: 'open' },
          { label: 'Closed', value: 'close' },
          { label: 'Updated', value: 'update' },
          { label: 'Merged', value: 'merge' },
          { label: 'Approved', value: 'approved' },
          { label: 'Unapproved', value: 'unapproved' },
          { label: 'Reopened', value: 'reopen' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    object_kind: 'merge_request',
    event_type: 'merge_request',
    object_attributes: {
      state: 'opened',
      action: 'open',
      title: 'Example MR',
    },
  },

  async onEnable({ store, auth, propsValue, webhookUrl }) {
    await subscribeWebhook(
      propsValue.projectId as string,
      auth,
      webhookUrl,
      STORE_KEY,
      { merge_requests_events: true },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['object_kind'] !== 'merge_request') return [];

    const { actiontype } = context.propsValue;
    if (actiontype === 'all') return [payload];

    const action = (payload['object_attributes'] as Record<string, unknown>)?.['action'];
    return action === actiontype ? [payload] : [];
  },
});
