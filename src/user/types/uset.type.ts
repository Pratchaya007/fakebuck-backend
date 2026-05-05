import { User } from 'src/database/generated/prisma/client';

export type UserWithOutPassword = Omit<User, 'password'>;

export type findByIdOptions = {
  includeFriends?: boolean;
  currentUserId?: string;
};
