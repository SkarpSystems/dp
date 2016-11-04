var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require('./game.js');

var g = new game.Game("foo");

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
        if (g.leader_socket === socket) {
            g.leader_socket = null;
        }

        if (g.leader_socket !== null) {
            g.leader_socket.emit('user_left', {
                user: socket.user_name
            });
        }
    });

    socket.on('LOGIN_E', function (msg) {
        console.log('LOGIN_E: ' + JSON.stringify(msg));
        g.addEstimator(msg.user, socket);
    });

    socket.on('estimate', function (msg) {
        console.log('estimate: ' + JSON.stringify(msg));
        if (g.leader_socket !== null) {
            g.leader_socket.emit('estimate', msg);
        }
    });
    socket.on('LOGIN_EL', function (msg) {
        console.log('LOGIN_EL: ' + JSON.stringify(msg));
        g.addLeader(msg.user, socket);
    });
});

http.listen(36080, function () {
    "use strict";
    console.log('listening on *:36080');
});
