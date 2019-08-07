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
        this.flagged = 'no';
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
let board, offset, numberOfMines, playerStatus, gameMode;

// cached elements
let boardEl = document.getElementById('board');
let flagsLeftDisplay = document.getElementById('flag-tracker');
let smiley = document.getElementById('smiley');
let timerDisplay = document.getElementById('timer');
let tiles = document.querySelectorAll('.tile');
let beginnerBtn = document.getElementById('beginner-btn');
let intermediateBtn = document.getElementById('intermediate-btn');
let expertBtn = document.getElementById('expert-btn');

// event listeners

// adds an event listener to the board container
boardEl.addEventListener('click', handleClickLeft);
boardEl.addEventListener('contextmenu', handleClickRight, false);
smiley.addEventListener('click', newGame);
beginnerBtn.addEventListener('click', beginnerMode);
intermediateBtn.addEventListener('click', intermediateMode);
expertBtn.addEventListener('click', expertMode);
function beginnerMode() {
    offset = DEFAULTS.beginner.offset;
    numberOfMines = DEFAULTS.beginner.numMines;
    clearRedStyling();
    setRedStyling(1);
    init();
}
function intermediateMode() {
    offset = DEFAULTS.intermediate.offset;
    numberOfMines = DEFAULTS.intermediate.numMines;
    clearRedStyling();
    setRedStyling(2);
    init();
}
function expertMode() {
    offset = DEFAULTS.expert.offset;
    numberOfMines = DEFAULTS.expert.numMines;
    clearRedStyling();
    setRedStyling(3);
    init();
}
function clearRedStyling() {
    for (let i = 1; i <=3; i++) {
        document.getElementById(`border${i}`).classList.remove('clicked');
        document.getElementById(`text${i}`).classList.remove('clicked');
        document.getElementById(`fill${i}`).classList.remove('clicked');
    }
}
function setRedStyling(modeIdx) {
    document.getElementById(`border${modeIdx}`).classList.toggle('clicked');
    document.getElementById(`text${modeIdx}`).classList.toggle('clicked');
    document.getElementById(`fill${modeIdx}`).classList.toggle('clicked');    
}

// functions

// createBoard will generate board in DOM after all objects are placed inside
function createBoard(offsetValue) {
    // clear whatever might've already been in #board section
    boardEl.innerHTML = '';
    // set properties of boardEl
    boardEl.style.gridTemplateColumns = `repeat(${offsetValue}, ${60 / offsetValue}vmin [col-start])`;
    boardEl.style.gridTemplateRows = `repeat(${offsetValue}, ${60 / offsetValue}vmin [row-start])`;
    // generate and place tiles in boardEl
    let numTiles = offsetValue * offsetValue;
    for (let i = 0; i < numTiles; i++) {
        let newTile = document.createElement('div');
        newTile.className = 'tile';
        newTile.style.fontSize = `${(-5 / 16) * offsetValue + 9.5}vmin`;
        newTile.id = `${i}`;
        boardEl.appendChild(newTile);
    }
}


function getGameMode() {
    let idArray = document.querySelector('.clicked').id.split('');
    let modeIdx = idArray[idArray.length - 1];
    switch (modeIdx) {
        case '3':
            gameMode = 'expert';
            break;
        case '2':
            gameMode = 'intermediate';
            break;
        default:
            gameMode = 'beginner';
    }
}



