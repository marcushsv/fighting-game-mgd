// Kollisionserkennungsfunktion
function rectangularCollision({ rectangle1, rectangle2 }){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
}

function rectangularCollisionParry({ rectangle1, rectangle2 }){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.attackBox.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        )
}


// timer funktion

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    //zeigt für unterschiedliche Spielausgänge Unentschieden oder den jeweiligen Sieger
    if (player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Unentschieden'
        } else if (player.health > enemy.health){
            document.querySelector('#displayText').innerHTML = 'Spieler 1 hat gewonnen'
        } else if (player.health < enemy.health){
            document.querySelector('#displayText').innerHTML = 'Spieler 2 hat gewonnen'
        } 
}

let timer = 60
let timerId
// lässt den timer runterzählen
function decreaseTimer() {
    timerId = setTimeout (decreaseTimer, 1000)
    if ( timer > 0 ) {
        timer--
        document.querySelector('#timer').innerHTML = timer
    }   
    if (timer === 0){
        
        determineWinner({player, enemy, timerId})
       
        }
}