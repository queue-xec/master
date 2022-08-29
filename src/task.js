/*
 only needed to sinulate work / delay
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
 */
// Requre here libs you passed from master as dependencies
// if needed here.
// const { Big } = require('big.js');

class Task {
  constructor() {
    this.data = null;
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
    // code to run in workers
    return {};
  }
}

module.exports = Task;
