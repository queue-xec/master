const moment = require('moment');
const crypto = require('crypto');
const fs = require('fs');

class Helper {
    /**
     * Description:
     * @param {Number} timestamp
     */
    static LocalTime(timestamp) {
        return moment(timestamp).format('DD-MM HH:mm:ss');
    }

    /**
     * Description:
     * @param {String} file
     */
    static getSha256(file) {
        return new Promise((resolve, reject) => {
            try {
                if (fs.existsSync(file)) {
                    const fileBuffer = fs.readFileSync(file);
                    const hashSum = crypto.createHash('sha256');
                    hashSum.update(fileBuffer);
                    resolve(hashSum.digest('hex'));
                } else {
                    reject(new Error('File not found'));
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = {
    Helper,
};
