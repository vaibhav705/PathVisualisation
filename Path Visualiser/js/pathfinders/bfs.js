let bfs = {
    run: async function () {
        pathfind.begin();
        let visited = Array(grid.width * grid.height).fill(false);
        let cameFrom = {};
        let q = new Queue();
        q.push(grid.startPos);
        visited[grid.startPos.toInt()] = true;
        while (!q.empty()) {
            let cur = q.pop();
            await pathfind.sleep(10);
            grid.setColor(cur, 'explored');

            if (cur.equals(grid.goalPos)) {
                break;
            }

            let n = pathfind.neighbors(cur);
            for (let i = 0; i < n.length; i++) {
                if (visited[n[i].toInt()]) continue;
                grid.setColor(n[i], 'visited');
                visited[n[i].toInt()] = true;
                cameFrom[n[i].toInt()] = cur.toInt();
                q.push(n[i]);
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
