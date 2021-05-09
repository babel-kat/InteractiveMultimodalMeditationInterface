// Main background
let Interface = {
    main: {
        Mode: "main",
        BackgroundColor: "#95B8C4",
        TextColor: "#FFFFFF"
    },
    meditation: {
        Mode: "meditation",
        Mood: ["focus", "happy", "zen", "relax"],
        BackgroundColor: ["#D8C36A", "#CAA4CC", "#A3C7CC", "#A3CCA9"],
        CircleColor: ["#E1B324", "#C960A5", "#38B2BF", "#3C9344"],
        CircleHover: ["#F2B60F", "#E032AA", "#1ED7E0", "#25C125"],
        Sound: ["sound_focus", "sound_happy", "sound_zen", 'sound_relax']
    }
};

let mode = "main";
let mood = false;
let moodNum = false;
let bgd = Interface.main.BackgroundColor;
let diam;

//mouseCounter used only for prototype
let mouse = false;

// Buttons / Sliders
let instr_button;
let back_button;
let volume_slider;
let slider_val;

// Particle system
let system;
let rad;
let angle;

//Images
let namaste;

//Offscreen graphic for circle effect
let pg;

//Sound
let sound_focus, sound_happy, sound_zen, sound_relax, sound_bell;
let sound;
let sound_prev = false;

//Speech
var myRec;

// Mudra img
let one;
let two;
let three;
let four;
let five;

