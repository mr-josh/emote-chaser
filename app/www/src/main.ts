import Sketch from "sketch/draw";
import p5 from "p5";

import { invoke } from "@tauri-apps/api/tauri";

invoke("enable_clickthrough");

// You're probably looking for the sketch/draw.ts file!
new p5(Sketch, document.getElementById("sketch")!);
