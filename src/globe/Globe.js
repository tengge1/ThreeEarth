import TileMesh from './tile/TileMesh';
import Mouse from '../core/Mouse';
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
        this.mouse = new Mouse();
        this.raycast = new THREE.Raycaster();
        this.app.mouse = this.mouse;
    }

    /**
     * 开始渲染地球
     */
    render() {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                this.add(new TileMesh(j, i, 1));
            }
        }
        this.app.on(`mousemove.${this._id}`, (event) => this._onMouseMove(event));
    }

    /**
     * 清除地球渲染
     */
    clear() {
        this.children.length = [];
        this.app.on(`mousemove.${this._id}`, null);
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