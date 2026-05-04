import { createServerFn } from '@tanstack/react-start';
import { getUsersService } from '@/server/data/users/factory';

export const getUsersFn = createServerFn({ method: 'GET' }).handler(async () => {
  return getUsersService().getUsers();
});
