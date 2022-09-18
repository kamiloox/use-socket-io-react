import { renderHook } from '@testing-library/react-hooks';

import { SocketProviderMock, server, postpone } from '../test-utils';
import { UnknownArray } from '../types';

import { useSocketEvent, Config } from './useSocketEvent';

const renderUseSocketEvent = <Data extends UnknownArray>(
  eventName: string,
  config?: Config<string, Data>,
) => {
  return renderHook(() => useSocketEvent<Data>(eventName, config), {
    wrapper: SocketProviderMock,
  });
};

test('when server emits event it returns received value', async () => {
  const { result, waitForNextUpdate, waitForValueToChange } =
    renderUseSocketEvent<readonly [string, { readonly name: string }]>('hello');

  await waitForValueToChange(() => result.current.socket.connected);

  server.socket.emit('hello', 'world');
  await waitForNextUpdate();
  expect(result.current.data[0]).toBe('world');

  server.socket.emit('hello', 'bye', { name: 'john' });
  await waitForNextUpdate();
  expect(result.current.data[0]).toEqual('bye');
  expect(result.current.data[1]).toEqual({ name: 'john' });
});

test('when the option is set to once it does not listen to incoming updates', async () => {
  const { result, waitForNextUpdate, waitForValueToChange } =
    renderUseSocketEvent<readonly [string]>('ping', {
      once: true,
    });

  await waitForValueToChange(() => result.current.socket.connected);

  server.socket.emit('ping', 'pong_1');
  await waitForNextUpdate();
  expect(result.current.data[0]).toBe('pong_1');

  server.socket.emit('ping', 'pong_2');
  await postpone(1000);
  expect(result.current.data[0]).toBe('pong_1');
});

test('when the value is not emitted than it is undefined', async () => {
  const { result, waitForNextUpdate, waitForValueToChange } =
    renderUseSocketEvent('ping');

  await waitForValueToChange(() => result.current.socket.connected);

  server.socket.emit('ping', 'pong');
  await waitForNextUpdate();
  expect(result.current.data[1]).toBe(undefined);
  expect(result.current.data[2]).toBe(undefined);
});
