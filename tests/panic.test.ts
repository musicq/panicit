import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {panic, definePanicitConfig} from '../src'

const mockProcessExit = vi
  .spyOn(process, 'exit')
  .mockImplementation((() => {}) as any)
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
const mockConsoleGroup = vi.spyOn(console, 'group').mockImplementation(() => {})

afterEach(() => {
  vi.clearAllMocks()
})

describe('panicit', () => {
  beforeEach(() => {
    // reset global config
    definePanicitConfig({
      exit: true,
      silent: false,
      exitCode: 1,
    })
  })

  describe('panic error snapshots', () => {
    it('snapshot panic error message', () => {
      try {
        panic('error message')
      } catch (e) {
        expect(e.toString()).toMatchInlineSnapshot(`"Error: error message"`)
        expect(e.cause).toBeUndefined()
      }
    })

    it('snapshot panic & cause error message', () => {
      try {
        panic('error message', {cause: 'reason'})
      } catch (e) {
        expect(e.toString()).toMatchInlineSnapshot(`"Error: error message"`)
        expect(e.cause).toBe('reason')
      }
    })
  })

  it('panic', () => {
    expect(() => panic('error message')).toThrowError()
    expect(mockProcessExit).toHaveBeenCalledOnce()
    expect(mockProcessExit).toBeCalledWith(1)
    expect(mockConsoleError).toHaveBeenCalledOnce()
    expect(mockConsoleError).toBeCalledWith('[Panic]', 'error message')
  })

  it('panic with error code = 2 and error cause', () => {
    expect(() =>
      panic('error message', {exitCode: 2, cause: 'error cause'})
    ).toThrowError()
    expect(mockProcessExit).toHaveBeenCalledOnce()
    expect(mockProcessExit).toBeCalledWith(2)
    expect(mockConsoleGroup).toBeCalledTimes(1)
    expect(mockConsoleGroup).toHaveBeenCalledWith('[Panic]', 'error message')
    expect(mockConsoleError).toBeCalledTimes(1)
    expect(mockConsoleError).toBeCalledWith('[Cause]', 'error cause')
  })

  it('error and cause are objects', () => {
    expect(() =>
      panic({error: 'some error'}, {cause: {reason: 'some cause'}})
    ).toThrowError()
    expect(mockProcessExit).toHaveBeenCalledOnce()
    expect(mockProcessExit).toBeCalledWith(1)
    expect(mockConsoleGroup).toBeCalledTimes(1)
    expect(mockConsoleGroup).toHaveBeenCalledWith(
      '[Panic]',
      expect.objectContaining({error: 'some error'})
    )
    expect(mockConsoleError).toBeCalledTimes(1)
    expect(mockConsoleError).toHaveBeenCalledWith(
      '[Cause]',
      expect.objectContaining({reason: 'some cause'})
    )
  })

  it('silent output', () => {
    expect(() =>
      panic({error: 'some error'}, {cause: 'some cause', silent: true})
    ).toThrowError()
    expect(mockProcessExit).toHaveBeenCalledOnce()
    expect(mockProcessExit).toBeCalledWith(1)
    expect(mockConsoleGroup).not.toBeCalled()
    expect(mockConsoleError).not.toBeCalled()
  })

  it('do not exit if opt.exit is false', () => {
    expect(() =>
      panic({error: 'some error'}, {cause: 'some cause', exit: false})
    ).toThrowError()
    expect(mockProcessExit).not.toHaveBeenCalled()
    expect(mockConsoleGroup).toBeCalled()
    expect(mockConsoleError).toBeCalled()
  })

  describe('global panic config', () => {
    it('respects global config', () => {
      definePanicitConfig({exit: true, silent: true, exitCode: 2})

      expect(() => panic({error: 'some error'})).toThrowError()
      expect(mockProcessExit).toBeCalledWith(2)
      expect(mockConsoleGroup).not.toBeCalled()
      expect(mockConsoleError).not.toBeCalled()
    })

    it('overrides global config with inline config', () => {
      expect(() =>
        panic({error: 'some error'}, {exit: true, silent: true, exitCode: 2})
      ).toThrowError()
      expect(mockProcessExit).toBeCalledWith(2)
      expect(mockConsoleGroup).not.toBeCalled()
      expect(mockConsoleError).not.toBeCalled()
    })
  })
})
