let gameMode = 'quick' // gameMode global variable. This will determine further functions.
const testButton = document.getElementById('testButton')

// The Ship function below creates the ship object. It is very simple: Each ship has a length and a counter. 
// The ship length === ship health. Hit a ship once, the counter will go up by 1. If counter === health, ship is sunk.



function Ship(length, shipCoordinates) {
    const getLength = () => length
    const getCounter = () => counter
    let counter = 0
    let sunkStatus = false
    const getShipCoordinates = () => shipCoordinates

    const isSunkCheck = () => {
        if(getCounter() === getLength()) {
            return true
        }
    }

    return{
        set counter(number) {
            counter = number
        },

        set isSunk(trueOrFalse) {
            if(getCounter() === getLength()){
                sunkStatus = trueOrFalse
                console.log('this ship just sank!')
            }
        },
        isSunkCheck,
        getLength,
        getCounter,
        getShipCoordinates
    }
}

// this gameboard object is where the action takes place. The ship coordinates are determined here and the incoming attacks are parsed to see if there is a hit or a miss.
// the hits and misses are registered in their respective arrays. There is also a method to check if all ships are destroyed, which would lead to the end of the game.
function GameBoard() {
    const getListOfShips = () => listOfShips
    const listOfShips = [ // 10 ships in total with pre-determined coordinates for the enemy
        Ship(1, [[0,0]]),
        Ship(1, [[1, 1]]),
        Ship(1, [[0,1]]),
        Ship(1, [[1,5]]),
        Ship(2, [[1,7], [1,8]]),
        Ship(2, [[2,1], [2,2]]),
        Ship(2, [[3,0], [3,1]]),
        Ship(3, [[4,0], [4,1], [4,2]]),
        Ship(3, [[6,0], [7,0], [8,0]]),
        Ship(4, [[7,1], [7,2], [7,3], [7,4]])
    ]

    const getListOfShipsInArray = () => listOfShipsInArray
    const listOfShipsInArray = [
        [[0,0]],
        [[1, 1]],
        [[0,1]],
        [[1,5]],
        [[1,7], [1,8]],
        [[2,1], [2,2]],
        [[3,0], [3,1]],
        [[4,0], [4,1], [4,2]],
        [[6,0], [7,0], [8,0]],
        [[7,1], [7,2], [7,3], [7,4]]
    ]
    
    const getHitAndMissedMarks = () => [hitMarks, missedMarks]
    const getHitAndMissedOneArray = () => hitAndMissedOneArray;
    const getHitMarks = () => hitMarks
    const getMissedMarks = () => [missedMarks]
    const hitMarks = [];
    const missedMarks = [];
    const hitAndMissedOneArray = []

    const receiveAttack = hitCoordinates => { // the hitcoordinates are entered as an argument here, and then each coordinate with ships on it is being checked. Logically, a coordinate with a ship === hit. hit === counter (damage) +1
        loop1:
        for(const ship in listOfShips) {
            let nestedArray = listOfShips[ship].getShipCoordinates()
            loop2:
            for(const array in nestedArray) {
                if(_.isEqual(nestedArray[array], hitCoordinates)) {
                    listOfShips[ship].counter = listOfShips[ship].getCounter() + 1
                    listOfShips[ship].isSunk = true

                    hitMarks.push(hitCoordinates)
                    break loop1
                }
            }
        }

        if(!_.isEqual(hitMarks[hitMarks.length - 1], hitCoordinates)) { // this condition checks if the hitcoordinates are present in the hitmarkArray, to avoid double registering hits.
            missedMarks.push(hitCoordinates)
        }
        hitAndMissedOneArray.push(hitCoordinates)
    }

    const areAllShipsSunk = () => {
        for(const ship in listOfShips) {
            if(listOfShips[ship].isSunkCheck() != true) {
                return false
            }
        }
        return true
    }

    return {
        receiveAttack,
        getListOfShips,
        getHitAndMissedMarks,
        getHitMarks,
        getMissedMarks,
        getHitAndMissedOneArray,
        areAllShipsSunk,
        getListOfShipsInArray,
    }
}

