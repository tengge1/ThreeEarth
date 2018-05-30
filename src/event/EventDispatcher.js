import { dispatch } from '../third_party';
import EventList from './EventList';

/**
 * 事件执行器
 */
class EventDispatcher {

    constructor(app) {
        this.app = app;
        this.dispatch = dispatch.apply(dispatch, EventList);
        this.domElement = this.app.container;
        this.addDomEventListener();
    }

    /**
     * 执行事件
     * @param {*} eventName 
     * @param {*} _this 
     * @param {*} others 
     */
    call(eventName, _this, ...others) {
        this.dispatch.call(eventName, _this, ...others);
    }

    /**
     * 监听事件
     * @param {*} eventName 
     * @param {*} callback 
     */
    on(eventName, callback) {
        this.dispatch.on(eventName, callback);
    }

    /**
     * 监听dom事件
     */
    addDomEventListener() {
        var container = this.app.container;
        this.domElement.addEventListener('click', () => {

        });
        this.domElement.addEventListener('contextmenu', () => {

        });
        this.domElement.addEventListener('dblclick', () => {

        });
        this.domElement.addEventListener('keydown', () => {

        });
        this.domElement.addEventListener('keyup', () => {

        });
        this.domElement.addEventListener('mousedown', () => {

        });
        this.domElement.addEventListener('mousemove', () => {

        });
        this.domElement.addEventListener('mouseup', () => {

        });
        this.domElement.addEventListener('mousewheel', () => {

        });
        this.domElement.addEventListener('resize', () => {

        });
    }
}

export default EventDispatcher;