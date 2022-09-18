<div align="center">
  <p>
  Written with ❤️ It's 100% typesafe to make React.js developer experience better with socket.io-client.
  </p>
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React.js">

</div>

## Key features

- Module augmentation to reuse your types that are on a backend. More on that [here](#module-augmentation)
- TypeScript support
- Reusable React.js hooks

## Installation

- With yarn

  ```sh
  yarn add use-socket-io-react
  ```

- With npm

  ```sh
  npm install use-socket-io-react
  ```

## Setup

Wrap the application with a `SocketProvider`. For example, with React 18 it can be done like so:

```ts
const SERVER_URI = 'http://localhost:4000';

ReactDOM.render(
  <SocketProvider uri={SERVER_UR}>
    <App />
  </SocketProvider>,
  document.getElementById('root'),
);
```

The URI prop needs to point to a backend server. Don't forget about handling a [CORS policy](https://socket.io/docs/v4/handling-cors/#configuration) on a server because since version 3 of a `socket.io` it needs to be set explicitly.

## Handling events

There is a hook called `useSocketEvent`. As a first argument, it takes an event name and in a resolution, it returns an object with a `data` array. Values in an array match to an order in which values are passed to an `io.emit` on a server.

```ts
// Server
io.emit('alert', 'Hey, you are the best!');
```

```ts
// Client
const {
  data: [alert],
} = useSocketEvent<[string]>('alert');

if (alert) {
  return <p>You received an alert: ${alert}</p>;
}
```

Alternatively `useSocketEvent` provides a handler callback that gets dispatched when the socket receives an event.

```ts
// Server
io.emit('chat', 'Hello John!', '12:38');
```

```ts
// Client
const [messages, setMessages] = useState<
  Array<{ message: string; sentAt: string }>
>([]);

const handleMessage = ([message, sentAt]: [string, string]) => {
  setMessages([...messages, { message: message, sentAt: sentAt }]);
};

useSocketEvent<[string, string]>('chat', {
  handler: handleMessage,
});

return (
  <section>
    {messages.map(({ message, sentAt }) => (
      <p>
        {message} ({sentAt})
      </p>
    ))}
  </section>
);
```

## Emitting events

For emitting there is a hook called `useSocketEmit`. It doesn't take any argument but it returns an `emit` function.

```ts
const { emit } = useSocketEmit();

emit<[string]>('message', ['Hey, this is my message']);
```

You can provide a generic of how your emitted values need to look, but that's not recommended. Take a look at [module augmentation](#module-augmentation)

## Socket state

Hook called `useSocket` stores values about a current socket state. It knows e.g. if a socket is either connected or there is some error.

```ts
const {
  socket,
  status,
  isConnected,
  isConnecting,
  isDisconnected,
  disconnectReason,
  isError,
  error,
} = useSocket();

// Or you can check: status === 'error'
if (isError) {
  return <p>Error! {error}</p>;
}

if (isDisconnected) {
  return <p>Socket disconnected {disconnectReason}</p>;
}

if (isConnecting) {
  return <p>Is loading</p>;
}
```

In addition, `useSocket` returns a native socket from a `socket.io-client` if some feature is needed that's currently beyond this library.

<h2 id="module-augmentation">Module augmentation</h2>

Socket.io introduces [TypeScript support](https://socket.io/docs/v4/typescript/). This library supports this idea too. It's possible to abandon passing generic to every `useSocketEvent` and `useSocketEmit` hook thankfully to a module [augmentation feature](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

In the a root of a project (e.g. in the `src`) create a file called `types/use-socket-io-react.d.ts` and paste this.

```ts
import 'use-socket-io-react';

declare module 'use-socket-io-react' {
  interface ServerToClientEvents {
    chat: (message: string, sentAt: number) => void;
  }

  interface ClientToServerEvents {
    alert: (content: string) => void;
  }
}
```

These interfaces are copied directly from a backend. There is no need to worry about the specific conventions for this package. If on a backend server a TypeScript is used then it's easy to extend it.

```ts
const { emit } = useSocketEmit();

// Argument of type '[]' is not assignable to parameter of type '[content: string]'.
// Source has 0 element(s) but target requires 1.
emit('alert', []);
```

```ts
const handleMessage: EventHandler<'chat'> = ([message]) => {
  console.log(`There is a message ${message}`);
};

useSocketEvent('chat', {
  handler: handleMessage,
});
```

> Disclaimer. If this feature doesn't work try adding a path to a `typeRoots` in a `tsconfig.json`.

```ts
{
  "compilerOptions": {
    "typeRoots": ["./src/types"]
  },
}
```

### Additional notes

- Package uses the 4th major version of a `socket.io-client`.
- This project uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) convention
- This is still in development. But there are more incoming updates in the future!
