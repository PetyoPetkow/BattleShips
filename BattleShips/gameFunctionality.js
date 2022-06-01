let rowToStrike
let elementToStrike
let origxx = xx = randomNumber(0,9)
let origyy = yy = randomNumber(0,9)
let winOrLose = document.querySelector(".winOrLose")
let restartBtn = document.querySelector('.restart')
let battleshipsLeft = document.querySelector('.battleshipsLeft')
let destroyersLeft = document.querySelector('.destroyersLeft')
let submarinesLeft = document.querySelector('.submarinesLeft')
let patrolBoatsLeft = document.querySelector('.patrolBoatsLeft')
let clicks = document.querySelector('.numberOfClicks')

restartBtn.addEventListener("click", restart)

let state=0   //0-random

const battleshipSize = 6
const destroyerSize = 4
const submarineSize = 3
const patrolBoatSize = 2

let numberOfBattleships = 1
let numberOfDestroyers = 2
let numberOfSubmarines = 2
let numberOfPatrolBoats = 2

let numberOfAllEnemyBoats = 
numberOfBattleships + 
numberOfDestroyers + 
numberOfSubmarines + 
numberOfPatrolBoats

let playerBoatTiles = 
numberOfBattleships * battleshipSize + 
numberOfDestroyers * destroyerSize + 
numberOfSubmarines * submarineSize + 
numberOfPatrolBoats * patrolBoatSize

let oldNumberOfClicks = 0
let numberOfClicks = 0

let lastAccurateShotCoordinates={x:0, y:0}

battleshipsLeft.innerHTML = numberOfBattleships
destroyersLeft.innerHTML = numberOfDestroyers
submarinesLeft.innerHTML = numberOfSubmarines
patrolBoatsLeft.innerHTML = numberOfPatrolBoats

let allBoatsCoordinates = [
battleshipCoordinates = makeArray(2, battleshipSize),
destroyerFirstCoordinates = makeArray(2, destroyerSize),
destroyerSecondCoordinates = makeArray(2, destroyerSize),
submarineFirstCoordinates = makeArray(2, submarineSize),
submarineSecondCoordinates = makeArray(2, submarineSize),
patrolBoatFirstCoordinates = makeArray(2, patrolBoatSize),
patrolBoatSecondCoordinates = makeArray(2, patrolBoatSize),
]



function OnButtonClick(e){
    if(e.target.value){
        
        let text = e.target.classList.value

        xy = e.target.value.toString().split(" ")  // Getting the coordinates of the clicked button e.g.: 3 5
        x=xy[0]                                    // when created every button gets a value of his "x" and "y" coordinates
        y=xy[1]
        enemyMap[x][y]=9

        //checking if the shot hit a boat
        if(["box destroyer boat", "box battleship boat", "box submarine boat", "box patrolBoat boat"].indexOf(text) > -1){
            numberOfClicks++
            e.target.setAttribute("class", "shot box")
            
            //Going trough all enemy boats to check if their coordinates have been shot
            allBoatsCoordinates.forEach(concreteBoatCoordinates => {
                boatLength=concreteBoatCoordinates.length

                concreteBoatCoordinates.forEach(rowOfCoordinates => {
                    x=rowOfCoordinates[0]
                    y=rowOfCoordinates[1]

                    if(enemyMap[x][y]==9){
                        boatLength--
                    }
                });

                //Remove the eliminated boat (if there is one) from the ".top" element
                if(boatLength==0){
                    switch (concreteBoatCoordinates.length){
                        case battleshipSize:
                            battleshipsLeft.innerHTML--
                            break;
                        case destroyerSize:
                            destroyersLeft.innerHTML--
                            break;
                        case submarineSize:
                            submarinesLeft.innerHTML--
                            break;
                        case patrolBoatSize:
                            patrolBoatsLeft.innerHTML--
                            break;
                    }

                    //if a ship has been sunk, its coordinates are removed from the array of all boats
                    var index = allBoatsCoordinates.indexOf(concreteBoatCoordinates)
                    allBoatsCoordinates.splice(index,1)
                    numberOfAllEnemyBoats--
                    if(numberOfAllEnemyBoats<=0){
                        winOrLose.innerHTML="You won in "+numberOfClicks+" clicks!"
                        restartBtn.style.display = "block"
                    }
                }
            }); 
        }
        else if(text=="box emptyField"){
            numberOfClicks++
            e.target.setAttribute("class", "box")
        }

        e.target.innerHTML = "O"
        clicks.innerHTML = numberOfClicks

        setTimeout(movesDetector,200)
    }
}


