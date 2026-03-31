import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { openprojectAuth, OpenProjectAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'op_wiki_page_trigger';

export const wikiPageEventTrigger = createTrigger({
  auth: openprojectAuth,
  name: 'wiki_page_event',
  displayName: 'Wiki Page Event',
  description: 'Triggers when a wiki page is created or updated.',
  props: {
    event: Property.StaticDropdown({
      displayName: 'Event',
      required: true,
      defaultValue: 'wiki_page:created',
      options: {
        disabled: false,
        options: [
          { label: 'Created', value: 'wiki_page:created' },
          { label: 'Updated', value: 'wiki_page:updated' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    action: 'wiki_page:created',
    _type: 'WikiPage',
    id: 1,
    title: 'Example wiki page',
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
