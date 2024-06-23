let grid = {
    click: function (elmnt, pos, drawmode) {
        grid.grid[pos] = drawmode;
        elmnt.setAttribute('status', (grid.grid[pos]) ? 'wall' : 'blank');
    },

    clearColors: function () {
        for (let i = 0; i < grid.gridElmnts.length; i++) {
            grid.gridElmnts[i].setAttribute('color', 'blank');
        }
    },

    setMode: function (value) {
        grid.mode = value;
        for (let i = 0; i < grid.gridElmnts.length; i++) {
            grid.gridElmnts[i].setAttribute('mode', value);
        }
    },

    setColor: function (pos, color) {
        grid.gridElmnts[pos.toInt()].setAttribute('color', color);
    },

    setDimensions: function (width, height) {
        grid.width = width;
        grid.height = height;
        document.body.style.setProperty('--grid-width', grid.width);
        grid.startPos = new Vec(height / 2, 2);
        grid.goalPos = new Vec(this.height / 2, this.width - 3);
    },

    grid: [],
    gridElmnts: [],
    drawmode: false,
    gridElmnt: document.getElementsByClassName('grid-container')[0],
    mode: 'edit',
};

grid.setDimensions(32, 15);
grid.setMode(grid.mode);
for (let i = 0; i < grid.width * grid.height; i++) {
    let elmnt = document.createElement('div')
    elmnt.className = 'grid-item';
    elmnt.setAttribute('color', 'blank');
    elmnt.setAttribute('mode', 'edit');
    grid.gridElmnt.appendChild(elmnt);
    grid.gridElmnts.push(elmnt);

    if (i == grid.startPos.toInt()) {
        elmnt.setAttribute('status', 'start');
        continue;
    } else if (i == grid.goalPos.toInt()) {
        elmnt.setAttribute('status', 'goal');
        continue;
    }

    elmnt.setAttribute('status', 'blank');
    elmnt.addEventListener('mousedown', () => {
        if (grid.mode != 'edit') return;
        grid.drawmode = !grid.grid[i];
        grid.click(elmnt, i, grid.drawmode);
    });
    elmnt.addEventListener('mouseenter', (event) => {
        if (grid.mode != 'edit') return;
        if (event.buttons == 1) {
            grid.click(elmnt, i, grid.drawmode);
        }
    });
    grid.grid.push(false);
}
