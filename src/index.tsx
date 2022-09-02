import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const Socket = () => {
  const socket = useRef(io());

  useEffect(() => {
    socket.current.on('connect_error', () => {
      console.log('Connect error');
    });
  }, []);

  return <div>Hello use-socket-io</div>;
};