// This function gives the USER AND the COMPUTER two powers: 1. have their own gameboard, 2. set an enemy.
// Logically, the enemy of the USER will be the COMPUTER, vice versa. 
function player() {
    let target;
    let playerGameBoard = GameBoard()
    const getGameBoard = () => playerGameBoard

    const attacks = attackCoordinations => {
        target.getGameBoard().receiveAttack(attackCoordinations)
    }

    return {
        set enemy(enemy) {
            target = enemy
        },

        getGameBoard,
        attacks
    }
}

//player1 is by default USER
//player2 is by default Computer

let player1 = player()
let player2 = player()
player1.enemy = player2
player2.enemy = player1
let newCoordinatesSet = false

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  // This is where the computer moves are generated, which are initially random but... if the computer hits a ship on the gameboard, 
  // It will get to hit another ship (per the rules of Battleship) and this time, the attack move is always on the left, right, up or down coordinates of the ship
  // This makes sense because if the ship is for example 2 lengths long, the next possible hit coordinates are always nearby. This is how a human would play.
function computerAttackMove() {
    let xy = [1, getRandomInt(10), getRandomInt(10)]


    let repetitionArray = player1.getGameBoard().getHitAndMissedOneArray();
    for(const i in repetitionArray) {
        if( _.isEqual(repetitionArray[i], xy)) {
            return computerAttackMove() // check if the computer move is already made in the past (hit or miss), if yes, generate another move untill the hit is 'unique' 
        }
    }
    return xy
}

function targetedMove() { // this is where the second hit for the computer is generated if the initial hit (which is random) was a success. 
    let lastHitCoordinates = player1.getGameBoard().getHitMarks()[player1.getGameBoard().getHitMarks().length - 1]
    let left = lastHitCoordinates.slice(); // get the left, right, up and down coordinates relative to the previous hit.
    left[2] -= 1
    let right = lastHitCoordinates.slice()
    right[2] += 1
    let up = lastHitCoordinates.slice()
    up[1] -= 1
    let down = lastHitCoordinates.slice()
    down[1] += 1

    // this new hit coordinate needs to be valid. Three conditions are in play here:
    // 1. new hit coordinate is not out of bounds
    // 2. new hit coordinate is not a previous miss
    // 3. new hit coordinate is not a previous hit
    let checkConditionsOfMove = function(move, index) { 
        if(move[index] < 0 || move[index] > 9) {
            return false
        }
        for(const i in player1.getGameBoard().getMissedMarks()) {
            if(  _.isEqual(move, player1.getGameBoard().getMissedMarks()[i])) {
                return false
            }
        }
        for(const i in player1.getGameBoard().getHitMarks()) {
            if(  _.isEqual(move, player1.getGameBoard().getHitMarks()[i])) {
                return false
            }
        }

        return move
    }

    left = checkConditionsOfMove(left, 2)
    right = checkConditionsOfMove(right, 2)
    up = checkConditionsOfMove(up, 1)
    down = checkConditionsOfMove(down, 1)

    return {
        left,
        right,
        up,
        down
    }
}




// Creating the XY locations for the gameboard with a loop


const xyLayout = document.getElementById('xyLayoutID') // USER gameboard
const xyLayout2 = document.getElementById('xyLayoutID2') // Computer gameboard



function getAllCoordinates () { // this function does 2 things: it renders all the divs in html AND returns an array with all possible coordinates. This function is called in the next function: game().
    let xCor = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let yCor = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let array = []
    for(const i in xCor) {
        for(const j in yCor) {
            array.push([xCor[i], yCor[j]])
            let div = document.createElement('div')
            let div2 = document.createElement('div')
            div.id =  [1, xCor[i], yCor[j]]
            div.className = 'divClass'
            div2.id = [2, xCor[i], yCor[j]]
            div2.className = 'divClass2'
            xyLayout.appendChild(div)
            xyLayout2.appendChild(div2)
        }
    }
    return array
}


