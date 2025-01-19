const Node = require('../src/Node');
const Queue = require('../src/Queue');

describe('Queue', () => {
    let queue;

    beforeEach(() => {
        queue = new Queue();
    });

    describe('Initialization', () => {
        it('should initialize with empty queue', () => {
            expect(queue.first).toBeNull();
            expect(queue.last).toBeNull();
            expect(queue.size).toBe(0);
        });
    });

    describe('isEmpty()', () => {
        it('should return true when queue is empty', () => {
            expect(queue.isEmpty()).toBe(true);
        });

        it('should return false when queue is not empty', () => {
            queue.enqueue(1);
            expect(queue.isEmpty()).toBe(false);
        });
    });

    describe('enqueue()', () => {
        it('should add item to the end of the queue', () => {
            queue.enqueue(1);
            expect(queue.first.value).toBe(1);
            expect(queue.last.value).toBe(1);
        });

        it('should maintain correct order of elements', () => {
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            expect(queue.first.value).toBe(1);
            expect(queue.last.value).toBe(3);
        });

        it('should update size correctly', () => {
            queue.enqueue(1);
            expect(queue.size).toBe(1);
            queue.enqueue(2);
            expect(queue.size).toBe(2);
            queue.enqueue(3);
            expect(queue.size).toBe(3);
        });
    });

    describe('dequeue()', () => {
        it('should remove and return the first element from the queue', () => {
            queue.enqueue(1);
            queue.enqueue(2);
            expect(queue.dequeue().value).toBe(1);
            expect(queue.first.value).toBe(2);
        });

        it('should update size correctly', () => {
            queue.enqueue(1);
            queue.enqueue(2);
            queue.dequeue();
            expect(queue.size).toBe(1);
        });

        it('should return null when queue is empty', () => {
            expect(queue.dequeue()).toBeNull();
        });
    });

    describe('search()', () => {
        it('should find an element in the queue', () => {
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            const foundNode = queue.search(2);
            expect(foundNode.value).toBe(2);
        });

        it('should not find an element not in the queue', () => {
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            const foundNode = queue.search(4);
            expect(foundNode).toBeNull();
        });

        it('should find an object in the queue', () => {
            queue.enqueue({ a: 1, b: 2 });
            queue.enqueue({ c: 3, d: 4 });
            const foundNode = queue.search({ a: 1, b: 2 });
            expect(foundNode.value).toEqual({ a: 1, b: 2 });
        });

        it('should not find an object not in the queue', () => {
            queue.enqueue({ a: 1, b: 2 });
            queue.enqueue({ c: 3, d: 4 });
            const foundNode = queue.search({ e: 5, f: 6 });
            expect(foundNode).toBeNull();
        });
    });

    describe('bubbleSort()', () => {
        it('should sort the queue in ascending order', () => {
            queue.enqueue(3);
            queue.enqueue(1);
            queue.enqueue(2);
            queue.bubbleSort();
            expect(queue.first.value).toBe(1);
            expect(queue.last.value).toBe(3);
        });

        it('should sort the queue in ascending order with objects', () => {
            queue.enqueue({ a: 3 });
            queue.enqueue({ a: 1 });
            queue.enqueue({ a: 2 });
            queue.bubbleSort();
            expect(queue.first.value).toEqual({ a: 1 });
            expect(queue.last.value).toEqual({ a: 3 });
        });

        it('should sort the queue in ascending order with mixed types', () => {
            queue.enqueue(3);
            queue.enqueue('a');
            queue.enqueue(1);
            queue.enqueue('b');
            queue.enqueue(2);
            queue.bubbleSort();
            expect(queue.first.value).toBe(3);
            expect(queue.last.value).toBe(2);
        });
    });

    describe('peek()', () => {
        it('should return the first element from the queue', () => {
            queue.enqueue(1);
            expect(queue.peek().value).toBe(1);
        });

        it('should return null when queue is empty', () => {
            expect(queue.peek()).toBeNull();
        });
    });

    describe('tail()', () => {
        it('should return the last element from the queue', () => {
            queue.enqueue(1);
            queue.enqueue(2);
            expect(queue.tail().value).toBe(2);
        });

        it('should return null when queue is empty', () => {
            expect(queue.tail()).toBeNull();
        });
    });
});

