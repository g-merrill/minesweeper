// constants
const COLORS = {
    1 : 'blue',
    2 : 'green',
    3 : 'red',
    4 : 'purple',
    5 : 'maroon',
    6 : 'turquoise',
    7 : 'black',
    8 : 'gray'
};

const DEFAULTS = {
    beginner: {
        offset: 8,
        numMines: 10
    },
    intermediate: {
        offset: 16,
        numMines: 40
    },
    expert: {
        offset: 24,
        numMines: 99
    }
};

class Tile {
    constructor(location) {
        // location references both the dom id and the array id
        this.location = location;
        this.status = 'hidden';
    }
}

class Mine extends Tile {
    constructor(location) {
        super(location);
        this.type = 'mine';
    }
}

class Number extends Tile {
    constructor(location) {
        super(location);
        this.value = this.checkForMines(this.getValidNeighbors());
        this.type = 'number';
    }
    getValidNeighbors() {
        // function that returns the actual number of tiles this tile is touching
        let tileLocation = this.location;
        let validNeighbors;
        // tiles that need specialized neighbor algorithms:
        let corner = false;
        let border = false;
        // get neighbors of corner tiles
        // TL corner
        if (tileLocation === 0) {
            corner = true;
            validNeighbors = [
                (tileLocation + 1), 
                (tileLocation + offset),
                (tileLocation + offset + 1)
            ];
        }
        // TR corner
        if (tileLocation === (offset - 1)) {
            corner = true;
            validNeighbors = [
                (tileLocation - 1), 
                (tileLocation + offset - 1),
                (tileLocation + offset)
            ];
        }
        // BL corner
        if (tileLocation === (offset * (offset - 1))) {
            corner = true;
            validNeighbors = [
                (tileLocation - offset),
                (tileLocation - offset + 1),
                (tileLocation + 1)
            ];
        }
        // BR corner
        if (tileLocation === (offset * offset - 1)) {
            corner = true;
            validNeighbors = [
                (tileLocation - offset - 1),
                (tileLocation - offset),
                (tileLocation - 1)
            ];
        }
        // get neighbors of border tiles
        // top row
        if (!corner && tileLocation < offset) {
            border = true;
            validNeighbors = [
                (tileLocation - 1),
                (tileLocation + 1),
                (tileLocation + offset - 1),
                (tileLocation + offset),
                (tileLocation + offset + 1)
            ];
        }
        // left row
        if (!corner && tileLocation % offset === 0) {
            border = true;
            validNeighbors = [
                (tileLocation - offset),
                (tileLocation - offset + 1),
                (tileLocation + 1),
                (tileLocation + offset),
                (tileLocation + offset + 1)
            ];
        }
        // right row
        if (!corner && (tileLocation + 1) % offset === 0) {
            border = true;
            validNeighbors = [
                (tileLocation - offset - 1),
                (tileLocation - offset),
                (tileLocation - 1),
                (tileLocation + offset - 1),
                (tileLocation + offset)
            ];
        }
        // bottom row
        if (!corner && tileLocation > (offset * (offset - 1))) {
            border = true;
            validNeighbors = [
                (tileLocation - offset - 1),
                (tileLocation - offset),
                (tileLocation - offset + 1),
                (tileLocation - 1),
                (tileLocation + 1)
            ];
        }
        // get neighbors of everything else
        if (!corner && !border) {
            // get neighbors above
            validNeighbors = [
                (tileLocation - offset - 1),
                (tileLocation - offset),
                (tileLocation - offset + 1),
            // get neighbors to the side
                (tileLocation - 1),
                (tileLocation + 1),
            // get neighbors below
                (tileLocation + offset - 1),
                (tileLocation + offset),
                (tileLocation + offset + 1)
            ];
        }
        return validNeighbors;
    }
    checkForMines(validNeighbors) {
        let minesNearby = 0;
        validNeighbors.forEach( location => {
            if (typeof board[location] === 'object' && board[location].type === 'mine') {
                minesNearby += 1;
            }
        });
        return minesNearby;
    }
}
class Blank extends Number {
    constructor(location) {
        super(location);
        this.type = 'blank';
        this.blankNeighbors = this.getBlankNeighbors();
    }
    getBlankNeighbors() {
        // function that returns location of any blank tiles touching this one on the top, bottom, left, or right
        let location = this.location;
        let validNeighbors = this.getValidNeighbors();
        let blankNeighbors = [];
        validNeighbors.forEach( neighbor => {
            if (board[neighbor].value === 0) {
                blankNeighbors.push(neighbor);
            }
        });
        return blankNeighbors;
    }
}



