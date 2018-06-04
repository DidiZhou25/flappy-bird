// Add canvas references. We need this to add some custom rendering.
var canvas = document.getElementById('game');
var canvasContext = canvas.getContext('2d');

// Creates the physics engine. This engine will update all bodies in the physics world at approx. 60fps.
var engine = Matter.Engine.create();

Matter.Engine.run(engine);

// Creates the renderer. This renderer will draw each body in the physics world on a html canvas at approx. 60fps.
var render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "images/background.png"
    }
});

Matter.Render.run(render);

//****//    

var flySound = document.getElementById('fly-sound');
var dieSound = document.getElementById('die-sound');
var winSound = document.getElementById('win-sound');

var floor = Matter.Bodies.rectangle(500, 600 - (74 / 2), 1000, 74, {isStatic: true});
floor.render.sprite.texture = 'images/floor.png';
floor.label = 'surface';
Matter.World.add(engine.world, floor);

var ceiling = Matter.Bodies.rectangle(400, -50, 800, 100, {isStatic: true});
ceiling.label = 'surface';
Matter.World.add(engine.world, ceiling);

var pipesTop = new Array();
var pipesBottom = new Array();
var winSensor = new Array();

for (var i = 0; i < 100; i++) {
    var offsetY = Math.random() * 300;

    var pipe = Matter.Bodies.rectangle(500 + (i * 300), -225 + (offsetY), 80, 500, {isStatic: true});
    pipe.render.sprite.texture = 'images/pipe.png';
    pipe.label = 'surface';
    Matter.World.add(engine.world, pipe);

    pipesTop.push(pipe);

    var pipe = Matter.Bodies.rectangle(500 + (i * 300), 450 + (offsetY), 80, 500, {isStatic: true});
    pipe.render.sprite.texture = 'images/pipe.png';
    pipe.label = 'surface';
    Matter.World.add(engine.world, pipe);

    pipesBottom.push(pipe);

    var win = Matter.Bodies.rectangle(500 + (i * 300), 400, 3, 800, {isStatic: true, isSensor: true});
    win.label = 'sensor';
    win.render.visible = false;
    Matter.World.add(engine.world, win);

    winSensor.push(win);
}

var flappy = Matter.Bodies.rectangle(200, 250, 75, 56);
flappy.render.sprite.texture = 'images/flappy.png';
flappy.label = 'flappy';
Matter.World.add(engine.world, flappy);
var flappyIsKill;

Matter.Events.on(engine, 'collisionStart', function (e) {
    // check if flappy hits floor
    if (e.pairs[0].bodyA.label == 'surface' && e.pairs[0].bodyB.label == 'flappy' ||
        e.pairs[0].bodyA.label == 'flappy' && e.pairs[0].bodyB.label == 'surface') {

        if (!flappyIsKill) {
            flappyIsKill = true;
            dieSound.play();
            console.log('flappy died!');
        }
    }
    if (e.pairs[0].bodyA.label == 'sensor' && e.pairs[0].bodyB.label == 'flappy' ||
        e.pairs[0].bodyA.label == 'flappy' && e.pairs[0].bodyB.label == 'sensor') {
        winSound.play();
    }
});

Matter.Events.on(engine, 'afterUpdate', function (e) {
    if (flappy.velocity.y < -7) {
        Matter.Body.setVelocity(flappy, {x: flappy.velocity.x, y: -5});
    }

    var angle = 0;

    if (flappy.velocity.y < 0) {
        angle = -45 * (flappy.velocity.y / -7);
    }

    if (flappy.velocity.y > 0) {
        angle = 45 * (flappy.velocity.y / 7);
    }

    Matter.Body.setAngle(flappy, Math.radians(angle));

    if (!flappyIsKill) {
        floor.position.x -= 4;


        if (floor.position.x < 0) {
            floor.position.x = 800;
        }

        pipesTop.forEach(function (pipe) {
            Matter.Body.setPosition(pipe, {x: pipe.position.x - 4, y: pipe.position.y});
        });

        pipesBottom.forEach(function (pipe) {
            Matter.Body.setPosition(pipe, {x: pipe.position.x - 4, y: pipe.position.y});
        });

        winSensor.forEach(function (win) {
            Matter.Body.setPosition(win, {x: win.position.x - 4, y: win.position.y});
        });
    }
});

document.addEventListener('keydown', function (e) {

    switch (e.keyCode) {
        case 32:
            flySound.play();
            if (!flappyIsKill) {
                Matter.Body.applyForce(flappy, flappy.position, {x: 0, y: -0.2});
                break;
            }
    }
});