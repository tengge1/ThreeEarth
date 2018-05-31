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

    /**
     * 鼠标单击事件
     * @param event
     */
    'click',

    /**
     * 上下文菜单事件
     * @param event
     */
    'contextmenu',

    /**
     * 鼠标双击事件
     * @param event
     */
    'dblclick',

    /**
     * 按键事件
     * @param event
     */
    'keydown',

    /**
     * 抬起键事件
     * @param event
     */
    'keyup',

    /**
     * 鼠标键按下事件
     * @param event
     */
    'mousedown',

    /**
     * 鼠标移动事件
     * @param event
     */
    'mousemove',

    /**
     * 鼠标键抬起事件
     * @param event
     */
    'mouseup',

    /**
     * 鼠标滚轮滚动事件
     */
    'mousewheel',

    /**
     * 窗口尺寸变化事件
     */
    'resize'
];

export default EventList;