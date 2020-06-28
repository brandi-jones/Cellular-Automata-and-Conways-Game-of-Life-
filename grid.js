let grid = [];
let columns;
let rows;
let resolution = 20;
let deadColor = 0;
let aliveColor = 'rgb(0,255,0)';
let paused = false;
let generation = 0;
let fps = 10;


//function for p5.js that is called on initial render
function setup(){
    canvas = createCanvas(windowWidth, windowHeight); //make the size of the entire page
    canvas.parent('canvas') //connect it to html div with id='canvas' for positioning

    //move position of canvas and move the layer behind other elements
    canvas.position(0,0);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed')  
    canvas.style('display', 'block')

    columns = floor(windowWidth / resolution);
    rows = floor(windowHeight / resolution);

    //make draw() only iterate once, until told to start
    //noLoop();

    for(let i = 0; i < columns; i++){
        let inArr = [];
        for(let j = 0; j < rows; j++){
            let cell = new Cell(i, j, 0, deadColor);
            inArr.push(cell);
        }
        grid.push(inArr)  
    }
}

//when window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    columns = floor(windowWidth / resolution);
    rows = floor(windowHeight / resolution);

    redraw();
   // console.log("test", this.windowWidth, columns, rows)
}

//function for p5.js that is called continously to update the canvas, unless stopped by noLoop()
function draw(){
    document.getElementById("gen").innerHTML = `Generation: ${generation}`;

    //handle selections for fps
    fpsChange();
    frameRate(fps);

    //handle clear the grid config
    let clear = document.getElementById("clear").onclick = function() {
        for(let i = 0; i < columns; i++){
            for(let j = 0; j < rows; j++){
                grid[i][j].changeValues(0, deadColor)
            }
        }
        generation = 0;
        redraw();
    }

    //handle random cell config
    document.getElementById("random").onclick = function() {
        clear() //clear grid first

        for(let i = 0; i < columns; i++){
            for(let j = 0; j < rows; j++){
                let num = floor(random(2))
                if (num == 1) {
                    grid[i][j].changeValues(1, aliveColor)
                } 
            }
        }

        generation = 0; //reset gen
        noLoop();
        redraw();
    }

    //handle custom cell config 
    document.getElementById("custom").onclick = function() {
        clear(); //clear grid first
        noLoop();
        paused = true;
        generation = 0;
    }

    //show current grid
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            //console.log(grid[i][j])
            grid[i][j].show()
        }
    }

    //------------create next grid------------
    //create a new 2Darray for the "next" array after a cycle has completed
    let nextGrid = new Array(floor(windowWidth/resolution));
    //loop over columns to create new arrays at each column
    for (let i = 0; i < nextGrid.length; i++) { 
        nextGrid[i] = new Array(floor(windowHeight/resolution));
    }

    //create variable to track if grid changes at all this iteration
    let gridChanged = false;

    for (let i = 0; i < floor(windowWidth/resolution); i++) {
        for (let j = 0; j < floor(windowHeight/resolution); j++) {

            //create cell at nextgrid[i][j]
            nextGrid[i][j] = new Cell(i, j, 0, deadColor)

            //if next grid is going to be bigger than current grid (in case of window resize), all new cells will be dead in color.
            // otherwise, continue with rules
            if (i < grid.length && j < grid[0].length) {
        
                //console.log(i, j)
                let cell = grid[i][j].value;
                let neighbors = countNeighbors(grid, i, j);

            //console.log("rows: ", rows, "columns: ", columns)

                // //if cell is alive and neighbors are less than 2 (dies of underpopulation)
                // if (cell == 1 && neighbors < 2) {
                //     nextGrid[i][j].value = 0;
                //     nextGrid[i][j].color = deadColor;
                // }
                // //if cell is alive and has exactly 2 or 3 neighbors (lives on to the next generation)
                // else if (cell == 1  && neighbors == 2 || neighbors == 3){
                //     nextGrid[i][j].value = cell;
                //     nextGrid[i][j].color = aliveColor;
                // }
                // //if cell is alive and has more than 3 neighbors (dies of overpopulation)
                // else if (cell == 1 && neighbors > 3) {
                //     nextGrid[i][j].value = 0;
                //     nextGrid[i][j].color = deadColor;
                // }
                // //if cell is dead and has exactly 3 neighbors (born from reproduction)
                // else if (cell == 0 && neighbors == 3) {
                //     nextGrid[i][j].value = 1;
                //     nextGrid[i][j].color = aliveColor;
                // }
                // //any other cells die in the next generation
                // else {
                //     nextGrid[i][j].value = 0;
                //     nextGrid[i][j].color = 'red';
                // }
                if (paused) {
                    nextGrid[i][j] = grid[i][j]
                }
                else {
                    if (cell == 0 && neighbors == 3) {
                        nextGrid[i][j].changeValues(1, aliveColor)
                        gridChanged = true;
                    }
                    else if (cell == 1 && (neighbors < 2 || neighbors > 3)) {
                        nextGrid[i][j].changeValues(0, deadColor)
                        gridChanged = true;
                    }
                    else {
                        nextGrid[i][j].changeValues(cell, grid[i][j].color)
                    }
                }
         
            }   
        }
    }

    //assign new grid
    grid = nextGrid;
    
    //handle start button
    document.getElementById("start").onclick = function() {
        loop();
        paused = false;
    }

    //handle stop button
    document.getElementById("stop").onclick = function() {
        noLoop();
        paused = true;
    }
    
    //if grid changed this iteration, increase generation count
    if (gridChanged) {
        generation++;
    }

}

//function for p5.js called anytime mouse is pressed
function mousePressed(){
    //only want users to be able to click cells if simulation is paused
    if (paused) {
        for (i = 0; i < grid.length; i++) {
            for (j = 0; j < grid[0].length; j++) {
                grid[i][j].clicked()
            }
        }
    }
}


//count neighbors alive a cell has
function countNeighbors(grid, x, y) {
    let count = 0;

    //loop over all of a cell's neighbors, and if it is a live cell (value of 1), the count will be increased by 1. Otherwise, 0 will be added to count (dead cell)
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            //create new column/row variables to handle wrap around 
            let column = (x + i + grid.length) % grid.length;
            let row = (y + j + grid[0].length) % grid[0].length;

            count += grid[column][row].value;
        }
    }
    //subtract itself
    count -= grid[x][y].value;

    return count;
}

//handle FPS selection
function fpsChange(){
    document.getElementById("fps5").onclick = function() {
        fps = 5;
    }
    document.getElementById("fps10").onclick = function() {
        fps = 10;
    }
    document.getElementById("fps20").onclick = function() {
        fps = 20;
    }
}

class Cell {
    constructor(i, j, value, color) {
        this.i = i;
        this.j = j;
        this.x = i * resolution;
        this.y = j * resolution;
        this.value = value;
        this.color = color;
    }

    clicked(){
        let x1 = this.x, x2 = x1 + resolution,
            y1 = this.y, y2 = y1 + resolution;

        if (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2){
            console.log(this)
            this.color = aliveColor;
            this.value = 1;

            //the following code works with allowing cells to be turned both alive and dead, but it is quite slow
            // if (this.value === 0) {
            //     this.value = 1;
            //     this.color = aliveColor;
            // }
            // else {
            //     this.value = 0;
            //     this.color = deadColor;
            // }
            
            redraw()
        }
    }

    show(){
        fill(this.color)
        stroke('blue')
        rect(this.x, this.y, resolution, resolution)
    }

    changeValues(value, color) {
        this.value = value;
        this.color = color;
    }
}