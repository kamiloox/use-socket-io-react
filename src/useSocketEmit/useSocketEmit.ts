import { useCallback } from 'react';
import { Socket } from 'socket.io-client';

import { useSocket } from '../SocketProvider/SocketProvider';
import { ClientToServerEvents, EventNameString, EventsOf } from '../types';

type EventName = EventsOf<ClientToServerEvents>;

type SocketEmitArguments<Event extends EventName = EventName> =
  Event extends keyof ClientToServerEvents
    ? ClientToServerEvents[Event] extends (...args: readonly any[]) => any
      ? Parameters<ClientToServerEvents[Event]>
      : readonly unknown[]
    : readonly unknown[];

type UseSocketEmit = {
  (): {
    readonly emit: <Event extends EventName>(
      event: Event,
      ...args: SocketEmitArguments<Event>
    ) => void;
    readonly socket: Socket;
  };
  (): {
    readonly emit: <Event extends EventNameString = EventNameString>(
      event: Event,
      ...args: SocketEmitArguments<Event>
    ) => void;
    readonly socket: Socket;
  };
};

export const useSocketEmit: UseSocketEmit = () => {
  const { socket } = useSocket();

  const emit = useCallback(
    <Event extends EventName>(
      event: Event,
      ...args: SocketEmitArguments<Event>
    ) => {
      socket.emit(event, ...args);
    },
    [],
  );

  return { emit, socket };
};
