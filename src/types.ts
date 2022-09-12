// eslint-disable-next-line functional/prefer-readonly-type
export type UnknownArray = Array<unknown> | ReadonlyArray<unknown>;

export type MapToUndefined<Tuple> = {
  readonly [Key in keyof Tuple]: Tuple[Key] | undefined;
};

export interface ServerToClientEvents {}
