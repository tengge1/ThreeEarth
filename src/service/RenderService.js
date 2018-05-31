import BaseService from './BaseService';
import Globe from '../globe/Globe';
import OrbitViewer from '../view/OrbitViewer';
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
        this.app.scene = this.scene;

        this.camera = new THREE.PerspectiveCamera(45, this.app.width / this.app.height, 0.1, 1000);
        this.app.camera = this.camera;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.app.renderer = this.renderer;

        this.renderer.setSize(this.app.width, this.app.height);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitViewer(this.app);

        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);

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

    /**
     * 启动渲染服务
     */
    start() {
        this.controls.start();
        this.app.on('beforeFrame.RenderService', () => this._beforeFrame());
        this.app.on('frame.RenderService', () => this._frame());
        this.app.on('endFrame.RenderService', () => this._endFrame());
    }

    /**
     * 停止渲染服务
     */
    stop() {
        this.controls.stop();
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