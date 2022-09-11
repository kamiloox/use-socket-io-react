import { renderHook } from '@testing-library/react-hooks';

import {
  waitForSocketConnection,
  SocketProviderMock,
  serverSocket,
} from '../test-utils';

import { useSocketEvent } from './useSocketEvent';

test('when server emits event it returns received value', async () => {
  const { result, waitForNextUpdate } = renderHook(
    () => useSocketEvent<string>('hello'),
    {
      wrapper: SocketProviderMock,
    },
  );

  await waitForSocketConnection();

  serverSocket.emit('hello', 'world');

  await waitForNextUpdate();

  expect(result.current.data).toBe('world');
});
