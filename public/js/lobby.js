// DOM Elements
const lobby = document.getElementById("lobby");
const username = document.getElementById("username");

const rank_normal_rapido = document.getElementById("rank_normal_rapido");
const points_normal_rapido = document.getElementById("points_normal_rapido");
const rank_normal_blitz = document.getElementById("rank_normal_blitz");
const points_normal_blitz = document.getElementById("points_normal_blitz");
const rank_normal_bullet = document.getElementById("rank_normal_bullet");
const points_normal_bullet = document.getElementById("points_normal_bullet");

const rank_funny_rapido = document.getElementById("rank_funny_rapido");
const points_funny_rapido = document.getElementById("points_funny_rapido");
const rank_funny_blitz = document.getElementById("rank_funny_blitz");
const points_funny_blitz = document.getElementById("points_funny_blitz");
const rank_funny_bullet = document.getElementById("rank_funny_bullet");
const points_funny_bullet = document.getElementById("points_funny_bullet");

const totalUsers = document.getElementById("total-users");
const totalRooms = document.getElementById("total-rooms");

let user;

const fetchUserCallback = (data) => {
    user = data;

    socket.emit('user-connected', user);

    socket.emit('send-total-rooms-and-users');

    lobby.classList.remove("hidden");
    username.innerText = user.username;
    rank_normal_rapido.innerText = user.user_rank_normal_rapido;
    points_normal_rapido.innerText = user.user_points_normal_rapido;

    hideSpinner();
}

fetchData('/api/user-info', fetchUserCallback);

socket.on("receive-number-of-rooms-and-users", (totalR, totalU) => {
    totalRooms.innerText = `Total Rooms: ${totalR}`
    totalUsers.innerText = `Total Users: ${totalU}`
})