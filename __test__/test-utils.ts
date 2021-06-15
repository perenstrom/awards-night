import { setupServer } from 'msw/node';
const server = setupServer();

export const mockRequests = () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  return server;
};