function preload() {
    sound_focus = loadSound('sounds/focus.mp3');
    sound_happy = loadSound('sounds/happy.mp3');
    sound_zen = loadSound('sounds/zen.mp3');
    sound_relax = loadSound('sounds/sleep.mp3');
    sound_bell = loadSound('sounds/bell.mp3');

    namaste = loadImage('assets/namaste.png');
    // Load mudra img
    one = loadImage('assets/1.png');
    two = loadImage('assets/2.png');
    three = loadImage('assets/3.png');
    four = loadImage('assets/4.png');
    five = loadImage('assets/5.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(bgd);
    fill(Interface.main.TextColor);
    noStroke();
    textAlign(CENTER, CENTER);

    //Particle system
    system = new ParticleSystem(createVector(windowWidth / 2, windowHeight / 2));

    //Speech
    myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
    myRec.continuous = true; // do continuous recognition
    myRec.interimResults = true; // allow partial recognition (faster, less accurate)
    myRec.start(); // start engine

    sound = sound_focus;

    //frameRate(5);
    instr_button = createButton('Instructions');
    back_button = createButton('Back');
    slider_val = 0.05;
    volume_slider = createSlider(0, 1, slider_val, 0.05);   //(min, max, [value], [step])

    displayButton(back_button);
    displayButton(instr_button);
    displaySlider(volume_slider);
}


function draw() {
    background(bgd);
    diam = windowWidth / 7;
    rad = diam / 2;

    // if (mode === "loading"){
    //     fill(Interface.main.TextColor);
    //     textSize(24);
    //     text('Loading…', windowWidth/2, windowHeight/2);
    //     // Erase Instructions
    //     textSize(12);
    //     text('This page is used until connection with sensor is established. Hit SPACEBAR to go to first page', windowWidth/2, windowHeight/8);
    //
    // }else
    if (mode === "instructions"){
        textAlign(CENTER)
        fill(Interface.main.TextColor);
        textSize(24);
        text('Instructions', windowWidth/2, windowHeight/5);
        textSize(12);
        let sentences = ['You can navigate the different screens with your voice', 'Select between the different meditation modes by name',
            'You can say:', '“focus”,', '“happy” or “happiness”,', '“Zen”,', '“sleep” or “relax”', 'to select a meditation mode',
            'When in Meditation mode, say “Go Back” to return to the main menu.', 'During meditation you can press SPACE to return to the main page', 'Say “Nice”, “I am done”, or “Namaste” to go to the end screen and exit the application']

        for (let i = 0; i < sentences.length; i++){
            text(sentences[i], windowWidth/2, windowHeight/4 + 30 * i);
        }

        textSize(24);
        text('Enjoy!', windowWidth/2, windowHeight/4 + 30 * (sentences.length +1) );


    }else if (mode === "main") {
        //// MAIN
        bgd = Interface.main.BackgroundColor;
        fill(Interface.main.TextColor);
        textSize(20);


        //// BUTTONS
        instr_button.show()
        instr_button.mousePressed(changeModeInstr);
        volume_slider.hide()

        //Title
        textAlign(LEFT);
        text('Welcome back,', windowWidth / 7, windowHeight / 5 - 40);
        text('How are you feeling today?', windowWidth / 7, windowHeight / 5);

        //////// IMPLEMENT THE ABOVE WITH SYSTEM VOICE



        // Draw three ellipses
        ellipseMode(CENTER);
        noStroke();

        drawEllipses();

        if (dist(windowWidth / 5, windowHeight / 2, mouseX, mouseY) < diam / 2) {
            //focused
            fill(Interface.meditation.CircleHover[0]);
            ellipse( windowWidth / 5, windowHeight / 2, diam, diam);
        } else if (dist(2 * windowWidth / 5, windowHeight / 2, mouseX, mouseY) < diam / 2) {
            fill(Interface.meditation.CircleHover[1]);
            ellipse(2 * windowWidth / 5, windowHeight / 2, diam, diam);
        } else if (dist(3 * windowWidth / 5, windowHeight / 2, mouseX, mouseY) < diam / 2) {
            fill(Interface.meditation.CircleHover[2]);
            ellipse(3 * windowWidth / 5, windowHeight / 2, diam, diam);
        } else if (dist(4 * windowWidth / 5, windowHeight / 2, mouseX, mouseY) < diam / 2) {
            fill(Interface.meditation.CircleHover[3]);
            ellipse(4 * windowWidth / 5, windowHeight / 2, diam, diam);
        }

        // Mood text
        textAlign(CENTER);
        textSize(17);
        fill(255)
        text('focus', windowWidth / 5, windowHeight / 2);
        text('happiness', 2 * windowWidth / 5, windowHeight / 2);
        text('zen', 3 * windowWidth / 5,  windowHeight / 2);
        text('sleep', 4 * windowWidth / 5, windowHeight / 2);

        if (sound != false) {
            sound.pause();
        }

        volume_slider.hide()
        ////Draw fingers
        //paint();

    ////// MEDITATION
    } else if (mode === "meditation") {

        ///Volume control with swipe up gesture
        // Could be implemented here

        textAlign(CENTER)
        //Check mood selection to set mood/colors
        background(Interface.meditation.BackgroundColor[moodNum]);

        back_button.show()
        back_button.mousePressed(changeModeMain);
        volume_slider.show()
        slider_val = volume_slider.value();

        if (system.particles.length < 3) {
            system.particles.push(new Particle());
        } else {
            system.particles.shift();
            system.particles.shift();
        }
        system.run();

        //tint(255, 120);

        fill(Interface.meditation.CircleColor[moodNum]);
        ellipseMode(CENTER);
        ellipse(windowWidth / 2, windowHeight / 2, diam, diam);

        //Erase Instructions
        fill(255);
        textSize(12);
        //text('Return to previous page with SPACEBAR', windowWidth / 2, 7 * windowHeight / 8);


        if (moodNum === 0) {
            sound_prev = sound;
            sound = sound_focus;
        } else if (moodNum === 1) {
            sound_prev = sound;
            sound = sound_happy;
        } else if (moodNum === 2) {
            sound_prev = sound;
            sound = sound_zen;
        }else if (moodNum === 3) {
            sound_prev = sound;
            sound = sound_relax;
        }

        sound.setVolume(slider_val);

        if (sound_prev != sound) {
            if (sound_prev){
                sound_prev.pause();
            }
            sound.setVolume(slider_val);
            sound.play();
        }



        ellipse(windowWidth / 2, windowHeight / 2, diam, diam);




    ////END SCREEN
    } else if (mode === "end_screen") {
        fill(Interface.main.TextColor);
            textSize(30);
            text('Namaste', windowWidth/2, 2* windowHeight/3);
            textSize(20);
            text('Until next time...', windowWidth/2, windowHeight/3);
            imageMode(CENTER);
            image(namaste, windowWidth/2, windowHeight/2, windowHeight/3, windowHeight/4);
            sound.fade(0, 1)

        back_button.show()
        back_button.mousePressed(changeModeMain);
        volume_slider.hide();
    }

}

//Upon mouse click, it checks is it happens within mood-circles and sets the mood accordingly
function mouseReleased() {
    //Main screen ellipses used as buttons
    if (dist(windowWidth / 5, windowHeight / 2, mouseX, mouseY) < diam / 2) {
        //focused
        changeModeMeditation();
        moodNum = 0;
    } else if (dist(2 * windowWidth / 5, windowHeight / 2, mouseX, mouseY) < diam / 2) {
        changeModeMeditation();
        moodNum = 1;
    } else if (dist(3 * windowWidth / 5, windowHeight / 2, mouseX, mouseY) < diam / 2) {
        changeModeMeditation();
        moodNum = 2;
    } else if (dist(4 * windowWidth / 5, windowHeight / 2, mouseX, mouseY) < diam / 2) {
        changeModeMeditation();
        moodNum = 3;
    }
}

function keyPressed() {
    if (mode === "meditation"){
        changeModeMain();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    system = new ParticleSystem(createVector(windowWidth / 2, windowHeight / 2));
}


function drawEllipses() {
    for (let i = 0; i < 4; ++i) {
        fill(Interface.meditation.BackgroundColor[i]);
        ellipse((i + 1) * windowWidth / 5, windowHeight / 2, diam, diam);
    }
}

//////// Instructions Button
function displayButton(button){
    let b = button;
    if (b === instr_button){
        b.position(windowWidth - 160, windowHeight/20);
        b.style('background-color', "#6E878E");
        b.style('color', "#FFFFFF");
        b.style('font-size', "11px");

    } else if (b === back_button){
        b.position( 160, windowHeight/20);
        b.style('background-color', "#6E878E");
        b.style('color', "#FFFFFF");
        b.style('font-size', "11px");
        b.mousePressed(changeModeMain);
    }
}

function changeModeInstr(){
    instr_button.hide();
    back_button.show();
    //displaySlider(volume_slider, sound)
    mode = "instructions";
}

function changeModeMain(){
    mode = "main";
}

function changeModeMeditation(){
    instr_button.hide();
    back_button.show();
    volume_slider.show();
    mode = "meditation";
}

function changeModeEnd(){
    back_button.show();
    mode = "end_screen";
}

function displaySlider(slider){
    let s = slider;
    s.position(windowWidth - 200, windowHeight/20);
    s.style('background-color', "#6E878E");
    s.style('color', "#FFFFFF");
    s.style('width', "100px");
}




//Particle Effect Classes

let Particle = function () {
    this.position = createVector(system.center.x, system.center.y);
    this.pcolor = color(255, 255, 255, random(180));
    this.radius = random(width / 9, width / 5);
    this.a = 0;
};

Particle.prototype.run = function () {
    this.update();
    this.display();
};

Particle.prototype.update = function () {
    if (frameCount % 60 === 0) {
        this.a = Math.cos(2 * Math.PI * frameCount / 60);
    }
    this.radius += this.a;
    this.pcolor = color(255, 255, 255, random(50, 100));
};

Particle.prototype.display = function () {
    noStroke();
    //pg.fill(255, 220);
    fill(this.pcolor, random(180));
    ellipse(this.position.x, this.position.y, this.radius, this.radius);
};

let ParticleSystem = function (center) {
    this.center = center.copy();
    this.particles = [];
};


Particle.prototype.connect = function () {
    system.particles.forEach(particle => {
        let d = dist(this.position.x, this.position.y, particle.position.x, particle.position.y);
        if (d < windowWidth / 10) {
            fill(255, 20);
            strokeWeight(30);
            stroke(255, 10);
            line(this.position.x, this.position.y, particle.position.x, particle.position.y);
        }
    });

};


ParticleSystem.prototype.run = function () {
    for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i];
        //p.connect();
        p.run();
    }
};


