/**
 * 方向
 */
class Direction {

    constructor() {
        this.origin = new THREE.Vector3(); // 原点
        this.left = new THREE.Vector3(0, -1, 0); // 屏幕向左对应世界坐标系方向
        this.right = new THREE.Vector3(0, 1, 0); // 屏幕向右对应世界坐标系方向
        this.up = new THREE.Vector3(0, 0, 1); // 屏幕向上对应世界坐标系方向
        this.down = new THREE.Vector3(0, 0, -1); // 屏幕向下对应世界坐标系方向
        this.forward = new THREE.Vector3(-1, 0, 0); // 屏幕向前对应世界坐标系方向
        this.backward = new THREE.Vector3(1, 0, 0); // 屏幕向后对应世界坐标系方向
    }

}

export default Direction;