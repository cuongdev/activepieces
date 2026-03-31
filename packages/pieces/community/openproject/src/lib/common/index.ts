import { Property } from '@activepieces/pieces-framework';
import { OpenProjectClient } from './client';
import { openprojectAuth, OpenProjectAuth } from '../auth';

export function makeClient(auth: OpenProjectAuth): OpenProjectClient {
  return new OpenProjectClient(auth);
}

export const openprojectProps = {
  projectId: () =>
    Property.Dropdown({
      displayName: 'Project',
      required: true,
      refreshers: ['auth'],
      auth: openprojectAuth,
      options: async ({ auth }) => {
        if (!auth) return { disabled: true, placeholder: 'Setup authentication first', options: [] };
        const client = makeClient(auth as unknown as OpenProjectAuth);
        const projects = await client.listProjects();
        return {
          disabled: false,
          options: projects.map((p) => ({ label: p.name, value: String(p.id) })),
        };
      },
    }),

  typeId: (required = false) =>
    Property.Dropdown({
      displayName: 'Type',
      required,
      refreshers: ['auth', 'projectId'],
      auth: openprojectAuth,
      options: async ({ auth, projectId }) => {
        if (!auth || !projectId) return { disabled: true, placeholder: 'Select a project first', options: [] };
        const client = makeClient(auth as unknown as OpenProjectAuth);
        const types = await client.listTypes(projectId as string);
        return { disabled: false, options: types.map((t) => ({ label: t.name, value: String(t.id) })) };
      },
    }),

  statusId: (required = false) =>
    Property.Dropdown({
      displayName: 'Status',
      required,
      refreshers: ['auth'],
      auth: openprojectAuth,
      options: async ({ auth }) => {
        if (!auth) return { disabled: true, placeholder: 'Setup authentication first', options: [] };
        const client = makeClient(auth as unknown as OpenProjectAuth);
        const statuses = await client.listStatuses();
        return { disabled: false, options: statuses.map((s) => ({ label: s.name, value: String(s.id) })) };
      },
    }),

  assigneeId: (required = false) =>
    Property.Dropdown({
      displayName: 'Assignee',
      required,
      refreshers: ['auth', 'projectId'],
      auth: openprojectAuth,
      options: async ({ auth, projectId }) => {
        if (!auth || !projectId) return { disabled: true, placeholder: 'Select a project first', options: [] };
        const client = makeClient(auth as unknown as OpenProjectAuth);
        const members = await client.listMembers(projectId as string);
        return { disabled: false, options: members.map((u) => ({ label: u.name, value: String(u.id) })) };
      },
    }),
};
