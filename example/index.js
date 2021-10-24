const Master = require('queue-xec-master')

async function collectResults(response){
    console.dir(response)
}
function run(){
    const options = {
        ip: '127.0.0.1',
        port: 8080,
        token: 'secretsecretsecretsecretsecrettt',
        onResult: collectResults
    }
    const mm = new Master(options)
    const dummy = { 
        test: 'data'
    }   
    setInterval( ()=>{
        console.dir(mm.getQueueLength())
        var payload = {
          data: dummy, 
          exec:{  
            file: Master.getBase64('./task.js') , 
            name:"exec.js" , 
            dependencies: ['big.js', 'technicalindicators' ]} // npm packages to installed at runtime of online worker
           };
        mm.pushNewJob(JSON.stringify(payload))
    },500)
}

run()