import { isNode } from './helper'

export function panic(
  message: any,
  opt?: { exitCode?: number; cause?: any }
): never {
  console.error(message, opt?.cause ? `\n[Cause] ${opt.cause}` : '')

  if (isNode) {
    process.exit(opt?.exitCode ?? 1)
  }

  throw new Error(message, { cause: opt?.cause })
}
