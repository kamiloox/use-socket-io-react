import { renderHook } from '@testing-library/react-hooks';

import {
  waitForSocketConnection,
  SocketProviderMock,
  serverSocket,
  postpone,
} from '../test-utils';

import { useSocketEvent } from './useSocketEvent';

const renderUseSocketEvent = <T,>(
  eventName: string,
  config?: Parameters<typeof useSocketEvent>[1],
) => {
  return renderHook(() => useSocketEvent<T>(eventName, config), {
    wrapper: SocketProviderMock,
  });
};

test('when server emits event it returns received value', async () => {
  const { result, waitForNextUpdate } = renderUseSocketEvent<string>('hello');

  await waitForSocketConnection();

  serverSocket.emit('hello', 'world');
  await waitForNextUpdate();
  expect(result.current.data).toBe('world');

  serverSocket.emit('hello', 'socket');
  await waitForNextUpdate();
  expect(result.current.data).toBe('socket');
});

test('when the option is set to once it does not listen to incoming updates', async () => {
  const { result, waitForNextUpdate } = renderUseSocketEvent<string>('ping', {
    once: true,
  });

  await waitForSocketConnection();

  serverSocket.emit('ping', 'pong_1');
  await waitForNextUpdate();
  expect(result.current.data).toBe('pong_1');

  serverSocket.emit('ping', 'pong_2');
  await postpone(1000);
  expect(result.current.data).toBe('pong_1');
});
