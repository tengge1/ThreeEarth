/**
 * 鼠标信息
 */
class Mouse extends THREE.Vector2 {
    constructor(x, y) {
        super(x, y);
        // this.x = 0.0; // 设备坐标x
        // this.y = 0.0; // 设备坐标y

        this.offsetX = 0.0; // 鼠标offsetX
        this.offsetY = 0.0; // 鼠标offsetY

        this.cartesianX = 0.0; // 与地面碰撞笛卡尔坐标x
        this.cartesianY = 0.0; // 与地面碰撞笛卡尔坐标y
        this.cartesianZ = 0.0; // 与地面碰撞笛卡尔坐标z

        this._lon = 0.0; // 与地面碰撞经度（弧度）
        this.lon = 0.0; // 与地面碰撞经度（角度）
        this._lat = 0.0; // 与地面碰撞纬度（弧度）
        this.lat = 0.0; // 与地面碰撞纬度（角度）
        this._alt = 0.0; // 海拔 / 地球半径
        this.alt = 0.0; // 海拔

        this.onEarth = false; // 鼠标是否在地球上
    }
}

export default Mouse;