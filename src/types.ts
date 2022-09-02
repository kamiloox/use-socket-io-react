export type ServerToClientEvents = {
  readonly connect: () => void;
  readonly connect_error: () => void;
  readonly disconnect: () => void;
};
