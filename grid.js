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
}




