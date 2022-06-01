var playerMap = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

var enemyMap = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

var x = randomNumber(0,9)
var y = randomNumber(0,9)

let playerField = document.querySelector(".playerField")
let enemyField = document.querySelector(".enemyField")

allBoatsCoordinates.forEach(currentBoatCoordinates => {
    setBoatCoordinates(currentBoatCoordinates, playerMap )
    x=randomNumber(0,9)
    y=randomNumber(0,9)
});

allBoatsCoordinates.forEach(currentBoatCoordinates => {
     setBoatCoordinates(currentBoatCoordinates, enemyMap)
     x=randomNumber(0,9)
     y=randomNumber(0,9)
});

renderMap(playerMap, playerField)
renderMap(enemyMap, enemyField)

//fill every ship/boat's coordinates
function setBoatCoordinates(currentBoatCoordinates, ground){  
    originalX = x
    originalY = y

    for(j=0; j<currentBoatCoordinates.length; j++){
        boatSize = currentBoatCoordinates.length
        mapSize = ground.length
        
        var currentRowOfCoordinates = currentBoatCoordinates[j]
        currentRowOfCoordinates[0]=x
        currentRowOfCoordinates[1]=y
        

        //cheching whether the ship will go out of the bounds of the map, or touch another ship.
        if(originalX + boatSize > mapSize && originalX - boatSize >= 0 && theBoatwillNotCrossAnotherBoatInXminus(originalX, originalY, boatSize, ground)){         
            x--
        }
        else if(originalY + boatSize > mapSize && originalY - boatSize >= 0 && theBoatwillNotCrossAnotherBoatInYminus(originalX, originalY, boatSize, ground)){          
            y--
        }
        else if(originalX + boatSize <= mapSize && theBoatwillNotCrossAnotherBoatInXplus(originalX, originalY, boatSize, ground)){
            x++
        }
        else if(originalY + boatSize <= mapSize && theBoatwillNotCrossAnotherBoatInYplus(originalX, originalY, boatSize, ground)){
            y++
        }
        else{                                               //if the ship could not be placed in any direction without interfering                  
            x=randomNumber(0,9)                             // with another ship new coordinates are generated and the process is repeated
            y=randomNumber(0,9)
            setBoatCoordinates(currentBoatCoordinates, ground)
        }
    }
    fillTheBoatInTheMap(currentBoatCoordinates, ground)
}

function theBoatwillNotCrossAnotherBoatInXminus(originalX, originalY, boatSize, ground){
    var bool = true
    for(i=0;i<boatSize;i++){
        if(ground[originalX-i][originalY]!=0){
            bool = false
        }
    }
    return bool
}

function theBoatwillNotCrossAnotherBoatInXplus(originalX, originalY, boatSize, ground){
    var bool = true
    for(i=0;i<boatSize;i++){
        if(ground[originalX+i][originalY]!==0)
        {
            bool=false
        }
    }
    return bool
}

function theBoatwillNotCrossAnotherBoatInYminus(originalX, originalY, boatSize, ground){
    var bool = true
    for(i=0;i<boatSize;i++){
        
        if(ground[originalX][originalY-i]!=0){
            bool = false
        }
    }
    return bool
}

function theBoatwillNotCrossAnotherBoatInYplus(originalX, originalY, boatSize, ground){
    var bool = true
    for(i=0;i<boatSize;i++){
        
        if(ground[originalX][originalY+i]!=0){
            bool=false
        }
    }
    return bool
}

//fill boat/ship's coordinates to the map array
function fillTheBoatInTheMap(currentBoat, map){  
    var boatType
    switch(currentBoat.length){
        case 2: 
            boatType = 1 //patrol boat
            break;
        case 3:
            boatType = 2 //submarine
            break;
        case 4:
            boatType = 3 //destroyer
            break;
        case 6:
            boatType = 4 //battleship
            break;
    }

        currentBoat.forEach(row =>{
            for(i = 0; i < 1; i++){
                let x = row[i]
                let y = row[i+1]
    
                map[x][y]=boatType
            }
        })
        placeEmptySpacesBetweenBoats(map)
    
}

function placeEmptySpacesBetweenBoats(map){  //so that there are no boats that are connected to each other
    for(x=0; x<map.length; x++){
        for(y=0; y<map.length; y++){

            if(map[x][y]==1||map[x][y]==2||map[x][y]==3||map[x][y]==4){
                if(x-1>=0){
                    if( map[x-1][y]==0){
                        map[x-1][y]=5
                }}
                if(x+1<=9){
                    if(map[x+1][y]==0){
                        map[x+1][y]=5
                }}
                if(y-1>=0){
                    if(map[x][y-1]==0){
                        map[x][y-1]=5
                }}
                if(y+1<=9){
                    if(map[x][y+1]==0){
                        map[x][y+1]=5
                }}
            }
        }
    }
}


//create the fields in the map
function renderMap(enemyMap, otherBox){
    for(row = 0; row<enemyMap.length; row++){
        let currentRow = document.createElement("div")
        currentRow.setAttribute("class", "row")
        otherBox.appendChild(currentRow)
        let currentFieldType
        let field

        for(column = 0; column<enemyMap.length; column++){
            element = enemyMap[row][column]
          
            if(element == 0 || element == 5){
                currentFieldType = "box emptyField"
            }
            else if(element == 1){
                currentFieldType = "box patrolBoat boat"
            }
            else if(element == 2){
                currentFieldType = "box submarine boat"
            }
            else if(element == 3){
                currentFieldType = "box destroyer boat"
            }
            else if(element == 4){
                currentFieldType = "box battleship boat"
            }
            if(this.enemyMap==enemyMap){
                field = document.createElement("button")
            }
            else{
                field = document.createElement("span")
            }
            
            field.setAttribute("class", currentFieldType)
            field.setAttribute("value", row+" "+column)
            currentRow.appendChild(field)
            field.addEventListener("click", OnButtonClick)
        }
    }
}
