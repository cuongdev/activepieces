import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_job_trigger';

export const jobEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'job_event',
  displayName: 'New Job Event',
  description: 'Triggers when a CI/CD job changes status.',
  props: {
    projectId: gitlabCommon.projectId(),
    status: Property.StaticDropdown({
      displayName: 'Job Status',
      description: 'Filter by job status',
      defaultValue: 'all',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'All', value: 'all' },
          { label: 'Created', value: 'created' },
          { label: 'Pending', value: 'pending' },
          { label: 'Running', value: 'running' },
          { label: 'Success', value: 'success' },
          { label: 'Failed', value: 'failed' },
          { label: 'Canceled', value: 'canceled' },
          { label: 'Skipped', value: 'skipped' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    object_kind: 'build',
    build_status: 'success',
    build_name: 'test',
    ref: 'main',
  },

  async onEnable({ store, auth, propsValue, webhookUrl }) {
    await subscribeWebhook(
      propsValue.projectId as string,
      auth,
      webhookUrl,
      STORE_KEY,
      { job_events: true },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['object_kind'] !== 'build') return [];

    const { status } = context.propsValue;
    if (status === 'all') return [payload];

    return payload['build_status'] === status ? [payload] : [];
  },
});
