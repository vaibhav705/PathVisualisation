class Vec {
    constructor(i, j) {
        this.i = Math.trunc(i);
        this.j = Math.trunc(j);
    }

    equals(other) {
        return this.i == other.i && this.j == other.j;
    }

    toInt() {
        return this.i * grid.width + this.j;
    }

    static fromInt(p) {
        return new Vec(p / grid.width, p % grid.width);
    }

    static add(a, b) {
        return new Vec(a.i + b.i, a.j + b.j);
    }

    static sub(a, b) {
        return new Vec(a.i - b.i, a.j - b.j);
    }
}

class Queue {
    static get LinkedNode() {
        return class {
            constructor(value, parent, child) {
                this.value = value;
                this.parent = parent;
                this.child = child;
            }
        }
    }

    constructor() {
        this.front = null;
        this.back = null;
    }

    empty() {
        return this.front == null;
    }

    push(value) {
        if (this.front == null) {
            this.front = new Queue.LinkedNode(value, null, null);
            this.back = this.front;
            return;
        }
        this.back.child = new Queue.LinkedNode(value, this.back, null);
        this.back = this.back.child;
    }

    pop() {
        if (this.empty()) return null;
        let value = this.front.value;
        this.front = this.front.child;
        if (this.front != null) {
            this.front.parent = null;
        }
        return value;
    }
}

class MinHeap {
    static get Item() {
        return class {
            constructor(value, cost) {
                this.value = value;
                this.cost = cost;
            }
        }
    }

    constructor() {
        this.heap = [];
    }

    static parent(p) {
        return Math.trunc((p - 1) / 2);
    }
    static left(p) {
        return 2 * p + 1;
    }
    static right(p) {
        return 2 * p + 2;
    }
    empty() {
        return this.heap.length == 0;
    }

    minHeapify(p) {
        let l = MinHeap.left(p);
        let r = MinHeap.right(p);
        let min = p;
        if (l < this.heap.length && this.heap[l].cost < this.heap[min].cost) {
            min = l;
        }
        if (r < this.heap.length && this.heap[r].cost < this.heap[min].cost) {
            min = r;
        }
        if (min != p) {
            let tmp = this.heap[p];
            this.heap[p] = this.heap[min];
            this.heap[min] = tmp;
            this.minHeapify(min);
        }
    }

    push(value, cost) {
        let p = this.heap.length;
        this.heap.push(new MinHeap.Item(value, cost));
        let parent = MinHeap.parent(p);
        while (p != 0 && this.heap[parent].cost > this.heap[p].cost) {
            let tmp = this.heap[p];
            this.heap[p] = this.heap[parent];
            this.heap[parent] = tmp;
            p = parent;
            parent = MinHeap.parent(p);
        }
    }

    pop() {
        if (this.empty()) return null;
        if (this.heap.length == 1) {
            let value = this.heap[0].value;
            this.heap.length = 0;
            return value;
        }
        let root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.minHeapify(0);
        return root.value;
    }

}
