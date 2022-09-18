import { useCallback } from 'react';
import { Socket } from 'socket.io-client';

import { useSocket } from '../SocketProvider/SocketProvider';
import {
  ClientToServerEvents,
  EventNameString,
  EventsOf,
  UnknownArray,
} from '../types';

type EventName = EventsOf<ClientToServerEvents>;

type SocketEmitArguments<
  Event extends EventName,
  Data extends UnknownArray,
> = Event extends keyof ClientToServerEvents
  ? ClientToServerEvents[Event] extends (...args: readonly any[]) => any
    ? Parameters<ClientToServerEvents[Event]>
    : Data
  : Data;

type UseSocketEmit = {
  (): {
    readonly emit: <Data extends UnknownArray, Event extends EventName>(
      event: Event,
      values: SocketEmitArguments<Event, Data>,
    ) => void;
    readonly socket: Socket;
  };
  (): {
    readonly emit: <
      Data extends UnknownArray,
      Event extends EventNameString = EventNameString,
    >(
      event: Event,
      values: SocketEmitArguments<Event, Data>,
    ) => void;
    readonly socket: Socket;
  };
};

export const useSocketEmit: UseSocketEmit = () => {
  const { socket } = useSocket();

  const emit = useCallback(
    <Data extends UnknownArray, Event extends EventName = EventName>(
      event: Event,
      values: SocketEmitArguments<Event, Data>,
    ) => {
      socket.emit(event, ...values);
    },
    [],
  );

  return { emit, socket };
};
