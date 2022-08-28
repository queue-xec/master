const prompts = require('prompts');
const { program } = require('commander');
const fs = require('fs');
const envfile = require('envfile');
const path = require('path');
const { version } = require('./package.json');
const Master = require('./src/index');

const sourcePath = '.env';

program.version(version);

function getBase64(file) {
  return fs.readFileSync(file, { encoding: 'base64' });
}
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
async function setup() {
  const questions = [
    {
      type: 'number',
      name: 'port',
      message: 'Enter listening port:',
      validate: (port) => (port < 80 ? 'Enter a valid port above 80' : true),
    },
    {
      type: 'number',
      name: 'queueLimit',
      message: 'Max queue limit:',
      initial: 5000,
    },
  ];
  const portQ = await prompts(questions);
  fs.writeFileSync(sourcePath, envfile.stringify(portQ));

  const genKeys = await prompts(
    {
      type: 'confirm',
      name: 'gen_keys',
      message: 'Create new random hash?',
      initial: true,
    },
  );
  if (!genKeys.gen_keys) {
    const hashFromUser = await prompts({
      type: 'text',
      name: 'token',
      message: 'Servers token [32 length string]',
      validate: (token) => (token.length < 32 ? 'Minimum length is 32' : true),
    });
    // fs.writeFileSync('./.env', envfile.stringify(portQ))
    fs.appendFileSync(sourcePath, envfile.stringify(hashFromUser));
    return;
  }
  // console.log(genKeys)
  const key = { token: makeid(32) };
  console.log(`Share this token with your workers: ${key.token}`);
  fs.appendFileSync(sourcePath, envfile.stringify(key));

  console.log('Settings stored in .env');
}
function resultCollect(result) {
  console.dir(result);
}
async function run() {
  const mm = new Master({
    onResults: resultCollect,
    execAssets: {
      dependencies: [], // pass Worker dependencies like : ['big.js', 'moment']
      files: [
        // { masterPath: '/src/Logger.js', name: 'Logger.js', workerPath: '/workplace/Logger.js' },
        // { masterPath: '/src/Helper.js', name: 'Helper.js', workerPath: '/workplace/Helper.js' },
        // { masterPath: '/src/task.js', name: 'task.js', workerPath: '/workplace/task.js' }, // TODO this should be overridable by user
      ],
    },
  });
  const dummy = {

  };

  let cnt = 0;
  for (let i = 0; i < 5; i++) {
    const payload = {
      id: cnt,
      data: JSON.stringify(dummy),

    };
    await mm.pushNewJob(payload).catch((e) => console.log(e));
    // mm.pushNewJob();
    cnt += 1;
  }
  // setInterval(async () => {
  //   // console.dir(mm.getQueueLength());
  //   // const file = getBase64(path.join(process.cwd(), '/task.js'));

  // }, 100);
}

(async function () {
  program
    .option('-s, --setup', 'Setup/Register master settings');

  program.parse(process.argv);
  const options = program.opts();
  switch (true) {
    case (options.setup):
      await setup();
      break;
    default:
      await run();
      break;
  }
}());

process.on('uncaughtException', (error) => {
  console.log(error.message);
});
