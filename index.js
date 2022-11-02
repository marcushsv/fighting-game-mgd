const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


// Spielausschnitt
canvas.width = 1024
canvas.height = 576
//zeichnet ein Rechteck(position x, position y, dicke, höhe)
c.fillRect(0, 0, canvas.width, canvas.height)
// 
const gravity = 0.7

//Spielfiguren Klasse und Konstruktor

class Sprite {
    //übergibt dem constructor position und geschwindkeit als 
    constructor({position, velocity}) {
        //position ist die position auf dem Bildschirm, Velocity die Geschwindigkeit
        this.position = position
        this.velocity = velocity
        this.height = 150
        // damit sich erinnert wird, was die letzte gedrückte taste war, wir lastkey immer mit dem letzten gedrückten Wert überschrieben
        this.lastKey
    }

    draw() {
        //Farbe der figuren
        c.fillStyle = 'purple'

        //zeichnet ein rechteck 
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }

    update() {
        // ruft draw auf
        // sorgt für fallen der Figuren
        this.draw()
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

}

animate()

// Bewegung



/* windows.addeventlistener nimmt drücken der tast. wahr,"keydown" sagt etwas passiert
wenn wir einen knopf drücken */
window.addEventListener('keydown', (event) =>{
    console.log(event.key);
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
    console.log(event.key);

})