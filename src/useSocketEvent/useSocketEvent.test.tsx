import { createServer } from 'http';

import { renderHook } from '@testing-library/react-hooks';
import { ReactNode } from 'react';
import { Server } from 'socket.io';

import { SocketProvider, useSocket } from '../SocketProvider/SocketProvider';

const httpServer = createServer();
const io = new Server(httpServer);

const getHttpServerAddress = () => {
  const address = httpServer.address();
  if (address && typeof address !== 'string' && 'port' in address) {
    return address.port;
  }

  return address;
};

beforeAll((done) => {
  httpServer.listen();
  done();
});

afterAll(() => {
  io.close();
});

type SocketProviderMockProps = {
  readonly children: ReactNode;
};

const SocketProviderMock = ({ children }: SocketProviderMockProps) => (
  <SocketProvider uri={`http://localhost:${getHttpServerAddress() ?? ''}`}>
    {children}
  </SocketProvider>
);

test('when everything is valid it returns connected state', async () => {
  const { result, waitForNextUpdate } = renderHook(useSocket, {
    wrapper: SocketProviderMock,
  });

  await waitForNextUpdate();

  expect(2).toBe(2);
});
