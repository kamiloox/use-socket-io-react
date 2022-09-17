import { useEffect, useRef, useState } from 'react';

import { useSocket } from '../SocketProvider/SocketProvider';
import {
  ServerToClientEvents,
  MapToUndefined,
  UnknownArray,
  EventsOf,
  EventNameString,
  Socket,
} from '../types';

type EventName = EventsOf<ServerToClientEvents>;

type UseSocketEventResult<
  Event extends EventName,
  Data extends UnknownArray,
> = Event extends keyof ServerToClientEvents
  ? ServerToClientEvents[Event] extends (...args: readonly any[]) => void
    ? {
        readonly data: MapToUndefined<Parameters<ServerToClientEvents[Event]>>;
        readonly socket: Socket;
      }
    : { readonly data: MapToUndefined<Data>; readonly socket: Socket }
  : { readonly data: MapToUndefined<Data>; readonly socket: Socket };

type Config = Partial<{
  readonly once: boolean;
}>;

type UseSocketEvent = {
  <Data extends UnknownArray, Event extends EventName>(
    event: Event,
    config?: Config,
  ): UseSocketEventResult<Event, Data>;
  <Data extends UnknownArray, Event extends EventNameString = EventNameString>(
    event: Event,
    config?: Config,
  ): UseSocketEventResult<Event, Data>;
};

export const useSocketEvent: UseSocketEvent = <
  Data extends UnknownArray,
  Event extends EventName,
>(
  event: Event,
  { once }: Config = { once: false },
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
