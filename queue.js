const {Socket} = require("zeromq")
 
class Queue {

  constructor(socket, max = 50000) {
    this.queue = []
    this.socket = socket 
    this.max = max
    this.sending = false
  }

  send(msg) {
    if (this.queue.length > this.max) {
      throw new Error("Queue is full")
    }
    this.queue.push(msg)
    this.trySend()
  }

  async trySend() {
    if (this.sending) return
    this.sending = true

    while (this.queue.length) {
      await this.socket.send(this.queue.shift())
    }

    this.sending = false
  }
  getLength(){
    return this.queue.length;
  }
}

module.exports = Queue