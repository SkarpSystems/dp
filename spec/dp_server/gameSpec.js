var gameMod = require('../../game.js');

describe("Login/logout procedures", function () {
    "use strict";
    var game, socket, assertFailedLogin;

    beforeEach(function () {
        game = new gameMod.Game("TestGame");
        assertFailedLogin = function (uid, gid, reason, leader) {
            socket = jasmine.createSpyObj("socket", ["emit"]);

            if (leader) {
                game.addLeader(uid, gid, socket);
            } else {
                game.addEstimator(uid, gid, socket);
            }

            expect(socket.emit).toHaveBeenCalledWith("LOGIN_NACK", {
                reason: reason
            });
        }
    });

    it("creates a game", function () {
        expect(game.name).toEqual("TestGame");
    });

    it("succeeds to login if E login name and group at least five legal characters", function () {
        socket = jasmine.createSpyObj("socket", ["emit", "user_name"]);

        game.addEstimator("abcde", "fghij", socket);

        expect(socket.emit).toHaveBeenCalledWith("LOGIN_ACK", {
            role: "estimator"
        });

        // TODO check user_name/group_name
        // TODO check user list
        // TODO logout/logout/ack
    });

    it("succeeds to login if EL login name and group at least five legal characters", function () {
        socket = jasmine.createSpyObj("socket", ["emit", "user_name"]);

        game.addLeader("abcde", "fghij", socket, true);

        expect(socket.emit).toHaveBeenCalledWith("LOGIN_ACK", {
            role: "leader"
        });

        // TODO check user_name/group_name
        // TODO check user list
        // TODO logout/logout/ack
    });

    describe("Failed logon procedure for E", function () {
        it("fails to login if E login name is shorter than five characters", function () {
            assertFailedLogin("abcd", "fghij", "UID too short", false);
        });

        it("fails to login if E login group is shorter than five characters", function () {
            assertFailedLogin("abcde", "fghi", "GID too short", false);
        });

        it("fails to login if E login name contains illegal characters"); // TODO
    });


    describe("Failed logon procedure for ELV", function () {
        it("fails to login if EL login name is shorter than five characters", function () {
            assertFailedLogin("abcd", "fghij", "UID too short", true);
        });

        it("fails to login if EL login group is shorter than five characters", function () {
            assertFailedLogin("abcde", "fghi", "GID too short", false);
        });

        it("fails to login if EL login name contains illegal characters"); // TODO

        it("fails to login if the group already has an EL"); // TODO
    });
});