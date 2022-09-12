import { useReducer, Reducer } from 'react';

import { State, Action } from './types';

const socketReducer = (state: State, action: Action): State => {
  if (state.status === action.type) {
    return state;
  }

  if (action.type === 'connecting') {
    return {
      disconnectReason: undefined,
      error: undefined,
      isError: false,
      isConnected: false,
      isDisconnected: false,
      isConnecting: true,
      status: 'connecting',
    };
  }

  if (action.type === 'connected') {
    return {
      disconnectReason: undefined,
      error: undefined,
      isError: false,
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      status: 'connected',
    };
  }

  if (action.type === 'error') {
    return {
      disconnectReason: undefined,
      isDisconnected: false,
      isError: true,
      error: action.payload,
      isConnected: false,
      isConnecting: false,
      status: 'error',
    };
  }

  if (action.type === 'disconnect') {
    return {
      error: undefined,
      isError: false,
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      status: 'disconnected',
      disconnectReason: action.payload,
    };
  }

  return state;
};

export const useSocketReducer = () => {
  const initialState: State = {
    isConnected: false,
    isError: false,
    isConnecting: true,
    isDisconnected: false,
    status: 'connecting',
    disconnectReason: undefined,
    error: undefined,
  };

  return useReducer<Reducer<State, Action>>(socketReducer, initialState);
};

export { State };
