export interface OpenProjectWebhook {
  id: number;
  name: string;
  url: string;
  enabled: boolean;
  events: string[];
}

export interface OpenProjectProject {
  id: number;
  identifier: string;
  name: string;
}

export interface OpenProjectWorkPackageType {
  id: number;
  name: string;
}

export interface OpenProjectStatus {
  id: number;
  name: string;
}

export interface OpenProjectUser {
  id: number;
  name: string;
  login: string;
}

export interface CreateWebhookRequest {
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
  allProjects: boolean;
  projectIds?: number[];
}

export interface CreateWorkPackageRequest {
  subject: string;
  description?: string;
  projectId: string;
  typeId?: string;
  statusId?: string;
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  priority?: string;
}

export interface UpdateWorkPackageRequest {
  workPackageId: string;
  subject?: string;
  description?: string;
  statusId?: string;
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  lockVersion: number;
}

export interface HalLink {
  href: string;
  title?: string;
}

export interface HalResource {
  _type: string;
  _links: Record<string, HalLink | null>;
  id: number;
  [key: string]: unknown;
}

export interface OpenProjectCollection<T> {
  _type: 'Collection';
  total: number;
  count: number;
  _embedded: {
    elements: T[];
  };
}
