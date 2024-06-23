let astar = {
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
                let intPos = n[i].pos.toInt();
                let tentativeDist = n[i].dist + dist[cur.toInt()];
                if (dist[intPos] != null && tentativeDist >= dist[intPos]) {
                    continue;
                }
                grid.setColor(n[i].pos, 'visited');
                dist[intPos] = tentativeDist;
                cameFrom[intPos] = cur.toInt();
                q.push(n[i].pos, dist[intPos] + pathfind.euclidDist(n[i].pos, grid.goalPos));
            }
        }

        if (cameFrom[grid.goalPos.toInt()] == null) {
            pathfind.end();
            return;
        }

        await pathfind.reconstructPath(cameFrom);

        pathfind.end();
    },
}
