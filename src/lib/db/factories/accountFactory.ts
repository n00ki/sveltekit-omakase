import type { Account } from '$lib/db/models/account';
import { faker } from '@faker-js/faker';
import { generateNanoId } from '$lib/utils/helpers/generate';

export const accountFactory = async (instances: number): Promise<Account[]> => {
  return Array.from({ length: instances }, (_, index) => ({
    id: index + 1,
    publicId: generateNanoId(),
    name: faker.company.name(),
    type: faker.helpers.arrayElement(['personal', 'team']),
    avatar: faker.image.avatar(),
    createdAt: new Date(),
    updatedAt: new Date()
  }));
};
