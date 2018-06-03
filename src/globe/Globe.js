import TileMesh from './tile/TileMesh';
import Mouse from '../core/Mouse';
import Direction from '../core/Direction';
import GeoUtils from '../utils/GeoUtils';

var ID = -1;

/**
 * 地球
 */
class Globe extends THREE.Object3D {

    constructor(app) {
        super();
        this.app = app;
        this._id = `Globe${ID--}`;

        // 记录鼠标当前位置各种信息
        this.mouse = new Mouse();
        this.app.mouse = this.mouse;

        // 记录当前各种方向信息
        this.direction = new Direction();
        this.app.direction = this.direction;

        this.raycast = new THREE.Raycaster();

        this.helper = new THREE.ArrowHelper(this.direction.right, app.direction.origin, 2, 0xff0000);
    }

    /**
     * 开始渲染地球（只调用了一次）
     */
    render() {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                this.add(new TileMesh(j, i, 1));
            }
        }
        this.app.scene.add(this.helper);
        this.app.on(`viewChange.${this._id}`, () => this._onViewChange());
        this.app.on(`mousemove.${this._id}`, (event) => this._onMouseMove(event));
    }

    /**
     * 清除地球渲染（只调用了一次）
     */
    clear() {
        this.children.length = [];
        this.app.on(`viewChange.${this._id}`, null);
        this.app.on(`mousemove.${this._id}`, null);
    }

    /**
     * 视野发生变化
     */
    _onViewChange() {
        // 计算相机初始位置和当前位置所在的轴，和旋转角度
        var axis = new THREE.Vector3().crossVectors(new THREE.Vector3(1), this.app.camera.position);
        var angle = new THREE.Vector3(1).angleTo(this.app.camera.position);

        var quat = new THREE.Quaternion();
        quat.setFromRotationMatrix(app.camera.matrixWorld);

        this.direction.left.copy(new THREE.Vector3(0, -1, 0).unproject(this.app.camera).normalize());
        this.direction.right.copy(new THREE.Vector3(1, 0, 0).unproject(this.app.camera).normalize());
        this.direction.up.copy(this.app.camera.up).applyQuaternion(quat).normalize();
        this.direction.down.copy(new THREE.Vector3(0, 0, -1).unproject(this.app.camera).normalize());
        this.direction.forward.copy(this.app.camera.position).multiplyScalar(-1).normalize();
        this.direction.backward.copy(this.direction.forward).multiplyScalar(-1);

        this.helper.setDirection(this.direction.backward);
    }

    /**
     * 碰撞检测
     */
    raycast(raycaster, intersects) {
        this.children.forEach((n) => {
            n.raycast(raycaster, intersects);
        });
    }

    /**
     * 鼠标移动
     * @param {*} event 鼠标事件
     */
    _onMouseMove(event) {
        this.mouse.x = event.offsetX / this.app.width * 2 - 1;
        this.mouse.y = -event.offsetY / this.app.height * 2 + 1;
        this.mouse.offsetX = event.offsetX;
        this.mouse.offsetY = event.offsetY;
        this.mouse.cartesianX = 0.0;
        this.mouse.cartesianY = 0.0;
        this.mouse.cartesianZ = 0.0;
        this.mouse._lon = 0.0;
        this.mouse.lon = 0.0;
        this.mouse._lat = 0.0;
        this.mouse.lat = 0.0;
        this.mouse._alt = 0.0;
        this.mouse.alt = 0.0;
        this.mouse.onEarth = false;

        this.raycast.setFromCamera(this.mouse, this.app.camera);
        var intersects = this.raycast.intersectObjects(this.children);

        // 鼠标射线没有与地面发生碰撞
        if (intersects.length === 0) {
            return;
        }

        // 鼠标射线与地面发生碰撞
        var obj = intersects[0];

        this.mouse.cartesianX = obj.point.x;
        this.mouse.cartesianY = obj.point.y;
        this.mouse.cartesianZ = obj.point.z;
        var lonlat = GeoUtils._getLonLat(obj.point.x, obj.point.y, obj.point.z);
        this.mouse._lon = lonlat.lon;
        this.mouse.lon = GeoUtils.degree(lonlat.lon);
        this.mouse._lat = lonlat.lat;
        this.mouse.lat = GeoUtils.degree(lonlat.lat);
        this.mouse._alt = lonlat.alt;
        this.mouse.alt = GeoUtils.degree(lonlat.alt);
        this.mouse.onEarth = true;
    }
}

export default Globe;