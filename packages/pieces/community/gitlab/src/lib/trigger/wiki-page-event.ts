import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_wiki_trigger';

export const wikiPageEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'wiki_page_event',
  displayName: 'New Wiki Page Event',
  description: 'Triggers when a wiki page is created, updated, or deleted.',
  props: {
    projectId: gitlabCommon.projectId(),
    action: Property.StaticDropdown({
      displayName: 'Wiki Action',
      description: 'Filter by wiki page action',
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
    object_kind: 'wiki_page',
    object_attributes: {
      title: 'Home',
      action: 'create',
    },
  },

  async onEnable({ store, auth, propsValue, webhookUrl }) {
    await subscribeWebhook(
      propsValue.projectId as string,
      auth,
      webhookUrl,
      STORE_KEY,
      { wiki_page_events: true },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['object_kind'] !== 'wiki_page') return [];

    const { action } = context.propsValue;
    if (action === 'all') return [payload];

    const wikiAction = (payload['object_attributes'] as Record<string, unknown>)?.['action'];
    return wikiAction === action ? [payload] : [];
  },
});
