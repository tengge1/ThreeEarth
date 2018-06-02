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
        this._mouseLon = this.app.mouse._lon;
        this._mouseLat = this.app.mouse._lat;
        this._camPos = this.app.camera.position.clone();
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
            this._mouseLon = this.app.mouse._lon;
            this._mouseLat = this.app.mouse._lat;
            this._camPos = this.app.camera.position.clone();
            return;
        }

        // 鼠标在地球上，计算鼠标位移对于地心的弧度，并将相机转过相应的弧度
        if (this._mouseLon === 0.0 && this._mouseLat === 0.0) {
            this._mouseLon = this.app.mouse._lon;
            this._mouseLat = this.app.mouse._lat;
        }

        const dlon = this.app.mouse._lon - this._mouseLon;
        const dlat = this.app.mouse._lat - this._mouseLat;

        const position = this._camPos;
        const distance = position.distanceTo(new THREE.Vector3());
        const lonlat = GeoUtils._getLonLat(position.x, position.y, position.z);

        const xyz = GeoUtils._getXYZ(lonlat.lon + dlon, lonlat.lat, distance);
        this.app.camera.position.copy(xyz);
        this.app.camera.lookAt(new THREE.Vector3());
    }

    /**
     * 抬起鼠标
     * @param {*} event 
     */
    _onMouseUp(event) {
        this._mouseDown = false;
        this._mouseLon = 0.0;
        this._mouseLat = 0.0;
        this._camPos = null;
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