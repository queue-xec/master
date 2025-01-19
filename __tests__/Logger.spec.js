// Logger.test.js
const { Logger } = require('../src/Logger');
const fs = require('fs');
const { PassThrough } = require('stream');

jest.mock('fs');

describe('Logger class', () => {
    let logger;

    beforeEach(() => {
        logger = new Logger({
            level: 'debug',
            writeStream: null,
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('translateToCode method', () => {
        it('should return 0 for "off" log level', () => {
            const result = logger.translateToCode('off');
            expect(result).toBe(0);
        });

        it('should return 1 for "info" log level', () => {
            const result = logger.translateToCode('info');
            expect(result).toBe(1);
        });

        it('should return 2 for "warn" log level', () => {
            const result = logger.translateToCode('warn');
            expect(result).toBe(2);
        });

        it('should return 3 for "error" log level', () => {
            const result = logger.translateToCode('error');
            expect(result).toBe(3);
        });

        it('should return 4 for "debug" log level', () => {
            const result = logger.translateToCode('debug');
            expect(result).toBe(4);
        });

        it('should return 0 for invalid log level', () => {
            const result = logger.translateToCode('invalid');
            expect(result).toBe(0);
        });
    });

    describe('info method', () => {
        it('should not log if log level is "off"', () => {
            logger.level = 0;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.info('Test message');
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should log if log level is "info"', () => {
            logger.level = 1;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.info('Test message');
            expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        });

        it('should log with extra information', () => {
            logger.level = 1;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.info('Test message', { extra: 'information' });
            expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('warn method', () => {
        it('should not log if log level is "off"', () => {
            logger.level = 0;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.warn('Test message');
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should not log if log level is "info"', () => {
            logger.level = 1;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.warn('Test message');
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should log if log level is "warn"', () => {
            logger.level = 2;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.warn('Test message');
            expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        });

        it('should log with extra information', () => {
            logger.level = 2;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.warn('Test message', { extra: 'information' });
            expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('error method', () => {
        it('should not log if log level is "off"', () => {
            logger.level = 0;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.error('Test message');
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should not log if log level is "info"', () => {
            logger.level = 1;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.error('Test message');
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should not log if log level is "warn"', () => {
            logger.level = 2;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.error('Test message');
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should log if log level is "error"', () => {
            logger.level = 3;
            const consoleLogSpy = jest.spyOn(console, 'log');
            logger.error('Test message');
            logger.error('Test message', { mock: 'all' });
            logger.error({ mock: 'all' });

            expect(consoleLogSpy).toHaveBeenCalledTimes(3);
        });
    });

    describe('fatal method', () => {
        it('should exit the process with code -1 if no message is provided', () => {
            const processExitSpy = jest.spyOn(process, 'exit');
            const mockExit = jest
                .spyOn(process, 'exit')
                .mockImplementation((number) => {
                    throw new Error('process.exit: ' + number);
                });
            expect(() => {
                logger.fatal();
            }).toThrow();
            expect(() => {
                logger.fatal('error');
            }).toThrow();
            expect(() => {
                logger.fatal('error', 'extra');
            }).toThrow();

            expect(() => {
                logger.fatal('error', { mock: 'me' });
            }).toThrow();

            expect(() => {
                logger.fatal({ mock: 'me' });
            }).toThrow();

            expect(() => {
                logger.fatal({ mock: 'me' }, '22');
            }).toThrow();

            expect(mockExit).toHaveBeenCalledWith(-1);
            expect(processExitSpy).toHaveBeenCalledTimes(6);
            mockExit.mockRestore();
        });
    });

    describe('debug method', () => {
        it('should not log if log level is "off"', () => {
            logger.level = 0;
            const consoleDebugSpy = jest.spyOn(console, 'debug');
            logger.debug('Test message');
            expect(consoleDebugSpy).not.toHaveBeenCalled();
        });

        it('should not log if log level is "info"', () => {
            logger.level = 1;
            const consoleDebugSpy = jest.spyOn(console, 'debug');
            logger.debug('Test message');
            expect(consoleDebugSpy).not.toHaveBeenCalled();
        });

        it('should not log if log level is "warn"', () => {
            logger.level = 2;
            const consoleDebugSpy = jest.spyOn(console, 'debug');
            logger.debug('Test message');
            expect(consoleDebugSpy).not.toHaveBeenCalled();
        });

        it('should not log if log level is "error"', () => {
            logger.level = 3;
            const consoleDebugSpy = jest.spyOn(console, 'debug');
            logger.debug('Test message');
            expect(consoleDebugSpy).not.toHaveBeenCalled();
        });

        it('should log if log level is "debug"', () => {
            logger.level = 4;
            const consoleDebugSpy = jest.spyOn(console, 'debug');
            logger.debug('Test message');
            expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
        });

        it('should log if log level is "debug" with extra', () => {
            logger.level = 4;
            const consoleDebugSpy = jest.spyOn(console, 'log');
            logger.debug('Test message', 'extraaa');
            logger.debug('Test message', { test: 'me' });
            logger.debug({ test: 'me' }, { test: 'me' });
            logger.debug({ test: 'me' }, 'me');
            logger.debug({ test: 'me' });

            expect(consoleDebugSpy).toHaveBeenCalledTimes(5);
        });
    });

    describe('writeToFile method', () => {
        it('should stringify  ', () => {
            const mockWriteable = new PassThrough();
            fs.createWriteStream.mockReturnValueOnce(mockWriteable);

            const log = new Logger({
                level: 'debug',
                writeStream: fs.createWriteStream('here.txt'),
            });
            const consoleDebugSpy = jest.spyOn(log, 'writeToFile');
            log.writeToFile('hello');
            log.writeToFile({ pro: 'name' });

            log.writeToFile({ pro: 'name' }, { another: 1 });
            log.writeToFile({ pro: 'name' }, 1);

            expect(consoleDebugSpy).toHaveBeenCalledTimes(4);
        });
    });
});
