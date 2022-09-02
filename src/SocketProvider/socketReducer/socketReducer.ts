import { useReducer, Reducer } from 'react';

export type State = {
  readonly isConnected: boolean;
  readonly isConnectionError: boolean;
  readonly isConnecting: boolean;
  readonly error: string | null;
  readonly status: 'connect' | 'connecting' | 'connect_error' | 'disconnect';
};

type Action =
  | {
      readonly type: 'connect';
    }
  | {
      readonly type: 'connecting';
    }
  | {
      readonly type: 'connect_error';
      readonly payload: string;
    }
  | {
      readonly type: 'disconnect';
    };

const socketReducer = (state: State, action: Action): State => {
  if (state.status === action.type) {
    return state;
  }

  if (action.type === 'connecting') {
    return {
      error: null,
      isConnectionError: false,
      isConnected: false,
      isConnecting: true,
      status: 'connecting',
    };
  }

  if (action.type === 'connect') {
    return {
      error: null,
      isConnectionError: false,
      isConnected: true,
      isConnecting: false,
      status: 'connect',
    };
  }

  if (action.type === 'connect_error') {
    return {
      error: action.payload,
      isConnectionError: true,
      isConnected: false,
      isConnecting: false,
      status: 'connect_error',
    };
  }

  if (action.type === 'disconnect') {
    return {
      error: null,
      isConnectionError: false,
      isConnected: false,
      isConnecting: false,
      status: 'disconnect',
    };
  }

  return state;
};

export const useSocketReducer = () => {
  const initialState: State = {
    error: null,
    isConnected: false,
    isConnectionError: false,
    isConnecting: true,
    status: 'connecting',
  };

  return useReducer<Reducer<State, Action>>(socketReducer, initialState);
};
