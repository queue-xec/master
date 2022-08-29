const prompts = require('prompts');
const { program } = require('commander');
const fs = require('fs');
const envfile = require('envfile');
const path = require('path');
const { version } = require('./package.json');
const Master = require('./src/index');

const { FgYellow, Reset } = require('./src/Logger');

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
  console.log('Transfer Encrypt Token is used to encrypt data communications with workers.');
  console.log('Master and Workers have to pick the same Transfer Encrypt Token ..');
  console.log('Dont share it with dont trusty parties.');
  const questions = [
    {
      type: 'confirm',
      name: 'choice',
      message: 'Generate new random  Transfer Encrypt Token ?',
      initial: true,
    },
  ];
  const genTransferEncryptToken = await prompts(questions);
  if (genTransferEncryptToken.choice) {
    const transferEncryptToken = { transferEncryptToken: makeid(32) };
    console.log(`Share this token with your workers ${FgYellow}transferEncryptToken${Reset}: ${transferEncryptToken.transferEncryptToken}`);
    fs.appendFileSync(sourcePath, envfile.stringify(transferEncryptToken));
  } else {
    const transferEncryptTokenFromUser = await prompts({
      type: 'text',
      name: 'transferEncryptToken',
      message: 'ENTER Transfer Encrypt Token [32 length string]',
      validate: (transferEncryptToken) => (transferEncryptToken.length < 32 ? 'Minimum length is 32' : true),
    });
    fs.appendFileSync(sourcePath, envfile.stringify(transferEncryptTokenFromUser));
  }

  const genKeys = await prompts(
    {
      type: 'confirm',
      name: 'gen_keys',
      message: 'Create new random token [Will used to find your workers and them you]?',
      initial: true,
    },
  );
  if (!genKeys.gen_keys) {
    const hashFromUser = await prompts({
      type: 'text',
      name: 'token',
      message: 'Enter your token [atleast 20 length string]',
      validate: (token) => (token.length < 20 ? 'Minimum length is 20' : true),
    });
    fs.appendFileSync(sourcePath, envfile.stringify(hashFromUser));
    return;
  }
  const key = { token: makeid(20) };
  console.log(`Share this token with your workers ${FgYellow}token${Reset}: ${key.token}`);
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
        // { masterPath: '/src/task.js', name: 'task.js', workerPath: '/workplace/task.js' },
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
