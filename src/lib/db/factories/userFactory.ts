import type { User } from '$lib/db/models/user';
import { faker } from '@faker-js/faker';
import { hashPassword } from '$lib/utils/helpers/password';
import { generateNanoId } from '$lib/utils/helpers/generate';

export const userFactory = async (instances: number): Promise<User[]> => {
  const hashedPassword = await hashPassword('password1234');

  return Array.from({ length: instances }, (_, index) => ({
    id: index + 1,
    publicId: generateNanoId(),
    email: faker.internet.email(),
    googleId: null,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    hashedPassword,
    avatar: faker.image.avatar(),
    admin: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }));
};
