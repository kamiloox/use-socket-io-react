import { useEffect, useRef, useState } from 'react';

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

type Config = Partial<{
  readonly once: boolean;
}>;

type UseSocketEvent = {
  <Data, Event extends EventName>(
    event: Event,
    config?: Config,
  ): UseSocketEventResult<Event, Data>;
  <Data, Event extends EventNameString = EventNameString>(
    event: Event,
    config?: Config,
  ): {
    readonly data: Data | null;
  };
};

export const useSocketEvent: UseSocketEvent = <Data, Event extends EventName>(
  event: Event,
  { once }: Config = { once: false },
) => {
  const { socket, isConnected } = useSocket();
  const [data, setData] = useState<UseSocketEventResult<Event, Data> | null>(
    null,
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

    socket[method](
      event as string,
      (value: UseSocketEventResult<Event, Data>) => {
        setData(value);

        if (once) {
          receivedOnce.current = true;
        }
      },
    );

    return () => {
      socket.off(event);
    };
  }, [isConnected]);

  return { data };
};
