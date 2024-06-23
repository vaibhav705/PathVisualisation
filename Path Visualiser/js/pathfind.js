let pathfind = {
    begin: function () {
        grid.clearColors();
        grid.setMode('pathfind')
    },

    end: function () {
        grid.setMode('done');
    },

    sleep: function (millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    },

    walkable: function (pos) {
        if (pos.i < 0 || pos.i >= grid.height) return false;
        if (pos.j < 0 || pos.j >= grid.width) return false;
        if (grid.grid[pos.toInt()]) return false;
        return true;
    },

    neighbors: function (pos) {
        const deltas = [new Vec(-1, 0), new Vec(0, 1), new Vec(1, 0), new Vec(0, -1)];
        let out = [];
        for (let i = 0; i < deltas.length; i++) {
            if (!pathfind.walkable(Vec.add(pos, deltas[i]))) continue;
            out.push(Vec.add(pos, deltas[i]));
        }
        return out;
    },

    neighborsDiag: function (pos) {
        let out = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) continue;
                if (!pathfind.walkable(new Vec(pos.i + i, pos.j + j))) continue;
                let dist = (i != 0 && j != 0) ? Math.SQRT2 : 1;
                out.push({ pos: new Vec(pos.i + i, pos.j + j), dist: dist });
            }
        }
        return out;
    },

    euclidDist: function (a, b) {
        let di = a.i - b.i;
        let dj = a.j - b.j;
        return Math.sqrt(di * di + dj * dj);
    },

    reconstructPath: async function (cameFrom) {
        for (let p = cameFrom[grid.goalPos.toInt()]; p != null; p = cameFrom[p]) {
            await pathfind.sleep(20);
            grid.setColor(Vec.fromInt(p), 'path');
        }
    }
};
