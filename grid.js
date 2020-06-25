let grid
let columns;
let rows;
let resolution = 50;

//create a grid full of 0's of the specific size of columns/rows
function setup() {

    //create p5.js canvas for sketching later
    createCanvas(500, 500);

    columns = width / resolution;
    rows = height / resolution;

    //create inital array
    grid = new Array(columns);
    
    //loop over columns to create new arrays at each column
    for (var i = 0; i < columns; i++) { 
        grid[i] = new Array(rows);

        //loop over each specific column's array and fill in 0's according to the specific # of rows
        for (var j = 0; j < rows; j++) { 
            grid[i][j] = 0;
        }
    }

}

//sketch canvas with p5.js functions
function draw() {
    background(66, 78, 245);

    for (var i = 0; i < columns; i++){
        
        for (var j = 0; j < rows; j++) {

            let x = i * resolution;
            let y = j * resolution;
    
            //if alive
            if (grid[i][j] == 1) {
                fill(255);
            }
            //if dead
            else {
                fill(66, 78, 245);
            }

            //draw a rectangle at position x,y on the canvas with width and height
            rect(x, y, 50, 50) 
            console.log("hit this");
        
        }
    }
    
    noLoop()

    //create a new 2Darray for the "next" array after a cycle has completed
    let nextGrid = new Array(columns);
    //loop over columns to create new arrays at each column
    for (var i = 0; i < columns; i++) { 
        nextGrid[i] = new Array(rows);
    }

    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {

            let cell = grid[i][j];
            let neighbors = countNeighbors(grid, i, j);

            //if cell is alive and neighbors are less than 2 (dies of underpopulation)
            if (cell == 1 && neighbors < 2) {
                nextGrid[i][j] = 0;
            }
            //if cell is alive and has exactly 2 or 3 neighbors (lives on to the next generation)
            else if (cell = 1  && neighbors == 2 || neighbors == 3){
                nextGrid[i][j] = cell;
            }
            //if cell is alive and has more than 3 neighbors (dies of overpopulation)
            else if (cell == 1 && neighbors > 3) {
                nextGrid[i][j] = 0;
            }
            //if cell is dead and has exactly 3 neighbors (born from reproduction)
            else if (cell == 0 && neighbors == 3) {
                nextGrid[i][j] = 1;
            }
            //any other cells die in the next generation
            else {
                nextGrid[i][j] = 0;
            }

        }
    }

    grid = nextGrid;
}

function countNeighbors(grid, x, y) {
    let count = 0;

    //loop over all of a cell's neighbors, and if it is a live cell (value of 1), the count will be increased by 1. Otherwise, 0 will be added to count (dead cell)
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          let column = (x + i + columns) % columns;
          let row = (y + j + rows) % rows;
          count += grid[column][row];
        }
    }
    //subtract itself
    count -= grid[x][y];

    return count;
}




