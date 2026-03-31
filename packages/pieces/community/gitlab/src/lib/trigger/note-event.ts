import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_note_trigger';

export const noteEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'note_event',
  displayName: 'New Comment Event',
  description: 'Triggers when a comment is added to a commit, issue, merge request, or snippet.',
  props: {
    projectId: gitlabCommon.projectId(),
    noteableType: Property.StaticDropdown({
      displayName: 'Comment On',
      description: 'Filter by the type of item the comment is on',
      defaultValue: 'all',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'All', value: 'all' },
          { label: 'Commit', value: 'Commit' },
          { label: 'Issue', value: 'Issue' },
          { label: 'Merge Request', value: 'MergeRequest' },
          { label: 'Snippet', value: 'Snippet' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    object_kind: 'note',
    object_attributes: {
      note: 'This is a comment',
      noteable_type: 'Issue',
    },
  },

  async onEnable({ store, auth, propsValue, webhookUrl }) {
    await subscribeWebhook(
      propsValue.projectId as string,
      auth,
      webhookUrl,
      STORE_KEY,
      { note_events: true, confidential_note_events: true },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['object_kind'] !== 'note' && payload['object_kind'] !== 'confidential_note') return [];

    const { noteableType } = context.propsValue;
    if (noteableType === 'all') return [payload];

    const type = (payload['object_attributes'] as Record<string, unknown>)?.['noteable_type'];
    return type === noteableType ? [payload] : [];
  },
});
