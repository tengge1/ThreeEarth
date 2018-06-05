import Viewer from './Viewer';
import Wgs84 from '../globe/ellipsoid/Wgs84';
import GeoUtils from '../utils/GeoUtils';

/**
 * 轨道查看器
 */
class OrbitViewer extends Viewer {

    constructor(app) {
        super(app);
        this.minDistance = 1.1; // 离地心最近距离
        this.maxDistance = 5.0; // 离地心最远距离
    }

    /**
     * 开始查看
     */
    start() {
        this.app.on(`mousedown.${this.id}`, (event) => {
            this._onMouseDown(event);
        });
        this.app.on(`mousemove.${this.id}`, (event) => {
            this._onMouseMove(event);
        });
        this.app.on(`mouseup.${this.id}`, (event) => {
            this._onMouseUp(event);
        });
        this.app.on(`mousewheel.${this.id}`, (event) => {
            this._onMouseWheel(event);
        });
    }

    /**
     * 停止查看
     */
    stop() {
        this.app.on(`mousedown.${this.id}`, null);
        this.app.on(`mousemove.${this.id}`, null);
        this.app.on(`mouseup.${this.id}`, null);
        this.app.on(`mousewheel.${this.id}`, null);
    }

    /**
     * 按下鼠标
     * @param {*} event 鼠标事件
     */
    _onMouseDown(event) {
        if (event.button !== THREE.MOUSE.LEFT) {
            return;
        }
        this._mouseDown = true;
        this._mouseX = event.offsetX;
        this._mouseY = event.offsetY;

        this._oldX = 0;
        this._oldY = 0;
        this._oldZ = 0;
    }

    _intersectPoint(x, y) {
        x = x / this.app.width * 2 - 1;
        y = -y / this.app.height * 2 + 1;
        var point1 = new THREE.Vector3(x, y, 1);
        var point2 = new THREE.Vector3(x, y, -1);
        point1 = point1.unproject(this.app.camera);
        point2 = point2.unproject(this.app.camera);
        var intersects = GeoUtils.lineIntersectGlobe(point1.x, point1.y, point1.z, point2.x, point2.y, point2.z);
        if (intersects == null) {
            return null;
        }
        if(intersects.length > 1) {
            return intersects[1];
        }
        return intersects[0];
    }

    /**
     * 鼠标移动
     * @param {*} event 
     */
    _onMouseMove(event) {
        if (!this._mouseDown) {
            return;
        }

        // 鼠标不在地球上
        var point = this._intersectPoint(event.offsetX, event.offsetY);
        if (point == null) {
            return;
        }

        if (this._mouseX === 0 && this._mouseY === 0) {
            this._mouseX = event.offsetX;
            this._mouseY = event.offsetY;
            return;
        }

        if (this._oldX === 0 && this._oldY === 0 && this._oldZ === 0) {
            this._oldX = point.x;
            this._oldY = point.y;
            this._oldZ = point.z;
            return;
        }

        // 计算相机转过的弧度
        var vec3_old = new THREE.Vector3(this._oldX, this._oldY, this._oldZ);
        var vec3_new = new THREE.Vector3(point.x, point.y, point.z);

        var axis = new THREE.Vector3().crossVectors(vec3_new, vec3_old);
        axis.normalize();
        var angle = vec3_new.angleTo(vec3_old);

        var position = this.app.camera.position;
        var distance = position.distanceTo(new THREE.Vector3()) - 1;

        position.applyAxisAngle(axis, angle);
        this.app.camera.matrixWorld.setPosition(position);
        this.app.camera.lookAt(new THREE.Vector3());

        this._mouseX = event.offsetX;
        this._mouseY = event.offsetY;

        this._oldX = point.x;
        this._oldY = point.y;
        this._oldZ = point.z;

        this.app.call('viewChange', this);
    }

    /**
     * 抬起鼠标
     * @param {*} event 
     */
    _onMouseUp(event) {
        this._mouseDown = false;
        this._mouseX = 0;
        this._mouseY = 0;
        this._oldX = 0;
        this._oldY = 0;
        this._oldZ = 0;
    }

    /**
     * 鼠标滚轮移动
     * @param {*} event 鼠标事件
     */
    _onMouseWheel(event) {
        // event.deltaY：向前滚动鼠标为负数，向后滚动鼠标为正数。
        // 放大：向前滚动滚轮。
        // 缩小：向后滚动滚轮。
        var position = this.app.camera.position;
        var distance = position.distanceTo(new THREE.Vector3());

        if (distance <= this.minDistance && event.deltaY < 0 ||
            distance >= this.maxDistance && event.deltaY > 0) {
            return;
        }

        // y = ax + b，距离1，速度为0，距离5，速度为1
        var dd = (event.deltaY * 0.001) * (0.25 * distance - 0.25);

        this.app.camera.position.addVectors(position, position.clone().multiplyScalar(dd));

        this.app.call('viewChange', this);
    }
}

export default OrbitViewer;