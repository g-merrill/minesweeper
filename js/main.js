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
        // references both the dom id and the array id
        this.location = location;
        this.status = 'hidden';
    }
    getAllValidNeighbors() {
        // based on this tile's location,
        // function that returns array of locations of all valid neighboring tiles (valid meaning: they should be revealed if blank / checked if a number tile)
    }
}
class Blank extends Tile {
    constructor(location) {
        super(location);
        this.type = 'blank';
    }
    // any special functions needed by blank tiles
    getBlankNeighbors() {
        // function that returns location of any blank tiles touching this one on the top, bottom, left, or right
    }
}
class Number extends Tile {
    constructor(location) {
        super(location);
        this.type = 'number';
    }
    // any special functions needed by number tiles
    getMineNeighbors(){
        // function that returns the number of mines this tile is touching
        // can use constructor.name = Mine to check
    }
}
class Mine extends Tile {
    constructor(location) {
        super(location);
        this.type = 'mine';
    }
    // any special functions needed by mine tiles
}


// state variables
let board, offset, playerStatus, numberOfMines;

// cached elements


// event listeners

// adds an event listener to the board container
document.getElementById('board').addEventListener('click', handleClick);


// functions

// this function will do something whenever you click a div in the board


// init
init();
function init() {
    playerStatus = 'pregame';  // won, lost, pregame, or playing(used when timer function is set up)
    // for reset button, this will be a getOffset function that gets offset based on settings, then store it as a variable like below
    offset = DEFAULTS.beginner.offset;
    // for reset button, this will be a createBoard function that will return the appropriate board, the save that as the board state variable shown below
    board = Array(offset * offset).fill(0);
//     board = [                           // r
//         0,  0,  2, -1,  0,  0,  0,  0,  // 0
//         0,  0,  3,  3,  0,  0,  0,  0,  // 1
//         2,  3,  5, -1,  0,  0,  0,  0,  // 2
//        -1, -1, -1, -1,  0,  0,  0,  0,  // 3
//         0,  0,  0,  0,  0,  0,  0,  0,  // 4
//         0,  0,  0,  0,  0,  0,  0,  0,  // 5
//         0,  0,  0,  0,  0,  0,  0,  0,  // 6
//         0,  0,  0,  0,  0,  0,  0,  0,  // 7
//  //  c  0   1   2   3   4   5   6   7
//     ];
    numberOfMines = DEFAULTS.beginner.numMines;
    setMines();
    // need to call a calcNumbers function based on board's mine locations
    calcNumbers();
}
function calcNumbers() {

}
// render
function render(id) {
        // change tile's background colors based on board number
    let tile = document.getElementById(`${id}`);
    tile.style.backgroundColor = 'lightgray';
    // if bomb, render mine img
    if (typeof board[id] === 'object' && board[id].type === 'mine') { //can remove check for object, once all tiles are set as objects
        tile.style.backgroundColor = 'red';
        tile.innerHTML = '<img src="images/mine-img.png" alt="mine">';
        console.log('YOU HIT A BOMB! GAME OVER');
        // show location of all other hidden bombs (50% opacity)
        board.forEach(function(boardObj) {
            if (typeof boardObj === 'object' && boardObj.type === 'mine' && boardObj.location !== id) {
                document.getElementById(`${boardObj.location}`).innerHTML = '<img id="other-bombs" src="images/mine-img.png" alt="mine">';
            }
        });
        // update playerStatus
        playerStatus = 'lost';
        // (do later) stop timer, change smiley, offer a play-a-new-game button
        return;
    }
    // **************** NEED TO FIX ERRORS HERE **********
    // write number inside div using innerHTML
    if (board[id] === 0) {
        // // change background of all touching tiles around blank tiles no matter the board value
        document.getElementById(`${id - offset - 1}`).style.backgroundColor = 'lightgray';
        document.getElementById(`${id - offset}`).style.backgroundColor = 'lightgray';
        document.getElementById(`${id - offset + 1}`).style.backgroundColor = 'lightgray';
        document.getElementById(`${id - 1}`).style.backgroundColor = 'lightgray';
        document.getElementById(`${id + 1}`).style.backgroundColor = 'lightgray';
        document.getElementById(`${id + offset - 1}`).style.backgroundColor = 'lightgray';
        document.getElementById(`${id + offset}`).style.backgroundColor = 'lightgray';
        document.getElementById(`${id + offset + 1}`).style.backgroundColor = 'lightgray';

        // //  and display board value in divs of all touching tiles that have a board value !== 0
        let i, indexValue, boardValue;
        for (i = -1; i <= 1; i++) {
            // render any numbers above blank tile
            if (board[id - offset + i] !== 0) {
                indexValue = id - offset + i;
                boardValue = board[indexValue];
                document.getElementById(`${indexValue}`).style.color = COLORS[boardValue];
                document.getElementById(`${indexValue}`).innerHTML = `${boardValue}`;
            }
            // render any numbers below blank tile
            if (board[id + offset + i] !== 0) {
                indexValue = id + offset + i;
                boardValue = board[indexValue];
                document.getElementById(`${indexValue}`).style.color = COLORS[boardValue];
                document.getElementById(`${indexValue}`).innerHTML = `${board[indexValue]}`;
            }
        }
        for (i = -1; i <= 1; i += 2) {
            // render any numbers to left and right of blank tile
            if (board[id + i] !== 0) {
                indexValue = id + i;
                boardValue = board[indexValue];
                document.getElementById(`${indexValue}`).style.color = COLORS[boardValue];
                document.getElementById(`${id + i}`).innerHTML = `${board[id + i]}`;
            }
        }
        
        
        // // check up, check down, check left, check right for blanks
        // // if blank is found, switch to blank and continue to re-render all touching tiles around the new blank tile and check up, check down, check left, check right for blanks, until no more blanks left
        // // if no blank tiles, end the switch-checking function
        return;
    }
    // **************** NEED TO FIX ERRORS HERE **********
    tile.style.color = COLORS[board[id]];
    tile.innerHTML = `${board[id]}`;
    // change any revealed tile object's status from hidden to revealed
}
function handleClick(evt) {
    if (playerStatus === 'lost') return;
    let id = parseInt(evt.target.id);
    if (typeof board[id] === 'object' && board[id].status === 'revealed') return; //can remove check for object, once all tiles are set as objects
    render(id);
};

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
    mines.forEach(function(mineObj) {
        let id = mineObj.location;
        // change board value to mine
        board[id] = mineObj;
    });
}

// ******* SANDBOX ********

console.log(board);


// ******************