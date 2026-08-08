// DOM Elements
const gamesDivElement = document.getElementById("games")
const rankFilter = document.getElementById("filter");
const gamesList = document.getElementById("games-list")
const noGamesMessage = document.getElementById("no-games-message")

const createRoomBtn = document.getElementById("create-room")
const joinRandomBtn = document.getElementById("join-random")

const createRoomFormContainer = document.getElementById("create-room-form-container")
const createRoomForm = document.getElementById("create-room-form")
const gameTime = document.getElementById("game-time")
const closeCreateRoomFormBtn = document.getElementById("close-create-form");

let user;

let gameId = null;


const intervals = [0, 3, 5, 10, 15, 30, 45, 60]

// Functions
const fetchUserCallback = (data) => {
    user = data;

    socket.emit("user-connected", user);
    socket.emit('get-rooms', "all")

    gamesDivElement.classList.remove("hidden")

    hideSpinner();
}

const handleCreateRoomFormSubmit = e => {
    e.preventDefault();

    let time = intervals[+gameTime.value]

    socket.emit("join-random", user, time)

    createRoomFormContainer.classList.add("hidden")
}

const displayRooms = rooms => {
    gamesList.innerHTML = "";

    rooms.forEach(room => {
        let {username, user_rank} = room.players[0];
        let numberOfPlayersInRoom = room.players[1] ? 2 : 1

        gamesList.innerHTML += `
            <li class='game' id='${room.id}'>
                <div class="user">
                    <span>${username}</span>
                    <span>( ${user_rank.charAt(0).toUpperCase() + user_rank.slice(1)} )</span>
                </div>

                <div class="users-in-room">${numberOfPlayersInRoom} / 2</div>

                <button ${numberOfPlayersInRoom === 2 ? "class='disabled'" : ""}>Join</button>
                <div>Normal Game | ${room.id} | ${room.time}</div>
            </li>
        `
    })
}

fetchData('/api/user-info', fetchUserCallback)

// Listeners
socket.on('receive-rooms', rooms => {
    if(rooms.length > 0){
        noGamesMessage.classList.add("hidden");
        gamesList.classList.remove('hidden');

        displayRooms(rooms);
    }else{
        gamesList.classList.add('hidden');
        noGamesMessage.classList.remove('hidden')
    }
})

socket.on("room-created", (id) => {

    window.location.href = window.location.origin + "/room1?id=" + id;
})

socket.on("room-joined", (id) => {
    
    window.location.href = window.location.origin + "/room2?id=" + id;
})

rankFilter.addEventListener("change", (e) => {
    socket.emit("get-rooms", e.target.value)
})

createRoomBtn.addEventListener("click", () => {
    createRoomFormContainer.classList.remove("hidden")
})

closeCreateRoomFormBtn.addEventListener("click", () => {
    createRoomFormContainer.classList.add("hidden")
})

createRoomForm.addEventListener("submit", handleCreateRoomFormSubmit)