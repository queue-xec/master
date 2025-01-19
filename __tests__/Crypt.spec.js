const crypto = require('crypto');
const Crypt = require('../src/Crypt');

describe('Crypt class', () => {
    const key = 'ulo6Ohcoos0mieboh0mukah7nohch5ae';
    const text = 'Hello, World!';

    describe('constructor', () => {
        it('should throw an error if key is not provided', () => {
            expect(() => new Crypt()).toThrow(
                'transferEncryptToken not specified..'
            );
        });

        it('should initialize key and iv when provided', () => {
            const crypt = new Crypt(key);
            expect(crypt.key).toBe(key);
            expect(crypt.iv).toBeInstanceOf(Buffer);
        });
    });

    describe('encrypt method', () => {
        it('should encrypt text successfully', () => {
            const crypt = new Crypt(key);
            const encrypted = crypt.encrypt(text);
            expect(encrypted).toHaveProperty('iv');
            expect(encrypted).toHaveProperty('encryptedData');
        });

        it('should handle number input', () => {
            const crypt = new Crypt(key);
            const encrypted = crypt.encrypt(123);
            expect(encrypted).toHaveProperty('iv');
            expect(encrypted).toHaveProperty('encryptedData');
        });

        it('should throw an error if key is invalid', () => {
            const crypt = new Crypt('short_key');
            const result = crypt.encrypt(text);
            expect(result).toBeNull();
        });

        it('should handle edge cases', () => {
            const crypt = new Crypt(key);
            const encrypted = crypt.encrypt(undefined);
            const encrypted2 = crypt.encrypt(null);

            expect(() => crypt.encrypt(null)).not.toThrow();
            expect(() => crypt.encrypt(undefined)).not.toThrow();
            expect(encrypted).toBe(null);
            expect(encrypted2).toBe(null);
        });
    });

    describe('decrypt method', () => {
        it('should decrypt text successfully', () => {
            const crypt = new Crypt(key);
            const encrypted = crypt.encrypt(text);
            const decrypted = crypt.decrypt(encrypted);
            expect(decrypted).toBe(text);
        });

        it('should handle invalid input', () => {
            const crypt = new Crypt(key);
            const invalidEncrypted = {
                iv: 'invalid_iv',
                encryptedData: 'invalid_data',
            };
            const result = crypt.decrypt(invalidEncrypted);
            expect(result).toBeNull();
        });

        it('should handle edge cases', () => {
            const crypt = new Crypt(key);
            const decrypted = crypt.decrypt(undefined);
            const decrypted2 = crypt.decrypt(null);

            expect(() => crypt.decrypt(null)).not.toThrow();
            expect(() => crypt.decrypt(undefined)).not.toThrow();
            expect(decrypted).toBe(null);
            expect(decrypted2).toBe(null);
        });
    });

    describe('getKey and getIv methods', () => {
        it('should return the key', () => {
            const crypt = new Crypt(key);
            expect(crypt.getKey()).toBe(key);
        });

        it('should return the iv', () => {
            const crypt = new Crypt(key);
            expect(crypt.getIv()).toBeInstanceOf(Buffer);
        });
    });
});
