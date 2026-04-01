import { GitlabAuthValue } from '../auth';
import { ProjectWebhookRequest } from '../common/models';
import { makeClient } from '../common';

interface WebhookInformation {
  webhookId: string;
  projectId: string;
}

export async function subscribeWebhook(
  projectId: string,
  auth: GitlabAuthValue,
  webhookUrl: string,
  storeKey: string,
  events: Omit<ProjectWebhookRequest, 'url'>,
  store: { put<T>(key: string, value: T): Promise<T> }
) {
  const client = makeClient(auth);
  const res = await client.subscribeProjectWebhook(projectId, {
    url: webhookUrl,
    push_events: false,
    ...events,
  });
  await store.put<WebhookInformation>(storeKey, {
    webhookId: res.id,
    projectId,
  });
}

export async function unsubscribeWebhook(
  auth: GitlabAuthValue,
  storeKey: string,
  store: { get<T>(key: string): Promise<T | null | undefined> }
) {
  const info = await store.get<WebhookInformation>(storeKey);
  if (info) {
    const client = makeClient(auth);
    await client.unsubscribeProjectWebhook(info.projectId, info.webhookId);
  }
}
