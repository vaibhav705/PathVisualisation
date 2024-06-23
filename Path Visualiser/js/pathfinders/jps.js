// http://users.cecs.anu.edu.au/~dharabor/data/papers/harabor-grastien-aaai11.pdf

let jps = {
    jump: async function (node, parent) {
        if (!pathfind.walkable(node.pos)) {
            return null;
        }

        if (node.pos.equals(grid.goalPos)) return node;

        let delta = Vec.sub(node.pos, parent);
        if (delta.i != 0 && delta.j != 0) {
            // diagonal
            let h = new Vec(0, delta.j);
            let v = new Vec(delta.i, 0);

            if (!pathfind.walkable(Vec.sub(node.pos, h)) ||
                Vec.sub(node.pos, h).equals(grid.goalPos)) {
                return node;
            }
            if (!pathfind.walkable(Vec.sub(node.pos, v)) ||
                Vec.sub(node.pos, v).equals(grid.goalPos)) {
                return node;
            }

            let res = await jps.jump(node, Vec.sub(node.pos, h));
            if (res != null) return node;
            res = await jps.jump(node, Vec.sub(node.pos, v));
            if (res != null) return node;
            return await jps.jump({ pos: Vec.add(node.pos, delta), dist: node.dist + Math.SQRT2 }, node.pos);
        } else {
            // horizontal / vertical
            let ortho = new Vec(-delta.j, delta.i);
            let left = Vec.add(node.pos, ortho);
            let right = Vec.sub(node.pos, ortho);

            if ((!pathfind.walkable(left) && pathfind.walkable(Vec.add(left, delta))) ||
                left.equals(grid.goalPos) || Vec.add(left, delta).equals(grid.goalPos)) {
                return node;
            }
            if ((!pathfind.walkable(right) && pathfind.walkable(Vec.add(right, delta))) ||
                right.equals(grid.goalPos) || Vec.add(right, delta).equals(grid.goalPos)) {
                return node;
            }
            return await jps.jump({ pos: Vec.add(node.pos, delta), dist: node.dist + 1 }, node.pos);
        }
    },

    reconstructPath: async function (cameFrom) {
        let last = grid.goalPos;
        for (let p = cameFrom[grid.goalPos.toInt()]; p != null; p = cameFrom[p]) {
            let cur = Vec.fromInt(p);
            await pathfind.sleep(20);
            while (!cur.equals(last)) {
                await pathfind.sleep(20);
                grid.setColor(cur, 'path');
                let delta = Vec.sub(last, cur);
                delta.i = Math.sign(delta.i);
                delta.j = Math.sign(delta.j);
                cur = Vec.add(cur, delta);
            }

            last = Vec.fromInt(p);
        }
    },

    run: async function () {
        pathfind.begin();
        let dist = Array(grid.width * grid.height);
        let cameFrom = {};
        let q = new MinHeap();
        q.push(grid.startPos, pathfind.euclidDist(grid.startPos, grid.goalPos));
        dist[grid.startPos.toInt()] = 0;

        while (!q.empty()) {
            let cur = q.pop();
            await pathfind.sleep(10);
            grid.setColor(cur, 'explored');

            if (cur.equals(grid.goalPos)) {
                break;
            }

            let n = pathfind.neighborsDiag(cur);
            for (let i = 0; i < n.length; i++) {
                let next = await jps.jump(n[i], cur);
                if (next == null) {
                    continue;
                }
                let intPos = next.pos.toInt();
                let tentativeDist = next.dist + dist[cur.toInt()];
                if (dist[intPos] != null && tentativeDist >= dist[intPos]) {
                    continue;
                }
                grid.setColor(next.pos, 'visited');
                dist[intPos] = tentativeDist;
                cameFrom[intPos] = cur.toInt();
                q.push(next.pos, dist[intPos] + pathfind.euclidDist(next.pos, grid.goalPos));
            }
        }

        if (cameFrom[grid.goalPos.toInt()] == null) {
            pathfind.end();
            return;
        }

        await jps.reconstructPath(cameFrom);

        pathfind.end();
    },
};
