export default class SpriteManager {
  static context;
  static sprites = [];
  constructor() {}

  static async load(url) {
    const image = new Image(280, 168);
    image.src = url;
    try {
      await image.decode();
      const canvas = new OffscreenCanvas(image.width, image.height);
      this.context = canvas.getContext("2d");
      this.context.drawImage(image, 0, 0);
      this.blankImage = this.context.getImageData(112, 56, 56, 56);
    } catch (err) {
      throw err;
    }
  }

  static draw(context, board, dragging, axis, target, amount) {
    for (let space of board.model) {
      const imageData = space.cleared ? SpriteManager.blankImage:space.imageData; 
      context.putImageData(imageData, space.col * 56, space.row * 56);
    }
    if(dragging && axis === "column"){
        this.rotateColumn(target, amount, context);
    }
    if(dragging && axis === "row"){
        this.rotateRow(target, amount, context);
    }
  }

  static rotateColumn(col, amount, context) {
    if(amount === 0) return;
    const abs = Math.abs(amount);
    let carry, remainder;
    if(amount > 0){
        remainder = context.getImageData(col * 56, 0, 56, 560 - abs);
        carry = context.getImageData(col * 56, 560 - abs, 56, abs);
        context.putImageData(remainder, col * 56, abs);
        context.putImageData(carry, col * 56, 0);
    } else {
        remainder = context.getImageData(col * 56, abs, 56, 560 - abs);
        carry = context.getImageData(col * 56, 0, 56, abs);
        context.putImageData(remainder, col * 56, 0);
        context.putImageData(carry, col * 56, 560 - abs);
    }
  }

  static rotateRow(row, amount, context) {
    if(amount === 0) return;
    const abs = Math.abs(amount);
    let carry, remainder;
    if(amount > 0){
        remainder = context.getImageData(0, row * 56, 560 - abs, 56);
        carry = context.getImageData(560 - abs, row * 56, abs, 56);
        context.putImageData(remainder, abs, row * 56);
        context.putImageData(carry, 0, row * 56);
    } else {
        remainder = context.getImageData(abs, row * 56, 560 - abs, 56);
        carry = context.getImageData(0, row * 56, abs, 56);
        context.putImageData(remainder, 0, row * 56);
        context.putImageData(carry, 560 - abs, row * 56);
    }
  }
  
  static getImageData(num) {
    switch (num) {
      case 0:
        return this.context.getImageData(56, 0, 56, 56);
      case 1:
        return this.context.getImageData(56, 56, 56, 56);
      case 2:
        return this.context.getImageData(224, 0, 56, 56);
      case 3:
        return this.context.getImageData(168, 112, 56, 56);
      case 4:
        return this.context.getImageData(0, 56, 56, 56);
      default:
        // throw
        break;
    }
  }
}