describe('Queue tests', () => {
    let queue;

    beforeEach(() => {
        queue = new Queue();
    });

    it('should create an empty queue', () => {
        expect(queue.isEmpty()).toBe(true);
        expect(queue.first).toBe(null);
        expect(queue.last).toBe(null);
        expect(queue.size).toBe(0);
    });

    it('should not be empty after enqueuing an item', () => {
        queue.enqueue('item');
        expect(queue.isEmpty()).toBe(false);
        expect(queue.first).not.toBe(null);
        expect(queue.last).not.toBe(null);
        expect(queue.size).toBe(1);
    });

    it('should enqueue multiple items', () => {
        queue.enqueue('item1');
        queue.enqueue('item2');
        queue.enqueue('item3');
        expect(queue.size).toBe(3);
        expect(queue.first.value).toBe('item1');
        expect(queue.last.value).toBe('item3');
    });

    it('should dequeue an item', () => {
        queue.enqueue('item');
        const dequeuedItem = queue.dequeue();
        expect(dequeuedItem.value).toBe('item');
        expect(queue.isEmpty()).toBe(true);
        expect(queue.first).toBe(null);
        expect(queue.last).toBe(null);
        expect(queue.size).toBe(0);
    });

    it('should dequeue multiple items', () => {
        queue.enqueue('item1');
        queue.enqueue('item2');
        queue.enqueue('item3');
        const dequeuedItem1 = queue.dequeue();
        const dequeuedItem2 = queue.dequeue();
        const dequeuedItem3 = queue.dequeue();
        expect(dequeuedItem1.value).toBe('item1');
        expect(dequeuedItem2.value).toBe('item2');
        expect(dequeuedItem3.value).toBe('item3');
        expect(queue.isEmpty()).toBe(true);
        expect(queue.first).toBe(null);
        expect(queue.last).toBe(null);
        expect(queue.size).toBe(0);
    });

    it('should return null when trying to dequeue from an empty queue', () => {
        const dequeuedItem = queue.dequeue();
        expect(dequeuedItem).toBe(null);
    });

    it('should search for an item in the queue', () => {
        queue.enqueue('item');
        const searchResult = queue.search('item');
        expect(searchResult.value).toBe('item');
    });

    it('should not find an item that is not in the queue', () => {
        const searchResult = queue.search('item');
        expect(searchResult).toBe(null);
    });

    it('should search for an object in the queue', () => {
        const item = { id: 1, name: 'John' };
        queue.enqueue(item);
        const searchResult = queue.search(item);
        expect(searchResult.value).toEqual(item);
    });

    it('should bubble sort the queue', () => {
        queue.enqueue(5);
        queue.enqueue(1);
        queue.enqueue(3);
        queue.enqueue(2);
        queue.bubbleSort();
        let current = queue.first;
        let values = [];
        while (current) {
            values.push(current.value);
            current = current.next;
        }
        expect(values).toEqual([1, 2, 3, 5]);
    });

    it('should peek at the next item to be dequeued', () => {
        queue.enqueue('item');
        const nextItem = queue.peek();
        expect(nextItem.value).toBe('item');
    });

    it('should return the last item in the queue', () => {
        queue.enqueue('item1');
        queue.enqueue('item2');
        const lastItem = queue.tail();
        expect(lastItem.value).toBe('item2');
    });

    it('should return null from search function when types do not match', () => {
        const queue = new Queue();
        queue.enqueue(1);
        expect(queue.search('1')).toBeNull();
    });

    it('check() does not throw an error', () => {
        const queue = new Queue();
        expect(() => queue.check()).not.toThrow();
    });

    it('check() does not iterate if the queue is empty', () => {
        const queue = new Queue();
        const spy = jest.spyOn(console, 'log');
        queue.check = function () {
            let current = this.first;
            while (current) {
                current = current.next;
            }
        };

        queue.check();

        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });
});
