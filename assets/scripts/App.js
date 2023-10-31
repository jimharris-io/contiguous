import SpriteManager from "./SpriteManager.js";
import Pos from "./Pos.js";
import Board from "./Board.js";

export default class App {
  static fpsInterval = 1000 / 60;
  context;
  canvas;
  then = 0;
  dragActive = false;
  dragAxis = "";
  dragStartPos = new Pos(0, 0);
  dragTarget = -1;
  board;
  constructor() {
    this.init();
    this.callback = (event) => this.mouse(event);
    this.mousePos = new Pos(0, 0);
  }

  async init() {
    try {
      await SpriteManager.load("./assets/spritesheet.png");
      this.canvas = document.getElementsByTagName("canvas")[0];
      this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
      this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
      this.canvas.addEventListener("dblclick", this.doubleClick.bind(this));
      this.context = this.canvas.getContext("2d");
      this.board = new Board();
      requestAnimationFrame((timeStamp) => this.animate(timeStamp));
    } catch (err) {
      throw err;
    }
  }

  getAbsDistance(x1, y1, x2, y2) {
    const d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return Math.abs(d);
  }

  mouse(event) {
    if (this.dragActive && this.dragAxis === "") {
      const a =
        90 +
        (Math.atan2(
          event.offsetY - this.dragStartPos.y,
          event.offsetX - this.dragStartPos.x
        ) *
          180) /
          Math.PI;
      const d = this.getAbsDistance(
        event.offsetX,
        event.offsetY,
        this.dragStartPos.x,
        this.dragStartPos.y
      );
      if (d > 8) {
        if ((a > -45 && a < 45) || (a > 135 && a < 225)) {
          this.dragAxis = "column";
          this.dragTarget = parseInt(this.dragStartPos.x / 56);
        } else {
          this.dragAxis = "row";
          this.dragTarget = parseInt(this.dragStartPos.y / 56);
        }
      }
    }
    //
    this.mousePos = new Pos(event.offsetX, event.offsetY);
  }

  doubleClick(event) {
    const col = parseInt(event.offsetX / 56);
    const row = parseInt(event.offsetY / 56);
    const space = this.board.model.find((s) => s.col === col && s.row === row);
    if(space.cleared) return;
    const cleared = [];
    const fill = (model, row, col, token) => {
      if(!(row > -1 && row < 10 && col > -1 && col < 10)) return;
      const space = model.find((s) => s.col === col && s.row === row);
      if (space.token !== token || space.cleared) return;
      space.cleared = true;
      cleared.push(space);
      fill(model, row + 1, col, token);
      fill(model, row - 1, col, token);
      fill(model, row, col + 1, token);
      fill(model, row, col - 1, token);
    }
    fill(this.board.model, space.row, space.col, space.token);
    console.log(cleared);
  }

  mouseDown(event) {
    this.dragActive = true;
    this.canvas.addEventListener("mousemove", this.callback);
    this.mousePos = new Pos(event.offsetX, event.offsetY);
    this.dragStartPos = new Pos(event.offsetX, event.offsetY);
  }

  mouseUp() {
    this.canvas.removeEventListener("mousemove", this.callback);
    if (this.dragActive) {
      let spaces, d;
      if (this.dragAxis === "row") {
        d = this.mousePos.x - this.dragStartPos.x;
        if (d > 0) d += 28;
        if (d < 0) d -= 28;
        spaces = parseInt(d / 56);
        this.board.rotateRow(this.dragTarget, spaces);
      } else if (this.dragAxis === "column") {
        d = this.mousePos.y - this.dragStartPos.y;
        if (d > 0) d += 28;
        if (d < 0) d -= 28;
        spaces = parseInt(d / 56);
        this.board.rotateColumn(this.dragTarget, spaces);
      }
      this.dragActive = false;
      this.dragAxis = "";
      this.dragTarget = -1;
    }
  }

  animate(timeStamp) {
    requestAnimationFrame((timeStamp) => this.animate(timeStamp));
    const now = timeStamp;
    const elapsed = now - this.then;
    if (elapsed > App.fpsInterval) {
      this.then = now - (elapsed % App.fpsInterval);
      this.context.reset();
      //
      const fps = Math.max(1000 / elapsed, 1000 / App.fpsInterval);
      let amount = 0;
      if (this.dragActive) {
        if (this.dragAxis === "column") {
          amount = this.mousePos.y - this.dragStartPos.y;
        } else if (this.dragAxis === "row") {
          amount = this.mousePos.x - this.dragStartPos.x;
        }
      }
      SpriteManager.draw(
        this.context,
        this.board,
        this.dragActive,
        this.dragAxis,
        this.dragTarget,
        amount
      );
    }
  }
}