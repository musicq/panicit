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
import { panic } from 'panicit'

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

You can also provide the cause.

```ts
import { panic } from 'panicit'

panic('some error', { cause: 'some cause' })
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
import { panic } from 'panicit'

panic('some error', { cause: 'some cause', exitCode: 2 })
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
