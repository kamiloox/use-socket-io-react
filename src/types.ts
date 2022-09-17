import * as Client from 'socket.io-client';

// eslint-disable-next-line functional/prefer-readonly-type
export type UnknownArray = Array<unknown> | ReadonlyArray<unknown>;

export type EventNameString = string & { readonly __brand?: never };

export type EventsOf<Handlers> = keyof Handlers | EventNameString;

export type MapToUndefined<Tuple> = {
  readonly [Key in keyof Tuple]: Tuple[Key] | undefined;
};

export type Socket = Client.Socket<ServerToClientEvents, ClientToServerEvents>;

// Interfaces to augment down below ↓

export interface ServerToClientEvents {
  readonly [event: EventsOf<ServerToClientEvents>]: (
    ...args: readonly any[]
  ) => void;
}

export interface ClientToServerEvents {
  readonly [event: EventsOf<ClientToServerEvents>]: (
    ...args: readonly any[]
  ) => void;
}
