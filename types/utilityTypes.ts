import { UserProfile } from '@auth0/nextjs-auth0';

export type PropsWithUser<T> = T & { user: UserProfile };
