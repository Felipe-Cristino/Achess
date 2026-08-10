const redisClient = require("../config/redis");

const createRoom = (roomId, user, time, mode) => {
    let room = { id: roomId, players: [null, null], moves: [], time, gameStarted: false, mode: mode}
    
    room.players[0] = user

    redisClient.set(roomId, JSON.stringify(room));

    redisClient.get('rooms', (err, reply) => {
        if (err) throw err;

        let rooms;
        let index;

        if (reply) {
            rooms = JSON.parse(reply);

            index = rooms.length;

            rooms.push(room);
        } else {
            index = 0;
            rooms = [room]
        }

        redisClient.set('rooms', JSON.stringify(rooms));

        redisClient.get('roomIndices', (err, reply) => {
            if (err) throw err;

            let roomIndices;

            if (reply) {
                roomIndices = JSON.parse(reply);
            } else {
                roomIndices = {}
            }

            roomIndices[`${roomId}`] = index;

            redisClient.set('roomIndices', JSON.stringify(roomIndices));
        })
    })

    redisClient.get('total-rooms', (err, reply) => {
        if (err) throw err;

        if (reply) {
            let totalRooms = parseInt(reply)

            totalRooms += 1;

            redisClient.set('totalRooms', totalRooms + "")
        } else {
            redisClient.set('totalRooms', "1")
        }
    })
}

const joinRoom = (roomId, user, mode) => {
    redisClient.get(roomId, (err, reply) => {
        if (err) throw err;

        if (reply) {
            let room = JSON.parse(reply);

            room.players[1] = user;
            if(room.mode !== mode) {
                return;
            }
            redisClient.set(roomId, JSON.stringify(room));

            redisClient.get('roomIndices', (err, reply) => {
                if (err) throw err;

                if (reply) {
                    let roomIndices = JSON.parse(reply);

                    redisClient.get('rooms', (err, reply) => {
                        if (err) throw err;

                        if (reply) {
                            let rooms = JSON.parse(reply);
                            
                            if(rooms[roomIndices[roomId]] && 
                                rooms[roomIndices[roomId]]?.players) {
                                rooms[roomIndices[roomId]].players[1] = user;
                            }
                            redisClient.set('rooms', JSON.stringify(rooms))
                        }
                    })
                }
            })
        }
    })
}

const removeRoom = (roomId) => {
    redisClient.del(roomId);

    redisClient.get('roomIndices', (err, reply) => {
        if (err) throw err;

        if (reply) {
            let roomIndices = JSON.parse(reply);

            redisClient.get('rooms', (err, reply) => {
                if (err) throw err;

                if (reply) {
                    let rooms = JSON.parse(reply);

                    rooms.splice(roomIndices[roomId], 1)
                    delete roomIndices[roomId];
                    
                    redisClient.set('rooms', JSON.stringify(rooms));
                    redisClient.set('roomIndices', JSON.stringify(roomIndices));
                }
            })
        }
    })

    redisClient.get('total-rooms', (err, reply) => {
        if (err) throw err;

        if (reply) {
            let totalRooms = parseInt(reply)

            totalRooms -= 1;

            redisClient.set('totalRooms', totalRooms + "")
        }
    })
}

module.exports = { createRoom, joinRoom, removeRoom }