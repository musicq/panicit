import {isNode} from './helper'

export type PanicOption = {
  /** Note the cause of why the error is triggered. */
  cause?: any
  /** Should log panic message. */
  silent?: boolean
  /** Only works in Node.js env. */
  exit?: boolean
  /** Only works in Node.js env. */
  exitCode?: number
}

/**
 * Define default config of panic function.
 */
export type PanicConfig = Omit<PanicOption, 'cause'>

// global panic config
const panicConfig: PanicConfig = {
  exit: true,
  silent: false,
  exitCode: 1,
}

/**
 * Define global panicit config.
 *
 * ```ts
 * definePanicitConfig({exit: false, silent: false, exitCode: 1});
 * ````
 */
export function definePanicitConfig(config: PanicConfig) {
  if (config.exit !== undefined) {
    panicConfig.exit = !!config.exit
  }

  if (config.silent !== undefined) {
    panicConfig.silent = !!config.silent
  }

  if (config.exitCode !== undefined) {
    const exitCode = Number(config.exitCode)
    panicConfig.exitCode = isNaN(exitCode) ? 1 : exitCode
  }
}

/**
 * Terminates the program by throwing an error or exiting the process, and optionally logs a message and cause.
 *
 * ```ts
 * // Throwing a panic with a message
 * panic("Unexpected error occurred");
 *
 * // Throwing a panic with a cause and custom exit behavior
 * panic("Database connection failed", {cause: "Timeout", exit: true, exitCode: 2});
 *
 * // Silently throwing a panic
 * panic("Silent error", {silent: true});
 * ```
 */
export function panic(message: any, opt?: PanicOption): never {
  if (!resolveValue(opt, 'silent')) {
    if (!opt?.cause) {
      console.error('[Panic]', message)
    } else {
      console.group('[Panic]', message)
      console.error('[Cause]', opt.cause)
      console.groupEnd()
    }
  }

  const shouldExit = resolveValue(opt, 'exit')

  if (isNode && shouldExit) {
    process.exit(resolveValue(opt, 'exitCode'))
  }

  throw new Error(message, {cause: opt?.cause})
}

function resolveValue(opt: PanicOption | undefined, optKey: keyof PanicOption) {
  return opt?.[optKey] !== undefined
    ? opt[optKey]
    : panicConfig[optKey as keyof PanicConfig]
}
