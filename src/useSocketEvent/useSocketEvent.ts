import { useEffect, useState } from 'react';

import { useSocket } from '../SocketProvider/SocketProvider';
import { ServerToClientEvents } from '../types';

type EventNameString = string & { readonly __brand?: never };

type EventName = keyof ServerToClientEvents | EventNameString;

type UseSocketEventResult<
  Event extends EventName,
  Data,
> = Event extends keyof ServerToClientEvents
  ? ServerToClientEvents[Event] extends (...args: readonly any[]) => void
    ? { readonly data: Parameters<ServerToClientEvents[Event]>[0] | null }
    : { readonly data: Data | null }
  : { readonly data: Data | null };

type UseSocketEvent = {
  <Data, Event extends EventName>(event: Event): UseSocketEventResult<
    Event,
    Data
  >;
  <Data, Event extends EventNameString = EventNameString>(event: Event): {
    readonly data: Data | null;
  };
};

export const useSocketEvent: UseSocketEvent = <Data, Event extends EventName>(
  event: Event,
) => {
  const { socket, isConnected } = useSocket();
  const [data, setData] = useState<UseSocketEventResult<Event, Data> | null>(
    null,
  );

  useEffect(() => {
    socket.on(event as string, (value: UseSocketEventResult<Event, Data>) => {
      setData(value);
    });

    return () => {
      socket.off(event);
    };
  }, [isConnected]);

  return { data };
};
