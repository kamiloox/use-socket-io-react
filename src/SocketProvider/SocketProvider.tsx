import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import io, { ManagerOptions, SocketOptions } from 'socket.io-client';

import { Socket } from '../types';

import {
  useSocketReducer,
  State as SocketState,
} from './socketReducer/socketReducer';

type SocketContextValues = {
  readonly socket: Socket;
} & SocketState;

const SocketContext = createContext<SocketContextValues | undefined>(undefined);

type SocketProviderProps = {
  readonly children: ReactNode;
  readonly uri: string;
  readonly config?: Partial<ManagerOptions & SocketOptions>;
};

export const SocketProvider = ({
  children,
  uri,
  config,
}: SocketProviderProps) => {
  const [socket]: readonly [Socket, unknown] = useState(io(uri, config));

  const [state, dispatch] = useSocketReducer();

  useEffect(() => {
    dispatch({ type: 'connecting' });

    socket.on('connect', () => {
      dispatch({ type: 'connected' });
    });

    socket.on('connect_error', ({ message }) => {
      dispatch({
        type: 'error',
        payload: message,
      });
    });

    socket.on('disconnect', (reason) => {
      dispatch({ type: 'disconnect', payload: reason });
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [dispatch, uri]);

  return (
    <SocketContext.Provider value={{ socket, ...state }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const value = useContext(SocketContext);

  if (!value) {
    throw new Error("SocketContext hasn't been provided");
  }

  return useMemo(() => value, [value]);
};
