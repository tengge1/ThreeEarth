var container = null;
var app = null;

var init = function () {
    container = document.getElementById('container');
    app = new E.Application(container);
    app.start();
};

window.onload = init;