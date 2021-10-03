/*
 only needed to sinulate work / delay
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
 */
const  {PluginManager} = require("live-plugin-manager")
const manager = new PluginManager();

  class Task {
  
  constructor(job){
    this.data = job.data;
    this.dependencies = job.exec.dependencies;
    
  }
   async run(){ 
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