const {  Push, Pull } = require('zeromq');
const Queue = require('./queue');
const Hash = require('./hash');
const fs = require('fs')

require('dotenv').config();

class Master {
  constructor({ip, port, token, queueLimit = 10000, onResult }) {
    this.ip = ip || process.env.ip || '0.0.0.0';
    this.port = Number(port) || Number(process.env.port) || new Error('Port not defined, pass it in constructor or with env variable "port"');
    this.token = token || process.env.token || new Error('token not defined, pass it in constructor or with env variable "token" , or generate it with cli.');
    this.queueLimit = queueLimit || process.env.queueLimit || new Error('queueLimit not defined , pass it in constructor or with env variable "queueLimit"');
    this.hash = new Hash(this.token);
    this.resultReceiver = null
    this.queue_name = 'work_queue';
    this.queue = null;
    this.onResult = onResult
    this.init();
  }

  async init() {
    const sender = new Dealer();
    const sender = new Push();
    sender.sendHighWaterMark = 1000;
    sender.sendTimeout = 0;
    const resultReceiver= new Pull();
    console.log(this)
    await sender.bind(`tcp://${this.ip}:${this.port}`);
    await resultReceiver.bind(`tcp://${this.ip}:${this.port+1}`);
    const queue = new Queue(sender, this.queueLimit);
    this.queue = queue;
    this.sender = sender;
    this.resultReceiver = resultReceiver;
    this.listenForResults();
  }

  async listenForResults() {
    for await (const [msg] of this.resultReceiver) {
      const ms = msg.toString();
      const decrypted = this.hash.decrypt(JSON.parse(ms));
      this.onResult.call(this, decrypted)
    }
  }

  async pushNewJob(payload) {
    try {
      if (typeof payload === 'undefined') {
        this.queue.send(null);// kill workers
        return;
      }
      const encrypted = this.hash.encrypt(JSON.stringify(payload));
      const a = this.queue.send(JSON.stringify(encrypted));
    } catch (e) {
      console.dir(e.message);
      console.dir(this.queue.getLength());
    }
  }

  getQueueLength() {
    return this.queue.getLength();
  }
  static  getBase64(file) {
    return fs.readFileSync(file, { encoding: 'base64' });
  }
}

module.exports = Master;
