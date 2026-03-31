import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { openprojectAuth, OpenProjectAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'op_time_entry_trigger';

export const timeEntryEventTrigger = createTrigger({
  auth: openprojectAuth,
  name: 'time_entry_event',
  displayName: 'Time Entry Event',
  description: 'Triggers when a time entry is created or updated.',
  props: {
    event: Property.StaticDropdown({
      displayName: 'Event',
      required: true,
      defaultValue: 'time_entry:created',
      options: {
        disabled: false,
        options: [
          { label: 'Created', value: 'time_entry:created' },
          { label: 'Updated', value: 'time_entry:updated' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    action: 'time_entry:created',
    _type: 'TimeEntry',
    id: 1,
    hours: 'PT2H',
    comment: { raw: 'Working on feature' },
  },

  async onEnable({ auth, propsValue, webhookUrl, store }) {
    await subscribeWebhook(auth as unknown as OpenProjectAuth, webhookUrl, STORE_KEY, [propsValue.event as string], store);
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth as unknown as OpenProjectAuth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['action'] !== context.propsValue.event) return [];
    return [payload];
  },
});
