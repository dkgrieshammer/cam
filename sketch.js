let letters = []

let lHand
let rHand

let poseNet
let video
let poses = []

let frameCount = 0
let myTextIndex = 0
let myText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

let gravity;

function setup() {
  createCanvas(1950, 950)
  lHand = createVector(0, 0) //Vergessen umzustellen
  rHand = createVector(0, 0)
  gravity = createVector(0, 0.2) //einmalig erstellen
  //Webcam
  video = createCapture(VIDEO)
  video.size(width, height)
  //ML5 Model = poseNet
  poseNet = ml5.poseNet(video, modelReady)
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results
  })

  // Webcamverstecken
  video.hide()

  // Buchstaben erstellen
  for (let i = 0; i < 100; i++) {
    letters.push(new Letter(random(width), 0)) // Startposition oben
  }
}

//Feedback wenn das Model poseNet geladen hat
function modelReady() {
  console.log("Model ready!")
}

function draw() {
  background(0)

  // Aktualisieren und zeichnen der Buchstaben
  for (let letter of letters) {
    letter.applyGravity(gravity)
    letter.checkCollision()
    letter.update()
    letter.display()
    letter.checkCanvasBoundary()
  }
  handMove()

  frameCount++

  // Alle 60 Frames (ca. 1 Sekunde) Buchstabe wechseln
  if (frameCount % 60 === 0) {
    myTextIndex++
    myTextIndex %= myText.length // Sicherstellen, dass der Index nicht außerhalb des Arrays liegt
    frameCount = 0
  }
}

// Die Funktion muss ausserhalb von draw definiert werden!
function handMove() {
  let keyColor = color(255, 0, 0) // Farbe des Handpunktes rot
  if (poses.length > 0) {
    for (let i = 0; i < poses.length; i += 1) {
      const pose = poses[i].pose // Kein Problem
      keyColor = color(0, 255, 0) // wenn erkannt -> Farbe des Handpunktes grün
      lHand = pose.nose
      rHand = pose.rightWrist
    }
  }
  push()
  fill(keyColor)
  noStroke()
  ellipse(lHand.x, lHand.y, 10, 10)
  pop()
}




//Buchstabe als Klasse definieren
class Letter {
  constructor(x, y) {
    this.pos = createVector(x, y)
    this.vel = createVector(random(-5, 5), random(-5, 5))
    this.acc = createVector(0, 0)
    this.size = random(10, 60)
  }
  //Schwerkraft
  applyGravity(gravity) {
    this.acc.add(gravity)
  }
  //Kollision
  checkCollision() {
    let distance = dist(this.pos.x, this.pos.y, lHand.x, lHand.y)
    let collisionThreshold = this.size / 2

    if (distance < collisionThreshold) {
      // Beschleunigung nach Kollision
      this.vel.mult(-2)
    }
  }
  //Wände
  checkCanvasBoundary() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.pos.x = random(width)
      this.pos.y = 0 // Start ist oben auf dem Canvas
      this.vel.y = 0 // Zurücksetzen der Geschwindigkeit
    }

    if (this.pos.y > height) {
      this.pos.y = height // Solid Ground
      this.vel.y *= -0.8 // Abprallen an der unteren Grenze
    }
  }

  update() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.set(0, 0)
  }

  display() {
    fill(255)
    textSize(this.size)
    let myTextShow = myText.charAt(myTextIndex % myText.length)
    text(myTextShow, this.pos.x, this.pos.y)
    //text("KAAN", this.pos.x, this.pos.y);
  }
}
