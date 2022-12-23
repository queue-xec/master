#  Distributed Web Scraper

In this example , we can see queue-xec lib in action , in a more real case scenario.
We will target [dev.to](https://dev.to) website , to fetch latest posts including keyword `javascript`.
* In first step , master visits , target page , discovers last 60 post urls , then assign as tasks these urls to workers.
* Workers , will receive target urls , will visit each one, will fetch author name , post tile , post content and finally return that data to master.

 Master visiting target url to discover urls in first step , is not mandatory , you can use whatever source of target urls is available ( e.g pull data from a db ).

 ### Steps to run it

 ### Master

 * git clone https://github.com/queue-xec/master
 * cd master ; yarn
 * cd examples/web_scraper
 * yarn
 * node index.js

### Worker1

* git clone https://github.com/queue-xec/worker
* cd worker ; yarn
* node index.js


 **Disclaimer:**
 *This project is for educational and research purposes only. We do not endorse or encourage any illegal or unauthorized use of web scraping. The purpose of this project is to demonstrate the capabilities and limitations of web scraping techniques and to provide a platform for learning and experimentation. The data and information collected through web scraping may be protected by copyright and other intellectual property laws. We are not responsible for any legal issues that may arise from the use of this project or the information collected through it. By using this project, you agree to adhere to all applicable laws and respect the intellectual property rights of others.*
