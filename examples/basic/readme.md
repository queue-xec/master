# Basic Example

```
git clone https://github.com/queue-xec/master && cd master
yarn --prod # npm install --only=prod
cd examples/basic
node index.js
```

pushNewJob returns a promise , if you need to throttle some how pushing new tasks in queue , use await , will resolves proportional of the current queue size.

This is usefull for hardware limitations , for big data sets. Otherwise dont await at all , create the promise and leave it.
