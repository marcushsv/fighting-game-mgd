const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


// Spielausschnitt
canvas.width =  1280
canvas.height = 720
//zeichnet ein Rechteck(position x, position y, dicke, höhe)
c.fillRect(0, 0, canvas.width, canvas.height)
// 
const gravity = 0.7

//Spielfiguren Klasse und Konstruktor

class Sprite {
    //übergibt dem constructor position und geschwindkeit als 
    constructor({position, velocity, color = "red", offset}) {
        //position ist die position auf dem Bildschirm, Velocity die Geschwindigkeit
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        // damit sich erinnert wird, was die letzte gedrückte taste war, wir lastkey immer mit dem letzten gedrückten Wert überschrieben
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            } ,
            offset,
            width: 100,
            height: 50
        }
        // color wird zugewiesen, default color ist red
        this.color = color
        this.isParrying
        this.isAttacking
        this.health = 100
    }

    draw() {
        //Farbe der figuren
        c.fillStyle = this.color

        //zeichnet ein rechteck 
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attackbox wird gezeichnet
        if (this.isAttacking){
        c.fillStyle = "green"
        c.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height
            )
        }
        if (this.isParrying){
            c.fillStyle = "yellow"
            c.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, 
                this.attackBox.height
                )
            }
    }

    update() {
        // ruft draw auf
        this.draw()
        // die position der attackbox wird mit der des spielers verbunden und durch offset dynamisiert
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        //bewegung auf der x Achse
        this.position.x += this.velocity.x
        // bewegung auf der y achse
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        } else 
            //fügt gravtitation hinzu, solange die figur über dem unteren rand ist
            this.velocity.y += gravity

    }

    attack(){
        // isAttacking ist true und wird nach 100 mSec auf false gesetzt
       this.isAttacking = true
       setTimeout(()=> {
        this.isAttacking = false
       }, 100) 
    }
    parry(){
        // isAttacking ist true und wird nach 100 mSec auf false gesetzt
       this.isParrying = true
       setTimeout(()=> {
        this.isParrying = false
       }, 100) 
    }


}


// Player aus Spielfigurenklasse Sprite
const player = new Sprite({
    position: {
    //x ist rechts/links verschiebung, y ist die höhe des objekts    
    x: 100,
    y: 0
    },
    // Geschwindigkeit des Objekts
    velocity: {
        x:0,
        y:0
    },
    offset: {
        x: 0,
        y: 0
    }
})


//second Player aus Spielfigurenklasse Sprite
const enemy = new Sprite({
    position: {
    //x ist rechts/links verschiebung, y ist die höhe des objekts   
    x: 800,
    y: 0
    },
    //Geschwindigkeit des Objekts
    velocity: {
        x:0,
        y:0
    },

    // setzen der enemy farbe
    color: "purple",
    // zum umdrehen der attackbox des enemy
    offset: {
        x: -50,
        y: 0
    }
})

console.log(player)


/* damit die geschwindigkeit nicht immer auf 0 gesetzt wird, wenn wir a und d gleichzeitig drücken
und eine taste heben und trotzdem stoppen, obwohl die andere noch gedrückt ist, erstellen wir eine const keys
*/
const keys = {
    
    a: {
        pressed: false
    },

    d: {
        pressed: false
    },

    w: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    },
     
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }


}
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

decreaseTimer()

// animations loop
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    /* Hier wird die Geschwindkeit der zu bewegenden objekte festgelegt, für den Fall,
    dass wir eine der tasten a oder d drücken
    */
    //standardgeschwindigkeit
    //player movement
    player.velocity.x = 0
    enemy.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a'){
        // wird a gedrückt, wird die geschwidnigkeit auf -1 gesetzt
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd'){
        // wird d gedrückt, wird die geschwidnigkeit auf 1 gesetzt
        player.velocity.x = 5
    }

      //enemy movement
    
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        // wird a gedrückt, wird die geschwidnigkeit auf -1 gesetzt
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        // wird d gedrückt, wird die geschwidnigkeit auf 1 gesetzt
        enemy.velocity.x = 5
    }

    // kollisionserkennung
    // player
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy

        }) &&
        player.isAttacking
        ) {
            player.isAttacking = false
            // angriff lässt healthbar auf 20 Prozent schrumpfen
            enemy.health -= 25
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        
    }
    // enemy
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player

        }) &&
        enemy.isAttacking
        ) {
            enemy.isAttacking = false
            player.health -= 25
            document.querySelector('#playerHealth').style.width = player.health + '%'
    }


    if (
        rectangularCollisionParry({
            rectangle1: player,
            rectangle2: enemy

        }) &&
        player.isParrying && enemy.isAttacking && player.health <= 75
        ) {
            player.isParrying = false
            // angriff lässt healthbar auf 20 Prozent schrumpfen
            player.health += 25
            document.querySelector('#playerHealth').style.width = player.health + '%'
            
        
    }
    // enemy
    if (
        rectangularCollisionParry({
            rectangle1: enemy,
            rectangle2: player

        }) &&
        enemy.isParrying && player.isAttacking && enemy.health <= 75
        ) {
            enemy.isParrying = false
            enemy.health += 25
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        
    }

    // beendet spiel, wenn healthbar bei 0 ist
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy,timerId})

    }
    

}

animate()

// Bewegung



/* windows.addeventlistener nimmt drücken der tast. wahr,"keydown" sagt etwas passiert
wenn wir einen knopf drücken */
window.addEventListener('keydown', (event) =>{
    //tastenbelegung, wenn taste 'irgendwas' gedrückt wird passiert: "folgender code"
    switch (event.key){
        //bewegung nach rechts
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        // bewegung nach links    
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.parry()
            break
        //attack    
        case " ":
            player.attack()
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        // bewegung nach links    
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.parry()
            break  
        // attack
        case "ArrowDown":
            enemy.attack()
            break 

    }
    console.log(event.key);

})

/* windows.addeventlistener nimmt drücken der tast. wahr,"keyup" 
 sagt etwas passiert wenn wir einen knopf hochnehmen */
window.addEventListener('keyup', (event) =>{
    // tastenbelegung, wenn taste 'irgendwas' gedrückt wird passiert: "folgender code"
    switch (event.key){
        // stoppt bewegung nach rechts
        case 'd':
            keys.d.pressed = false
            break
        // stoppt bewegung nach links
        case 'a':
            keys.a.pressed = false
            break
    }

    switch (event.key){
        // stoppt bewegung nach rechts
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        // stoppt bewegung nach links
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }

})