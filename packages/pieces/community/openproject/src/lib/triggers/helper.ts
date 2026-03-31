import { OpenProjectAuth } from '../auth';
import { makeClient } from '../common';

interface WebhookStore {
  webhookId: number;
}

export async function subscribeWebhook(
  auth: OpenProjectAuth,
  webhookUrl: string,
  storeKey: string,
  events: string[],
  store: { put<T>(key: string, value: T): Promise<T> }
): Promise<void> {
  const client = makeClient(auth);
  const webhook = await client.createWebhook({
    name: `Activepieces - ${events.join(', ')}`,
    url: webhookUrl,
    events,
    enabled: true,
    allProjects: true,
  });
  await store.put<WebhookStore>(storeKey, { webhookId: webhook.id });
}

export async function unsubscribeWebhook(
  auth: OpenProjectAuth,
  storeKey: string,
  store: { get<T>(key: string): Promise<T | null | undefined> }
): Promise<void> {
  const info = await store.get<WebhookStore>(storeKey);
  if (info) {
    const client = makeClient(auth);
    await client.deleteWebhook(info.webhookId);
  }
}
