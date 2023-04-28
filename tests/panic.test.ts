import {afterEach, expect, test, vi} from 'vitest'
import {panic} from '../src'

const mockProcessExit = vi
  .spyOn(process, 'exit')
  .mockImplementation((() => {}) as any)
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
const mockConsoleGroup = vi.spyOn(console, 'group').mockImplementation(() => {})

afterEach(() => {
  vi.clearAllMocks()
})

test('panic', () => {
  expect(() => panic('error message')).toThrowErrorMatchingInlineSnapshot(
    '"error message"'
  )
  expect(mockProcessExit).toHaveBeenCalledOnce()
  expect(mockProcessExit).toBeCalledWith(1)
  expect(mockConsoleError).toHaveBeenCalledOnce()
  expect(mockConsoleError).toBeCalledWith('[panic]', 'error message')
})

test('panic with error code = 2 and error cause', () => {
  expect(() =>
    panic('error message', { exitCode: 2, cause: 'error cause' })
  ).toThrowErrorMatchingInlineSnapshot('"error message"')
  expect(mockProcessExit).toHaveBeenCalledOnce()
  expect(mockProcessExit).toBeCalledWith(2)
  expect(mockConsoleGroup).toBeCalledTimes(1)
  expect(mockConsoleGroup).toHaveBeenCalledWith('[panic]', 'error message')
  expect(mockConsoleError).toBeCalledTimes(1)
  expect(mockConsoleError).toBeCalledWith('[Cause]', 'error cause')
})

test('error and cause are objects', () => {
  expect(() =>
    panic({ error: 'some error' }, { cause: { reason: 'some cause' } })
  ).toThrowErrorMatchingInlineSnapshot('"[object Object]"')
  expect(mockProcessExit).toHaveBeenCalledOnce()
  expect(mockProcessExit).toBeCalledWith(1)
  expect(mockConsoleGroup).toBeCalledTimes(1)
  expect(mockConsoleGroup).toHaveBeenCalledWith(
    '[panic]',
    expect.objectContaining({ error: 'some error' })
  )
  expect(mockConsoleError).toBeCalledTimes(1)
  expect(mockConsoleError).toHaveBeenCalledWith(
    '[Cause]',
    expect.objectContaining({ reason: 'some cause' })
  )
})

test('silent output', () => {
  expect(() =>
    panic({ error: 'some error' }, { cause: 'some cause', silent: true })
  ).toThrowErrorMatchingInlineSnapshot('"[object Object]"')
  expect(mockProcessExit).toHaveBeenCalledOnce()
  expect(mockProcessExit).toBeCalledWith(1)
  expect(mockConsoleGroup).not.toBeCalled()
  expect(mockConsoleError).not.toBeCalled()
})

test('do not exit if opt.exit is false', () => {
  expect(() =>
    panic({ error: 'some error' }, { cause: 'some cause', shouldExit: false })
  ).toThrowErrorMatchingInlineSnapshot('"[object Object]"')
  expect(mockProcessExit).not.toHaveBeenCalled()
  expect(mockConsoleGroup).toBeCalled()
  expect(mockConsoleError).toBeCalled()
})
