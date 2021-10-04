
# Master

Master dictates to its connected  [workers](https://github.com/queue-xec/worker)
what job to execute.Among job data , pass to workers task code to exacute and dependencies  list needed.
Uses  [ZeroMQ](https://github.com/zeromq/zeromq.js) for queue jobs, all job data exchanged with clients are ancrypted with sha-256.
Needs a static ip or a FQDN , to shared with workers and a token.


## Installation

```bash
  git clone https://github.com/queue-xec/master
  cd master
  npm install 
  node index.js --setup
```


```bash 
 node index.js --setup
 ```
Will prompt user to enter following info:
- `port` listening  
- `token`  32 length random alphanumeric string
- `queueLimit` number 

These info will saved and loaded in .env file at root Masters folder.

## How to set job code to run in workers

Edit [taskFile](https://github.com/queue-xec/master/blob/devel/task.js) inner `run()` method

```js
class Task {
  
  constructor(job){
    this.data = job.data;
    this.dependencies = job.exec.dependencies;
    
  }
   async run(){  // jobs logic to execute
    const  { Big } = manager.require('big.js');
    // require your dependencies here or in any other class method is need...

    // code to run in workers
    return 'result <anything serialized>'
    }

  static async checkInstallDeps( dependencies){ 
    let dep = null 
    for (let i=0 ; i < dependencies.length ; i+=1){
      dep = dependencies[i]
      try {
        require.resolve(dep)
      } catch(e) {
        // console.log(e)
        console.log(`Installing ${dep} `);
        await manager.install(dep);
      }
    }
  }


}

module.exports = Task
```


## Example:
```js
const Master = require('path-to-master')
async function run(){
    const mm = new Master()
    const dummy = { 
    // 
    }
     
    setInterval(async()=>{
        console.dir(mm.getQueueLength())
        var payload = {
          data: JSON.stringify(dummy), 
          exec:{  
            file: getBase64('./task.js') , 
            name:"exec.js" , 
            dependencies: ['big.js', 'technicalindicators' ]} // npm packages to installed at runtime of online worker
           };
        mm.pushNewJob(payload)
    },2000)
}
```



[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

  