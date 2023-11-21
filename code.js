let letters = [];

let lHand;
let rHand;

let poseNet;
let video;
let poses = [];

let frameCount = 0;
let myTextIndex = 0;
let myText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function setup() {
  createCanvas(1950, 950);
  lHand = createVector(0, 0);    //Vergessen umzustellen
  rHand = createVector(0, 0);

  //Webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  //ML5 Model = poseNet
  poseNet = ml5.poseNet(video, modelReady);
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });

  // Webcamverstecken
  video.hide();

  // Buchstaben erstellen
  for (let i = 0; i < 100; i++) {
    letters.push(new Letter(random(width), 0)); // Startposition oben
  }
}

//Feedback wenn das Model poseNet geladen hat
function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background(0);

  // Aktualisieren und zeichnen der Buchstaben
  for (let letter of letters) {
    letter.applyGravity(createVector(0, 0.2));
    letter.checkCollision();
    letter.update();
    letter.display();
    letter.checkCanvasBoundary();


  }

  //handMove();
  function handMove() {
    for (let i = 0; i < poses.length; i += 1) {
      const poses = poses[i]; // Kein Problem
      //console.log(poses[1].pose.keypoints[9].position)
      //let myXPos = poses[1].pose.keypoints[9].position.x
      // poses[1].pose.keypoints[9] = leftWrist
      // poses[0].pose.leftWrist = leftWrist
      //let lHand = poses[1].pose.keypoints[9].position;

      let lHand = poses[0].pose.leftWrist
      let rHand = poses[0].pose.rightWrist

      fill(0, 255, 0);
      noStroke();
      ellipse(lHand.x, lHand.y, 10, 10)
    }
  }

  frameCount++;

  // Alle 60 Frames (ca. 1 Sekunde) Buchstabe wechseln
  if (frameCount % 60 === 0) {
    myTextIndex++;
    myTextIndex %= myText.length; // Sicherstellen, dass der Index nicht außerhalb des Arrays liegt
    frameCount = 0;
  }
  Console();
}

function Console() {
  console.log(poses[0].pose) //Console: Uncaught TypeError: Cannot read properties of undefined (reading 'pose')
}



//function handMove() {
//  for (let i = 0; i < poses.length; i += 1) {
//    const poses = poses[i]; // Console: Cannot access 'poses' before initialization
//console.log(poses[1].pose.keypoints[9].position)
//let myXPos = poses[1].pose.keypoints[9].position.x
// poses[1].pose.keypoints[9] = leftWrist
// poses[0].pose.leftWrist = leftWrist
//let lHand = poses[1].pose.keypoints[9].position;

//    let lHand = poses[0].pose.leftWrist
//    let rHand = poses[0].pose.rightWrist

//    fill(0, 255, 0);
//    noStroke();
//  ellipse(lHand.x, lHand.y, 10,10)
//}
//}
//Buchstabe als Klasse definieren
class Letter {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-5, 5), random(-5, 5));
    this.acc = createVector(0, 0);
    this.size = random(10, 60);
  }
  //Schwerkraft
  applyGravity(gravity) {
    this.acc.add(gravity);
  }
  //Kollision
  checkCollision() {
    let distance = dist(this.pos.x, this.pos.y, lHand.x, lHand.y);
    let collisionThreshold = this.size / 2;

    if (distance < collisionThreshold) {
      // Beschleunigung nach Kollision
      this.vel.mult(-2);
    }
  }
  //Wände
  checkCanvasBoundary() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.pos.x = random(width);
      this.pos.y = 0; // Start ist oben auf dem Canvas
      this.vel.y = 0; // Zurücksetzen der Geschwindigkeit
    }

    if (this.pos.y > height) {
      this.pos.y = height; // Solid Ground
      this.vel.y *= -0.8; // Abprallen an der unteren Grenze
    }
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  display() {
    fill(255);
    textSize(this.size);
    let myTextShow = myText.charAt(myTextIndex % myText.length);
    text(myTextShow, this.pos.x, this.pos.y);
    //text("KAAN", this.pos.x, this.pos.y);
  }
}
