// node.test.js
const Node = require('../src/Node');

describe('Node class', () => {
    it('should create a new node with the given value', () => {
        const node = new Node('test value');
        expect(node.value).toBe('test value');
    });

    it('should initialize next and prev properties to null', () => {
        const node = new Node('test value');
        expect(node.next).toBeNull();
        expect(node.prev).toBeNull();
    });

    it('should allow setting the next property', () => {
        const node1 = new Node('test value 1');
        const node2 = new Node('test value 2');
        node1.next = node2;
        expect(node1.next).toBe(node2);
    });

    it('should allow setting the prev property', () => {
        const node1 = new Node('test value 1');
        const node2 = new Node('test value 2');
        node2.prev = node1;
        expect(node2.prev).toBe(node1);
    });

    describe('edge cases', () => {
        it('should create a new node with a null value', () => {
            const node = new Node(null);
            expect(node.value).toBeNull();
        });

        it('should create a new node with an undefined value', () => {
            const node = new Node(undefined);
            expect(node.value).toBeUndefined();
        });

        it('should create a new node with an empty string value', () => {
            const node = new Node('');
            expect(node.value).toBe('');
        });

        it('should create a new node with a number value', () => {
            const node = new Node(123);
            expect(node.value).toBe(123);
        });

        it('should create a new node with an object value', () => {
            const obj = { foo: 'bar' };
            const node = new Node(obj);
            expect(node.value).toBe(obj);
        });

        it('should create a new node with an array value', () => {
            const arr = [1, 2, 3];
            const node = new Node(arr);
            expect(node.value).toBe(arr);
        });
    });
});
