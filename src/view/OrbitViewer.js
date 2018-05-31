import Viewer from './Viewer';

/**
 * 可以平移、缩放的查看器
 */
class OrbitViewer extends Viewer {
    constructor(app) {
        super(app);
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector3();
    }

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

    stop() {
        this.app.on(`mousedown.${this.id}`, null);
        this.app.on(`mousemove.${this.id}`, null);
        this.app.on(`mouseup.${this.id}`, null);
        this.app.on(`mousewheel.${this.id}`, null);
    }

    _onMouseDown(event) {
        this.mouseDown = true;
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
    }

    _onMouseMove(event) {
        if (!this.mouseDown) {
            return;
        }

        // 判断鼠标是否经过地球，一旦经过，则不再判断。
        if (!this.onEarth) {
            this.mouse.x = event.offsetX / this.app.width * 2 - 1;
            this.mouse.y = - event.offsetY / this.app.height * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.app.camera);

            var intersect = this.raycaster.intersectObjects([this.app.globe])[0];
            if (intersect == null) {
                this.mouseX = event.offsetX;
                this.mouseY = event.offsetY;
                return;
            }
            this.onEarth = true;
        }

        // 计算鼠标位移对于地心的弧度，并将相机转过对应的弧度
        var dx = event.offsetX - this.mouseX;
        var dy = event.offsetY - this.mouseY;

    }

    _onMouseUp(event) {
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    _onMouseWheel(event) {
        // 最大距离5，最小距离1
        var position = this.app.camera.position;
        var distance = position.distanceTo(new THREE.Vector3());
        this.app.camera.position.sub(new THREE.Vector3().copy(position).multiplyScalar(event.deltaY * -0.001));
    }
}

export default OrbitViewer;