function game() {

    let player1ShipCoordinates = []
    let player2ShipCoordinates = []
    let allCoordinates = getAllCoordinates()
    for(let i = 0; i < 10; i++) {
        player1ShipCoordinates.push(player1.getGameBoard().getListOfShips()[i].getShipCoordinates());
        player2ShipCoordinates.push(player2.getGameBoard().getListOfShips()[i].getShipCoordinates());
    }

    let renderingBoard = function () {
        for(const x in allCoordinates) { // rendering board 1 (user) empty spaces (everything is by default empty)
            allCoordinates[x].unshift(1)    
        }
        for(const x in allCoordinates) { // rendering board 2 (computer). board 2 tiles are hidden for the user. 
            allCoordinates[x].splice(0, 1, 2)

        }

        for(const a in player1ShipCoordinates) { // rendering board 1 ships if user plays a 'quick game' which doesn't grant him the option to place his ships.(I basically override the empty spaces with ships)
            for(const b in player1ShipCoordinates[a]) {
                if(newCoordinatesSet === false) {player1ShipCoordinates[a][b].unshift(1)}
                document.getElementById(player1ShipCoordinates[a][b]).textContent = ''
                document.getElementById(player1ShipCoordinates[a][b]).style.border = '3px solid red'
                //document.getElementById(player1ShipCoordinates[a][b]).style.backgroundColor = 'red'
            }
        } 
        for(const a in player2ShipCoordinates) { // rendering board 2 ships (I basically override the empty spaces with ships)
            for(const b in player2ShipCoordinates[a]) {
                if(newCoordinatesSet === false) {player2ShipCoordinates[a][b].unshift(2)}
                /*document.getElementById(player2ShipCoordinates[a][b]).textContent = 'X'
                document.getElementById(player2ShipCoordinates[a][b]).style.backgroundColor = 'green'*/
            }
    }
    }
    renderingBoard()

}
game()

function myFunction() { // there is a 3 second delay for each computer move to make the game more fun and add some more 'weight' to it.
    console.log('Start');
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('End');
        resolve();
      }, Math.random() * 3500);
    });
  }

  async function delayComputerMove() { // during the delay, the user can't click on the opponents gameboard. I achieve this by setting class name to 'divClassUnclickable' and add a pointer-events:none in CSS.
    console.log('Before delay');
    divClasses.forEach(divClass => {
        divClass.className = 'divClassUnclickable'
    })
    await myFunction(); // Wait for myFunction() to complete
    console.log('After delay');
  }

let divClasses = document.querySelectorAll('.divClass2')
let commander1 = document.getElementsByClassName('commander1')[0]
let commander2 = document.getElementsByClassName('commander2')[0]

