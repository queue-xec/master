const mockeData = require('./utils');
const Master = require('../index');

process.env.transferEncryptToken = '00000000000000000000000000000000';
process.env.token = 'demoCHannel0';
process.env.LOG_LEVEL = 'off';

let master;
beforeEach(() => {
    master = new Master();
});

describe('pushNewJob method', () => {
    it('Reject push job if not pass payload', async () => {
        await master.pushNewJob().catch((e) => {
            expect(e.message).toBe('payload is undefined');
        });
    });
    it('Push job succesfully and enrcypted , if job is object', async () => {
        const encryptedPayload = master.crypt.encrypt(
            JSON.stringify(mockeData.payloadObject)
        );
        await master.pushNewJob(mockeData.payloadObject);

        expect(encryptedPayload).toHaveProperty('iv');
        expect(encryptedPayload).toHaveProperty('encryptedData');
        expect(master.jobs.size).toEqual(1);
        expect(JSON.parse(master.jobs.dequeue().value)).toEqual(
            encryptedPayload
        );
    });
    it('Push job succesfully and enrcypted , if job is array', async () => {
        const encryptedPayload = master.crypt.encrypt(
            JSON.stringify(mockeData.payloadArray)
        );
        await master.pushNewJob(mockeData.payloadArray);

        expect(encryptedPayload).toHaveProperty('iv');
        expect(encryptedPayload).toHaveProperty('encryptedData');
        expect(master.jobs.size).toEqual(1);
        expect(JSON.parse(master.jobs.dequeue().value)).toEqual(
            encryptedPayload
        );
    });
    it('Push job succesfully and enrcypted , if job is string', async () => {
        const jobData = '50';
        const encryptedPayload = master.crypt.encrypt(jobData);
        await master.pushNewJob(jobData);

        expect(encryptedPayload).toHaveProperty('iv');
        expect(encryptedPayload).toHaveProperty('encryptedData');
        expect(master.jobs.size).toEqual(1);
        expect(JSON.parse(master.jobs.dequeue().value)).toEqual(
            encryptedPayload
        );
    });
    it('Push job succesfully and enrcypted , if job is number', async () => {
        const jobData = 50;
        const encryptedPayload = master.crypt.encrypt(jobData);
        await master.pushNewJob(jobData);

        expect(encryptedPayload).toHaveProperty('iv');
        expect(encryptedPayload).toHaveProperty('encryptedData');
        expect(master.jobs.size).toEqual(1);
        expect(JSON.parse(master.jobs.dequeue().value)).toEqual(
            encryptedPayload
        );
    });
});
