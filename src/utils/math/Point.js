/**
 * 点
 */
class Point {

    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    /**
     * 计算到另一个点的距离
     * @param {*} point 
     */
    distanceToPoint(point) {
        return Math.sqrt(
            Math.pow(point.x - this.x, 2) +
            Math.pow(point.y - this.y, 2) +
            Math.pow(point.z - this.z, 2)
        );
    }

}

export default Point;