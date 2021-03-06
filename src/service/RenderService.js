import BaseService from './BaseService';
import Globe from '../globe/Globe';
import Sun from '../render/Sun';
import { OutlineEffect } from '../third_party';
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

        this.viewer = new OrbitViewer(this.app);

        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);

        this.ambientLight = new THREE.AmbientLight(new THREE.Color(0xffffff), 0.4);
        this.scene.add(this.ambientLight);

        this.sun = new Sun();
        this.sun.app = this.app;
        this.scene.add(this.sun);
        this.sun.init();
        this.sun.position.set(20, 0, 0);

        this.globe = new Globe(this.app);
        this.scene.add(this.globe);
        this.app.globe = this.globe;

        this.outline = new OutlineEffect(this.renderer, {
            defaultThickNess: 0.01,
            defaultColor: new THREE.Color(0x888888),
            defaultAlpha: 0.8,
            defaultKeepAlive: true
        });

        this.camera.position.x = 5;
        this.camera.up.copy(new THREE.Vector3(0, 0, 1));
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.running = false;
    }

    /**
     * 启动渲染服务
     */
    start() {
        this.globe.render();
        this.viewer.start();
        this.app.on(`beforeFrame.${this.id}`, () => this._beforeFrame());
        this.app.on(`frame.${this.id}`, () => this._frame());
        this.app.on(`endFrame.${this.id}`, () => this._endFrame());
        this.app.on(`resize.${this.id}`, () => this._onResize());
    }

    /**
     * 停止渲染服务
     */
    stop() {
        this.globe.clear();
        this.viewer.stop();
        this.app.on(`beforeFrame.${this.id}`, null);
        this.app.on(`frame.${this.id}`, null);
        this.app.on(`endFrame.${this.id}`, null);
        this.app.on(`resize.${this.id}`, null);
    }

    /**
     * 渲染之前
     */
    _beforeFrame() {
        this.stats.begin();
    }

    /**
     * 渲染过程
     */
    _frame() {
        this.app.call('beforeRender', this);
        this.renderer.render(this.scene, this.camera);
        this.outline.render(this.scene, this.camera);
        this.app.call('render', this);
    }

    /**
     * 渲染之后
     */
    _endFrame() {
        this.stats.end();
    }

    /**
     * 渲染区域自适应
     */
    _onResize() {
        this.app.width = this.container.clientWidth;
        this.app.height = this.container.clientHeight;
        this.renderer.setSize(this.app.width, this.app.height);
    }

}

export default RenderService;