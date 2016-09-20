
function Game(name) {
    "use strict";
    this.name = name;
    this.estimators = {};
    this.leader_socket = null;
}

Game.prototype.addEstimator = function (name, socket) {
    "use strict";
    if (name.length < 5) {
        console.log('user name to short');
        socket.emit('LOGIN_NACK', {reason: "UID too short"});
    } else {
        socket.user_name = name;
        socket.emit('LOGIN_ACK', {role: "estimator"});
        if (this.leader_socket !== null) {
            this.leader_socket.emit('user_joined', { /* FIXME send user list */
                user: name
            });
        }
    }
};

Game.prototype.addLeader = function (name, socket) {
    "use strict";
    if (name.length < 5) {
        console.log('user name to short');
        socket.emit('LOGIN_NACK', {reason: "UID too short"});
    } else {
        socket.emit('LOGIN_ACK', {role: "leader"});
        this.leader_socket = socket;
        /* Send user list */
    }
};

module.exports = {
    Game: Game
};
