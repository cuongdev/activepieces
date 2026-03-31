import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { openprojectAuth, OpenProjectAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'op_attachment_trigger';

export const attachmentEventTrigger = createTrigger({
  auth: openprojectAuth,
  name: 'attachment_event',
  displayName: 'Attachment Event',
  description: 'Triggers when an attachment is created or deleted.',
  props: {
    event: Property.StaticDropdown({
      displayName: 'Event',
      required: true,
      defaultValue: 'attachment:created',
      options: {
        disabled: false,
        options: [
          { label: 'Created', value: 'attachment:created' },
          { label: 'Deleted', value: 'attachment:destroyed' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    action: 'attachment:created',
    _type: 'Attachment',
    id: 1,
    fileName: 'example.pdf',
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
