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

function GameBoard() {
    const getListOfShips = () => listOfShips
    const listOfShips = [ // 10 ships in total
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
    
    const getHitAndMissedMarks = () => [hitMarks, missedMarks]
    const getHitAndMissedOneArray = () => hitAndMissedOneArray;
    const getHitMarks = () => hitMarks
    const getMissedMarks = () => [missedMarks]
    const hitMarks = [];
    const missedMarks = [];
    const hitAndMissedOneArray = []

    const receiveAttack = hitCoordinates => {
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

        if(!_.isEqual(hitMarks[hitMarks.length - 1], hitCoordinates)) {
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
    }
}

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

function computerAttackMove() {
    let xy = [1, getRandomInt(10), getRandomInt(10)]


    let repetitionArray = player1.getGameBoard().getHitAndMissedOneArray();
    for(const i in repetitionArray) {
        if( _.isEqual(repetitionArray[i], xy)) {
            return computerAttackMove()
        }
    }
    return xy
}

function targetedMove() {
    let lastHitCoordinates = player1.getGameBoard().getHitMarks()[player1.getGameBoard().getHitMarks().length - 1]
    let left = lastHitCoordinates.slice();
    left[2] -= 1
    let right = lastHitCoordinates.slice()
    right[2] += 1
    let up = lastHitCoordinates.slice()
    up[1] -= 1
    let down = lastHitCoordinates.slice()
    down[1] += 1

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


const xyLayout = document.getElementById('xyLayoutID')
const xyLayout2 = document.getElementById('xyLayoutID2')



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
        for(const x in allCoordinates) { // rendering board 1 empty spaces (everything is by default empty)
            allCoordinates[x].unshift(1)    
        }
        for(const x in allCoordinates) { // rendering board 2
            allCoordinates[x].splice(0, 1, 2)
            document.getElementById(allCoordinates[x]).textContent = '?'  
        }

        for(const a in player1ShipCoordinates) { // rendering board 1 ships (we basically override the empty spaces with ships)
            for(const b in player1ShipCoordinates[a]) {
                if(newCoordinatesSet === false) {player1ShipCoordinates[a][b].unshift(1)}
                document.getElementById(player1ShipCoordinates[a][b]).textContent = ''
                document.getElementById(player1ShipCoordinates[a][b]).style.border = '5px solid red'
                //document.getElementById(player1ShipCoordinates[a][b]).style.backgroundColor = 'red'
            }
        } 
        for(const a in player2ShipCoordinates) { // rendering board 2 ships (we basically override the empty spaces with ships)
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


let divClasses = document.querySelectorAll('.divClass2')

divClasses.forEach(divClass => {
    divClass.addEventListener('click', function playerVScomputer() {
        let attackCoordinates = JSON.parse('[' + divClass.id +']')
        player1.attacks(attackCoordinates)
        console.log(divClass.id)

        if(player2.getGameBoard().getHitAndMissedMarks()[1].includes(attackCoordinates)) {
            document.getElementById(divClass.id).textContent = ''
            document.getElementById(divClass.id).style.backgroundColor = 'red'


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

                if( _.isEqual(player1.getGameBoard().getHitMarks()[player1.getGameBoard().getHitMarks().length - 1], fixComputerAttackMove) ) {
                    document.getElementById(`${fixComputerAttackMove[0]},${fixComputerAttackMove[1]},${fixComputerAttackMove[2]}`).style.backgroundColor = 'green'
                    document.getElementById(`${fixComputerAttackMove[0]},${fixComputerAttackMove[1]},${fixComputerAttackMove[2]}`).style.border = 'none'
                    computerMoveIsHit = true
                    doubleTap = true
                } else {
                    document.getElementById(`${fixComputerAttackMove[0]},${fixComputerAttackMove[1]},${fixComputerAttackMove[2]}`).style.backgroundColor = 'red'
                    computerMoveIsHit = false
                    doubleTap = false
                }
            }
        } else {
            document.getElementById(divClass.id).textContent = ''
            document.getElementById(divClass.id).style.backgroundColor = 'green'
        }
        //console.log(player1.getGameBoard().getHitAndMissedMarks())
        //console.log(player2.getGameBoard().getHitAndMissedMarks())
        if(player1.getGameBoard().areAllShipsSunk()) {
            document.getElementById('decisionOne').textContent = 'You lost!';
            document.getElementById('decisionOne').style.color = 'red';
            document.getElementById('decisionTwo').textContent = 'Computer won!';
        }
        if(player2.getGameBoard().areAllShipsSunk()) {
            document.getElementById('decisionOne').textContent = 'You won!';
            document.getElementById('decisionTwo').textContent = 'Computer lost!';
            document.getElementById('decisionTwo').style.color = 'red';
        }
    },{once: true})
})


// function for ship placement when user select custom start -----------------------------------------------------------------------------------------------------
const header = document.getElementById('header')
const quickStart = document.getElementById('quickStart')
const shortTutorial = document.getElementById('shortTutorial')
const customStart = document.getElementById('customStart')
const tiles = document.getElementsByClassName('divClass')
const board1 = document.getElementById('player1Board')
const board2 = document.getElementById('player2Board')

const shipPlacementExit = document.createElement('button')
shipPlacementExit.textContent = 'exit to main menu'

shipPlacementExit.addEventListener('click', () => {
    location.reload()
})

quickStart.addEventListener('click', () => {
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
    explanationText.textContent = 'This is a turn-based game: each player has a gameboard with 100 tiles on it. Both players get 10 ships of various sizes, from 1 tile to 4 tiles.'
    header.appendChild(explanationText)
    header.appendChild(nextButton)

    document.getElementById('nextButton').addEventListener('click', () => {
    explanationText.textContent = 'Once you placed all your ships on your gameboard, you can attack your opponents ships by clicking on his/her tiles.'
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
    quickStart.hidden = true;
    shortTutorial.hidden = true;
    customStart.hidden = true;
    board1.style.visibility = 'visible'
    board2.style.visibility = 'hidden'

    const shipPlacementDiv = document.createElement('div');
    const shipPlacementText = document.createElement('p');
    shipPlacementText.id = 'shipPlacement'
    shipPlacementText.textContent = 'Click on the board to place your ships. Be aware: ships placed too close to eachother are prone to multi-hits, as the AI targets the proximity of previously hit coordinates  '    


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
        document.getElementById(id).style.border = '5px solid red';

    } if (length === 2 && decrementX1[1] >= 0 && checkForRepetiton(decrementX1)) {
        document.getElementById(id).style.border = '5px solid red';

        document.getElementById(decrementX1.toString()).style.border = '5px solid red';
        document.getElementById(decrementX1.toString()).replaceWith(document.getElementById(decrementX1.toString()).cloneNode(true));

    } if (length === 3 && decrementX2[1] >= 0 && checkForRepetiton(decrementX1) && checkForRepetiton(decrementX2)) {
        document.getElementById(id).style.border = '5px solid red';

        document.getElementById(decrementX1.toString()).style.border = '5px solid red';
        document.getElementById(decrementX1.toString()).replaceWith(document.getElementById(decrementX1.toString()).cloneNode(true));

        document.getElementById(decrementX2.toString()).style.border = '5px solid red';
        document.getElementById(decrementX2.toString()).replaceWith(document.getElementById(decrementX2.toString()).cloneNode(true));

    } if (length === 4 && decrementX3[1] >= 0 && checkForRepetiton(decrementX1) && checkForRepetiton(decrementX2) && checkForRepetiton(decrementX3)) {
        document.getElementById(id).style.border = '5px solid red';

        document.getElementById(decrementX1.toString()).style.border = '5px solid red';
        document.getElementById(decrementX1.toString()).replaceWith(document.getElementById(decrementX1.toString()).cloneNode(true));

        document.getElementById(decrementX2.toString()).style.border = '5px solid red';
        document.getElementById(decrementX2.toString()).replaceWith(document.getElementById(decrementX2.toString()).cloneNode(true));

        document.getElementById(decrementX3.toString()).style.border = '5px solid red';
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


board1.style.visibility = 'hidden'
board2.style.visibility = 'hidden'