// this code creates an addeventlistener to all the tiles of the computer. So if the user clicks (read: attacks) on the computers board, the functions to register a hit will be called and
// the functions to make the computer attack will be called.
// note: add setTimeOut here.
divClasses.forEach(divClass => {
    divClass.addEventListener('click',  function playerVScomputer() {
        if(divClass != 'divClassUnclickable') {

        
        let attackCoordinates = JSON.parse('[' + divClass.id +']')
        player1.attacks(attackCoordinates)
        console.log(divClass.id)

        if(player2.getGameBoard().getHitAndMissedMarks()[1].includes(attackCoordinates)) { // grant the computer the option to hit IF the user misses. If user hits, he gets to attack one more time
            document.getElementById(divClass.id).textContent = ''
            document.getElementById(divClass.id).style.backgroundColor = 'red' // if user misses, the tiles turn red

            delayComputerMove().then(() => {
                divClasses.forEach(divClass => {
                    divClass.className = 'divClass2'
                })


            let computerMoveIsHit = true
            let doubleTap = false
             while(computerMoveIsHit === true) {
                let fixComputerAttackMove;
                if(doubleTap === false) {
                    fixComputerAttackMove = computerAttackMove(); // this makes a random play
                } else { // this checks if left, right, up and down are okay to attack, if not, it will make a random move.
                    if(targetedMove().up != false) {
                        fixComputerAttackMove = targetedMove().up
                    } else if (targetedMove().down != false) {
                        fixComputerAttackMove = targetedMove().down
                    } else if (targetedMove().up != false) {
                        fixComputerAttackMove = targetedMove().left
                    } else if (targetedMove().down != false) {
                        fixComputerAttackMove = targetedMove().right
                    } else {
                        fixComputerAttackMove = computerAttackMove()
                    }
                }
                
                player2.attacks(fixComputerAttackMove);
                console.log(fixComputerAttackMove)
                updateShipScoreboard()

                if( _.isEqual(player1.getGameBoard().getHitMarks()[player1.getGameBoard().getHitMarks().length - 1], fixComputerAttackMove) ) { // check if computer move is a hit, if so, make doubleTap 'true'. Now Computer gets to make another move.
                    document.getElementById(`${fixComputerAttackMove[0]},${fixComputerAttackMove[1]},${fixComputerAttackMove[2]}`).style.backgroundColor = 'green'
                    document.getElementById(`${fixComputerAttackMove[0]},${fixComputerAttackMove[1]},${fixComputerAttackMove[2]}`).style.border = 'none'
                    let lengthOfShipThatGotHit = checkLengthOfShipThatIsStruck(player1,fixComputerAttackMove, 'player1')
                    if(gameMode === 'quick') fixComputerAttackMove.unshift(1)
                    document.getElementById(`${fixComputerAttackMove[0]},${fixComputerAttackMove[1]},${fixComputerAttackMove[2]}`).innerHTML   = lengthOfShipThatGotHit
                    computerMoveIsHit = true
                    doubleTap = true
                } else {
                    document.getElementById(`${fixComputerAttackMove[0]},${fixComputerAttackMove[1]},${fixComputerAttackMove[2]}`).style.backgroundColor = 'red'
                    computerMoveIsHit = false
                    doubleTap = false
                }

            }

        })
        } else {
            let lengthOfShipThatGotHit = checkLengthOfShipThatIsStruck(player2,attackCoordinates, 'player2')
            document.getElementById(divClass.id).textContent = lengthOfShipThatGotHit
            document.getElementById(divClass.id).style.backgroundColor = 'green' // this means that the users attack was a hit, so it does nothing, which allows the user to make one more attack.
        }

        if(player1.getGameBoard().areAllShipsSunk()) { // before allowing the user to make another attack, check if any of the players shipbase is completely sunk. If so, end game and determine winner.
            commander1.remove() // this removes the header of the gameboard to make space for the win/loss notification
            commander2.remove()
            document.getElementById('decisionOne').textContent = 'You lost!';
            document.getElementById('decisionOne').style.color = 'red';
            document.getElementById('decisionTwo').textContent = 'Computer won!';
        }
        if(player2.getGameBoard().areAllShipsSunk()) {
            commander1.remove()
            commander2.remove()
            document.getElementById('decisionOne').textContent = 'You won!';
            document.getElementById('decisionTwo').textContent = 'Computer lost!';
            document.getElementById('decisionTwo').style.color = 'red';
        }
        updateShipScoreboard()
    }},{once: true})
})

