import processing from "p5";
import { PhysRect } from "sketch/physics";

class Player extends PhysRect {
  private damaging: boolean = false;

  constructor(
    x: number,
    y: number,
  ) {
    super(x, y, 20, 20, { isStatic: true, isSensor: true, friction: 0.75 });
  }

  isAttacking() {
    return this.damaging;
  }

  draw(p5: processing, debug: boolean = false) {
    this.position = {x: p5.mouseX, y: p5.mouseY};
    this.damaging = true;

    // Lock rotation
    this.angle = 0;
    this.angularVelocity = 0;

    // Draw player
    if (debug) {
      p5.stroke("black");
      p5.fill("red");
      p5.push();
      p5.translate(this.position.x, this.position.y);
      p5.rect(0, 0, this.size.h);
      p5.pop();
    }

  }
}

export default Player;
