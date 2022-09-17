import { renderHook } from '@testing-library/react-hooks';

import { server, SocketProviderMock } from '../test-utils';

import { useSocketEmit } from './useSocketEmit';

test('when client emits event to server, server receives emitted value', (done) => {
  const { result, waitForValueToChange } = renderHook(useSocketEmit, {
    wrapper: SocketProviderMock,
  });

  void waitForValueToChange(() => result.current.socket.connected).then(() => {
    server.socket.on('fruit', (fruit1, fruit2) => {
      expect(fruit1).toBe('orange');
      expect(fruit2).toBe('apple');
      done();
    });

    result.current.emit('fruit', 'orange', 'apple');
  });
});
