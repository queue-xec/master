
 
const  {Dealer} = require("zeromq")
const Queue = require("./queue.js")
const fs = require('fs');

function getBase64(file) {
   return fs.readFileSync(file, {encoding: 'base64'});
}
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

class Master {
    constructor(){
        this.queue_name = 'work_queue'
        this.queue  = null
        this.init()
    }

    async  init(){
      const sender = new Dealer({
        routingId: makeid(10)
      })
      await sender.bind("tcp://127.0.0.1:5555")
      const queue = new Queue(sender, 150)
      this.queue  =queue;
      this.sender  =sender;
    }

   async pushNewJob(payload){
     try{
      // this.queue.send(null)// kill workers
      this.queue.send(JSON.stringify({ sender: this.sender.routingId ,load: payload}))
     } catch(e){
      console.dir(e.message)
      console.dir(this.queue.getLength())
     }
    }
    getQueueLength(){
      return this.queue.getLength()
    }
}

setTimeout(()=>{
    const mm = new Master()
    setInterval(async()=>{
        console.log('*')
        console.dir(mm.getQueueLength())
        var payload = {what: 'ever'};
        mm.pushNewJob(getBase64('./index.js'))
        // for(var i=0; i<150; i++){  
        //    mm.pushNewJob(i)
        //   }
        //   mm.count
        // process.exit()
    },2000)
},500)

process.on('uncaughtException', (err) => {
   console.error(err.message)
  // process.exit(1)
})
module.export=  Master