// Speech
function parseResult() {
    // recognition system will often append words into phrases.
    // so hack here is to only use the last word:
    var mostrecentword = myRec.resultString.split(' ').pop();
    console.log(mostrecentword);

    if ((mode === 'meditation') || (mode === 'instructions')) {
        var user_commands = ['namaste', 'nice', 'finish', 'end', 'I am done', 'back'];
        user_commands.forEach(word => {
            if (mostrecentword.indexOf(word) !== -1) {
                if (word.indexOf('back') === -1) {
                    changeModeEnd();
                } else {
                    changeModeMain();
                }
            }
        })

    } else if (mode === 'main') {
        if (mostrecentword.indexOf('focus') !== -1 || (mostrecentword.indexOf('Focus') !== -1)) {
            changeModeMeditation();
            mode = "meditation";
            moodNum = 0;
        } else if (mostrecentword.indexOf('happy') !== -1 || (mostrecentword.indexOf('happiness') !== -1)) {
            changeModeMeditation();
            mode = "meditation";
            moodNum = 1;
        } else if (mostrecentword.indexOf('zen' || 'Zen') !== -1) {
            changeModeMeditation();
            mode = "meditation";
            moodNum = 2;
        } else if (mostrecentword.indexOf('relax') !== -1 || (mostrecentword.indexOf('sleep') !== -1)) {
            changeModeMeditation();
            mode = "meditation";
            moodNum = 3;
        }
    }

    // var user_go_back = ['back', 'go back'];
    // user_go_back.forEach(word => {
    //     if(mostrecentword.indexOf(word)!==-1) {
    //        if (mode === 'main'){
    //            fill(255);
    //            text('Your heart is in the right place', windowWidth/2, 3 * windowHeight/5);
    //        } else {
    //            mode === 'main';
    //        }
    //     }
    // })

    // else if(mostrecentword.indexOf("down")!==-1) { dx=0;dy=1; }
    // else if(mostrecentword.indexOf("clear")!==-1) { background(255); }

}
