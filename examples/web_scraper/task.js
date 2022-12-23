/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/*
 only needed to sinulate work / delay
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
 */
const puppeteer = require('puppeteer');

class Task {
    constructor() {
        this.data = null;
        this.browser = null;
        this.page = null;
        this.setBrowser();
    }

    async setBrowser() {
        if (!this.browser)
            this.browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu-sandbox',
                ],
            });
        if (!this.page) this.page = await this.browser.newPage();
        this.page.setViewport({
            width: 360,
            height: 760,
        });
    }

    visitNFetch() {
        return new Promise((resolve, reject) => {
            this.page
                .goto(this.data.url)
                .then(() => {
                    const content = this.page.evaluate((url) => {
                        const ans = {};
                        ans.contentTxt =
                            document.querySelector('.crayons-article__main')
                                ?.innerText || '';
                        ans.title =
                            document.querySelector(
                                '.crayons-article__header__meta h1'
                            )?.innerText || '';
                        ans.author =
                            document.querySelector(
                                '.crayons-article__header__meta .crayons-link'
                            )?.innerText || '';
                        ans.url = url;
                        return ans;
                    }, this.data.url);
                    resolve(content);
                })
                .catch((e) => reject(e));
        });
    }

    /**
     * Description: This method is the job procces. Receives job data (job)
     * Must return job results (Object) , to delivered in master.
     * @param {Object} job data from Master about job {id: Number , data: String (needs JSON.parse)}
     * @returns {Object} result
     */
    run(job) {
        return new Promise((resolve, reject) => {
            this.data = JSON.parse(job.data);
            console.log('Received task data: ', this.data);
            if (!this.page) {
                this.setBrowser().then(() => {
                    this.visitNFetch()
                        .then((content) => {
                            resolve(content);
                        })
                        .catch((e) => reject(e));
                });
            } else {
                this.visitNFetch()
                    .then((content) => {
                        resolve(content);
                    })
                    .catch((e) => reject(e));
            }
        });
    }
}

module.exports = Task;
