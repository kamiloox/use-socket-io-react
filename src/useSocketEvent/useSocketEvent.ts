import { useEffect, useState } from 'react';

import { useSocket } from '../SocketProvider/SocketProvider';
import { ServerToClientEvents } from '../types';

type EventNameString = string & { readonly __brand?: never };

type EventName = keyof ServerToClientEvents | EventNameString;

type EventResolvedData<
  Event extends EventName,
  Data,
> = Event extends keyof ServerToClientEvents
  ? ServerToClientEvents[Event] extends (...args: readonly any[]) => void
    ? Parameters<ServerToClientEvents[Event]>[0]
    : Data
  : Data;

type UseSocketEvent = {
  <Data, Event extends EventName>(event: Event): EventResolvedData<
    Event,
    Data
  > | null;
  <Data, Event extends EventNameString = EventNameString>(
    event: Event,
  ): Data | null;
};

export const useSocketEvent: UseSocketEvent = <Data, Event extends EventName>(
  event: Event,
) => {
  const { socket, isConnected } = useSocket();
  const [data, setData] = useState<EventResolvedData<Event, Data> | null>(null);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    socket.on(event as string, (value: EventResolvedData<Event, Data>) => {
      setData(value);
    });

    return () => {
      socket.off(event);
    };
  }, [isConnected]);

  return data;
};
