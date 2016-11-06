function Game(name) {
    "use strict";
    this.name = name;
    this.estimators = {};
    this.leader_socket = null;
}

Game.prototype.addEstimator = function (name, group, socket) {
    "use strict";
    if (name.length < 5) {
        console.log('user name to short');
        socket.emit('LOGIN_NACK', {
            reason: "UID too short"
        });
    } else if (group.length < 5) {
        console.log('group name to short');
        socket.emit('LOGIN_NACK', {
            reason: "GID too short"
        });
    } else {
        socket.user_name = name;
        socket.group_name = group;
        socket.emit('LOGIN_ACK', {
            role: "estimator"
        });
        if (this.leader_socket !== null) {
            this.leader_socket.emit('user_joined', { /* FIXME send user list */
                user: name,
                group: group
            });
        }
    }
};

Game.prototype.addLeader = function (name, group, socket) {
    "use strict";
    if (name.length < 5) {
        console.log('user name to short');
        socket.emit('LOGIN_NACK', {
            reason: "UID too short"
        });
    } else if (group.length < 5) {
        console.log('group name to short');
        socket.emit('LOGIN_NACK', {
            reason: "GID too short"
        });
    } else {
        socket.emit('LOGIN_ACK', {
            role: "leader"
        });
        this.leader_socket = socket;
        this.leader_socket.user_name = name;
        this.leader_socket.group_name = group;
        /* Send user list */
    }
};

module.exports = {
    Game: Game
};