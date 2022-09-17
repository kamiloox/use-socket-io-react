import { useCallback } from 'react';

import { useSocket } from '../SocketProvider/SocketProvider';
import { ClientToServerEvents, EventsOf } from '../types';

type EventName = EventsOf<ClientToServerEvents>;

export const useSocketEmit = () => {
  const { socket } = useSocket();

  const emit = useCallback((event: EventName, ...args: readonly unknown[]) => {
    socket.emit(event, ...args);
  }, []);

  return { emit, socket };
};
