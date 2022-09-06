export interface ServerToClientEvents {
  readonly chat: (message: string) => void;
}
