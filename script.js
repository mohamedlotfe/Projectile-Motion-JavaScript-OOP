'use strict';

/////global variables////////
const G = 9.81;
const INITVELOCITY = 20;
const INITANGEL = 20;
const INITCOLOR = "red";
const GAMELOOP_TIME = 15;
const INITRADUIS = 3;
///////HTML Elements////////
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const initailBall = { x: 0, y: canvas.height - 1 }

let shooterBtn = document.getElementById("shooterBtn");
let clearBtn = document.getElementById("clearBtn");
let velocityInput = document.getElementById("Velocity");
let angleInput = document.getElementById("Angle");

class Ball {

    constructor(position, velocity, acceleration, context, color = getRandomColor(), radius = INITRADUIS) {
        this.position = { x: position.x, y: position.y }
        this.velocity = { x: velocity.x, y: velocity.y }
        this.acceleration = { x: 0, y: acceleration / 60 };
        this.context = context;

        this.radius = radius;
        this.color = color;
    }

    move() {
        // Accerlate then change position
        this.velocity.x += this.acceleration.x;
        this.velocity.y = this.velocity.y + this.acceleration.y;

        this.position.x += this.velocity.x;
        this.position.y -= this.velocity.y;
    }
    draw() {
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        this.context.fill();
    }


}

class Shooter {
    constructor(context, velocity, angle) {
        this.context = context;
        this.velocity = { x: velocity.x, y: velocity.y };
        this.angle = angle;
        this.acceleration = -9.807;
        this.ballsTrunc = [];
    }
    getTime() {
        // t=Vo-Vf/a
        return (Math.abs(this.velocity.y / this.acceleration) * 2).toFixed(3);
    }
    getMaxDistance(time) {
        //Xf=Vo*t
        return (this.velocity.x * time).toFixed(0);
    }
    getMaxHeight() {
        // Vo*Vo/2*a
        return Math.abs((this.velocity.y * this.velocity.y) / (2 * this.acceleration)).toFixed(2);
    }

    addBall() {
        this.ballsTrunc.push(new Ball(initailBall, this.velocity, this.acceleration, ctx))

        console.log(this.ballsTrunc.length);
    }
    shoot() {
        // console.log('shoot =>');
        if (this.ballsTrunc.length > 0)
            for (let i = this.ballsTrunc.length - 1; i >= 0; i--) {
                this.ballsTrunc[i].move();
                this.ballsTrunc[i].draw();
            }
    }
}



shooterBtn.addEventListener('click', () => { launchProjectile(); });
clearBtn.addEventListener('click', () => {
    clearScreen();
    DisplayValues(0, 0, 0)

});
var shooter = new Shooter(ctx, getVelocityXY(INITVELOCITY, INITANGEL), INITANGEL);
DisplayValues(0, 0, 0)

function launchProjectile() {
    let time, maxDistance = 0, maxHeight = 0, counter = 0;

    clearScreen()
    // Get Input Values
    let angle = parseFloat(angleInput.value) || INITANGEL;
    let velocity = parseFloat(velocityInput.value) || INITVELOCITY;

    // Update Shooter with Input  values 
    shooter.velocity = getVelocityXY(velocity, angle);
    shooter.angle = angle;
    time = shooter.getTime()
    maxDistance = shooter.getMaxDistance(time);
    maxHeight = shooter.getMaxHeight();

    //Display Caluclated Values 
    DisplayValues(time, maxDistance, maxHeight)
    // Add new ball to shooter
    shooter.addBall();

    setInterval(function () {
        //ctx.clearRect(0, 0, canvas.width, canvas.height); 
        shooter.shoot();
        counter++;
    }, GAMELOOP_TIME);
}




/////////////Helper functions//////////
function getVelocityXY(velocity, angle) {
    let velX = Math.sin((angle * Math.PI) / 180) * velocity;
    let velY = Math.cos((angle * Math.PI) / 180) * velocity;
    return { x: velX, y: velY };
}
function DisplayValues(time, maxDistance, maxHeight) {
    document.getElementById("time").value = time
    document.getElementById("maxDistance").value = maxDistance
    document.getElementById("maxHeight").value = maxHeight
}
function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function getRandomColor() {
    let colors = ['gray', 'green', 'orange', 'red', 'cyan', 'blue', 'Purple', 'Lime', 'Magenta', 'silver', 'gray', 'green', 'orange', 'brown', 'maroon'];
    return colors[randomNum(0, colors.length-1)];
}
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
