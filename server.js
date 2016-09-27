var express = require('express'),
    app = express(),
    http = require('http'),
    io = require('socket.io');

var server = http.createServer(app);
var io = io.listen(server);
server.listen(process.env.PORT || 8008);
app.use(express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/www')); 
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); 
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-colorpicker/dist/js')); 
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-colorpicker/dist/css'));
app.use('/img', express.static(__dirname + '/node_modules/bootstrap-colorpicker/dist/img')); 

var line_history = [];

io.on('connection', function (socket) {
    if(line_history > 0){
        for (var i in line_history) {
            socket.emit('draw_line', { line: line_history[i] });
        }
    }
    socket.on('draw_line', function (data) {
        line_history.push(data);
        io.emit('draw_line', data);
    });
    socket.on('clear', function () {
        socket.broadcast.emit("clear");
        line_history = [];
    });
});

