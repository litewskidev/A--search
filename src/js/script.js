// GLOBAL
const cols = 10; // GRID SIZE
const rows = cols;
const grid = new Array(cols); // 1D ARRAY
const squareHeight = 65;  //  SQUARE SIZE
const squareWidth = squareHeight;
const width = 11;  //  GRID WIDTH
const gridWidth = width * squareWidth;

let html = '';
let openSet = [];
let closedSet = [];
let path = [];
let start;
let end;

class Spot {
  constructor(i, j){
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.display = false;
    this.isStart = false;
    this.isEnd = false;

    html += '<div id="square" class="square" data-row="' + i + '" data-col="' + j + '" style="width: ' + squareWidth + 'px; height: ' + squareHeight + 'px;"></div>';

    this.showGrid = function (){
      let showGrid = document.querySelector('#grid');
      showGrid.style.width = `${gridWidth}px`;
      showGrid.innerHTML = html;
    };

    this.addNeighbors = function (grid){
      let i = this.i;
      let j = this.j;

      if (i < cols - 1){
        this.neighbors.push(grid[i + 1][j]);
      }
      if (i > 0){
        this.neighbors.push(grid[i - 1][j]);
      }
      if (j < rows - 1){
        this.neighbors.push(grid[i][j + 1]);
      }
      if (j > 0){
        this.neighbors.push(grid[i][j - 1]);
      }
    };
  }
}

function setupGrid(){
  // 2D ARRAY
  for (let i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }
  // SPOTS
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      grid[i][j] = new Spot(i, j);
    }
  }
  // NEIGHBORS
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }
  // SHOW GRID
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      grid[i][j].showGrid();
    }
  }

  // START
  start = grid[0][0];
  // END
  end = grid[9][9];

  openSet.push(start);
  console.log(grid);
}

function searchPath(){
  while (openSet.length > 0){
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++){
      if (openSet[i].f < openSet[lowestIndex].f){
        lowestIndex = i;
      }
    }
    let current = openSet[lowestIndex];

    // FINDING PATH
    if (current === end){
      let temp = current;
      path.push(temp);
      while (temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
      }
      console.log('DONE!');
    }

    // REMOVE CURRENT FROM [OPENSET] & PUSH TO [CLOSEDSET]
    removeFromArray(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++){
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)){
        let tempG = current.g + 1;
        if (openSet.includes(neighbor)){
          if (tempG < neighbor.g){
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          // PUSH NEIGHBOR TO [OPENSET]
          openSet.push(neighbor);
        }

        // CALCULATE DISTANCE
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;
      }
    }
  }

  // DISPLAY RESULTS DOM
  for (let i = 0; i < closedSet.length; i++){
    const closedNode = closedSet[i];
    document.querySelector(`[data-row="${closedNode.i}"][data-col="${closedNode.j}"]`).className = 'square closed';
  }

  for (let i = 0; i < openSet.length; i++){
    const openNode = openSet[i];
    document.querySelector(`[data-row="${openNode.i}"][data-col="${openNode.j}"]`).className = 'square open';
  }

  for (let i = 0; i < path.length; i++){
    const pathNode = path[i];
    document.querySelector(`[data-row="${pathNode.j}"][data-col="${pathNode.i}"]`).className = 'square path';
  }
}

function removeFromArray(arr, elem){
  for (let i = arr.length - 1; i >= 0; i--){
    if (arr[i] === elem){
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b){
  // euclidean
  //let d = euclidean(a.i, a.j, b.i, b.j);

  // manhattan
  let d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);

  return d;
}

// eslint-disable-next-line no-unused-vars
function euclidean(x1, y1, x2, y2){
  return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
}

setupGrid();
searchPath();
