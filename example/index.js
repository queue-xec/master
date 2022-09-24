/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
const Master = require('../index');
// const Master = require('queue-xec-master')

// set here only for example , transferEncryptToken
process.env.transferEncryptToken = '00000000000000000000000000000000';
process.env.token = 'demoCHannel0';
process.env.LOG_LEVEL = 'debug';

function resultCollect(result) {
    // handle here incoming results from workers..
    console.dir(result);
}
async function run() {
    const mm = new Master({
        onResults: resultCollect,
        execAssets: {
            dependencies: ['big.js', 'moment'], // pass Worker dependencies
            files: [
                // { masterPath: '/../src/task.js', name: 'task.js', workerPath: '/workplace/task.js' }, // if task.js file not passed to workers , Master will use default one located in /src/task.js , here you can ovverride it by changing above details
                {
                    masterPath: '/task.js',
                    name: 'task.js',
                    workerPath: '/workplace/task.js',
                }, // if task.js file not passed to workers , Master will use default one located in /src/task.js , here you can ovverride it by changing above details
            ],
            /* masterPath and workerPath are not absolute , NEVER access files out of their process.cwd()  path.
        Are relative to their process current location , respectively */
        },
    });
    const dummy = {
        x: 1,
        y: 2,
    };

    let cnt = 0;
    for (let i = 0; i < 500; i += 1) {
        const payload = {
            id: cnt,
            data: JSON.stringify(dummy),
        };
        // eslint-disable-next-line no-await-in-loop
        await mm.pushNewJob(payload).catch((e) => console.log(e));
        cnt += 1;
    }
}
run();
