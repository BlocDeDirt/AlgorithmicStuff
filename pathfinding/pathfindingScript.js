const TABLE = document.getElementById("table");
document.querySelector(".startButton").addEventListener("click", () => {
    if(needReset){
        window.alert("Besoin de réinitialiser.");
    }
    FloodPropagation();
});
document.querySelector(".resetButton").addEventListener("click", () => {
    clearTimeout(idTimeout);
    Reset();
})
const NBR_ROWS = 15;
const NBR_COLUMNS = 30;
const SPEED_PROPAGATION = 110;
const EMPTY = -1;
const WALL = -2;
const START = -3;
const END = -4;

let counter = 0;

let isMouseDown = false;
let needReset = false;
let elementChoosed = 0;
let startPosition = 0;
let endPosition = 0;
let idTimeout;

let positionToCheck = [startPosition];

let matrixTable = CreateMatrix();
CreateTable();
ChooseElement();

const CELLS = document.querySelectorAll(".cell");
endPosition = CELLS.length-1,

CELLS[startPosition].classList.add("start");
matrixTable[0][0] = START;

CELLS[endPosition].classList.add("end");
matrixTable[NBR_ROWS-1][NBR_COLUMNS-1] = END;


document.addEventListener("mousedown", () => {
    isMouseDown = true;
});

document.addEventListener("mouseup", () => {
    isMouseDown = false;
});

function Reset(){
    CELLS.forEach(element => {
        element.classList.remove("end");
        element.classList.remove("start");
        element.classList.remove("wall");
        element.classList.remove("pathSolution");
        element.classList.remove("visited");
    });
    for(let i = 0; i < NBR_ROWS; i++){
        for(let j = 0; j < NBR_COLUMNS; j++){
            matrixTable[i][j] = -1;
        }
    }
    needReset = false;
    counter = 0;
    startPosition = 0;
    positionToCheck = [startPosition];
    endPosition = CELLS.length-1;

    CELLS[startPosition].classList.add("start");
    matrixTable[0][0] = START;

    CELLS[endPosition].classList.add("end");
    matrixTable[NBR_ROWS-1][NBR_COLUMNS-1] = END;
}

function CreateTable(){
    for(let i = 0; i < NBR_ROWS; i++){
        let row = document.createElement("tr");
        for(let j = 0; j < NBR_COLUMNS; j++){
            let column = document.createElement("td");
            column.classList.add("cell");

            column.addEventListener("mouseenter", () => {
                if(isMouseDown && elementChoosed == 0){
                    if(matrixTable[i][j] == EMPTY){
                        column.classList.add("wall");
                        matrixTable[i][j] = WALL;
                    }
                    else if(matrixTable[i][j] == -2){
                        column.classList.remove("wall");
                        matrixTable[i][j] = EMPTY;
                    }
                }
            });

            column.addEventListener("click", () => {
                if(elementChoosed == 0){ //wall
                    if(matrixTable[i][j] == EMPTY){
                        column.classList.add("wall");
                        matrixTable[i][j] = WALL;
                    }
                    else if(matrixTable[i][j] == WALL){
                        column.classList.remove("wall");
                        matrixTable[i][j] = EMPTY;
                    }  
                }

                else if(elementChoosed == 1 && matrixTable[i][j] == EMPTY){ //start
                    matrixTable[Math.floor(startPosition/NBR_COLUMNS)][startPosition%NBR_COLUMNS] = EMPTY;
                    CELLS[startPosition].classList.remove("start");

                    let newPosition = i * NBR_COLUMNS + j;

                    startPosition = newPosition;
                    positionToCheck[0] = startPosition;
                    matrixTable[i][j] = START;
                    CELLS[startPosition].classList.add("start");
                }

                else if(elementChoosed == 2 && matrixTable[i][j] == EMPTY){//fin
                    matrixTable[Math.floor(endPosition/NBR_COLUMNS)][endPosition%NBR_COLUMNS] = EMPTY;
                    CELLS[endPosition].classList.remove("end");

                    let newPosition = i * NBR_COLUMNS + j;

                    endPosition = newPosition;
                    matrixTable[i][j] = END;
                    CELLS[endPosition].classList.add("end");
                }
            });
            row.appendChild(column);
        }
        TABLE.appendChild(row);
    }
}

