/* eslint-disable no-console */
const crypto = require('crypto');

class Crypt {
    constructor(key) {
        this.key = key || new Error('transferEncryptToken not specified..');
        this.iv = crypto.randomBytes(16);
    }

    encrypt(text) {
        let textToEncrypt = text;
        try {
            if (typeof textToEncrypt === 'number')
                textToEncrypt = textToEncrypt.toString();
            const cipher = crypto.createCipheriv(
                'aes-256-cbc',
                Buffer.from(this.getKey()),
                this.getIv()
            );
            let encrypted = cipher.update(textToEncrypt);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return {
                iv: this.getIv().toString('hex'),
                encryptedData: encrypted.toString('hex'),
            };
        } catch (e) {
            if (e.message.includes('Invalid key length')) {
                console.log('Crypt:', e.message, ' pick a 32 length key');
            } else console.log('Crypt:', e.message);
            return null;
        }
    }

    decrypt(text) {
        try {
            const iv = Buffer.from(text.iv, 'hex');
            const encryptedText = Buffer.from(text.encryptedData, 'hex');
            const decipher = crypto.createDecipheriv(
                'aes-256-cbc',
                Buffer.from(this.getKey()),
                iv
            );
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (e) {
            console.log('Crypt:', e.message);
            return null;
        }
    }

    getKey() {
        return this.key;
    }

    getIv() {
        return this.iv;
    }
}

module.exports = Crypt;
