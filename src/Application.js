import Options from './Options';
import EventDispatcher from './event/EventDispatcher';
import BaseService from './service/BaseService';
import RenderService from './service/RenderService';

/**
 * 应用程序
 */
class Application {

    constructor(container, options) {
        this.container = container;
        if (this.container == null) {
            throw 'Application: container未定义。';
        }
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.options = new Options(options);

        this.dispatch = new EventDispatcher(this);
        this.call = this.dispatch.call.bind(this.dispatch);
        this.on = this.dispatch.on.bind(this.dispatch);

        this.services = [
            new RenderService(this)
        ];

        this.running = false;
    }

    /**
     * 应用程序启动
     */
    start() {
        if (this.running) {
            console.log('Application: 程序已经启动。');
            return;
        }
        this.running = true;

        this.call('beforeAppStart', this);

        this.services.forEach((n) => {
            if (!(n instanceof BaseService)) {
                throw 'Application: n不是BaseService的实例。';
            }
            n.start();
        });

        this.call('appStart', this);

        requestAnimationFrame(() => {
            this._loop();
        });
    }

    /**
     * 应用程序停止
     */
    stop() {
        if (!this.running) {
            console.log('Application: 程序尚未启动。');
        }
        this.running = false;

        this.call('beforeAppStop', this);

        this.services.forEach((n) => {
            if (!(n instanceof BaseService)) {
                throw 'Application: n不是BaseService的实例。';
            }
            n.stop();
        });

        this.call('appStop', this);
    }

    /**
     * 应用程序循环
     */
    _loop() {
        if (!this.running) {
            return;
        }

        this.call('beforeFrame', this);

        this.call('frame', this);

        this.call('endFrame', this);

        requestAnimationFrame(() => {
            this._loop();
        });
    }
}

export default Application;