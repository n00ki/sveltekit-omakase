import type { Team } from '$lib/db/models/team';
import { faker } from '@faker-js/faker';
import { generateNanoId } from '$lib/utils/helpers/generate';

export const teamFactory = async (instances: number): Promise<Team[]> => {
  return Array.from({ length: instances }, (_, index) => ({
    id: index + 1,
    publicId: generateNanoId(),
    name: faker.company.name(),
    avatar: faker.image.avatar(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  }));
};
