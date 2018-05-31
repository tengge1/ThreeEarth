import Viewer from './Viewer';

class OrbitViewer extends Viewer {
    constructor(app) {
        super(app);
    }

    start() {
        this.app.on('mousewheel.OrbitViewer', (event) => {
            this._onMouseWheel(event);
        });
    }

    stop() {
        this.app.on('mousewheel.OrbitViewer', null);
    }

    _onMouseWheel(event) {
        this.app.camera.position.sub(new THREE.Vector3(1, 1, 1).multiplyScalar(event.deltaY * 0.0001));
    }
}

export default OrbitViewer;