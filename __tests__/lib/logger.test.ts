import { logger } from '@/lib/logger';

describe('Logger', () => {
  let logSpy: jest.SpiedFunction<typeof console.log>;
  let errorSpy: jest.SpiedFunction<typeof console.error>;
  let warnSpy: jest.SpiedFunction<typeof console.warn>;
  let debugSpy: jest.SpiedFunction<typeof console.debug>;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs info messages', () => {
    logger.info('Test info message');

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toContain('[INFO]');
    expect(logSpy.mock.calls[0][0]).toContain('Test info message');
  });

  it('logs error messages', () => {
    logger.error('Test error message');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][0]).toContain('[ERROR]');
    expect(errorSpy.mock.calls[0][0]).toContain('Test error message');
  });

  it('logs warning messages', () => {
    logger.warn('Test warning message');

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('[WARN]');
    expect(warnSpy.mock.calls[0][0]).toContain('Test warning message');
  });

  it('logs debug messages in development', () => {
    const originalEnv = process.env.NODE_ENV;

    try {
      process.env.NODE_ENV = 'development';
      logger.debug('Test debug message');

      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(debugSpy.mock.calls[0][0]).toContain('[DEBUG]');
      expect(debugSpy.mock.calls[0][0]).toContain('Test debug message');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('includes metadata in log output', () => {
    logger.info('Test message', { key: 'value', number: 123 });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    expect(output).toContain('Test message');
    expect(output).toContain('"key":"value"');
    expect(output).toContain('"number":123');
  });

  it('logs error objects with stack trace', () => {
    const error = new Error('Test error');

    logger.logError(error, { context: 'test' });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const output = errorSpy.mock.calls[0][0];
    expect(output).toContain('Test error');
    expect(output).toContain('context');
  });

  it('handles non-Error objects', () => {
    logger.logError('String error', { context: 'test' });

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
