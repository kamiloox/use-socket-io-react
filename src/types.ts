// eslint-disable-next-line functional/prefer-readonly-type
export type UnknownArray = Array<unknown> | ReadonlyArray<unknown>;

export type EventNameString = string & { readonly __brand?: never };

export type EventsOf<Handlers> = keyof Handlers | EventNameString;

export type MapToUndefined<Tuple> = {
  readonly [Key in keyof Tuple]: Tuple[Key] | undefined;
};

export type EventHandler<Event extends keyof ServerToClientEvents> = {
  (values: Parameters<ServerToClientEvents[Event]>): void;
};

// Interfaces to augment down below ↓

export interface ServerToClientEvents {}

export interface ClientToServerEvents {}
