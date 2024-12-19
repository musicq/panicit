# panicit

<p>
  <a href="https://npmjs.com/package/panicit"><img src="https://img.shields.io/npm/v/panicit.svg" alt="npm package"></a>
</p>

`panicit` is a small library that could let you exit or throw error with helpful
messages. It works in both browser and Node.js.

## Getting start

```shell
npm i panicit
```

## Usage

```ts
import {panic} from 'panicit'

panic('some error')
```

It will print

```txt
some reason
Uncaught Error: some reason
    at n (<anonymous>:2:57)
    at <anonymous>:1:1
```

**with cause**

You can provide the cause as well.

```ts
import {panic} from 'panicit'

panic('some error', {cause: 'some cause'})
```

It will print

```txt
some reason
[Cause] some cause
Error: some reason
    at n (<anonymous>:2:57)
    at <anonymous>:1:1
```

If you are using Node.js, you can also provide exit code.

```ts
import {panic} from 'panicit'

panic('some error', {cause: 'some cause', exitCode: 2})
```

Result

```txt
➜ node
> panic('some reason', {cause: 'some cause', exitCode: 2})
some reason
[Cause] some cause

➜ echo $?
2
```

### Prevent exit

By default, `panic` will exit the program in Node.js, but you can set `exit`
option to false to disable this behavior.

```ts
panic('some error', {exit: false})
```

> Note that exit program can only be used in Node environment.

### Default exit behavior

You can define whether should the program exit by default or not by using
`definePanicitConfig`.

```ts
import {definePanicitConfig} from 'panicit'

definePanicitConfig({exit: false})

// this won't exit the program
panic('some error')

// you can still exit the program by set `exit` to `true` explicitly
panic('some error', {exit: true})
```

### Options

Inline panic option, used as the second parameter of `panic` function.

```ts
type PanicOption = {
  /** Note the cause of why the error is triggered. */
  cause?: any
  /** Should log panic message. */
  silent?: boolean
  /** Only works in Node.js env. */
  exit?: boolean
  /** Only works in Node.js env. */
  exitCode?: number
}
```

Global panic config.

```ts
type PanicConfig = {
  /** Should log panic message. */
  silent?: boolean
  /** Only works in Node.js env. */
  exit?: boolean
  /** Only works in Node.js env. */
  exitCode?: number
}
```
