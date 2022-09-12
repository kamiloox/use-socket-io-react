import { renderHook } from '@testing-library/react-hooks';

import {
  waitForSocketConnection,
  SocketProviderMock,
  serverSocket,
  postpone,
} from '../test-utils';
import { UnknownArray } from '../types';

import { useSocketEvent } from './useSocketEvent';

const renderUseSocketEvent = <T extends UnknownArray>(
  eventName: string,
  config?: Parameters<typeof useSocketEvent>[1],
) => {
  return renderHook(() => useSocketEvent<T>(eventName, config), {
    wrapper: SocketProviderMock,
  });
};

test('when server emits event it returns received value', async () => {
  const { result, waitForNextUpdate } =
    renderUseSocketEvent<readonly [string, { readonly name: string }]>('hello');

  await waitForSocketConnection();

  serverSocket.emit('hello', 'world');
  await waitForNextUpdate();
  expect(result.current.data[0]).toBe('world');

  serverSocket.emit('hello', 'bye', { name: 'john' });
  await waitForNextUpdate();
  expect(result.current.data[0]).toEqual('bye');
  expect(result.current.data[1]).toEqual({ name: 'john' });
});

test('when the option is set to once it does not listen to incoming updates', async () => {
  const { result, waitForNextUpdate } = renderUseSocketEvent<readonly [string]>(
    'ping',
    {
      once: true,
    },
  );

  await waitForSocketConnection();

  serverSocket.emit('ping', 'pong_1');
  await waitForNextUpdate();
  expect(result.current.data[0]).toBe('pong_1');

  serverSocket.emit('ping', 'pong_2');
  await postpone(1000);
  expect(result.current.data[0]).toBe('pong_1');
});

test('when the value is not emitted than it is undefined', async () => {
  const { result, waitForNextUpdate } = renderUseSocketEvent('ping');

  await waitForSocketConnection();

  serverSocket.emit('ping', 'pong');
  await waitForNextUpdate();
  expect(result.current.data[1]).toBe(undefined);
  expect(result.current.data[2]).toBe(undefined);
});
