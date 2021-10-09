const { Dealer } = require('zeromq');
const Queue = require('./queue');
const Hash = require('./hash');

require('dotenv').config();

class Master {
  constructor({ip, port, token, queueLimit = 10000, onResult }) {
    this.ip = ip || process.env.ip || '0.0.0.0';
    this.port = port || process.env.port || new Error('Port not defined, pass it in constructor or with env variable "port"');
    this.token = token || process.env.token || new Error('token not defined, pass it in constructor or with env variable "token" , or generate it with cli.');
    this.queueLimit = queueLimit || process.env.queueLimit || new Error('queueLimit not defined , pass it in constructor or with env variable "queueLimit"');
    this.hash = new Hash(this.token);
    this.queue_name = 'work_queue';
    this.queue = null;
    this.onResult = onResult
    this.init();
  }

  async init() {
    const sender = new Dealer();
    console.log(this)
    await sender.bind(`tcp://${this.ip}:${this.port}`);
    const queue = new Queue(sender, this.queueLimit);
    this.queue = queue;
    this.sender = sender;
    this.listenForResults();
  }

  async listenForResults() {
    for await (const [msg] of this.sender) {
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
}

module.exports = Master;
