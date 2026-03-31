import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { openprojectAuth, OpenProjectAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'op_member_trigger';

export const memberEventTrigger = createTrigger({
  auth: openprojectAuth,
  name: 'member_event',
  displayName: 'Member Event',
  description: 'Triggers when a project member is added, updated, or removed.',
  props: {
    event: Property.StaticDropdown({
      displayName: 'Event',
      required: true,
      defaultValue: 'member:created',
      options: {
        disabled: false,
        options: [
          { label: 'Added', value: 'member:created' },
          { label: 'Updated', value: 'member:updated' },
          { label: 'Removed', value: 'member:removed' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    action: 'member:created',
    _type: 'Membership',
    id: 1,
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
