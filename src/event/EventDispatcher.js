import { dispatch } from '../third_party';
import EventList from './EventList';

/**
 * 事件执行器
 */
class EventDispatcher {

    constructor() {
        this.dispatch = dispatch.apply(dispatch, EventList);
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
}

export default EventDispatcher;