function checkLengthOfShipThatIsStruck(whoGotHit, hitCoordinates, whoGotHitStringified) { // if a ship is struck, this function returns what the length of that ship is so the user can hit any tile that is next to it. This makes the game more fun and less random.
    const shipList = whoGotHit.getGameBoard().getListOfShipsInArray()
    const shipListPlayer1 =  player1.getGameBoard().getListOfShipsInArray()
    const shipListPlayer2 = player2.getGameBoard().getListOfShipsInArray()
    console.log(shipListPlayer1, shipListPlayer2)
    console.log(hitCoordinates)
    if(gameMode === 'quick') {
        hitCoordinates.shift()
    } else if (gameMode === 'custom' && whoGotHitStringified === 'player2') {
        hitCoordinates.shift()
    }
    console.log(shipList)
    console.log(hitCoordinates)
    function CheckIfCoordinateIsPresentInArray(array, hit) {
        for(let i in array) {
          if(_.isEqual(array[i], hit)) return true
        }
      }

      const removeOuterArray = shipList.map((ship) => ship) // this is a neccessary step to map through the shiplist because the shiplist is a nested array
      let lengthOfShip;
      console.log(removeOuterArray)
      const returnLengthOfShip =   removeOuterArray.map((ship, index) => {
        if(CheckIfCoordinateIsPresentInArray(ship, hitCoordinates)) {
            lengthOfShip = removeOuterArray[index].length
        }
      })
      console.log(lengthOfShip)
      return lengthOfShip

}

function updateShipScoreboard () {
    let shipsPlayer1 = player1.getGameBoard().getListOfShipsInArray()
    let hitsPlayer1 = player1.getGameBoard().getHitMarks()
    let shipsPlayer2 = player2.getGameBoard().getListOfShipsInArray()
    let hitsPlayer2 = player2.getGameBoard().getHitMarks()

    let listOfDestroyedShipsPlayer1 = [] // the code below will fill this array with all the destroyed ships so I can use this to manipulate the DOM and update destroyed ships.
    shipsPlayer1.map((shipArray, index) => { // I am mapping through the ship list. Each ship has an array with coordinates in it. The coordinates are also in an array form. I want to check if all the coordinates in that array are in the hit mark list.
        let shipWasDestroyed = true
        for(let i in shipArray) { //   This is where I seperate the array of coordinates per ship. for example shipArray[0] gets the first coordinates of the coordinates array. 
                let coordinateWasInHitMark = false
                for(let j in hitsPlayer1) { // continuing on the example above: I want to check if that shipArray[0] is in the hit mark list. 
                    console.log(hitsPlayer1[j])
                    if( _.isEqual(hitsPlayer1[j].slice(1), shipArray[i]) && gameMode === 'quick') {
                        coordinateWasInHitMark = true
                        break
                    } else if ( _.isEqual(hitsPlayer1[j], shipArray[i])) {
                        coordinateWasInHitMark = true
                        break
                    }
                }
            if(coordinateWasInHitMark === false) {
                shipWasDestroyed = false
                break
            }
        }
        if(shipWasDestroyed) {
            listOfDestroyedShipsPlayer1.push(index)
        }
    })

    let listOfDestroyedShipsPlayer2 = [] 
    shipsPlayer2.map((shipArray, index) => {
        let shipWasDestroyed = true
        for(let i in shipArray) { 
                let coordinateWasInHitMark = false
                for(let j in hitsPlayer2) { 
                    if( _.isEqual(hitsPlayer2[j], shipArray[i])) {
                        coordinateWasInHitMark = true
                        break
                    }
                }
            if(coordinateWasInHitMark === false) {
                shipWasDestroyed = false
                break
            }
        }
        if(shipWasDestroyed) {
            listOfDestroyedShipsPlayer2.push(index)
        }
    })

    for(let i in listOfDestroyedShipsPlayer1) {
        document.getElementsByClassName("shipDiv1")[listOfDestroyedShipsPlayer1[i]].style.backgroundColor = 'red'
    }

    for(let i in listOfDestroyedShipsPlayer2) {
        document.getElementsByClassName("shipDiv2")[listOfDestroyedShipsPlayer2[i]].style.backgroundColor = 'red'
    }
    
}


