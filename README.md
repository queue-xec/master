# Master

[![Publish to NPM](https://github.com/queue-xec/master/actions/workflows/publish_npm.yml/badge.svg)](https://github.com/queue-xec/master/actions/workflows/publish_npm.yml)


Master connects to a peer-to-peer 'room' data channel and shares with their peers (Workers) data about the jobs. Among them is job data( each job/task may have its own data to solve/work on) , job code to executed by workers and code dependencies which workers have to install before stat processing tasks. In other words Master defines the problem , defines the way to solve it, provides all the tools and code needed and adds data (if needed() to solve the problem..

Master and Workers can find each other in any network condition , as long they are connected online. This is possible from nature of peer to peer networks and [bugout](https://github.com/chr15m/bugout) ! Bugout offers message transfer encryption, but we encrypt all data i/o transfers on top of that , here as well.

<img  height="780px"  src="./example/demo.gif">

## Installation

```bash
  git clone https://github.com/queue-xec/master
  cd master
  yarn # or npm  install
```

```bash
 node cli.js --setup
```

Will prompt user to enter following info:

-   `transferEncryptToken` Enter a 32 length alphanumeric string Or prompt to generate one on the fly
-   `token` Enter at least 20 length alphanumeric string Or prompt to generate one on the fly

These info will be saved and loaded in .env file in the root folder of Master.It should be the same on all workers , to be able to communicate.

## How to set job code to run in workers

Edit [taskFile](https://github.com/queue-xec/master/blob/devel/src/task.js) inner `run()` method

 ⚠️ Beware, this file should never be modified in a remote worker instance because it will be overwritten by Master the next time the worker instance is initiated

```javascript
// Require here libs you passed from master as dependencies
// if needed here.
const { Big } = require('big.js');
const Helper = require('./Helper.js');
class Task {
    // task.js file will placed by default in WORKER_DIR /workplace/task.js
    constructor() {
        this.data = null;
        // this.helper = new Helper();
    }

    /**
     * Description: This method is the job procces. Receives job data (job)
     * Must return job results (Object) , to delivered in master.
     * @param {Object} job data from Master about job {id: Number , data: String (needs JSON.parse)}
     * @returns {Object} result
     */
    async run(job) {
        console.dir(job);
        const data = JSON.parse(job.data);
        // code to solve the problem  , in remote Workers
        return {};
    }
}

module.exports = Task;
```

## Example:

```js
const Master = require('queue-xec-master');
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
                {
                    masterPath: '/src/task.js',
                    name: 'task.js',
                    workerPath: '/workplace/task.js',
                }, // if task.js file not passed to workers , Master will use default one located in /src/task.js , here you can ovverride it by changing above details
                {
                    masterPath: '/src/Logger.js',
                    name: 'Logger.js',
                    workerPath: '/workplace/Logger.js',
                },
                {
                    masterPath: '/src/Helper.js',
                    name: 'Helper.js',
                    workerPath: '/workplace/Helper.js',
                },
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
    for (let i = 0; i < 5; i++) {
        const payload = {
            id: cnt,
            data: JSON.stringify(dummy),
        };
        await mm.pushNewJob(payload).catch((e) => console.log(e));
        cnt += 1;
    }
}
```

### ⚠️ Under development ⚠️

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/queue-xec/master/blob/devel/LICENSE)

## > Contributors <

<a  href="https://github.com/queue-xec/master/graphs/contributors">
<img  src="https://contrib.rocks/image?repo=queue-xec/master"  />
</a>

### DISCLAIMER NOTICE:

Queue-Xec Master is a library that allows users to connect to a peer-to-peer 'room' data channel and share data about jobs with other users (hereinafter referred to as "Workers"). This data may include job data, job code to be executed by Workers, and code dependencies that Workers must install before processing tasks. The Library also allows users to define the problem to be solved, provide the necessary tools and code, and add data (if needed) to solve the problem.

Please be aware that the Library is provided "as is" and we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the Library or the information, products, services, or related graphics contained on the Library for any purpose. Any reliance you place on such information is therefore strictly at your own risk.

In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of the Library.
