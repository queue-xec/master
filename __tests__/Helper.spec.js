// helper.test.js
const { Helper } = require('../src/Helper');
const moment = require('moment');
const fs = require('fs');
const crypto = require('crypto');

describe('Helper', () => {
    describe('LocalTime', () => {
        it('returns expected local time for valid timestamp', () => {
            const timestamp = 1737155257000; // Representing 2022-02-01 12:30:00
            const expectedTime = '18-01 01:07:37';
            expect(Helper.LocalTime(timestamp)).toBe(expectedTime);
        });

        it('returns expected local time for current timestamp', () => {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const currentTime =
                moment(currentTimestamp).format('DD-MM HH:mm:ss');
            expect(Helper.LocalTime(currentTimestamp)).toBe(currentTime);
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