// function for ship placement when user select custom start -----------------------------------------------------------------------------------------------------
const header = document.getElementById('header')
const quickStart = document.getElementById('quickStart')
const shortTutorial = document.getElementById('shortTutorial')
const customStart = document.getElementById('customStart')
const tiles = document.getElementsByClassName('divClass')
const board1 = document.getElementById('sideOne')
const board2 = document.getElementById('sideTwo')

const shipPlacementExit = document.createElement('button')
shipPlacementExit.textContent = 'exit to main menu'

shipPlacementExit.addEventListener('click', () => {
    location.reload()
})

quickStart.addEventListener('click', () => {
    gameMode = 'quick'
    document.getElementById('gameboardOuter').style.display = 'flex'
    board1.style.visibility = 'visible';
    board2.style.visibility = 'visible'
    quickStart.remove()
    customStart.remove()
    shortTutorial.remove()
    header.appendChild(shipPlacementExit)

})

shortTutorial.addEventListener('click', function shipPlacement() {
    quickStart.hidden = true
    shortTutorial.hidden = true
    customStart.hidden = true

    const explanationText = document.createElement('p')
    const nextButton = document.createElement('button')
    nextButton.id = 'nextButton'
    nextButton.textContent = 'Next'
    explanationText.textContent = 'This is a turn-based game: each player has a gameboard with 100 tiles on it. Both players get 10 ships placed on their gameboard. The ships have varying sizes, from 1 tile to 4 tiles.'
    header.appendChild(explanationText)
    header.appendChild(nextButton)

    document.getElementById('nextButton').addEventListener('click', () => {
    explanationText.textContent = `You can sink a ship by clicking on all its tiles. If you hit a ship, it will show a number of the total ship size. For example: you hit a ship and see a '2'. This means that there is a remaining tile in the vicinity. Click on this tile to finish the ship off `
    nextButton.id = 'nextButton2'

    document.getElementById('nextButton2').addEventListener('click', () => {
        explanationText.textContent = 'Hitting a ship grants you 1 more turn to attack. Destroy your enemies fleet before you are destroyed yourself.'
        nextButton.id = 'nextButton3'



            document.getElementById('nextButton3').addEventListener('click', () => {
                explanationText.remove()
                nextButton.remove()
                quickStart.hidden = false
                shortTutorial.hidden = false
                customStart.hidden = false

            })
        })
    })
    })




customStart.addEventListener('click', () => {
    gameMode = 'custom'
    quickStart.hidden = true;
    shortTutorial.hidden = true;
    customStart.hidden = true;
    document.getElementById('gameboardOuter').style.display = 'flex'
    board1.style.visibility = 'visible'
    board2.style.visibility = 'hidden'

    const shipPlacementDiv = document.createElement('div');
    const shipPlacementText = document.createElement('p');
    shipPlacementText.id = 'shipPlacement'
    shipPlacementText.textContent = 'Click on the board to place your ships. Be aware: ships placed too close to eachother are prone to multi-hits, as the computer targets the proximity of previously hit tiles  '    


    header.appendChild(shipPlacementDiv)
    header.appendChild(shipPlacementExit)
    shipPlacementDiv.append(shipPlacementText)
    let shipOrder = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 0]


        for(let i = 0; i < tiles.length; i++) {
            tiles[i].removeAttribute('style')
            tiles[i].textContent = ''

            tiles[i].addEventListener('mouseover', () => {
                mouseoverFunction(tiles[i].id, shipOrder[0]) 
            })

            tiles[i].addEventListener('mouseout', () => {
                mouseoutFunction(tiles[i].id, shipOrder[0]) 
            })

            tiles[i].addEventListener('click', function clickEvent() {
                mouseclickFunction(tiles[i].id, shipOrder[0])
                if(clickIsSucces === true){
                    shipOrder.splice(0, 1)
                } 
                clickIsSucces = false
                if(array.length === 20) {
                    applyNewShipPlacement()
                    game()
                    deleteOldBoard()
                }
                console.log(array)
            }, {once: true})
    }
})


