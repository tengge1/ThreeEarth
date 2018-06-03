import Viewer from './Viewer';
import Wgs84 from '../globe/ellipsoid/Wgs84';
import GeoUtils from '../utils/GeoUtils';

/**
 * 轨道查看器
 */
class OrbitViewer extends Viewer {

    constructor(app) {
        super(app);
        this.minDistance = 1.0; // 离地心最近距离
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

        this.oldX = 0;
        this.oldY = 0;
        this.oldZ = 0;
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
        if (!this.app.mouse.onEarth) {
            this._mouseX = event.offsetX;
            this._mouseY = event.offsetY;
            return;
        }

        if (this._mouseX === 0 && this._mouseY === 0) {
            this._mouseX = event.offsetX;
            this._mouseY = event.offsetY;
            return;
        }

        if (this.oldX === 0 && this.oldY === 0 && this.oldZ === 0) {
            this.oldX = this.app.mouse.cartesianX;
            this.oldY = this.app.mouse.cartesianY;
            this.oldZ = this.app.mouse.cartesianZ;
            return;
        }

        // 计算相机转过的弧度
        var vec3_old = new THREE.Vector3(this.oldX, this.oldY, this.oldZ);
        var vec3_new = new THREE.Vector3(this.app.mouse.cartesianX, this.app.mouse.cartesianY, this.app.mouse.cartesianZ);

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

        this.oldX = this.app.mouse.cartesianX;
        this.oldY = this.app.mouse.cartesianY;
        this.oldZ = this.app.mouse.cartesianZ;
    }

    /**
     * 抬起鼠标
     * @param {*} event 
     */
    _onMouseUp(event) {
        this._mouseDown = false;
        this._mouseX = 0;
        this._mouseY = 0;
        this.oldX = 0;
        this.oldY = 0;
        this.oldZ = 0;
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

        this.app.camera.position.addVectors(position, position.clone().multiplyScalar(event.deltaY * 0.001));
    }
}

export default OrbitViewer;