import BaseService from './BaseService';
import Globe from '../globe/Globe';
import { Stats } from '../third_party';

/**
 * 渲染服务
 */
class RenderService extends BaseService {

    constructor(app) {
        super(app);
        this.container = this.app.container;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.CubeTextureLoader().setPath('assets/texture/skybox/')
            .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

        this.camera = new THREE.PerspectiveCamera(45, this.app.width / this.app.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(this.app.width, this.app.height);
        this.container.appendChild(this.renderer.domElement);

        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };

        this.ambientLight = new THREE.AmbientLight(new THREE.Color(0xffffff), 0.4);
        this.scene.add(this.ambientLight);
        this.directionalLight = new THREE.DirectionalLight(new THREE.Color(0xffffff), 0.8);
        this.scene.add(this.directionalLight);

        this.globe = new Globe(this);
        this.scene.add(this.globe);
        this.app.globe = this.globe;

        this.camera.position.z = 2;
        this.camera.lookAt(new THREE.Vector3());

        this.running = false;
    }

    start() {
        this.app.on('beforeFrame.RenderService', () => this._beforeFrame());
        this.app.on('frame.RenderService', () => this._frame());
        this.app.on('endFrame.RenderService', () => this._endFrame());
    }

    stop() {
        this.app.on('frame.RenderService', null);
    }

    _beforeFrame() {
        this.stats.begin();
    }

    _frame() {
        this.renderer.render(this.scene, this.camera);
    }

    _endFrame() {
        this.stats.end();
    }

}

export default RenderService;