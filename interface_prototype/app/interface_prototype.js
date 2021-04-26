// Main background
let Interface = {
    main: {
        Mode: "main",
        BackgroundColor: "#95B8C4",
        TextColor: "#FFFFFF"},
    meditation: {
        Mode: "meditation",
        Mood: ["focused", "calm", "loving"],
        BackgroundColor: ["#A3CCA9", "#A3C7CC", "#CAA4CC"],
        CircleColor: ["#3C9344", "#38B2BF", "#C960A5"],
        Sound: ["sound_focused", "sound_calm", "sound_loving"]}
    };

let mode = "main";
let mood = false;
let moodNum = false;
let bgd = Interface.main.BackgroundColor;
let diam;

//mouseCounter used only for prototype
let mouse = false;

// Particle system
let system;
let rad;
let angle;

//Offscreen graphic for circle effect
let pg;

// LEAP SENSOR
let controller;
let listener;
let brush = [];

//Sound
let sound = false;
let sound_prev;

function preload(){
    sound_calm = loadSound('sounds/calm.mp3');
    sound_focused = loadSound('sounds/focused.mp3');
    sound_loving = loadSound('sounds/loving.mp3');
    sound_bell = loadSound('sounds/bell.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(bgd);
    fill(Interface.main.TextColor);
    noStroke();
    textAlign(CENTER, CENTER);
    pg = createGraphics(windowWidth, windowHeight);

    //Particle system
    system = new ParticleSystem(createVector(windowWidth/2, windowHeight/2));

    controller = new Leap.Controller({
        enableGestures: true
    });
    controller.connect();
    controller.setBackground(false);

}

function draw() {
    background(bgd);
    diam = windowWidth/6;
    rad = diam/2;


    // if (mode === "loading"){
    //     fill(Interface.main.TextColor);
    //     textSize(24);
    //     text('Loading…', windowWidth/2, windowHeight/2);
    //     // Erase Instructions
    //     textSize(12);
    //     text('This page is used until connection with sensor is established. Hit SPACEBAR to go to first page', windowWidth/2, windowHeight/8);
    //
    // }else
    if (mode === "main") {
      bgd = Interface.main.BackgroundColor;
      fill(Interface.main.TextColor);
      textSize(30);
      text('How are you feeling today?', windowWidth / 2, windowHeight / 5);

      //Erase Instructions
      textSize(12);
      text('Click inside circle to select mood', windowWidth/2, windowHeight/8);
      text('This selection should be possible from a distance using the Leap Sensor, probably?', windowWidth/2, windowHeight/7);


      // Mood text
      textSize(17);
      text('focused', windowWidth/4, 4 * windowHeight / 5);
      text('calm', 2 * windowWidth/4, 4 * windowHeight / 5);
      text('loving', 3 * windowWidth/4, 4 * windowHeight / 5);

      // Draw three ellipses
      ellipseMode(CENTER);
      noStroke();
      for (let i=0; i<3; ++i){
          fill(Interface.meditation.BackgroundColor[i]);
          ellipse((i+1) * windowWidth/4, windowHeight/2, diam, diam);
      }

      if (sound != false) {
          sound.pause();
      }
      //Draw fingers
      paint();

      //Check mood selection to set mood/colors
      }else if(mode === "meditation"){
          background(Interface.meditation.BackgroundColor[moodNum]);

          if (system.particles.length < 3){
              system.particles.push(new Particle());
          } else{
              system.particles.shift();
              system.particles.shift();
          }
          system.run();

          tint(255, 120);
          image(pg, 0, 0);
          fill(Interface.meditation.CircleColor[moodNum]);
          ellipseMode(CENTER);
          ellipse(windowWidth/2, windowHeight/2, diam, diam);

          //Erase Instructions
          fill(255);
          textSize(12);
          text('Return to previous page with SPACEBAR', windowWidth/2, windowHeight/8);

          sound_prev = sound;
          if (moodNum === 0){
              sound = sound_focused;
          } else if (moodNum === 1) {
              sound = sound_calm;
          } else if (moodNum === 2){
              sound = sound_loving;
          }

          if (sound_prev != false && sound_prev != sound) {
              sound_prev.pause();
              sound.setVolume(0.02);
              sound.play();
          }

      }
}

//Upon mouse click, it checks is it happens within mood-circles and sets the mood accordingly
function mouseReleased() {
    if (dist(windowWidth/4, windowHeight/2, mouseX, mouseY) < diam/2){
    //focused
        mode = "meditation";
        moodNum = 0;
    } else if(dist(2 * windowWidth/4, windowHeight/2, mouseX, mouseY) < diam/2){
        mode = "meditation";
        moodNum = 1;
    }else if(dist(3 * windowWidth/4, windowHeight/2, mouseX, mouseY) < diam/2){
        mode = "meditation";
        moodNum = 2;
    }
    mouse = false;
}

function keyPressed(){
    // Change btw modes/pages
    mouse = !mouse;
    if (mouse === true){
       mode = "main";
    } else if (mouse == false){
       mode = "meditation";
    }
    //console.log(mode);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    system = new ParticleSystem(createVector(windowWidth/2, windowHeight/2));
}


//Particle Effect Classes

let Particle = function(){
    this.position = createVector(system.center.x, system.center.y);
    this.pcolor = color(255, 255, 255, random(180));
    this.radius = random(width/9, width/5);
    this.a = 0;
};

Particle.prototype.run = function(){
    this.update();
    this.display();
};

Particle.prototype.update = function(){
    if(frameCount % 60 === 0){
        this.a = Math.cos(2 * Math.PI * frameCount/60);
    }
    this.radius += this.a
    console.log(this.radius);
    this.pcolor = color(255, 255, 255, random(50, 100));
};

Particle.prototype.display = function(){
    noStroke();
    //pg.fill(255, 220);
    fill(this.pcolor, random(180));
    ellipse(this.position.x, this.position.y, this.radius, this.radius);
};

let ParticleSystem = function(center){
    this.center = center.copy();
    this.particles = [];
};


Particle.prototype.connect = function(){
    system.particles.forEach(particle => {
        let d = dist(this.position.x, this.position.y, particle.position.x, particle.position.y);
        if (d < windowWidth/10){
            fill(255, 20);
            strokeWeight(30);
            stroke(255, 10);
            line(this.position.x, this.position.y, particle.position.x, particle.position.y);
        }
    });

};


ParticleSystem.prototype.run = function(){
    for (let i = 0; i < this.particles.length; i++){
        let p = this.particles[i];
        //p.connect();
        p.run();
    }
};

//LEAP FUNCTioNS
//Trial
function paint() {
    let frame = controller.frame();
    rgb = (255, 255, 255);
    frame.fingers.forEach(finger => {
        x = finger.dipPosition[0] + width / 2;
        y = height - finger.dipPosition[1];
        brush.push(new Brush(x, y, color(rgb), random(15)));
    });

    frame.fingers.forEach(finger => {
        for (let i = 0; i < brush.length; i++) {
            brush[i].render(createVector(finger.dipPosition[0] + width / 2, height - finger.dipPosition[1]));
        }
    });

    frame.fingers.forEach(finger => {
        for (let i = 0; i < brush.length; i++) {
            brush[i].render(createVector(finger.dipPosition[0] + width / 2, height - finger.dipPosition[1]));
        }
    });
}

let Brush = function(x, y, col, size) {
        this.pos = createVector();
        this.col = col;
        this.size = size;
    }

Brush.prototype.display = function(pos) {
        this.pos.set(pos.x, pos.y);
        noStroke();
        fill(this.col);
        ellipse(this.pos.x, this.pos.y, this.size, this.size);

        return this;
    }

Brush.prototype.render = function(pos) {
        return this.display(pos);
}




