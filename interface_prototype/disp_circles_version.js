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
        CircleColor: ["#3C9344", "#38B2BF", "#C960A5"]}
};

let mode = "loading";
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

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(bgd);
    fill(Interface.main.TextColor);
    noStroke();
    textAlign(CENTER, CENTER);
    diam = windowWidth/6;

    //Particle system
    rad = diam/2;
    angle = 0;
    system = new ParticleSystem(createVector(windowWidth/2, windowHeight/2));
    //fill particles array
    for (let i = 0; i < windowWidth/100; i++){
        system.particles.push(new Particle(random(0, 2 * PI)));
    }
}

function draw() {
    background(bgd);
    diam = windowWidth/6;
    rad = diam/2;
    //Change 'loading' to to leap connection check
    if (mode === "loading"){
        fill(Interface.main.TextColor);
        textSize(24);
        text('Loading…', windowWidth/2, windowHeight/2);

    }else if (mode === "main") {
        bgd = Interface.main.BackgroundColor;
        fill(Interface.main.TextColor);
        textSize(30);
        text('How are you feeling today?', windowWidth / 2, windowHeight / 5);

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

        //Check mood selection to set mood/colors
    }else if(mode === "meditation"){
        // let idx = indexOf(Interface.meditation.Mood.mood);
        // console.log(idx);
        background(Interface.meditation.BackgroundColor[moodNum]);
        fill(Interface.meditation.CircleColor[moodNum]);
        ellipseMode(CENTER);
        ellipse(windowWidth/2, windowHeight/2, windowWidth/4, windowWidth/4);

        //Particle system
        system.run();
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
    //fill particles array
    for (let i = 0; i < windowWidth/100; i++){
        system.particles.push(new Particle(random(0, 2 * PI)));
    }
}


//Particle Effect Classes
let Particle = function(angle){
    this.angle0 = angle;
    this.position = createVector(system.center.x + rad * cos(this.angle0), system.center.y + rad * sin(this.angle0));
    //this.velocity = createVector(random(-1, 1), random(-1,1));
};

Particle.prototype.run = function(){
    this.update();
    this.display();
};

Particle.prototype.update = function(){
    t = frameCount%60;
    console.log(t);
    if (t%5 === 0){
        this.angle = this.angle0 + 2*PI*t/20;
        this.position = createVector(system.center.x + rad * cos(this.angle0) + random(-rad, rad), system.center.y + rad * sin(this.angle0) + random(-rad, rad));
    }
};

Particle.prototype.display = function(){
    noStroke();
    fill(255, 120);
    ellipse(this.position.x, this.position.y, 10, 10);
};

let ParticleSystem = function(center){
    this.center = center.copy();
    this.particles = [];
};

Particle.prototype.connect = function(){
    system.particles.forEach(particle => {
        let d = dist(this.position.x, this.position.y, particle.position.x, particle.position.y);
        if (d < windowWidth/20){
            stroke(255);
            line(this.position.x, this.position.y, particle.position.x, particle.position.y);
            console.log("IN");
        }
    });
};


ParticleSystem.prototype.run = function(){
    for (let i = 0; i < this.particles.length; i++){
        let p = this.particles[i];
        p.connect();
        p.run();
    }
};

