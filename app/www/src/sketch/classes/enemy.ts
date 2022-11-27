import processing from "p5";
import { PhysCirc } from "sketch/physics";
import Player from "./player";

class Enemy extends PhysCirc {
  private image: processing.Image;
  private name: string;
  private color: string;
  private stunned: boolean = false;
  private stunnedTime: number = 500;
  private player: Player;

  constructor(
    p5: processing,
    img: string,
    colName: string,
    x: number,
    y: number,
    playerRef: Player
  ) {
    super(x, y, 20, { isSensor: true, mass: 0 });

    // TODO: Setup success and fail callbacks
    this.image = p5.loadImage(img);

    this.name = colName.split(":")[0];
    this.color = colName.split(":")[1];

    this.player = playerRef;
  }

  getStunnedTime() {
    return this.stunnedTime;
  }

  draw(p5: processing) {
    p5.push();
    // Emote
    p5.translate(this.position.x, this.position.y);
    p5.rotate(this.angle);
    p5.image(this.image, -this.size, -this.size, this.size * 2, this.size * 2);

    // Name Text
    p5.textSize(12);
    p5.fill(this.color ?? "grey");
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(this.name, 0, -this.size * 1.75);
    p5.pop();

    if (this.position.y > p5.height + this.size) {
      this.position = { x: p5.random(0, p5.width), y: -this.size };
    }

    if (this.stunned) return;

    this.angle = 0;
    this.angularVelocity = 0;

    for (const col of this.collisions) {
      if (!(col instanceof Player)) continue;

      p5.fill("yellow");

      if (col.isAttacking()) {
        p5.fill("red");
        this.stunned = true;
        this.stunnedTime += 250;
        this.angularVelocity = (Math.random() * 2 - 1) / 3;
        this.matter.isSensor = false;

        setTimeout(() => {
          this.stunned = false;
          this.matter.isSensor = true;
        }, this.stunnedTime);
      }
    }

    // Create a vector from the enemy to the player
    const enemyToPlayer = {
      x: this.player.position.x - this.position.x,
      y: this.player.position.y - this.position.y,
    };

    // Normalize the vector
    const enemyToPlayerMag = Math.sqrt(
      enemyToPlayer.x * enemyToPlayer.x + enemyToPlayer.y * enemyToPlayer.y
    );

    // Move the enemy towards the player
    this.velocity = {
      x: (enemyToPlayer.x / enemyToPlayerMag) * 5 + (Math.random() * 2 - 1) * 5,
      y:
        (enemyToPlayer.y / enemyToPlayerMag) * 5 -
        0.5 +
        (Math.random() * 2 - 1) * 5,
    };

    // super.draw(p5);
  }
}

export default Enemy;
