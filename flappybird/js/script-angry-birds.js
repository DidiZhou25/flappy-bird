// Creates the physics engine. This engine will update all bodies in the physics world at approx. 60fps.
var engine = Matter.Engine.create();
// engine.timing.timeScale = 0.1;

Matter.Engine.run(engine);

// Creates the renderer. This renderer will draw each body in the physics world on a html canvas at approx. 60fps.
var render = Matter.Render.create({
    canvas: document.getElementById('game'),
    engine: engine,
    options: {
        width: 1000,
        height: 720,
        wireframes: false,
        background: "images/sky.png"
    }
});

Matter.Render.run(render);

//****//    

var floor = Matter.Bodies.rectangle(500, 720 - (130 / 2), 1000, 130, {isStatic: true});
floor.render.sprite.texture = 'images/floor.png';
floor.label = 'floor';
Matter.World.add(engine.world, floor);

createPlank(750, 720 - 130 - 102);
createPlank(750, 720 - 130 - 306);

var bird = Matter.Bodies.circle(200, 400, 23);
bird.render.sprite.texture = 'images/bird.png';
bird.label = 'bird';
Matter.World.add(engine.world, bird);

var pig = Matter.Bodies.circle(750, 140, 24);
pig.render.sprite.texture = 'images/pig.png';
pig.label = 'pig';
Matter.World.add(engine.world, pig);

var mouseDownPositionX;
var mouseUpPositionX;
var mouseDownPositionY;
var mouseUpPositionY;

Matter.Events.on(engine, 'collisionStart', function(e){
    console.log(e.pairs[0]);

    // check if pig hits floor
    if(e.pairs[0].bodyA.label == 'pig' && e.pairs[0].bodyB.label == 'floor' || 
    e.pairs[0].bodyA.label == 'floor' && e.pairs[0].bodyB.label == 'pig'){
        console.log('pig died!');
    }

});

function createPlank(positionX, positionY){
    var plank = Matter.Bodies.rectangle(positionX, positionY, 20, 204, {isStatic: false});
    plank.render.sprite.texture = 'images/plank.png';
    Matter.World.add(engine.world, plank);
}

function shootBird(){
    var forceX = mouseDownPositionX - mouseUpPositionX;
    var forceY = mouseDownPositionY - mouseUpPositionY;

    forceX /= 1000;
    forceY /= 1000;

    Matter.Body.applyForce(bird, bird.position, {x: forceX, y: forceY});
}

document.addEventListener('keydown', function(e){
    console.log(e.keyCode);

    switch(e.keyCode){
        case 38:
            Matter.Body.applyForce(bird, bird.position, {x: 0, y: -0.05});
            break;
        case 39:
            Matter.Body.applyForce(bird, bird.position, {x: 0.05, y: 0});
            break;
    }
 });

document.getElementById('game').addEventListener('mousemove', function(e){
    // console.log(e);

    document.getElementById('mouse-position-x').innerText = e.offsetX;
    document.getElementById('mouse-position-y').innerText = e.offsetY;
});

document.getElementById('game').addEventListener('mousedown', function(e){

    document.getElementById('mouse-position-down-x').innerText = e.offsetX;
    document.getElementById('mouse-position-down-y').innerText = e.offsetY;

    // createPlank(e.offsetX, e.offsetY);
    mouseDownPositionX = e.offsetX;
    mouseDownPositionY = e.offsetY;

});

document.getElementById('game').addEventListener('mouseup', function(e){

    mouseUpPositionX = e.offsetX;
    mouseUpPositionY = e.offsetY;

    shootBird();

});