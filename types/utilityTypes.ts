import { UserProfile } from '@auth0/nextjs-auth0';

export type PropsWithUser<T> = T & { user: UserProfile };

export type Severity = 'error' | 'warning' | 'info' | 'success';

export interface StatusMessage {
  severity: Severity;
  message: string;
}