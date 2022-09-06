import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import io, { ManagerOptions, SocketOptions, Socket } from 'socket.io-client';

import { ServerToClientEvents } from '../types';

import {
  useSocketReducer,
  State as SocketReducerState,
} from './socketReducer/socketReducer';

type SocketContextValues = {
  readonly socket: Socket;
} & SocketReducerState;

const SocketContext = createContext<SocketContextValues | null>(null);

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
  const socketRef: MutableRefObject<
    Socket<ServerToClientEvents, Record<string, unknown>>
  > = useRef(io(uri, config));

  const [state, dispatch] = useSocketReducer();

  useEffect(() => {
    const socket = socketRef.current;

    dispatch({ type: 'connecting' });

    socket.on('connect', () => {
      dispatch({ type: 'connect' });
    });

    socket.on('connect_error', () => {
      dispatch({
        type: 'connect_error',
        payload: 'Websocket connection failure',
      });
    });

    socket.on('disconnect', () => {
      dispatch({ type: 'disconnect' });
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [dispatch, uri]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, ...state }}>
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
