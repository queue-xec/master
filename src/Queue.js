const Node = require('./Node');

class Queue {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    isEmpty() {
        return !this.size;
    }

    enqueue(item) {
        // Create node
        const newNode = new Node(item);
        /**
         * * If our list is empty than both our
         * * first item and last item is going to point the new node.
         */
        if (this.isEmpty()) {
            this.first = newNode;
            this.last = newNode;
            newNode.prev = null;
        } else {
            newNode.prev = this.last;

            this.last.next = newNode;
            this.last = newNode;
        }
        this.size += 1;
        return this;
    }
    /**
     *
     * @returns
     */

    dequeue() {
        //* if our queue is empty we return null
        if (this.isEmpty()) return null;
        const itemToBeRemoved = this.first;
        /**
         * * if both our first and last node are pointing the same item
         * * we dequeued our last node.
         */
        if (this.first === this.last) {
            this.last = null;
        }
        this.first = this.first.next;
        this.size -= 1;
        return itemToBeRemoved;
    }

    check() {
        let current = this.first;
        while (current) {
            // while not null
            current = current.next;
        }
    }

    /**
     * Searches inside list in linear fashion ,
     * Time complexity O(n)
     * @param {*} item String , Number , Object
     * @returns Node , null
     */
    search(item) {
        let current = this.first;
        if (typeof item !== typeof current.value) {
            return null;
        }
        while (current !== null) {
            if (current.value === item) {
                return current;
            }
            if (typeof item === 'object') {
                const itemKeys = Object.keys(item);
                for (let i = 0; i < itemKeys.length; i += 1) {
                    // check all item properties agains current.value properties
                    if (
                        Object.prototype.hasOwnProperty.call(
                            current.value,
                            itemKeys[i]
                        )
                    ) {
                        if (current.value[itemKeys[i]] === item[itemKeys[i]]) {
                            return current;
                        }
                    }
                }
            }
            current = current.next;
        }
        return null;
    }

    bubbleSort() {
        let { last } = this;
        while (last) {
            let node = this.first;
            while (node !== last) {
                const { next } = node;
                if (typeof node.value === 'object') {
                    // object comparision in first matched (common) property
                    const itemKeys = Object.keys(node.value);
                    for (let i = 0; i < itemKeys.length; i += 1) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                next.value,
                                itemKeys[i]
                            )
                        ) {
                            if (
                                node.value[itemKeys[i]] >
                                next.value[itemKeys[i]]
                            ) {
                                // swap
                                [node.value, next.value] = [
                                    next.value,
                                    node.value,
                                ];
                                break;
                            }
                        }
                    }
                } else if (typeof node.value === 'number') {
                    if (node.value > next.value) {
                        // swap
                        [node.value, next.value] = [next.value, node.value];
                    }
                } else if (typeof node.value === 'string') {
                    // Not Implemented yet
                }

                node = next;
            }
            last = last.prev; // shorten the range that must be bubbled through
        }
    }

    /**
     * * Returns the next element to be dequeued.
     * @returns
     */
    peek() {
        return this.first;
    }

    tail() {
        return this.last;
    }
}

module.exports = Queue;