function enemyStrike(){
    var n = xx+1                                                //nth-child(1) gives the row at position 0
    rowToStrike = document.querySelector('.playerField div:nth-child(' + n + ')') 
    elementToStrike = rowToStrike.children[yy]
    
    var stateOfTheShot
    if(elementToStrike.classList.contains("boat")){stateOfTheShot="hit"}
    if(elementToStrike.classList.contains("emptyField")){stateOfTheShot="miss"}
    if(elementToStrike.innerHTML=="O"){stateOfTheShot="marked"}

    switch (stateOfTheShot){
        case "hit":
            lastAccurateShotCoordinates.x=xx                    //<-------. Used later to find the most probable field to be a ship
            lastAccurateShotCoordinates.y=yy                    //<-------'
            onHit()
            break;
        case "miss":
            onMiss()
            break;
        case "marked":
            onAlreadyShotField()
            break;
    }

    if(playerBoatTiles<=0){
        winOrLose.innerHTML="You lost!"
        restartBtn.style.display = "block"
    }
    
}

function onHit(){
    elementToStrike.setAttribute("class", "shot box")
    elementToStrike.innerHTML="O"
    playerBoatTiles--

    if(xx<9 && state == 0 || xx<9 && state == "going down"){
        xx++
        state = "going down"
    }
    else if(state == "going down" && xx==9){
        xx=origxx
        state = "going up"
    }
    else if(state == 0 && xx==9 && yy<9){
        yy=origyy
        state = "going right"
    }
    else if(state == "going right" && yy<9){
        yy++
    }
    else if(state == "going right" && yy==9){
        yy=origyy
        state = "going left"
    }
    if(state == "going left" && yy>0){
        yy--
    }
    if(state == "going up" && xx>0){
        xx--
    }
}

function onMiss(){
    elementToStrike.setAttribute("class", "miss box")
    elementToStrike.innerHTML="O"

    if(state == "going down" && yy<9){
        xx=lastAccurateShotCoordinates.x 
        yy=origyy+1
        state = "going right"
    }
    else if(state == "going down" && yy==9){
        state="going left"
        xx=origxx
        yy=origyy-1
    }
    else if(state == "going right" && origyy>0){
        yy=origyy-1
        state="going left"
    }
    else if(state == "going right" && origyy==0 && origxx>0){
        state="going up"
        xx=origxx-1
        yy=origyy
    }
    else if(state == "going left" && yy<9 && origxx>0){
        yy++
        xx=origxx-1
        state="going up"
    }    
    else{
        state = 0
        origxx = xx = randomNumber(0,9)
        origyy = yy = randomNumber(0,9) 
    }
}

function onAlreadyShotField(){
    if(state == "going down" && yy<9){
        state = "going right"
        xx--
        yy++
        enemyStrike()
    }
    else if(state == "going down" && yy==9){
        state = "going left"
        yy=origyy-1
        xx=origxx
        enemyStrike()
    }
    else if(state == "going right" && origyy-1>=0){
        state="going left"
        yy=origyy-1
        enemyStrike()
    }
    else if(state == "going right" && yy-2<0){
        state="going up"
        xx=origxx-1
        yy=origyy
        enemyStrike()
    }
     else if(state == "going left" && origxx-1>0){
        state = "going up"
        yy=origyy
        xx=origxx-1
        enemyStrike()
    }
    else{
        state=0
        origxx=xx = randomNumber(0,9)
        origyy=yy = randomNumber(0,9)
        
        enemyStrike()
    }
}

/////////////////////////////////////////////////////////////////////
function movesDetector(){
    if(numberOfClicks>oldNumberOfClicks){
        enemyStrike()
    }
    oldNumberOfClicks=numberOfClicks
}

function makeArray(w, h) {
    var val = 0
    var arr = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}


function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
} 

function restart(){
    window.location.reload();
}