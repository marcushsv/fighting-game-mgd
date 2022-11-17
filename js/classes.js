//Spielfiguren Klasse und Konstruktor
class Sprite {
    //übergibt dem constructor position und geschwindkeit als 
constructor({position, imageSrc, /*scale = 1, framesMax = 1*/}) {
        //position ist die position auf dem Bildschirm, Velocity die Geschwindigkeit
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        /*this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0 
        this.framesElabsed = 0
        this.framesHold = 10 */
    }

    draw() {
        c.drawImage(
            this.image, 
            /*this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,*/
            this.position.x, 
            this.position.y,
            /*(this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale*/
        )
    }

    update() {
        // ruft draw auf
        this.draw()
        /* this.framesElabsed++

        if (this.framesElabsed % this.framesHold === 0) {

            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }*/
    }
}

class Fighter {
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

        if (this.position.y + this.height + this.velocity.y >= canvas.height /* minus den abstand vom Boden zum unteren Bildende (hängt vom Bild ab was noch designt werden muss) */){
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
}