// state variables
let board, offset, playerStatus, numberOfMines;

// cached elements


// event listeners

// adds an event listener to the board container
document.getElementById('board').addEventListener('click', handleClick);


// functions

// init
init();
function init() {
    playerStatus = 'pregame';  // won, lost, pregame, or playing(used when timer function is set up)
    // for reset button, this will be a getOffset function that gets offset based on settings, then store it as a variable like below
    offset = DEFAULTS.beginner.offset;
    // for reset button, this will be a createBoard function that will return the appropriate board, the save that as the board state variable shown below
    board = Array(offset * offset).fill(0);
    numberOfMines = DEFAULTS.beginner.numMines;
    setMines();
    setNumbers();
    setBlanks();
    renderTest();
}
// handleClick gets location of click, parses, returns before render if necessary, and passes to render function
function handleClick(evt) {
    if (playerStatus === 'lost') return;
    let id = parseInt(evt.target.id);
    if (board[id].status === 'revealed') return;
    render(id);
}
// render
function render(id) {
    // change tile's background color when clicked
    let tile = document.getElementById(`${id}`);
    tile.style.backgroundColor = 'lightgray';
    // if bomb, render mine img
    if (board[id].type === 'mine') {
        // change the clicked tile object's status from hidden to revealed
        board[id].status = 'revealed';
        tile.style.backgroundColor = 'red';
        tile.innerHTML = '<img src="images/mine-img.png" alt="mine">';
        console.log('YOU HIT A BOMB! GAME OVER');
        // show location of all other hidden bombs (50% opacity)
        board.forEach( boardObj => {
            if (boardObj.type === 'mine' && boardObj.location !== id) {
                document.getElementById(`${boardObj.location}`).innerHTML = '<img id="other-bombs" src="images/mine-img.png" alt="mine">';
            }
        });
        // update playerStatus
        playerStatus = 'lost';
        // (do later) stop timer, change smiley, offer a play-a-new-game button
        return;
    }
    // if a blank is clicked
    if (board[id].type === 'blank') {
        // could initialize an array that holds blanksNeedingRendering
        let blanksNeedingRendering = [id];
        // initialize another array holding blanksAlreadyRendered
        let blanksAlreadyRendered = [];
        // while there are blanks that need rendering, continue while loop
        while (blanksNeedingRendering.length) {
            let newBlank = blanksNeedingRendering[0];
            console.log(newBlank);
            // change the clicked tile object's status from hidden to revealed
            board[newBlank].status = 'revealed';
            renderBlank(newBlank);
            // copy whatever was rendered from blanksNeedingRendering to blanksAlreadyRendered
            blanksAlreadyRendered.push(newBlank);
            blanksNeedingRendering.forEach(function(blankLoc) {
                // get all valid blank neighbors of rendered tile
                // filter out any blanks that are in blanksAlreadyRendered
                let unrenderedBlankNeighbors = board[blankLoc].blankNeighbors;
                blanksAlreadyRendered.forEach(function(location) {
                    if (unrenderedBlankNeighbors.includes(location)) {
                        // remove that value from unrenderedBlankNeighbors
                            // first get index of this value in our array
                        let removalIdx = unrenderedBlankNeighbors.indexOf(location);
                            // then remove value from our array
                        unrenderedBlankNeighbors.splice(removalIdx, 1);
                    }
                });
                unrenderedBlankNeighbors.forEach(function(blankLoc) {
                    // get all valid neighbors of these blanks
                    let newNeighbors = board[blankLoc].getValidNeighbors();

                    // if there are no hidden tiles around the blank, no need to call renderBlank for it
                    // let checkForHidden = false;
                    // for (let i = 0; i < newNeighbors.length; i++) {
                    //     let location = newNeighbors[i];
                    //     if (board[location].status === 'hidden') {
                    //         checkForHidden = true;
                    //         break;
                    //     }
                    // }
                    // console.log(checkForHidden); // will return true if condition is true, as expected

                    let checkForHidden = newNeighbors.some(function(location) {
                        return board[location].status === 'hidden';
                    });

                    // add to blanksNeedingRendering array to be rendered in the next while loop iteration
                    if (
                        checkForHidden && 
                        // AND not already in blanksNeedingRendering (don't want to add a duplicate)
                        !(blanksNeedingRendering.some(value => value === blankLoc))
                        ) {
                        blanksNeedingRendering.push(blankLoc);
                    }
                });
            });
            // after doing all the stuff, remove current value from blanksNeedingRendering array
            blanksNeedingRendering.shift();
            console.log(blanksNeedingRendering);            
        }
        return;
    }
    // otherwise, write number inside div using innerHTML
    // change the clicked tile object's status from hidden to revealed
    board[id].status = 'revealed';
    tile.style.color = COLORS[board[id].value];
    tile.innerHTML = `${board[id].value}`;
    return;
}
function renderBlank(id) {
    board[id].getValidNeighbors().forEach( location => {
        // display all valid touching tiles as revealed
        document.getElementById(`${location}`).style.backgroundColor = 'lightgray';
        board[location].status = 'revealed';
        //  display number value in divs of all touching tiles that have a board value !== 0
        if (board[location].value !== 0) { // don't have to worry about mines as they will not be valid neighbors of a blank
            document.getElementById(`${location}`).style.color = COLORS[board[location].value];
            document.getElementById(`${location}`).innerHTML = `${board[location].value}`;
        }
    });
    return;
}
// Mines! 
function getMineLocations() {
    let locationOfMines = Array(numberOfMines).fill('to be filled');
    let prevMineLocations = [];
    locationOfMines.forEach((val, idx) => {
        let randLocation = Math.floor(Math.random() * board.length);
        // while loop: keep reassigning a new location if location = any number in prevMineLocations
        while (prevMineLocations.some(value => value === randLocation)) {
            randLocation = Math.floor(Math.random() * board.length);
        }
        prevMineLocations.push(randLocation);
        locationOfMines[idx] = randLocation;
    });
    return locationOfMines;
}
function createMineObjects() {
    let mineObjects = [];
    let mineArray = getMineLocations();
    mineArray.forEach(location => {
        let mineTile = new Mine(location);
        mineObjects.push(mineTile);
    });
    return mineObjects;
}
function setMines() {
    let mines = createMineObjects();
    mines.forEach( mineObj => {
        let id = mineObj.location;
        // change board value to mine
        board[id] = mineObj;
    });
}
function setNumbers() {
    board.forEach(function(val, idx) {
        // for every board value that isnt a mine, create number object for that location
        if (board[idx] === 0) {
            board[idx] = new Number(idx);
        }
    });
}
function setBlanks() {
    board.forEach(function(val, idx) {
        // replace all Number.value === 0 objects with Blank objects
        if (board[idx].type === 'number' && !board[idx].value) {
            board[idx] = new Blank(idx);
        }
    });
}

// ******* SANDBOX ********

function renderTest() {
    let tiles = document.querySelectorAll('.tile');
    tiles.forEach(function(tile, idx) {
        tile.innerHTML = (board[idx].type === 'mine') ? 
            `<img id="${idx}" src="images/mine-img.png" alt="mine">` : 
            `${board[idx].value}`;
        if (board[idx].type === 'mine') {
            tile.style.backgroundColor = 'red';
        }
    });
}
console.log(board);

// ******************


