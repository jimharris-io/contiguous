export default class Pos {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    static add(p, v){
        return new Pos(p.x + v.dx, p.y + v.dy)
    }
}