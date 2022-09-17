import { createServer } from 'http';

import { ReactNode } from 'react';
import { Server, Socket } from 'socket.io';
import Client from 'socket.io-client';

import { SocketProvider } from './SocketProvider/SocketProvider';

const httpServer = createServer();
const io = new Server(httpServer);

export const server = {
  socket: {} as Socket,
};

beforeAll((done) => {
  httpServer.listen(() => {
    Client(`http://localhost:${getHttpServerPort() ?? ''}`);

    io.on('connection', (socket) => {
      server.socket = socket;
      done();
    });
  });
});

afterAll(() => {
  io.close();
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

/** Delays test. It process to next function after provided time in`ms` that has elapsed. */
// eslint-disable-next-line require-await
export const postpone = async (ms: number) => {
  return new Promise((_) => setTimeout(_, ms));
};
