// helper.test.js
const { Helper } = require('../src/Helper');
const moment = require('moment-timezone');
const fs = require('fs');
const crypto = require('crypto');

describe('Helper', () => {
    describe('LocalTime', () => {
        beforeAll(() => {
            // Set a default timezone for tests
            moment.tz.setDefault('America/New_York');
        });

        afterAll(() => {
            // Reset the default timezone
            moment.tz.setDefault();
        });

        it('returns expected local time for valid timestamp', () => {
            const timestamp = 1737155257000; // Representing 2025-01-17 12:07:37 UTC
            const expectedTime = '17-01 18:07:37'; // Expected time in America/New_York (UTC-5)
            expect(Helper.LocalTime(timestamp)).toBe(expectedTime);
        });

        it('returns expected local time for current timestamp', () => {
            const currentTimestamp = Date.now();
            const expectedTime =
                moment(currentTimestamp).format('DD-MM HH:mm:ss');
            expect(Helper.LocalTime(currentTimestamp)).toBe(expectedTime);
        });
    });

    describe('getSha256', () => {
        it('returns expected SHA-256 hash for existing file', async () => {
            const file = 'test.txt';
            fs.writeFileSync(file, 'Hello, World!');
            const hash = await Helper.getSha256(file);
            const expectedHash = crypto
                .createHash('sha256')
                .update('Hello, World!')
                .digest('hex');
            expect(hash).toBe(expectedHash);
            fs.unlinkSync(file); // Clean up the test file
        });

        it('rejects promise for non-existent file', async () => {
            const file = 'non_existent_file.txt';
            await expect(Helper.getSha256(file)).rejects.toThrowError(
                'File not found'
            );
        });

        it('rejects promise for invalid file path', async () => {
            const file = './invalid/path';
            await expect(Helper.getSha256(file)).rejects.toThrowError();
        });
    });

    describe('sleep', () => {
        it('resolves promise after specified time', async () => {
            const startTime = Date.now();
            await Helper.sleep(1000); // Sleep for 1 second
            const endTime = Date.now();
            expect(endTime - startTime).toBeGreaterThan(900); // Tolerance of 100ms
        });
    });
});