function CreateMatrix(){
    let matrix = new Array(NBR_ROWS);
    for(let i = 0; i < NBR_ROWS; i++){
        matrix[i] = new Array(NBR_COLUMNS).fill(-1);
    }
    return matrix;
}

function ChooseElement(){
    const BUTTONS_ELEMENT = document.querySelectorAll(".element");

    for(let i = 0; i < BUTTONS_ELEMENT.length; i++){
        BUTTONS_ELEMENT[i].addEventListener("click", () => {
            BUTTONS_ELEMENT.forEach(element => {
                element.classList.remove("active");
            });
            BUTTONS_ELEMENT[i].classList.add("active");
            elementChoosed = i;
        });
    }
}

function FloodPropagation(){
    let newSurrounding = [];
    for(let i = 0; i < positionToCheck.length; i++){
        let row = Math.floor(positionToCheck[i] / NBR_COLUMNS);
        let column = positionToCheck[i] % NBR_COLUMNS;
        newSurrounding = newSurrounding.concat(CheckSurrounding(row, column, counter));
    }

    if(newSurrounding.length != 0){
        if(newSurrounding.includes(endPosition)){
            FloodComplete(true);
        }else{
            positionToCheck = [...newSurrounding];
            counter++;
            idTimeout = setTimeout(() => {
                FloodPropagation();
            }, SPEED_PROPAGATION);
        }
    }else{
        FloodComplete(false);
    }
}

function CheckSurrounding(rowToCheck, columnToCheck, counter){
    let newPositionToCheck = [];
    if(rowToCheck-1 >= 0 && (matrixTable[rowToCheck-1][columnToCheck] == EMPTY || matrixTable[rowToCheck-1][columnToCheck] == END)){
        newPositionToCheck.push((rowToCheck-1) * NBR_COLUMNS + columnToCheck);
        matrixTable[rowToCheck-1][columnToCheck] = counter;
    }

    if(columnToCheck+1 < NBR_COLUMNS && (matrixTable[rowToCheck][columnToCheck+1] == EMPTY || matrixTable[rowToCheck][columnToCheck+1] == END)){
        newPositionToCheck.push(rowToCheck * NBR_COLUMNS + (columnToCheck+1));
        matrixTable[rowToCheck][columnToCheck+1] = counter;
    }

    if(rowToCheck+1 < NBR_ROWS && (matrixTable[rowToCheck+1][columnToCheck] == EMPTY || matrixTable[rowToCheck+1][columnToCheck] == END)){
        newPositionToCheck.push((rowToCheck+1) * NBR_COLUMNS + columnToCheck);
        matrixTable[rowToCheck+1][columnToCheck] = counter;
    }

    if(columnToCheck-1 >= 0 && (matrixTable[rowToCheck][columnToCheck-1] == EMPTY || matrixTable[rowToCheck][columnToCheck-1] == END)){
        newPositionToCheck.push(rowToCheck * NBR_COLUMNS + (columnToCheck-1));
        matrixTable[rowToCheck][columnToCheck-1] = counter;
    }
    newPositionToCheck.forEach(element => {
        CELLS[element].classList.add("visited");
        //CELLS[element].innerHTML = counter.toString();
    });
    return newPositionToCheck;
}

function FloodComplete(isObjectiveFound){
    if(needReset) return;
    needReset = true;
    if(isObjectiveFound){
        TraceBackPath();
    }else{
        window.alert("Pas trouvé");
    }
}

function TraceBackPath(){
    let currentCell = endPosition;
    while(counter > 0){
        currentCell = FindPreviousNumber(counter, currentCell);
        CELLS[currentCell].classList.remove("visited");
        CELLS[currentCell].classList.add("pathSolution");
        counter--;
    }
}

function FindPreviousNumber(counter, currentCell){
    let row = Math.floor(currentCell / NBR_COLUMNS);
    let column = currentCell % NBR_COLUMNS;
    counter--;
    if(row-1 >= 0 && matrixTable[row-1][column] == counter){
        return (row-1) * NBR_COLUMNS + column;
    }

    if(column+1 < NBR_COLUMNS && matrixTable[row][column+1] == counter){
        return row * NBR_COLUMNS + (column+1);
    }

    if(row+1 < NBR_ROWS && matrixTable[row+1][column] == counter){
        return (row+1) * NBR_COLUMNS + column;
    }

    if(column-1 >= 0 && matrixTable[row][column-1] == counter){
        return row * NBR_COLUMNS + (column-1);
    }
}