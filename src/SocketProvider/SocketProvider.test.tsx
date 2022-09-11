import { renderHook } from '@testing-library/react-hooks';

import {
  SocketProviderMock,
  SocketProviderMockInvalidUri,
} from '../test-utils';

import { useSocket } from './SocketProvider';

test('when uri is invalid it returns connection error', async () => {
  const { result, waitForNextUpdate } = renderHook(useSocket, {
    wrapper: SocketProviderMockInvalidUri,
  });

  await waitForNextUpdate();

  expect(result.current.isConnectionError).toBeTruthy();
});

test('when everything is valid it returns connected state', async () => {
  const { result, waitForNextUpdate } = renderHook(useSocket, {
    wrapper: SocketProviderMock,
  });

  await waitForNextUpdate();

  expect(result.current.isConnected).toBeTruthy();
});
