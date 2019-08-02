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
        // // change background of all touching tiles around it
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
            if (board[id - offset + i] !== 0) {
                indexValue = id - offset + i;
                boardValue = board[indexValue];
                colorIndex = boardValue.toString();
                document.getElementById(`${indexValue}`).style.color = COLORS[colorIndex];
                document.getElementById(`${indexValue}`).innerHTML = `${boardValue}`;
            }
            if (board[id + offset + i] !== 0) {
                indexValue = id + offset + i;
                boardValue = board[indexValue];
                colorIndex = boardValue.toString();
                document.getElementById(`${indexValue}`).style.color = COLORS[colorIndex];
                document.getElementById(`${indexValue}`).innerHTML = `${board[indexValue]}`;
            }
        }
        for (i = -1; i <= 1; i += 2) {
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
