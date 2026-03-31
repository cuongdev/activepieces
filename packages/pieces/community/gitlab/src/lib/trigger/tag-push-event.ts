import { createTrigger, TriggerStrategy } from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_tag_push_trigger';

export const tagPushEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'tag_push_event',
  displayName: 'New Tag Push Event',
  description: 'Triggers when a tag is created or deleted.',
  props: {
    projectId: gitlabCommon.projectId(),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    object_kind: 'tag_push',
    event_name: 'tag_push',
    ref: 'refs/tags/v1.0.0',
    before: '0000000000000000000000000000000000000000',
    after: 'da1560886d4f094c3e6c9ef40349f7d38b5d27d7',
    user_name: 'John Smith',
    commits: [],
    total_commits_count: 1,
  },

  async onEnable({ store, auth, propsValue, webhookUrl }) {
    await subscribeWebhook(
      propsValue.projectId as string,
      auth,
      webhookUrl,
      STORE_KEY,
      { tag_push_events: true },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['object_kind'] !== 'tag_push') return [];
    return [payload];
  },
});
