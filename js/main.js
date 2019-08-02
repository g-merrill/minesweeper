// constants
const COLORS = {
    '1' : 'blue',
    '2' : 'green',
    '3' : 'red',
    '4' : 'purple',
    '5' : 'maroon',
    '6' : 'turquoise',
    '7' : 'black',
    '8' : 'gray'
};
const offset = 8;

class Tile {
    constructor(location, status) {
        // references both the dom id and the array id
        this.location = location;
        this.status = status;
    }
    getAllValidNeighbors() {
        // function that returns array of locations of all valid neighboring tiles (valid meaning: they should be revealed if blank / checked if a number tile)
    }
}
class blank extends Tile {
    constructor(location, status) {
        super(location, status);
        this.type = 'blank';
    }
    // any special functions needed by blank tiles
    getBlankNeighbors() {
        // function that returns location of any blank tiles touching this one on the top, bottom, left, or right
    }
}
class number extends Tile {
    constructor(location, status) {
        super(location, status);
        this.type = 'number';
    }
    // any special functions needed by number tiles
    getMineNeighbors(){
        // function that returns the number of mines this tile is touching
    }
}
class mine extends Tile {
    constructor(location, status) {
        super(location, status);
        this.type = 'mine';
    }
    // any special functions needed by mine tiles
}

// ******* SANDBOX ********
let tiles = [];





// ******************


// const tile = {
//     tileStatus: 'hidden'
// };


// state variables
let board = [               // r
     0,  0,  2, -1,  0,  0,  0,  0,  // 0
     0,  0,  3,  3,  0,  0,  0,  0,  // 1
     2,  3,  5, -1,  0,  0,  0,  0,  // 2
    -1, -1, -1, -1,  0,  0,  0,  0,  // 3
     0,  0,  0,  0,  0,  0,  0,  0,  // 4
     0,  0,  0,  0,  0,  0,  0,  0,  // 5
     0,  0,  0,  0,  0,  0,  0,  0,  // 6
     0,  0,  0,  0,  0,  0,  0,  0,  // 7
//c 0  1  2  3  4  5  6  7
];
let playerStatus = 'playing';  // won, lost, or playing
let numberOfMines = 10;

// cached elements


// event listeners

// adds an event listener to the board container
document.getElementById('board').addEventListener('click', handleClick);


// functions

// this function will do something whenever you click a div in the board


// init

// render
function render(id) {
        // change tile's background colors based on board number
    let tile = document.getElementById(`${id}`);
    tile.style.backgroundColor = 'lightgray';
    // if bomb, render mine img
    if (board[id] === -1) {
        tile.style.backgroundColor = 'red';
        tile.innerHTML = '<img src="images/mine-img.png" alt="mine">';
        console.log('YOU HIT A BOMB! GAME OVER');
        // show location of all other hidden bombs
        
        // update playerStatus
        playerStatus = 'lost';
        return;
    }
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
        let i, indexValue, boardValue, colorIndex;
        for (i = -1; i <= 1; i++) {
            // render any numbers above blank tile
            if (board[id - offset + i] !== 0) {
                indexValue = id - offset + i;
                boardValue = board[indexValue];
                colorIndex = boardValue.toString();
                document.getElementById(`${indexValue}`).style.color = COLORS[colorIndex];
                document.getElementById(`${indexValue}`).innerHTML = `${boardValue}`;
            }
            // render any numbers below blank tile
            if (board[id + offset + i] !== 0) {
                indexValue = id + offset + i;
                boardValue = board[indexValue];
                colorIndex = boardValue.toString();
                document.getElementById(`${indexValue}`).style.color = COLORS[colorIndex];
                document.getElementById(`${indexValue}`).innerHTML = `${board[indexValue]}`;
            }
        }
        for (i = -1; i <= 1; i += 2) {
            // render any numbers to left and right of blank tile
            if (board[id + i] !== 0) {
                indexValue = id + i;
                boardValue = board[indexValue];
                colorIndex = boardValue.toString();
                document.getElementById(`${indexValue}`).style.color = COLORS[colorIndex];
                document.getElementById(`${id + i}`).innerHTML = `${board[id + i]}`;
            }
        }
        
        // // check up, check down, check left, check right for blanks
        // // if blank is found, switch to blank and continue to re-render all touching tiles around the new blank tile and check up, check down, check left, check right for blanks, until no more blanks left
        // // if no blank tiles, end the switch-checking function
        return;
    }
    let colorIndex = board[id].toString();
    tile.style.color = COLORS[colorIndex];
    tile.innerHTML = `${board[id]}`;
}
function handleClick(evt) {
    if (playerStatus === 'lost') return;
    let id = parseInt(evt.target.id);
    render(id);
};

function mineLocations(numberOfMines) {
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
console.log(mineLocations(numberOfMines));