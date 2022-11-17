const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


// Spielausschnitt
canvas.width = 1280
canvas.height = 720
//zeichnet ein Rechteck(position x, position y, dicke, höhe)
c.fillRect(0, 0, canvas.width, canvas.height)
// 
const gravity = 0.7

//implementation für den Hintergrund Sprite
const background = new Sprite({
    //positioniert das Bild ganz oben links in der ecke
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/platzHalterBackground.png'
})

//im video wird ein shop animiert, wir könnte einfach iwas ähnliches nehmen, hier der code falls nötig
/*const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 1.5,
    framesMax = 6 anzahl der frames für die animation
})*/

// Player aus Spielfigurenklasse Sprite
const player = new Fighter({
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
const enemy = new Fighter({
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

decreaseTimer()

// animations loop
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    //shop.update() //possible bug weil kein shop designed wurde?
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
            player.velocity.y = -20
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
            enemy.velocity.y = -20
            break   
        // attack
        case "ArrowDown":
            enemy.isAttacking = true
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