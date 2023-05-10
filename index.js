const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


// Spielausschnitt
canvas.width =  1280
canvas.height = 720
//zeichnet ein Rechteck(position x, position y, dicke, höhe)
c.fillRect(0, 0, canvas.width, canvas.height)
// 
const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.jpg'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 145
    },
    imageSrc: './img/emptyPlaceholderShop.png',
    scale: 2.75,
    framesMax: 6
})



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
    },
    imageSrc: './img/idle_spritesheet.png',
    framesMax: 13,
    scale: 0.35,
    offset: {
        x: 175,
        y: 305
    },
    sprites: {
        idle: {
            imageSrc: './img/idle_spritesheet.png',
            framesMax: 13
        },
        run: {
            imageSrc: './img/walker.png',
            framesMax: 9
        },
        attack1: {
            imageSrc: './img/Slasher.png',
            framesMax: 10
        },
        takeHit: {
            imageSrc: './img/hurt.png',
            framesMax: 6
        },
        death: {
            imageSrc: './img/Death.png',
            framesMax: 6
        },
        perry: {
            imageSrc: './img/parrier.png',
            framesMax: 10
        }
    },
    attackBox: {
        offset: {
            x: 50,
            y: -50
        },
        width: 120,
        height: 50
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
    },
    imageSrc: './img/idle_spritesheet_enemy.png',
    framesMax: 13,
    scale: 0.35,
    offset: {
        x: 175,
        y: 305
    },
    sprites: {
        idle: {
            imageSrc: './img/idle_enemy.png',
            framesMax: 13
        },
        run: {
            imageSrc: './img/walker_enemy.png',
            framesMax: 9
        },
        attack1: {
            imageSrc: './img/slasher_enemy.png',
            framesMax: 10
        },
        takeHit: {
            imageSrc: './img/hurt_enemy.png',
            framesMax: 6
        },
        death: {
            imageSrc: './img/Death_enemy.png',
            framesMax: 6
        },
        perry: {
            imageSrc: './img/parrier_enemy.png',
            framesMax: 10
        }
    },
    attackBox: {
        offset: {
            x: -70,
            y: -50
        },
        width: 120,
        height: 50
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
    shop.update()
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
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd'){
        // wird d gedrückt, wird die geschwidnigkeit auf 1 gesetzt
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

      //enemy movement
    
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        // wird a gedrückt, wird die geschwidnigkeit auf -1 gesetzt
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        // wird d gedrückt, wird die geschwidnigkeit auf 1 gesetzt
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // kollisionserkennung & enemy gets hit
    // player
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy

        }) &&
        player.isAttacking && player.framesCurrent === 6
        ) {
            enemy.takeHit()
            setTimeout(()=> {
                this.isAttacking = false
               }, 2000) 
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 6 ) {
        player.isAttacking = false 
    }

    // enemy, player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player

        }) &&
        enemy.isAttacking && enemy.framesCurrent === 6
        ) {
            player.takeHit()
            enemy.isAttacking = false
            document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 6 ) {
        enemy.isAttacking = false 
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
    if (!player.dead) {

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
        }
    }
    
    if (!enemy.dead) {
        switch (event.key) {
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