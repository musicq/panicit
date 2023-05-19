import {isNode} from './helper'

export type PanicOption = {
  cause?: any
  exitCode?: number
  silent?: boolean
  shouldExit?: boolean
  exit?: boolean
}

export function panic(message: any, opt?: PanicOption): never {
  if (!opt?.silent) {
    if (!opt?.cause) {
      console.error('[panic]', message)
    } else {
      console.group('[panic]', message)
      console.error('[Cause]', opt.cause)
      console.groupEnd()
    }
  }
  let shouldExit = opt?.exit

  if (opt?.shouldExit !== undefined && opt?.exit == undefined) {
    shouldExit = opt.shouldExit
  }

  if (isNode && shouldExit !== false) {
    process.exit(opt?.exitCode ?? 1)
  }

  throw new Error(message, { cause: opt?.cause })
}
