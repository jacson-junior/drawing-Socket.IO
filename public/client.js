$(document).ready(function () {
    var mouse = {
        click: false,
        move: false,
        pos: { x: 0, y: 0 },
        pos_prev: false
    };

    var canvas = document.getElementById('drawing');
    var context = canvas.getContext('2d');
    var navbar_height = $('.navbar').height();
    var offset = 27;
    var width = window.innerWidth;
    var height = window.innerHeight - navbar_height - offset;
    var socket = io.connect();

    canvas.width = width;
    canvas.height = height;

    $("#btn_clear").click(function () {
        socket.emit("clear");
    });

    canvas.addEventListener("touchstart", function (){ mouse.click = true }, false);
    canvas.addEventListener("touchend", function (){ mouse.click = false }, false);
    canvas.addEventListener("touchmove", move, false);
    
    canvas.onmousedown = function (e) { mouse.click = true; };
    canvas.onmouseup = function (e) { mouse.click = false; };
    
    function move(e){
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY / height;
        mouse.move = true;
    }

    canvas.onmousemove = function (e) { move(e) };

    socket.on('draw_line', function (data) {
        var line = data.line;
        context.beginPath();
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.lineWidth = data.width;
        context.strokeStyle = data.color;
        context.lineJoin = context.lineCap = 'round';
        context.stroke();
    });

    socket.on('clear', function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    function mainLoop() {
        if (mouse.click && mouse.move && mouse.pos_prev) {
            socket.emit('draw_line', { line: [mouse.pos, mouse.pos_prev], width : $('.stroke-width').val(), color: $('.color-code').val()});
            mouse.move = false;
        }
        mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
        setTimeout(mainLoop, 25);
    }
    mainLoop();
});