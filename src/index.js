const Bugout = require('bugout');
const events = require('events');
const fs = require('fs');
const { Logger } = require('./Logger');
const { Helper } = require('./Helper');
const Crypt = require('./Crypt');

const defaultExecAssets = [
  {
    masterPath: '/src/task.js', // location of file starting from master's dir
    name: 'task.js', // name to save as in workers
    workerPath: '/workplace/task.js', // remote location of file starting from workers's dir
    sha256: null, // hash of file ,will generate whenever a workers
    // asks for assets.(to detect file changes)
  },
];
require('dotenv').config();

class Master {
  constructor({
    token = null, execAssets = [], onResults = () => { }, loglevel,
    transferEncryptToken = null,
  } = {}) {
    this.availableWorkers = [];
    this.jobs = [];

    this.event = new events.EventEmitter();
    this.log = new Logger({ level: loglevel || process.env.LOG_LEVEL });
    this.token = token || process.env.token || new Error('token not defined, pass it in constructor or with env variable "token" , or generate it with cli.');
    this.crypt = null; // instatiate in init method
    this.peer = Bugout(this.token);
    this.onResults = onResults;
    this.execAssets = execAssets;
    this.execAssets.files = [...this.execAssets.files, ...defaultExecAssets]; 
    // TODO populate in init , after check if user has defined already an asset with name task.js
    // to be able to ovveride default task.js file and its location.

    this.onSeen = this.onSeen.bind(this);
    this.init = this.init.bind(this);
    this.requestExecAssets = this.requestExecAssets.bind(this);
    this.encryptFiles = this.encryptFiles.bind(this);

    // this.peer.on('rpc', this.onRpcCall);
    this.peer.on('seen', this.onSeen);
    this.peer.on('message', this.onMessage);
    // this.peer.on('rpc-response', (address, nonce, response)=> );
    // this.peer.on('left', (address)=> );

    this.event.addListener('init', this.init);
    this.event.emit('init', transferEncryptToken);
  }

  async init(transferEncryptToken) {
    this.log.info('Address:', this.peer.address());
    this.log.info('Seed:', this.peer.seed);
    this.log.info('Announcing to trackers...');
    this.crypt = new Crypt(transferEncryptToken || process.env.transferEncryptToken);
    if (this.crypt.key instanceof Error) {
      this.log.fatal('Crypt: ', this.crypt);
    }
    this.log.debug(typeof this.crypt.key);
    this.registerRPC();
  }

  registerRPC() {
    this.peer.register('ping', (pk, args, cb) => {
      args.pong = true;
      cb(args);
    }, "Respond to ping with 'pong'.");
    this.peer.register('isMaster', (pk, args, cb) => {
      args.isMaster = 'yes';
      cb(args);
    });
    this.peer.register('requestWork', (pk, args, cb) => {
      switch (true) {
        case (this.jobs.length > 1): {
          args.task = this.jobs.shift();
          this.log.debug(`task queue reduced:${this.jobs.length}`);
          break;
        }
        case (this.jobs.length === 1): { // shift  make array undefined on last element
          [args.task] = this.jobs; // , correct this with this check
          this.jobs = [];
          this.log.debug(`task queue finished:${this.jobs.length}`);
          break;
        }
        case (this.jobs.length === 0): {
          args.task = null;
          this.log.debug(`task queue is empty:${this.jobs.length}`);
          break;
        }
        default: {
          args.task = null;
          this.log.warning(`task queue is empty:${this.jobs.length}`);

          break;
        }
      }
      cb(args);
    });
    this.peer.register('shareResults', (pk, args, cb) => {
      const results = JSON.parse(this.crypt.decrypt(JSON.parse(args)));
      this.onResults(results);
    });
    this.peer.register('requestExecAssets', (pk, args, cb) => {
      const currentHash = args?.currentHash; // hash of current assets array
      // if is same , not send again
      this.requestExecAssets(currentHash).then((ans) => {
        cb(ans);
      });
    });
  }

