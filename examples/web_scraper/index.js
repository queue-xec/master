/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
const puppeteer = require('puppeteer');
const Master = require('../../index');
// const Master = require('queue-xec-master')

// set here only for example , transferEncryptToken
process.env.transferEncryptToken = '00000000000000000000000000000000';
process.env.token = 'demoCHannel0'; // In case someone else running this example , you may want
// to change this token (here and in workers too), for privacy and not end up doing someone else tasks.
process.env.LOG_LEVEL = 'debug';

function resultCollect(result) {
    // handle here incoming results from workers..
    console.dir(result);
}

async function run() {
    const mm = new Master({
        onResults: resultCollect,
        execAssets: {
            dependencies: ['puppeteer'], // pass Worker dependencies
            files: [
                // { masterPath: '/../src/task.js', name: 'task.js', workerPath: '/workplace/task.js' }, // if task.js file not passed to workers , Master will use default one located in /src/task.js , here you can ovverride it by changing above details
                {
                    masterPath: '/task.js',
                    name: 'task.js',
                    workerPath: '/workplace/task.js',
                }, // if task.js file not passed to workers , Master will use default one located in /src/task.js , here you can ovverride it by changing above details
            ],
            /* masterPath and workerPath are not absolute , NEVER access files out of their process.cwd()  path.
        Are relative to their process current location , respectively */
        },
    });

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu-sandbox',
        ],
    });
    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080,
    });

    const targetTag = 'https://dev.to/t/javascript';
    await page.goto(targetTag);
    const latestPosts = await page.evaluate(() => {
        const ans = [];
        // get latest post urls
        const posts = document.querySelectorAll(
            '.substories .crayons-story__body '
        );
        posts.forEach((body) => {
            const url = body.querySelector('.crayons-story__title a').href;
            if (url) ans.push({ author: null, title: null, url });
        });
        return ans;
    });
    // loop on all posts found , and send them to workers
    for (let i = 0; i < latestPosts.length; i += 1) {
        const payload = {
            id: i,
            data: JSON.stringify(latestPosts[i]),
        };
        // eslint-disable-next-line no-await-in-loop
        await mm.pushNewJob(payload).catch((e) => console.log(e));
    }
}
run();
