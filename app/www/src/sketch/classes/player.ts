import processing from "p5";
import { PhysRect } from "sketch/physics";

class Player extends PhysRect {
  private speed: number;
  private jumpStrength: number;
  private attackRange: number;
  private attackSpeed: number;

  private attacking: boolean = false;
  private damaging: boolean = false;
  private facingDirection: number = 1;
  private doubleJumpReady: boolean = false;
  private ghosts: Array<{ x: number; y: number; o: number }> = [];

  constructor(
    x: number,
    y: number,
    options?: { speed?: number; jumpStrength?: number; attackRange?: number; attackSpeed?: number }
  ) {
    super(x, y, 30, 30, { friction: 0.75 });

    this.speed = options?.speed ?? 15;
    this.jumpStrength = options?.jumpStrength ?? 25;
    this.attackRange = options?.attackRange ?? 25;
    this.attackSpeed = options?.attackSpeed ?? 50;
  }

  isAttacking() {
    return this.damaging;
  }

  getDirection() {
    return this.facingDirection;
  }

  getAttackRange() {
    return this.attackRange;
  }

  draw(p5: processing) {
    // Lock rotation
    this.angle = 0;
    this.angularVelocity = 0;

    // Collision stuffs
    if (this.collisions.length > 0) this.doubleJumpReady = false;

    // Draw
    for (const ghost of this.ghosts) {
      if (ghost.o <= 0) this.ghosts.splice(this.ghosts.indexOf(ghost), 1);
      ghost.o -= 0.05;

      p5.blendMode(p5.MULTIPLY);
      p5.noStroke();
      p5.fill(`rgba(255, 0, 0, ${ghost.o})`);
      p5.push();
      p5.translate(ghost.x, ghost.y);
      p5.rect(0, 0, this.size.h);
      p5.pop();
      p5.blendMode(p5.BLEND);
    }

    p5.stroke("black");
    p5.fill("red");
    p5.push();
    p5.translate(this.position.x, this.position.y);
    p5.rect(0, 0, this.size.h);
    p5.pop();

    // Movement
    if (p5.keyIsDown(65)) {
      // left
      this.facingDirection = -1;
      this.velocity = { x: -1 * this.speed, y: this.velocity.y };
    }

    if (p5.keyIsDown(68)) {
      // right
      this.facingDirection = 1;
      this.velocity = { x: 1 * this.speed, y: this.velocity.y };
    }

    if (p5.keyIsDown(83) && !this.collisions.some((col) => col.matter.isStatic)) {
      // drop
      this.damaging = true;
      this.facingDirection = 1;
      this.velocity = { x: this.velocity.x * 0.5, y: 40 };
    }

    if (!(p5.keyIsDown(83) && !this.collisions.some((col) => col.matter.isStatic)) && !this.attacking) {
      this.damaging = false;
    }

    // Attacking
    if (this.attacking) {
      this.position = {
        x: this.position.x + this.facingDirection * this.attackRange,
        y: this.position.y,
      };

      this.ghosts.push({
        ...this.position,
        o: 1,
      });

      this.ghosts.at(-1)!.o /= 2;
    }
  }

  keyPressed(p5: processing, ev: KeyboardEvent) {
    if (ev.key == " " && (this.collisions.some((col) => col.matter.isStatic) || this.doubleJumpReady)) {
      this.velocity = { x: this.velocity.x, y: -this.jumpStrength };
      if (this.doubleJumpReady) this.doubleJumpReady = false;
      return;
    }
  }

  mousePressed(p5: processing, ev: MouseEvent) {
    if (this.attacking) return;
    if (ev.buttons == 1 || ev.buttons == 2) {
      this.facingDirection = ev.buttons == 2 ? 1 : -1;

      this.matter.isStatic = true;
      this.attacking = true;
      this.damaging = true;
      this.doubleJumpReady = true;

      setTimeout(() => {
        this.matter.isStatic = false;
        this.velocity = { x: this.velocity.x, y: 0 };
      }, this.attackSpeed);

      setTimeout(() => {
        this.attacking = false;
      }, this.attackSpeed + 50);
      return;
    }
  }
}

export default Player;
