import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { openprojectAuth, OpenProjectAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'op_project_trigger';

export const projectEventTrigger = createTrigger({
  auth: openprojectAuth,
  name: 'project_event',
  displayName: 'Project Event',
  description: 'Triggers when a project is created or updated.',
  props: {
    event: Property.StaticDropdown({
      displayName: 'Event',
      required: true,
      defaultValue: 'project:created',
      options: {
        disabled: false,
        options: [
          { label: 'Created', value: 'project:created' },
          { label: 'Updated', value: 'project:updated' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    action: 'project:created',
    _type: 'Project',
    id: 1,
    name: 'Example project',
    identifier: 'example-project',
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
