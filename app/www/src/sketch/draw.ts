import { start, PhysRect } from "sketch/physics";

import processing from "p5";
import Player from "./classes/player";

const CANVAS_SIZE = { w: 1280, h: 720 };

const Sketch = (p5: processing) => {
  let player = new Player(0, 50);
  let enemy = new PhysRect(-20, -20, 30, 30, {
    // isStatic: true,
    // isSensor: true,
  });

  let world: Array<PhysRect> = [
    new PhysRect(-250, 100, 800, 20, { isStatic: true }),
    new PhysRect(-500, 300, 400, 20, { isStatic: true }),
    new PhysRect(50, 200, 400, 20, { isStatic: true }),
  ];

  // This is the same as our `function setup() { ... }`
  p5.setup = () => {
    p5.createCanvas(CANVAS_SIZE.w, CANVAS_SIZE.h);

    start(); // Start Physics
  };

  // This is the same as our `function draw() { ... }`
  p5.draw = () => {
    // p5.background("rgba(255, 255, 255, 0.1)");
    p5.background("white");

    p5.translate(p5.width / 2, p5.height / 2);

    p5.fill("green");
    for (const obj of world) {
      obj.draw(p5);
    }


    // Enemy
    enemy.angle = 0;
    enemy.angularVelocity = 0;

    p5.fill("blue");
    for (const col of enemy.collisions) {
      if (!(col instanceof Player)) continue;

      p5.fill("yellow");

      if (col.isAttacking()) {
        p5.fill("red");
        console.log("HIT", p5.millis());
        enemy.position = {
          x: enemy.position.x + col.getAttackRange() * col.getDirection(),
          y: enemy.position.y,
        };
        enemy.velocity = {
          x: col.getDirection() * 3,
          y: -10,
        };
      }
    }
    enemy.draw(p5);

    // Player
    player.draw(p5);
  };

  p5.keyPressed = (ev: KeyboardEvent) => {
    player.keyPressed(p5, ev);
  };

  p5.mousePressed = (ev: MouseEvent) => {
    player.mousePressed(p5, ev);
  };
};

export default Sketch;
