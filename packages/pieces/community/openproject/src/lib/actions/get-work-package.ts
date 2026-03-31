import { createAction, Property } from '@activepieces/pieces-framework';
import { openprojectAuth, OpenProjectAuth } from '../auth';
import { makeClient } from '../common';

export const getWorkPackageAction = createAction({
  auth: openprojectAuth,
  name: 'get_work_package',
  displayName: 'Get Work Package',
  description: 'Retrieves a work package by its ID.',
  props: {
    workPackageId: Property.ShortText({
      displayName: 'Work Package ID',
      required: true,
    }),
  },

  async run({ auth, propsValue }) {
    const client = makeClient(auth as unknown as OpenProjectAuth);
    return await client.getWorkPackage(propsValue.workPackageId);
  },
});
