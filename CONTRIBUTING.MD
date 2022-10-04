# Contributing

Contributors are always welcome! Any single line of code maters! Don't hesitate to correct even a typo!

Before anything else, check issues.
If issue exist in any condition (closed, assigned, stalled), comment and share your thoughts there. It's nice to have all subject related discussions, organized in one place.

If you can't find any issue related to your current issue you want to contribute, go ahead and open it! After verification, issues will be assigned to you.

Then you can start working on that issue.

### How to setup environment

It is recommended to have both worker and master in their latest versions. So :
Fork [master](https://github.com/queue-xec/maste) and [worker](https://github.com/queue-xec/worker)

```bash
mkdir queue-xec
cd queue-xec
git clone https://github.com/<your_username>/master
git clone https://github.com/<your_username>/worker
cd worker ; yarn
cd ../master ; yarn
git checkout -b my_new_feature
... make your changes
git commit
```
### On git commit :
After all test passed , commitizen will fire up and start asking questions about your commit.(Be honest)

If you have any issue during this , check issues , if cant found something related , open a new issue , any other contributor can help you.
