import { start, Phys, PhysCirc } from "sketch/physics";

import processing from "p5";
import Player from "./classes/player";
import Enemy from "./classes/enemy";

import { invoke } from "@tauri-apps/api/tauri";
import { Client } from "tmi.js";
import emotify from "./utils/emotes";

const PEG_SPACING = 65;
const EMOTE_DEATH = 3000;

const twitch = new Client({
  channels: ["dotmrjosh"],
});
twitch.connect();

const Sketch = (p5: processing) => {
  let player = new Player(0, 50);
  // let enemy = new PhysRect(-20, -20, 30, 30, {
  //   isSensor: true,
  // });

  let enemies = [
    new Enemy(
      p5,
      "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_9a759911d295485895b30ac011237c0d/default/dark/1.0",
      "Welcome!:pink",
      -200,
      -200,
      player
    ),
  ];

  let world: Array<Phys> = [];

  function generatePegs() {
    world = [];
    for (let x = 0; x < p5.width; x += PEG_SPACING) {
      for (let y = 0; y < p5.height; y += PEG_SPACING) {
        world.push(
          new PhysCirc(x + (y % 2) * (PEG_SPACING / 2), y, 10, {
            isStatic: true,
          })
        );
      }
    }
  }

  // This is the same as our `function setup() { ... }`
  p5.setup = async () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);

    // Get cursor position from rust
    setInterval(async () => {
      let pos: {x: number, y: number} = await invoke("get_cursor");
      p5.mouseX = pos.x;
      p5.mouseY = pos.y;
    }, 100);

    // Add emotes to screen when they are sent in chat
    twitch.addListener("message", (_channel, tags, message, _self) => {
      let emotes = emotify(message, tags.emotes);

      if (!emotes) return;

      for (const emote of emotes) {
        enemies.push(
          new Enemy(
            p5,
            emote.value,
            `${tags["display-name"] ?? ""}:${tags.color}`,
            p5.random(0, p5.width),
            p5.random(0, p5.height),
            player
          )
        );
      }
    });

    generatePegs();

    start(); // Start Physics
  };

  // This is the same as our `function draw() { ... }`
  p5.draw = () => {
    // p5.background("rgba(255, 255, 255, 0.1)");
    p5.clear(0, 0, 0, 0);

    // Pegs
    // for (const obj of world) {
    //   obj.draw(p5);
    // }

    // Enemy
    for (const enemy of enemies) {
      enemy.draw(p5);

      if (enemy.getStunnedTime() > EMOTE_DEATH) {
        enemy.remove();
        enemies.splice(enemies.indexOf(enemy), 1);
      }
    }

    // Player
    player.draw(p5);
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    generatePegs();
  };
};

export default Sketch;
