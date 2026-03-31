import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { openprojectAuth, OpenProjectAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'op_work_package_trigger';

export const workPackageEventTrigger = createTrigger({
  auth: openprojectAuth,
  name: 'work_package_event',
  displayName: 'Work Package Event',
  description: 'Triggers when a work package is created or updated.',
  props: {
    event: Property.StaticDropdown({
      displayName: 'Event',
      required: true,
      defaultValue: 'work_package:created',
      options: {
        disabled: false,
        options: [
          { label: 'Created', value: 'work_package:created' },
          { label: 'Updated', value: 'work_package:updated' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    action: 'work_package:created',
    _type: 'WorkPackage',
    id: 1,
    subject: 'Example work package',
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
