import {
  HttpMethod,
  httpClient,
} from '@activepieces/pieces-common';
import {
  CreateWebhookRequest,
  HalResource,
  OpenProjectCollection,
  OpenProjectProject,
  OpenProjectStatus,
  OpenProjectUser,
  OpenProjectWebhook,
  OpenProjectWorkPackageType,
} from './models';
import { OpenProjectAuth } from '../auth';

export class OpenProjectClient {
  private apiBase: string;
  private authHeader: string;

  constructor(auth: OpenProjectAuth) {
    this.apiBase = `${auth.baseUrl.replace(/\/$/, '')}/api/v3`;
    // OpenProject uses HTTP Basic Auth with "apikey" as username
    this.authHeader = `Basic ${Buffer.from(`apikey:${auth.apiKey}`).toString('base64')}`;
  }

  private async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const res = await httpClient.sendRequest<T>({
      method,
      url: `${this.apiBase}${path}`,
      headers: { Authorization: this.authHeader, 'Content-Type': 'application/json' },
      body: body as Record<string, unknown>,
    });
    return res.body;
  }

  // Webhooks
  async createWebhook(req: CreateWebhookRequest): Promise<OpenProjectWebhook> {
    return this.request<OpenProjectWebhook>(HttpMethod.POST, '/webhooks', req);
  }

  async deleteWebhook(webhookId: number): Promise<void> {
    await this.request<void>(HttpMethod.DELETE, `/webhooks/${webhookId}`);
  }

  // Projects
  async listProjects(): Promise<OpenProjectProject[]> {
    const res = await this.request<OpenProjectCollection<HalResource>>(HttpMethod.GET, '/projects?pageSize=100');
    return res._embedded.elements.map((p) => ({
      id: p.id,
      identifier: p['identifier'] as string,
      name: p['name'] as string,
    }));
  }

  // Types
  async listTypes(projectId: string): Promise<OpenProjectWorkPackageType[]> {
    const res = await this.request<OpenProjectCollection<HalResource>>(
      HttpMethod.GET,
      `/projects/${projectId}/types`
    );
    return res._embedded.elements.map((t) => ({ id: t.id, name: t['name'] as string }));
  }

  // Statuses
  async listStatuses(): Promise<OpenProjectStatus[]> {
    const res = await this.request<OpenProjectCollection<HalResource>>(HttpMethod.GET, '/statuses');
    return res._embedded.elements.map((s) => ({ id: s.id, name: s['name'] as string }));
  }

  // Users
  async listMembers(projectId: string): Promise<OpenProjectUser[]> {
    const res = await this.request<OpenProjectCollection<HalResource>>(
      HttpMethod.GET,
      `/projects/${projectId}/memberships?pageSize=100`
    );
    return res._embedded.elements
      .map((m) => {
        const principal = (m._links?.['principal'] as { href: string; title?: string } | null);
        if (!principal) return null;
        const idMatch = principal.href.match(/\/(\d+)$/);
        return idMatch
          ? { id: parseInt(idMatch[1]), name: principal.title ?? '', login: '' }
          : null;
      })
      .filter((u): u is OpenProjectUser => u !== null);
  }

  // Work Packages
  async createWorkPackage(projectId: string, body: Record<string, unknown>): Promise<HalResource> {
    return this.request<HalResource>(HttpMethod.POST, `/projects/${projectId}/work_packages`, body);
  }

  async getWorkPackage(workPackageId: string): Promise<HalResource> {
    return this.request<HalResource>(HttpMethod.GET, `/work_packages/${workPackageId}`);
  }

  async updateWorkPackage(workPackageId: string, body: Record<string, unknown>): Promise<HalResource> {
    return this.request<HalResource>(HttpMethod.PATCH, `/work_packages/${workPackageId}`, body);
  }
}