  /** Called when some of connected peers send us a message */
  onMessage(address, message) {
    this.log.debug(`message from ${address} :`, message);
  }

  /** Called when a peer calls rpc on this node */
  // onRpcCall(hash, call) {
  // }

  onSeen(newPeerAddress) {
    this.log.info('New peer seen : ', newPeerAddress);
    // this.event.emit('worker_joined', newPeerAddress)
  }

  /**
   * Description: Pushes new jobs to task querue
   * @param { { id: string , data: JSON }} payload
   * @returns Promise
   */
  async pushNewJob(payload) {
    return new Promise((resolve, reject) => {
      if (typeof payload === 'undefined') {
        this.log.fatal('pushNewJob:', 'payload is undefined');
        reject(Error('payload is undefined'));
      }
      let payloadJson = payload;
      if (typeof payloadJson === 'object') payloadJson = JSON.stringify(payload);

      const encryptedPayload = this.crypt.encrypt(payloadJson);
      this.log.debug('pushNewJob payload: ', payload);
      if (this.jobs.length > 20) {
        // resolve();
        setTimeout(() => {
          this.jobs.push(JSON.stringify(encryptedPayload));
          resolve();
        }, this.jobs.length * 3);
      } else {
        this.jobs.push(JSON.stringify(encryptedPayload));
        resolve();
      }
    });
  }

  /**
   * Description: Call populateSha256OnAssets to geneate current hashs of all files ,
   * and then compare all file hashes with given currentHash
   * @param {String} currentHash
   * @returns Promise
   * @resolves {String} same || changed
   */
  requestExecAssets(currentHash) {
    return new Promise(async (resolve, reject) => {
      // const assets = await this.populateSha256OnAssets(this.execAssets);
      // this.execAssets = assets; // update global exec Assets
      let assets = this.execAssets.files;
      let unifiedHash = '';
      for (let i = 0; i < assets.length; i += 1) { //
        const file = assets[i];
        // eslint-disable-next-line no-await-in-loop
        const sha = await Helper.getSha256(`${process.cwd()}${file.masterPath}`)
          .catch((e) => { // usually not found reject error here
            this.log.warn(file.masterPath, e.message);
          });
        if (!sha) continue; // not sha -> file not found
        this.execAssets.files[i].sha256 = sha;
        unifiedHash += sha; // join all hashes in one , and compare these
      }
      assets = assets.filter((item) => item.hasOwnProperty('sha256')); // remove not found files in master
      this.execAssets.files = JSON.parse(JSON.stringify(assets)); // deep copy object  to class prop
      // this.log.debug('assets info :', sha);

      this.log.warn('assets info :', this.execAssets);
      this.log.debug('currentHash :', currentHash);
      this.log.debug('unnifiedHash :', unifiedHash);
      if (currentHash === unifiedHash) { // all joined hashes should
        // match workers remote joined hashes
        resolve({ status: 'same', files: [] });
      }
      const { encryptedFiles, dependencies } = this.encryptFiles(this.execAssets);
      resolve({
        status: 'changed',
        dependencies,
        files: encryptedFiles,
      });
    });
  }

  /**
   * Description: Reads assets defined , if exist try to encrypt data from files.
   * @param {Array} files
   */
  encryptFiles(execAssets) {
    const assetFiles = execAssets.files;
    for (let i = 0; i < assetFiles.length; i++) {
      const asset = assetFiles[i];
      try {
        if (fs.existsSync(`${process.cwd()}${asset.masterPath}`)) {
          const fileContent = fs.readFileSync(`${process.cwd()}${asset.masterPath}`, { encoding: 'utf8' }).toString();
          const encrypted = this.crypt.encrypt(fileContent);
          asset.content = encrypted;
        }
      } catch (err) {
        this.log.warn(err);
        if (err.message === 'File not found') assetFiles.remove(assetFiles[i]);
      }
    }
    return {
      encryptedFiles: assetFiles,
      dependencies: execAssets.dependencies,
    };
  }
}

module.exports = Master;
