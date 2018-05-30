/**
 * 自定义事件列表
 */
var EventList = [
    /**
     * 应用程序启动前执行
     * @param application
     */
    'beforeAppStart',

    /**
     * 应用程序启动后执行
     * @param application
     */
    'appStart',

    /**
     * 应用程序停止前执行
     * @param application
     */
    'beforeAppStop',

    /**
     * 应用程序启动后执行
     * @param application
     */
    'appStop',

    /**
     * 应用程序循环中在frame前执行
     * @param application
     */
    'beforeFrame',

    /**
     * 应用程序循环中执行
     * @param application
     */
    'frame',

    /**
     * 应用程序循环中在frame后执行
     * @param application
     */
    'endFrame',

    'mousedown',
    'mousemove',
    'mouseup'
];

export default EventList;