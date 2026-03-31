import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { gitlabCommon } from '../common';
import { gitlabAuth } from '../auth';
import { subscribeWebhook, unsubscribeWebhook } from './helper';

const STORE_KEY = 'gitlab_deployment_trigger';

export const deploymentEventTrigger = createTrigger({
  auth: gitlabAuth,
  name: 'deployment_event',
  displayName: 'New Deployment Event',
  description: 'Triggers when a deployment starts, succeeds, fails, or is canceled.',
  props: {
    projectId: gitlabCommon.projectId(),
    status: Property.StaticDropdown({
      displayName: 'Deployment Status',
      description: 'Filter by deployment status',
      defaultValue: 'all',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'All', value: 'all' },
          { label: 'Created', value: 'created' },
          { label: 'Running', value: 'running' },
          { label: 'Success', value: 'success' },
          { label: 'Failed', value: 'failed' },
          { label: 'Canceled', value: 'canceled' },
        ],
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    object_kind: 'deployment',
    status: 'success',
    environment: 'production',
    ref: 'main',
  },

  async onEnable({ store, auth, propsValue, webhookUrl }) {
    await subscribeWebhook(
      propsValue.projectId as string,
      auth,
      webhookUrl,
      STORE_KEY,
      { deployment_events: true },
      store
    );
  },

  async onDisable({ auth, store }) {
    await unsubscribeWebhook(auth, STORE_KEY, store);
  },

  async run(context) {
    const payload = context.payload.body as Record<string, unknown>;
    if (payload['object_kind'] !== 'deployment') return [];

    const { status } = context.propsValue;
    if (status === 'all') return [payload];

    return payload['status'] === status ? [payload] : [];
  },
});
