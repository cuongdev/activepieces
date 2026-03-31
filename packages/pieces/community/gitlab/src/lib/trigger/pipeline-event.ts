import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_pipeline_trigger';

export const pipelineEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'pipeline_event',
  displayName: 'New Pipeline Event',
  description: 'Triggers when a pipeline changes status.',
  props: {
    projectId: gitlabCommon.projectId(),
    status: Property.StaticDropdown({
      displayName: 'Pipeline Status',
      description: 'Filter by pipeline status',
      defaultValue: 'all',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'All', value: 'all' },
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
    object_kind: 'pipeline',
    object_attributes: { status: 'success', ref: 'main' },
  },

  async onEnable({ store, auth, propsValue, webhookUrl }) {
    await subscribeWebhook(
      propsValue.projectId as string,
      auth,
      webhookUrl,
      STORE_KEY,
      { pipeline_events: true },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['object_kind'] !== 'pipeline') return [];

    const { status } = context.propsValue;
    if (status === 'all') return [payload];

    const pipelineStatus = (payload['object_attributes'] as Record<string, unknown>)?.['status'];
    return pipelineStatus === status ? [payload] : [];
  },
});
