let dijkstra = {
    run: async function () {
        pathfind.begin();
        let dist = Array(grid.width * grid.height);
        let cameFrom = {};
        let q = new MinHeap();
        q.push(grid.startPos, 0);
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
                if (dist[intPos] != null) {
                    continue;
                }
                grid.setColor(n[i].pos, 'visited');
                dist[intPos] = n[i].dist + dist[cur.toInt()];
                cameFrom[intPos] = cur.toInt();
                q.push(n[i].pos, dist[intPos]);
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
