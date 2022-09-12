import { Socket } from 'socket.io-client';

export type Action =
  | {
      readonly type: 'connected';
    }
  | {
      readonly type: 'connecting';
    }
  | {
      readonly type: 'error';
      readonly payload: string;
    }
  | {
      readonly type: 'disconnect';
      readonly payload: Socket.DisconnectReason;
    };

type ErrorState = {
  readonly isConnected: false;
  readonly isDisconnected: false;
  readonly isConnecting: false;
  readonly isError: true;
  readonly status: 'error';
  readonly error: string;
  readonly disconnectReason: undefined;
};

type DisconnectedState = {
  readonly isConnected: false;
  readonly isConnecting: false;
  readonly isError: false;
  readonly isDisconnected: true;
  readonly status: 'disconnected';
  readonly error: undefined;
  readonly disconnectReason: string;
};

type ConnectedState = {
  readonly isConnected: true;
  readonly isConnecting: false;
  readonly isError: false;
  readonly isDisconnected: false;
  readonly status: 'connected';
  readonly error: undefined;
  readonly disconnectReason: undefined;
};

type ConnectingState = {
  readonly isConnected: false;
  readonly isConnecting: true;
  readonly isError: false;
  readonly isDisconnected: false;
  readonly status: 'connecting';
  readonly error: undefined;
  readonly disconnectReason: undefined;
};

export type State =
  | ErrorState
  | DisconnectedState
  | ConnectedState
  | ConnectingState;
