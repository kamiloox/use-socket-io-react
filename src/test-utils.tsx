import { createServer } from 'http';

import { renderHook } from '@testing-library/react-hooks';
import { ReactNode } from 'react';
import { Server } from 'socket.io';

import { SocketProvider, useSocket } from './SocketProvider/SocketProvider';

const httpServer = createServer();
export const serverSocket = new Server(httpServer);

beforeAll((done) => {
  httpServer.listen();
  done();
});

afterAll(() => {
  serverSocket.close();
});

const getHttpServerPort = () => {
  const address = httpServer.address();
  if (address && typeof address !== 'string' && 'port' in address) {
    return address.port;
  }

  return address;
};

type SocketProviderMockProps = {
  readonly children: ReactNode;
};

export const SocketProviderMock = ({ children }: SocketProviderMockProps) => (
  <SocketProvider uri={`http://localhost:${getHttpServerPort() ?? ''}`}>
    {children}
  </SocketProvider>
);

export const SocketProviderMockInvalidUri = ({
  children,
}: SocketProviderMockProps) => {
  const serverPort = getHttpServerPort() ?? '';

  const invalidPort = typeof serverPort === 'number' ? serverPort - 1 : '';

  return (
    <SocketProvider uri={`http://localhost:${invalidPort}`}>
      {children}
    </SocketProvider>
  );
};

export const waitForSocketConnection = async () => {
  const { result, waitForValueToChange } = renderHook(useSocket, {
    wrapper: SocketProviderMock,
  });

  await waitForValueToChange(() => result.current.isConnected);

  if (result.current.isConnected) {
    return;
  }

  throw new Error('Client socket cannot connect to the server');
};

/** Delays test. It process to next function after provided time in`ms` that has elapsed. */
// eslint-disable-next-line require-await
export const postpone = async (ms: number) => {
  return new Promise((_) => setTimeout(_, ms));
};
