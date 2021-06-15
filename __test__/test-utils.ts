import { server } from './__mocks__/mswServer';

export const mockRequests = () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  return server;
};
