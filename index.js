var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var compiler_socket = null;

app.get('/', function (req, res) {
    "use strict";
    res.sendFile(__dirname + '/drakpoker.html');
});

app.get('/index.js', function (req, res) {
    "use strict";
    res.sendFile(__dirname + '/index.js');
});

io.on('connection', function (socket) {
    "use strict";
    console.log('a user connected');
    socket.user_name = "unknown";
    socket.on('disconnect', function () {
        console.log('user disconnected');
        if (compiler_socket === socket) {
            compiler_socket = null;
        }
        if (compiler_socket !== null) {
            compiler_socket.emit('user_left', {
                user: socket.user_name
            })
        }
    });
    socket.on('LOGIN_E', function (msg) {
        console.log('user login: ' + JSON.stringify(msg));
        if (msg.user.length < 5) {
            console.log('user name to short');
            socket.emit('LOGIN_NACK', {'reason':"UID to short"})
        }
        else {
            socket.user_name = msg.user;
            socket.emit('LOGIN_ACK', {'role':"estimator"})
            if (compiler_socket !== null) {
                compiler_socket.emit('user_joined', {
                    user: msg.user
                })
            }
        }
    });
    socket.on('estimate', function (msg) {
        console.log('estimate: ' + JSON.stringify(msg));
        if (compiler_socket !== null) {
            compiler_socket.emit('estimate', msg);
        }
    });
    socket.on('LOGIN_EL', function (msg) {
        console.log('leader login: ' + JSON.stringify(msg));
        socket.emit('LOGIN_ACK', {role:"leader"})
        compiler_socket = socket;
    });
});

http.listen(36080, function () {
    "use strict";
    console.log('listening on *:36080');
});