// init function sets up page when web app is first loaded
init();
function init() {
    smiley.setAttribute('src', 'images/smiley.png');
    playerStatus = 'pregame';  // won, lost, pregame, or playing(used when timer function is set up)
    getGameMode();
    flagsLeftDisplay.textContent = `0${DEFAULTS[gameMode].numMines}`;
    // for reset button, this will be a getOffset function that gets offset based on settings, then store it as a variable like below
    offset = DEFAULTS[gameMode].offset;
    // create board in DOM based on value of offset (css sizing nightmare)
    createBoard(offset);
    // for reset button, this will be a createBoard function that will return the appropriate board, the save that as the board state variable shown below
    board = Array(offset * offset).fill(0);
    // if number of mines are custom set by settings tab, use a separate customInit function instead of init/reset
    numberOfMines = DEFAULTS[gameMode].numMines;
    // numberOfMines = 1;
    setMines();
    setNumbers();
    setBlanks();
    // seeBoard();
}
// Mines! 
function getMineLocations() {
    let locationOfMines = Array(numberOfMines).fill('to be filled');
    let prevMineLocations = [];
    // generate random mine locations
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
// place 'mine' objects in board array
function setMines() {
    let mines = createMineObjects();
    mines.forEach( mineObj => {
        let id = mineObj.location;
        // change board value to mine
        board[id] = mineObj;
    });
}
// place 'number' objects in board array
function setNumbers() {
    board.forEach(function(val, idx) {
        // for every board value that isnt a mine, create number object for that location
        if (board[idx] === 0) {
            board[idx] = new Number(idx);
        }
    });
}
// replace any 'number' objects that have a value of zero with special 'blank' objects
function setBlanks() {
    board.forEach(function(val, idx) {
        // replace all Number.value === 0 objects with Blank objects
        if (board[idx].type === 'number' && !board[idx].value) {
            board[idx] = new Blank(idx);
        }
    });
}
// handleClickLeft gets location of click, parses, returns before render if necessary, and passes to render function
function handleClickLeft(evt) {
    if (playerStatus === 'lost') return;
    let id = parseInt(evt.target.id); // since I use id in a comparison (see renderMine function), I need it to be a number, not a string
    if (board[id].status === 'revealed') return;
    render(id);
}
function handleClickRight(evt) {
    evt.preventDefault();
    if (playerStatus === 'lost') return false;
    let id = parseInt(evt.target.id);
    if (board[id].status === 'revealed') {
        return false;
    }
    switch (board[id].flagged) {
        case 'no':
            renderFlag(id);
            break;
        case 'yes':
            renderUnsure(id);
            break;
        default:
            renderRemoveMark(id);
    }
    return false;
}
// render
function render(id) {
    // change tile's background color when clicked
    let tile = document.getElementById(`${id}`);
    tile.style.backgroundColor = 'rgba(211, 211, 211, 1)';
    tile.style.border = '0.2vmin solid rgba(105, 105, 105, 1)';
    switch (board[id].type) {
        case 'mine':
            renderMine(id, tile);
            break;
        case 'blank':
            renderBlank(id);
            break;
        default:
            // otherwise, write number inside div using innerHTML
            board[id].status = 'revealed';
            tile.style.color = COLORS[board[id].value];
            tile.innerHTML = `${board[id].value}`;
    }
    // checkWinner has renderWinner inside of it
    checkWinner();
}
function renderFlag(id) {
    document.getElementById(`${id}`).innerHTML = '<img class="flag-img" src="images/flag-img.png" alt="flag">';
    // update flags left display
    let oldNum = parseInt(flagsLeftDisplay.textContent);
    // the following is an unorthodox way of using switch statements, but I preferred it to two else ifs
    switch (true) {
        case (oldNum > 100):
            flagsLeftDisplay.textContent = `${oldNum - 1}`;
            break;
        case (oldNum <= 100 && oldNum > 10):
            flagsLeftDisplay.textContent = `0${oldNum - 1}`;
            break;
        case (oldNum > 0):
            flagsLeftDisplay.textContent = `00${oldNum - 1}`;
    }
    // update flagged property
    board[id].flagged = 'yes';
}
function renderUnsure(id) {
    document.getElementById(`${id}`).innerHTML = '?';
    // update flags left display
    let oldNum = parseInt(flagsLeftDisplay.textContent);
    switch (true) {
        case (oldNum >= 99):
            flagsLeftDisplay.textContent = `${oldNum + 1}`;
            break;
        case (oldNum < 99 && oldNum >= 9):
            flagsLeftDisplay.textContent = `0${oldNum + 1}`;
            break;
        case (oldNum > 0):
            flagsLeftDisplay.textContent = `00${oldNum + 1}`;
            break;
        default:
            let flagsOnBoard = 0;
            board.forEach( boardObj => {
                boardObj.flagged === 'yes' ? flagsOnBoard++ : flagsOnBoard;
            });
            flagsOnBoard === numberOfMines ? flagsLeftDisplay.textContent = `00${oldNum + 1}` : flagsOnBoard; 
    }
    // update flagged property
    board[id].flagged = 'unsure';
}
function renderRemoveMark(id) {
    document.getElementById(`${id}`).innerHTML = '';
    // update flagged property
    board[id].flagged = 'no';
}
function renderMine(id, tile) {
    // change the clicked tile object's status from hidden to revealed
    board[id].status = 'exploded';
    tile.style.backgroundColor = 'rgba(255, 0, 0, 1)';
    tile.innerHTML = '<img class="mine-img" src="images/mine-img.png" alt="mine">';
    // show location of all other hidden bombs (50% opacity)
    board.forEach( boardObj => {
        if (boardObj.type === 'mine' && boardObj.location !== id) {
            document.getElementById(`${boardObj.location}`).innerHTML = '<img class="mine-img other-bombs" src="images/mine-img.png" alt="mine">';
        }
    });
    smiley.setAttribute('src', 'images/smiley-loss.png');
    playerStatus = 'lost';
    // (do later) stop timer, change smiley, offer a play-a-new-game button
}
function renderBlank(id) {
    // initialize an array that holds blanks needing rendering
    let blanksNeedingRendering = [id];
    // initialize another array holding blanks that have already been rendered
    let blanksAlreadyRendered = [];
    // while there are blanks that need rendering, continue while loop
    while (blanksNeedingRendering.length) {
        // render first item in blanksNeedingRendering array
        let newBlank = blanksNeedingRendering[0];
// console.log(newBlank);
        // change this blank tile's status from hidden to revealed
        board[newBlank].status = 'revealed';
        renderSingleBlank(newBlank);
        // after rendering, push this blank's location to blanksAlreadyRendered array
        blanksAlreadyRendered.push(newBlank);
        // check for any blanks touching this one that need to be rendered as well
        findMoreBlanks(blanksNeedingRendering, blanksAlreadyRendered);
        // after rendering current blank and finding any renderable blanks nearby, remove current value from blanksNeedingRendering array
        blanksNeedingRendering.shift();
// console.log(blanksNeedingRendering);            
    }
// console.log(blanksAlreadyRendered);
}
function renderSingleBlank(id) {
    board[id].getValidNeighbors().forEach( location => {
        // display and change all valid touching tiles as revealed
        document.getElementById(`${location}`).style.backgroundColor = 'rgba(211, 211, 211, 1)';
        document.getElementById(`${location}`).style.border = '0.2vmin solid rgba(105, 105, 105, 1)';
        board[location].status = 'revealed';
        //  display number value in divs of all touching tiles that have a board value !== 0
        if (board[location].value !== 0) { // don't have to worry about mines as they will not be valid neighbors of a blank
            document.getElementById(`${location}`).style.color = COLORS[board[location].value];
            document.getElementById(`${location}`).innerHTML = `${board[location].value}`;
        }
    });
    return;
}
function findMoreBlanks(blanksNeedingRendering, blanksAlreadyRendered) {
    blanksNeedingRendering.forEach( blankLoc => {
        // get all valid blank neighbors of rendered tile
        // filter out any blanks that are in blanksAlreadyRendered
        let unrenderedBlankNeighbors = board[blankLoc].blankNeighbors;
        blanksAlreadyRendered.forEach( location => {
            if (unrenderedBlankNeighbors.includes(location)) {
                // remove that value from unrenderedBlankNeighbors
                // first get index of this value in our array
                let removalIdx = unrenderedBlankNeighbors.indexOf(location);
                // then remove value from our array
                unrenderedBlankNeighbors.splice(removalIdx, 1);
            }
        });
        unrenderedBlankNeighbors.forEach( blankLoc => {
            // get all valid neighbors of these blanks
            let newNeighbors = board[blankLoc].getValidNeighbors();
            let checkForHidden = newNeighbors.some( location => {
                return board[location].status === 'hidden';
            });
            // add to blanksNeedingRendering array to be rendered in the next while loop iteration
            if (
                // if this blank is next to a hidden tile
                checkForHidden && 
                // AND not already in blanksNeedingRendering (don't want to add a duplicate)
                !(blanksNeedingRendering.some(value => value === blankLoc))
                ) {
                // add this blank to the needingRendering array
                blanksNeedingRendering.push(blankLoc);
            }
        });
    });
}
function checkWinner() {
    let revealedCount = 0;
    board.forEach(boardObj => {
        if (boardObj.status === 'revealed') revealedCount++;
    });
    if (revealedCount === board.length - numberOfMines) {
        renderWinner();
    }
}
function renderWinner() {
    // find any unflagged, hidden mine tiles and put flags on them!
    let toAutoFlag = board.filter( boardObj => {
        return (boardObj.flagged !== 'yes' && boardObj.type === 'mine');
    });
    toAutoFlag.forEach( boardObj => {
        document.getElementById(`${boardObj.location}`).innerHTML = '<img class="flag-img" src="images/flag-img.png" alt="flag">';
        boardObj.flagged = 'yes';
    });
    flagsLeftDisplay.textContent = '000';
    smiley.setAttribute('src', 'images/smiley-win.png');
    // create new transparent div that has fixed position
    // create a <p> inside the div that has semitransparent black background, solid white text
    let winnerDiv = document.createElement('div');
    winnerDiv.className = 'win-message';
    winnerDiv.innerHTML = `<p>Congrats!! You have successfully cleared the minefield!</p>`;
    boardEl.appendChild(winnerDiv);
    // update winner variable
    playerStatus = 'won';
}
function newGame() {
    init(gameMode);
    tiles.forEach( tile => {
        tile.innerHTML = '';
        tile.style.backgroundColor = 'rgba(150, 150, 150, 1)';
    });
    // seeBoard();
}

// ******* SANDBOX ********

function seeBoard() {
    tiles.forEach(function(tile, idx) {
        tile.style.backgroundColor = 'rgba(211, 211, 211, 1)';
        tile.style.bborder = '0.2vmin solid rgba(105, 105, 105, 1)';
        if (board[idx].type === 'mine') {
            tile.innerHTML = '<img class="mine-img" src="images/mine-img.png" alt="mine">';
            tile.style.backgroundColor = 'rgba(255, 0, 0, 1)';
            tile.style.opacity = 0.75;
        } else {
            tile.innerHTML = `${board[idx].value}`;
            tile.style.color = COLORS[`${board[idx].value}`];
        }
    });
}
console.log(board);

// ******************


// notes: 
// -js will work with any gamemode now, but haven't added mode-button functionality
// -init will only work with default game modes 

// ******************

// TO DO - check deliverables
// add some win messaging
// settings tab (if nothing else, don't do a dropdown, just put it directly on the screen)
    // ^ could still style it to be as cool as a dropdown
        // beginner, intermediate, expert (default# of mines and custom # mines in vertical radio), grayed out number box that activates with custom, reset button that lights up when changed from current gameMode
// timer functionality
// readme
// styling
// bomb propagate animation
// stretch goal: learn how to do a dropdown with smooth animation and overlay for settings