let mouseoverFunction = function(id, length) {
    let idInArray = id.split(',').map(Number)
    let decrementX1 = idInArray.slice()
    let decrementX2 = idInArray.slice()
    let decrementX3 = idInArray.slice()
    decrementX1[1] -= 1
    decrementX2[1] -= 2
    decrementX3[1] -= 3
    if(length >= 1) {
        document.getElementById(id).style.backgroundColor = 'red'
    } if(length >= 2 && decrementX1[1] >= 0) {
          document.getElementById(decrementX1.toString()).style.backgroundColor = 'red'
    } if(length >= 3 && decrementX2[1] >= 0) {
        document.getElementById(decrementX2.toString()).style.backgroundColor = 'red'
    }     if(length >= 4 && decrementX3[1] >= 0) {
        document.getElementById(decrementX3.toString()).style.backgroundColor = 'red'
    }
}

let mouseoutFunction = function(id, length) {
    let idInArray = id.split(',').map(Number)
    let decrementX1 = idInArray.slice()
    let decrementX2 = idInArray.slice()
    let decrementX3 = idInArray.slice()
    decrementX1[1] -= 1
    decrementX2[1] -= 2
    decrementX3[1] -= 3
    if(length >= 1) {
        document.getElementById(id).style.backgroundColor = 'blue'
    } if(length >= 2 && decrementX1[1] >= 0) {
          document.getElementById(decrementX1.toString()).style.backgroundColor = 'blue'
    } if(length >= 3 && decrementX2[1] >= 0) {
        document.getElementById(decrementX2.toString()).style.backgroundColor = 'blue'
    }     if(length >= 4 && decrementX3[1] >= 0) {
        document.getElementById(decrementX3.toString()).style.backgroundColor = 'blue'
    }
}

let clickIsSucces = false

let mouseclickFunction = function(id, length) { 
    let idInArray = id.split(',').map(Number)
    let decrementX1 = idInArray.slice()
    let decrementX2 = idInArray.slice()
    let decrementX3 = idInArray.slice()
    decrementX1[1] -= 1
    decrementX2[1] -= 2
    decrementX3[1] -= 3

    if(length === 1) {
        document.getElementById(id).style.border = '3px solid red';

    } if (length === 2 && decrementX1[1] >= 0 && checkForRepetiton(decrementX1)) {
        document.getElementById(id).style.border = '3px solid red';

        document.getElementById(decrementX1.toString()).style.border = '3px solid red';
        document.getElementById(decrementX1.toString()).replaceWith(document.getElementById(decrementX1.toString()).cloneNode(true));

    } if (length === 3 && decrementX2[1] >= 0 && checkForRepetiton(decrementX1) && checkForRepetiton(decrementX2)) {
        document.getElementById(id).style.border = '3px solid red';

        document.getElementById(decrementX1.toString()).style.border = '3px solid red';
        document.getElementById(decrementX1.toString()).replaceWith(document.getElementById(decrementX1.toString()).cloneNode(true));

        document.getElementById(decrementX2.toString()).style.border = '3px solid red';
        document.getElementById(decrementX2.toString()).replaceWith(document.getElementById(decrementX2.toString()).cloneNode(true));

    } if (length === 4 && decrementX3[1] >= 0 && checkForRepetiton(decrementX1) && checkForRepetiton(decrementX2) && checkForRepetiton(decrementX3)) {
        document.getElementById(id).style.border = '3px solid red';

        document.getElementById(decrementX1.toString()).style.border = '3px solid red';
        document.getElementById(decrementX1.toString()).replaceWith(document.getElementById(decrementX1.toString()).cloneNode(true));

        document.getElementById(decrementX2.toString()).style.border = '3px solid red';
        document.getElementById(decrementX2.toString()).replaceWith(document.getElementById(decrementX2.toString()).cloneNode(true));

        document.getElementById(decrementX3.toString()).style.border = '3px solid red';
        document.getElementById(decrementX3.toString()).replaceWith(document.getElementById(decrementX3.toString()).cloneNode(true));

    }

    if(length === 1) {
        array.push(idInArray)
        clickIsSucces = true
    } else if(length === 2 && decrementX1[1] >= 0 && checkForRepetiton(decrementX1)) {
        array.push(idInArray, decrementX1)
        clickIsSucces = true
    } else if (length === 3 && decrementX2[1] >= 0 && checkForRepetiton(decrementX1) && checkForRepetiton(decrementX2)) {
        array.push(idInArray, decrementX1, decrementX2)
        clickIsSucces = true
    } else if (length === 4 && decrementX3[1] >= 0 && checkForRepetiton(decrementX1) && checkForRepetiton(decrementX2) && checkForRepetiton(decrementX3)) {
        console.log(id, decrementX1)
        array.push(idInArray, decrementX1, decrementX2, decrementX3)
        colorCorrection.push(id, decrementX1.toString(), decrementX2.toString(), decrementX3.toString())
        clickIsSucces = true
    }
}


