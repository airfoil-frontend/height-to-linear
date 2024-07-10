import { LinearClient } from '@linear/sdk';

export const linearClient = (apiKey: string) => {
  return new LinearClient({ apiKey });
};
