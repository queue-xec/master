/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/*
 only needed to sinulate work / delay
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
 */
const moment = require('moment');

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
        this.data = JSON.parse(job.data);

        // require your dependencies here or in any other class method is need...

        // code to run in workers
        return `-- ${Math.random()} on ${moment().format(
            'MMMM Do YYYY, h:mm:ss a'
        )} -- result <anything serialized>`;
    }
}

module.exports = Task;
