
 
const  {Dealer} = require("zeromq")
const Queue = require("./queue.js")
const Hash = require('./hash')
const fs = require('fs');
const envfile = require('envfile')
const sourcePath = '.env'
const prompts = require('prompts');
const { program } = require('commander');
const version = require('./package.json').version

require('dotenv').config()
program.version(version);

function getBase64(file) {
  return fs.readFileSync(file, {encoding: 'base64'});
}
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *  charactersLength));
  }
  return result;
}
async function setup(){
  const questions = [
    {
      type: 'number',
      name: 'port',
      message: 'Enter listening port:',
      validate: port => port < 80 ? `Enter a valid port above 80` : true
    },
    {
      type: 'number',
      name: 'queueLimit',
      message: 'Max queue limit:',
      initial: 5000
    },
  ];
  const portQ = await prompts(questions);
  fs.writeFileSync(sourcePath, envfile.stringify(portQ)) 
   
  const genKeys = await prompts( 
    {
      type: 'confirm',
      name: 'gen_keys',
      message: 'Create new random hash?',
      initial: true
    }); 
    if ( ! genKeys.gen_keys){
      const hashFromUser = await prompts( {
          type: 'text',
          name: 'token',
          message: 'Servers token [32 length string]',
          validate: token => token.length < 32 ? 'Minimum length is 32' : true
        }); 
        // fs.writeFileSync('./.env', envfile.stringify(portQ)) 
        fs.appendFileSync(sourcePath, envfile.stringify(hashFromUser));
        return;
    }
    // console.log(genKeys)
    const key = { token : makeid(32)}
    console.log(`Share this token with your workers: ${key.token}`)
    fs.appendFileSync(sourcePath, envfile.stringify(key));

  console.log('Settings stored in .env')
}
async function run(){
    const mm = new Master()
    const dummy = { 
    
    }
     
    setInterval(async()=>{
        console.dir(mm.getQueueLength())
        var payload = {
          data: JSON.stringify(dummy), 
          exec:{  
            file: getBase64('./task.js') , 
            name:"exec.js" , 
            dependencies: ['big.js', 'technicalindicators' ]}
           };
        mm.pushNewJob(payload)
    },2000)
}

class Master {
    constructor(){
        this.queue_name = 'work_queue'
        this.queue  = null
        this.hash = new Hash(process.env.token)
        this.init()
    }

    async  init(){
      const sender = new Dealer({
        routingId: makeid(10)
      })
      await sender.bind(`tcp://127.0.0.1:${process.env.port}`)
      const queue = new Queue(sender, process.env.queueLimit)
      this.queue  =queue;
      this.sender  =sender;
      this.listenForResults()
    }
    async listenForResults(){
      for await (const [msg] of  this.sender ) { 
        let ms = msg.toString()
      
        let decrypted =  this.hash.decrypt(JSON.parse(ms))
        console.log(decrypted)
      }
    }

   async pushNewJob(payload){
     try{
      // this.queue.send(null)// kill workers
      let encrypted = this.hash.encrypt(JSON.stringify(payload))
     let a =  this.queue.send(JSON.stringify(encrypted))
     } catch(e){
      console.dir(e.message)
      console.dir(this.queue.getLength())
     }
    }
    getQueueLength(){
      return this.queue.getLength()
    }
}


process.on('uncaughtException', function (error) {
    console.log(error.message);
}); 



( async function () {
  program
  .option('-s, --setup', 'Setup/Register master settings')
  
  program.parse(process.argv);
  const options = program.opts();  
  switch (true) {
    case (options.setup):
      await setup()
      break;
    default:
      await run()
      break;
}
}());

module.export=  Master