let array = []
let colorCorrection = []

let checkForRepetiton = function (id) {
    for(const i in array) {
        if(_.isEqual(array[i], id) === true) {
            return false
        } 
    }
    return true
}


let applyNewShipPlacement = function() {
    player1.getGameBoard().getListOfShips()[0] = Ship(1, [array[0]])
    player1.getGameBoard().getListOfShips()[1] = Ship(1, [array[1]])
    player1.getGameBoard().getListOfShips()[2] = Ship(1, [array[2]])
    player1.getGameBoard().getListOfShips()[3] = Ship(1, [array[3]])

    player1.getGameBoard().getListOfShips()[4] = Ship(2, [array[4], array[5]])
    player1.getGameBoard().getListOfShips()[5] = Ship(2, [array[6], array[7]])
    player1.getGameBoard().getListOfShips()[6] = Ship(2, [array[8], array[9]])

    player1.getGameBoard().getListOfShips()[7] = Ship(3, [array[10], array[11], array[12]])
    player1.getGameBoard().getListOfShips()[8] = Ship(3, [array[13], array[14], array[15]])

    player1.getGameBoard().getListOfShips()[9] = Ship(4, [array[16], array[17], array[18], array[19]])

    player1.getGameBoard().getListOfShipsInArray()[0] = [array[0]]
    player1.getGameBoard().getListOfShipsInArray()[1] = [array[1]]
    player1.getGameBoard().getListOfShipsInArray()[2] = [array[2]]
    player1.getGameBoard().getListOfShipsInArray()[3] = [array[3]]

    player1.getGameBoard().getListOfShipsInArray()[4] = [array[4], array[5]]
    player1.getGameBoard().getListOfShipsInArray()[5] = [array[6], array[7]]
    player1.getGameBoard().getListOfShipsInArray()[6] = [array[8], array[9]]

    player1.getGameBoard().getListOfShipsInArray()[7] = [array[10], array[11], array[12]]
    player1.getGameBoard().getListOfShipsInArray()[8] = [array[13], array[14], array[15]]

    player1.getGameBoard().getListOfShipsInArray()[9] = [array[16], array[17], array[18], array[19]]

    board2.style.visibility = 'visible'
    newCoordinatesSet = true

    for(const i in colorCorrection) {
        document.getElementById(colorCorrection[i]).style.backgroundColor = 'blue'
    }

    document.getElementById('shipPlacement').textContent = 'First one to destroy all ships is the winner, good luck!'
}

let deleteOldBoard = function() {
    for(let i = 0 ; i < 100; i++) {
        xyLayout.removeChild(xyLayout.lastChild)
        xyLayout2.removeChild(xyLayout2.lastChild)
    }
}

document.getElementById('gameboardOuter').style.display = 'none'

board1.style.visibility = 'hidden'
board2.style.visibility = 'hidden'

