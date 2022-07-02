
const SIZE_ROD = 12;
const SIZE_ARRAY = 50;
const CONTAINER = document.querySelector(".container");

let arrayRandom = new Array(SIZE_ARRAY);
for(let i = 0; i < arrayRandom.length; i++){
    let objectRod = {
        value : Math.floor(Math.random() * 100) + 1,
        rod : document.createElement("div")
    }
    objectRod.rod.classList.add("rod");
    objectRod.rod.style.height = objectRod.value.toString() + "%";
    objectRod.rod.style.left = (SIZE_ROD * i).toString() + "px";
    arrayRandom[i] = objectRod
    CONTAINER.appendChild(objectRod.rod);
}


let i = 0;
SortArray();

function SortArray(){
    let start = i;
    let smallerValueIndex = i;
    let j = start;
    
    LoopRecursion();
    function LoopRecursion(){
        if(arrayRandom[smallerValueIndex].value > arrayRandom[j].value){
            smallerValueIndex = j;
        }
        if(j < arrayRandom.length - 1){
            j++;
            LoopRecursion();
        }else{
            if(i < arrayRandom.length -1){
                let smallerRodStyle = arrayRandom[smallerValueIndex].rod.style.left;
                let startRodStyle = arrayRandom[start].rod.style.left;
            
                arrayRandom[smallerValueIndex].rod.style.left = startRodStyle;
                arrayRandom[start].rod.style.left = smallerRodStyle;
            
            
                let temporaryVar = arrayRandom[start];
                arrayRandom[start] = arrayRandom[smallerValueIndex];
                arrayRandom[smallerValueIndex] = temporaryVar
                i++;
                setTimeout(() => {
                    SortArray();
                }, 50);
            }
        }
    }
}


/*for(let i = 0; i < arrayRandom.length; i++){
    let start = i;
    let smallerValueIndex = i;
    for(let j = start; j < arrayRandom.length; j++){
        if(arrayRandom[smallerValueIndex].value > arrayRandom[j].value){
            smallerValueIndex = j;
        }
    }

    let smallerRodStyle = arrayRandom[smallerValueIndex].rod.style.left;
    let startRodStyle = arrayRandom[start].rod.style.left;

    arrayRandom[smallerValueIndex].rod.style.left = startRodStyle;
    arrayRandom[start].rod.style.left = smallerRodStyle;


    let temporaryVar = arrayRandom[start];
    arrayRandom[start] = arrayRandom[smallerValueIndex];
    arrayRandom[smallerValueIndex] = temporaryVar


}*/

console.log(arrayRandom)