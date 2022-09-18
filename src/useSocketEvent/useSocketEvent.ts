import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

import { useSocket } from '../SocketProvider/SocketProvider';
import {
  ServerToClientEvents,
  UnknownArray,
  EventsOf,
  EventNameString,
  MapToUndefined,
} from '../types';

type EventName = EventsOf<ServerToClientEvents>;

type HandlerValues<
  Event extends EventName,
  Data extends UnknownArray,
> = Event extends keyof ServerToClientEvents
  ? ServerToClientEvents[Event] extends (...args: readonly any[]) => void
    ? Parameters<ServerToClientEvents[Event]>
    : Data
  : Data;

type UseSocketEventResult<
  Event extends EventName,
  Data extends UnknownArray,
> = {
  readonly socket: Socket;
  readonly data: MapToUndefined<HandlerValues<Event, Data>>;
};

type UseSocketEvent = {
  <Data extends UnknownArray, Event extends EventName>(
    event: Event,
    config?: Config<Event, Data>,
  ): UseSocketEventResult<Event, Data>;
  <Data extends UnknownArray, Event extends EventNameString = EventNameString>(
    event: Event,
    config?: Config<Event, Data>,
  ): UseSocketEventResult<Event, Data>;
};

export type Config<Event extends EventName, Data extends UnknownArray> = {
  readonly once?: boolean;
  readonly handler?: (values: HandlerValues<Event, Data>) => void;
};

export const useSocketEvent: UseSocketEvent = <
  Data extends UnknownArray,
  Event extends EventName,
>(
  event: Event,
  { once, handler }: Config<Event, Data> = { once: false },
) => {
  const { socket, isConnected } = useSocket();
  const [data, setData] = useState<MapToUndefined<Data>>(
    [] as unknown as MapToUndefined<Data>,
  );
  const receivedOnce = useRef(false);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    if (once && receivedOnce.current) {
      return;
    }

    const method = once ? 'once' : 'on';

    socket[method](event as string, (...values: readonly unknown[]) => {
      setData(values as MapToUndefined<Data>);
      if (handler) {
        handler(values as HandlerValues<Event, Data>);
      }

      if (once) {
        receivedOnce.current = true;
      }
    });

    return () => {
      socket.off(event);
    };
  }, [isConnected]);

  return { data, socket };
};
