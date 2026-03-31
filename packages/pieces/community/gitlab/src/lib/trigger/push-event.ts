import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_push_trigger';

export const pushEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'push_event',
  displayName: 'New Push Event',
  description: 'Triggers when commits are pushed to a branch.',
  props: {
    projectId: gitlabCommon.projectId(),
    branchFilter: Property.ShortText({
      displayName: 'Branch Filter',
      description: 'Optional: only trigger for this branch name (e.g., main). Leave empty for all branches.',
      required: false,
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    object_kind: 'push',
    event_name: 'push',
    before: '0000000000000000000000000000000000000000',
    after: 'da1560886d4f094c3e6c9ef40349f7d38b5d27d7',
    ref: 'refs/heads/main',
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
      {
        push_events: true,
        push_events_branch_filter: propsValue.branchFilter || undefined,
      },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['object_kind'] !== 'push') return [];
    return [payload];
  },
});
