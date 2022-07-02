const CONTAINER_TABLE = document.querySelector(".containerTable");
const TABLE = document.getElementById("table");
const GENERATION_COUNTER = document.querySelector(".generationCounter");


const NBR_COLUMNS = 70;
const NBR_ROWS = 50;
const SIZE_CELL = 15;

CONTAINER_TABLE.style.width = (SIZE_CELL * NBR_COLUMNS).toString()+"px";

const CELL_ON = 1;
const CELL_OFF = 0;

const TIMER_INTERVAL = 200;

let isMouseDown = false;
document.addEventListener("mousedown", () => {
    isMouseDown = true;
});

document.addEventListener("mouseup", () => {
    isMouseDown = false;
});


let matrixTable = CreateMatrix();
CreateTable();

const CELLS = document.querySelectorAll(".cell");

let cellAliveToCheck = [];
let cellKeepAlive = [];
let cellToBeBorn = [];
let cellToKill = [];
let counter = 0;

let idInterval;

document.getElementById("nextButton").addEventListener("click", () => {
    clearInterval(idInterval);
    LetItBeLife();
});

document.getElementById("playButton").addEventListener("click", () => {
    idInterval = setInterval(() => {
        LetItBeLife();
    }, TIMER_INTERVAL);
});

document.getElementById("pauseButton").addEventListener("click", () => {
    clearInterval(idInterval);
});

document.getElementById("resetButton").addEventListener("click", () => {
    Reset();
});

function Reset(){
    clearInterval(idInterval);
    counter = 0;
    GENERATION_COUNTER.innerHTML = "Génération : " + counter.toString();
    cellAliveToCheck = [];
    cellKeepAlive = [];
    cellToBeBorn = [];
    cellToKill = [];

    for(let i = 0; i < NBR_ROWS; i++){
        for(let j = 0; j < NBR_COLUMNS; j++){
            matrixTable[i][j] = CELL_OFF;
        }
    }

    for(let i = 0; i < CELLS.length; i++){
        CELLS[i].classList.remove("cellOn");
    }
}

function LetItBeLife(){
    for(let cellToCheck = 0; cellToCheck < cellAliveToCheck.length; cellToCheck++){
        let row = Math.floor(cellAliveToCheck[cellToCheck] / NBR_COLUMNS);
        let column = cellAliveToCheck[cellToCheck] % NBR_COLUMNS;
        let cellAliveAroundCell = 0;

        for(let rowOffset = -1; rowOffset <= 1; rowOffset++){
            for(let columnOffset = -1; columnOffset <= 1; columnOffset++){
                let i = row + rowOffset;
                let j = column + columnOffset;
                let around = i * NBR_COLUMNS + j;

                if(around != cellAliveToCheck[cellToCheck]){
                    if(i >= 0 && j >= 0 && i < NBR_ROWS && j < NBR_COLUMNS){
                        FindBornCell(around);
                        if(matrixTable[i][j] == CELL_ON){
                            cellAliveAroundCell++;
                        }

                    }
                }
            }
        }

        if(cellAliveAroundCell == 2 || cellAliveAroundCell == 3){
            if(cellKeepAlive.includes(cellAliveToCheck[cellToCheck]) == false){
                cellKeepAlive.push(cellAliveToCheck[cellToCheck]);
            }
        }
        else if(cellAliveAroundCell < 2 || cellAliveAroundCell > 3){
            if(cellToKill.includes(cellAliveToCheck[cellToCheck]) == false){
                cellToKill.push(cellAliveToCheck[cellToCheck]);
            }
        }

    }

    cellAliveToCheck = [...cellKeepAlive];
    cellAliveToCheck = cellAliveToCheck.concat(cellToBeBorn);

    cellKeepAlive = [];

    cellToBeBorn.forEach(cell => {
        let row = Math.floor(cell / NBR_COLUMNS);
        let column = cell % NBR_COLUMNS;

        matrixTable[row][column] = CELL_ON;
        CELLS[cell].classList.add("cellOn");
    });
    cellToBeBorn = [];

    cellToKill.forEach(cell => {
        let row = Math.floor(cell / NBR_COLUMNS);
        let column = cell % NBR_COLUMNS;

        matrixTable[row][column] = CELL_OFF;
        CELLS[cell].classList.remove("cellOn");
    });
    cellToKill = [];

    counter++;
    GENERATION_COUNTER.innerHTML = "Génération : " + counter.toString();
}

function FindBornCell(position){
    let row = Math.floor(position / NBR_COLUMNS);
    let column = position % NBR_COLUMNS;
    let cellAliveAroundCell = 0;

    for(let rowOffset = -1; rowOffset <= 1; rowOffset++){
        for(let columnOffset = -1; columnOffset <= 1; columnOffset++){
            let i = row + rowOffset;
            let j = column + columnOffset;
            let around = i * NBR_COLUMNS + j;

            if(around != position){
                if(i >= 0 && j >= 0 && i < NBR_ROWS && j < NBR_COLUMNS){
                    //console.log(CELLS[around])
                    if(matrixTable[i][j] == CELL_ON){
                        cellAliveAroundCell++;
                    }
                }
            }
        }
    }
    if(cellAliveAroundCell == 3){
        if(cellToBeBorn.includes(position) == false){
            cellToBeBorn.push(position);
        }
    }
}

function CreateMatrix(){
    let matrix = new Array(NBR_ROWS);
    for(let i = 0; i < NBR_ROWS; i++){
        matrix[i] = new Array(NBR_COLUMNS).fill(CELL_OFF);
    }
    return matrix;
}

function CreateTable(){
    for(let i = 0; i < NBR_ROWS; i++){
        let row = document.createElement("tr");
        for(let j = 0; j < NBR_COLUMNS; j++){
            let column = document.createElement("td");
            column.classList.add("cell");
            column.style.width = SIZE_CELL.toString() + "px";
            column.style.height = SIZE_CELL.toString() + "px";

            let index = i * NBR_COLUMNS + j;

            column.addEventListener("mouseenter", () => {
                if(isMouseDown){
                    if(matrixTable[i][j] == CELL_OFF){
                        matrixTable[i][j] = CELL_ON;
                        column.classList.add("cellOn");
                        cellAliveToCheck.push(index);
                    }else{
                        matrixTable[i][j] = CELL_OFF;
                        column.classList.remove("cellOn");
                        cellAliveToCheck = cellAliveToCheck.filter(x => x != index);
                    }
                }
            })

            column.addEventListener("click", () => {
                if(matrixTable[i][j] == CELL_OFF){
                    matrixTable[i][j] = CELL_ON;
                    column.classList.add("cellOn");
                    cellAliveToCheck.push(index);
                }else{
                    matrixTable[i][j] = CELL_OFF;
                    column.classList.remove("cellOn");
                    cellAliveToCheck = cellAliveToCheck.filter(x => x != index);
                }
            });
            row.appendChild(column);
        }
        TABLE.appendChild(row);
    }
}