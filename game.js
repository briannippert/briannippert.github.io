var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext('2d');
var chips = [];
var red = 0;
var white = 0;
var total = 0;
debug = true;

class pos {
  constructor(col, row) {
    this.row = row;
    this.col = col;
  }
  getRow() {
    return this.row
  }
  getCol() {
    return this.col
  }
}

class chip {
  constructor(col, row, color) {
    this.row = col;
    this.col = row;
    this.radius = 30;
    this.color = color;
    this.x = (this.col * 90) + 85;
    this.y = (this.row * 90) + 85;
    this.draw();
    chips.push(this);
  }
  flip() {
    if (this.color == "red") {
      this.color = "white"
    } else {
      this.color = "red"
    }
    this.draw();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

/**
 * Places a chip at the following position [COL,ROW] with the color COLOR
 * @param  {} col Column Number
 * @param  {} row Row Number
 * @param  {} color Color as a string
 */
function placeChip(col, row, color) {
  new chip(row, col, color);
}
/**
 * Highlights the specified cell in a light grey
 * @param  {} col
 * @param  {} row
 */
function highlight(col, row) {
  if (col == -1 || row == -1) {
    draw();
    return;
  }
  draw();
  ctx.fillStyle = "rgba(255,255, 255, .1)";
  ctx.fillRect((row * 90) + 40, (col * 90) + 40, 90, 90);

}

/**
 * Gets the current count of all pieces
 */
function getCounts() {
  red = 0;
  white = 0;
  total = 0;
  for (var i = 0; i < chips.length; i++) {
    total++;
    if (chips[i].color == "red") {
      red++;
    } else {
      white++;
    }
  }
  log("Red Chips: " + red);
  log("White Chips: " + white);
  log("Total Chips: " + total);
  if (total != red + white) {
    log("Chip Count Error!")
  }
}

/**
 * Handles the mouse move event inside the canvas element
 * @param  {} e mouse move event
 */
function handleMouseMove(e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  var coordinates = getGridNumber(mouseX, mouseY);
  highlight(coordinates.row, coordinates.col)
}
/**
 * Handles the mouse click event inside the canvas element
 * @param  {} e mouse click event
 */
function handleMouseClick(e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  var coordinates = getGridNumber(mouseX, mouseY);
  if (checkDuplicate(coordinates.col, coordinates.row) == false && coordinates.col != -1 && coordinates.row != -1) {
    placeChip(coordinates.col, coordinates.row, "red")
  } else {


  }
  getCounts();
}
/**
 * gets the grid number of the mouse pointer
 * @param  {} mouseX
 * @param  {} mouseY
 * @returns position object
 */
function getGridNumber(mouseX, mouseY) {
  var col = Math.floor((mouseX + 40) / 90)
  var row = Math.floor((mouseY + 40) / 90);
  col--;
  row--;
  if (col > 7) {
    col = -1;
  }
  if (row > 7) {
    row = -1;
  }
  if (col < 0) {
    col = -1;
  }
  if (row < 0) {
    row = -1;
  }
  var position = new pos(col, row);
  return position;
}
/**
 * clears the canvas. gets called at the beginning of every draw
 */
function clear() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
/**
 * main draw function that re-draws the entire screen
 */
function draw() {
  clear();
  drawGrid();
  for (var i = 0; i < chips.length; i++) {
    chips[i].draw();
  }


}
/**
 * Checks to see if there is already a chip in the specified space
 * @param  {} col Column Number
 * @param  {} row Row Number
 * @returns boolean
 */
function checkDuplicate(col, row) {
  for (var i = 0; i < chips.length; i++) {
    if (chips[i].row == row && chips[i].col == col) {
      if (debug) {
        chips[i].flip();
      }
      return true;
    }
  }
  return false;
}


/**
 * Checks to see if there is a chip in the specified row and column
 * @param  {} col Column Number
 * @param  {} row Row Number
 * @returns boolean
 */
function checkPosition(col, row) {
  for (var i = 0; i < chips.length; i++) {
    if (chips[i].row == row && chips[i].col == col) {
      return chips[i].color;
    }
  }
  return null;
}



/**
 * pauses execution of the JS for the specified time in milliseconds. No IE
 * @param  {} ms time in milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * removes an element from the specified array
 * @param  {} array
 * @param  {} element
 */
function remove(array, element) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}
/**
 * Draws the grid 
 */
function drawGrid() {
  const p = 40;
  const bw = canvas.width - (p * 2);
  const bh = canvas.height - (p * 2);
  for (let x = 0; x <= bw; x += 90) {
    ctx.moveTo(0.5 + x + p, p);
    ctx.lineTo(0.5 + x + p, bh + p);
  }
  for (var x = 0; x <= bh; x += 90) {
    ctx.moveTo(p, 0.5 + x + p);
    ctx.lineTo(bw + p, 0.5 + x + p);
  }
  ctx.strokeStyle = "red";
  ctx.stroke();
}

function log(string) {
  if (debug) {
    console.log(string)
  }

}

new chip(3, 3, "white");
new chip(4, 4, "white");
new chip(3, 4, "red");
new chip(4, 3, "red");
draw();