
//create a grid full of 0's of the specific size of columns/rows
function setupGrid(columns, rows) {
    //create inital array
    let grid = new Array(columns);
    
    //loop over columns to create new arrays at each column
    for (var x = 0; x < columns; x++) { 
        grid[x] = new Array(rows);

        //loop over each specific column's array and fill in 0's according to the specific # of rows
        for (var y = 0; y < rows; y++) { 
            grid[x][y] = 0;
        }
    }

    return grid;
}

let grid = setupGrid(25, 25);

