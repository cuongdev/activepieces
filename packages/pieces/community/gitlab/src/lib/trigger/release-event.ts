import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_release_trigger';

export const releaseEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'release_event',
  displayName: 'New Release Event',
  description: 'Triggers when a release is created, updated, or deleted.',
  props: {
    projectId: gitlabCommon.projectId(),
    action: Property.StaticDropdown({
      displayName: 'Release Action',
      description: 'Filter by release action',
      defaultValue: 'all',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'All', value: 'all' },
          { label: 'Created', value: 'create' },
          { label: 'Updated', value: 'update' },
          { label: 'Deleted', value: 'delete' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    object_kind: 'release',
    action: 'create',
    name: 'v1.0.0',
    tag: 'v1.0.0',
    description: 'Release description',
  },

  async onEnable({ store, auth, propsValue, webhookUrl }) {
    await subscribeWebhook(
      propsValue.projectId as string,
      auth,
      webhookUrl,
      STORE_KEY,
      { releases_events: true },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['object_kind'] !== 'release') return [];

    const { action } = context.propsValue;
    if (action === 'all') return [payload];

    return payload['action'] === action ? [payload] : [];
  },
});
