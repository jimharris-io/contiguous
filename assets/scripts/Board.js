import SpriteManager from "./SpriteManager.js";

export default class {
  constructor() {
    this.model = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const token = parseInt(Math.random() * 5);
        const imageData = SpriteManager.getImageData(token);
        this.model.push(new Space(i, j, token, imageData));
      }
    }
  }

  rotateRow(num, spaces) {
    for (let space of this.model) {
        if(space.row === num) {
            let c = space.col;
            c = c + spaces;
            if(c > 9) c = c - 10;
            if(c < 0) c = 10 + c;
            space.col = c;
        }
    }
  }

  rotateColumn(num, spaces) {
    for (let space of this.model) {
        if(space.col === num) {
            let r = space.row;
            r = r + spaces;
            if(r > 9) r = r - 10;
            if(r < 0) r = 10 + r;
            space.row = r;
        }
    }
  }

}

class Space {
  constructor(col, row, token, imageData) {
    this.col = col;
    this.row = row;
    this.token = token;
    this.imageData = imageData;
    this.cleared = false;
  }
}
