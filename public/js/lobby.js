// DOM Elements
const lobby = document.getElementById("lobby");
const username = document.getElementById("username");
const imagemProfile = document.getElementById("imagem-profile");
const btn1 = document.getElementById("btn1");
const flex3 = document.querySelector(".flex3")
const flex4 = document.querySelector(".flex4")

const rank_normal_rapid = document.getElementById("rank_normal_rapid");
const points_normal_rapid = document.getElementById("points_normal_rapid");
const brasao_normal_rapid = document.getElementById("brasao_normal_rapid");

const rank_normal_blitz = document.getElementById("rank_normal_blitz");
const points_normal_blitz = document.getElementById("points_normal_blitz");
const brasao_normal_blitz = document.getElementById("brasao_normal_blitz");

const rank_normal_bullet = document.getElementById("rank_normal_bullet");
const points_normal_bullet = document.getElementById("points_normal_bullet");
const brasao_normal_bullet = document.getElementById("brasao_normal_bullet");

const rank_funny_rapid = document.getElementById("rank_funny_rapid");
const points_funny_rapid = document.getElementById("points_funny_rapid");
const brasao_funny_rapid = document.getElementById("brasao_funny_rapid");

const rank_funny_blitz = document.getElementById("rank_funny_blitz");
const points_funny_blitz = document.getElementById("points_funny_blitz");
const brasao_funny_blitz = document.getElementById("brasao_funny_blitz");

const rank_funny_bullet = document.getElementById("rank_funny_bullet");
const points_funny_bullet = document.getElementById("points_funny_bullet");
const brasao_funny_bullet = document.getElementById("brasao_funny_bullet");

const totalUsers = document.getElementById("total-users");
const totalRooms = document.getElementById("total-rooms");

let user;

const fetchUserCallback = (data) => {
    user = data;

    socket.emit('user-connected', user);

    socket.emit('send-total-rooms-and-users');

    lobby.classList.remove("hidden");
    username.innerText = user.username;
    imagemProfile.src = user.profileImage;

    rank_normal_rapid.innerText = user.user_rank_normal_rapid;
    points_normal_rapid.innerText = user.user_points_normal_rapid;
    brasao_normal_rapid.src = user.user_brasao_normal_rapid;

    rank_normal_blitz.innerText = user.user_rank_normal_blitz;
    points_normal_blitz.innerText = user.user_points_normal_blitz;
    brasao_normal_blitz.src = user.user_brasao_normal_blitz;

    rank_normal_bullet.innerText = user.user_rank_normal_bullet;
    points_normal_bullet.innerText = user.user_points_normal_bullet;
    brasao_normal_bullet.src = user.user_brasao_normal_bullet;

    rank_funny_rapid.innerText = user.user_rank_funny_rapid;
    points_funny_rapid.innerText = user.user_points_funny_rapid;
    brasao_funny_rapid.src = user.user_brasao_funny_rapid;

    rank_funny_blitz.innerText = user.user_rank_funny_blitz;
    points_funny_blitz.innerText = user.user_points_funny_blitz;
    brasao_funny_blitz.src = user.user_brasao_funny_blitz;

    rank_funny_bullet.innerText = user.user_rank_funny_bullet;
    points_funny_bullet.innerText = user.user_points_funny_bullet;
    brasao_funny_bullet.src = user.user_brasao_funny_bullet;

    hideSpinner();
}

fetchData('/api/user-info', fetchUserCallback);

socket.on("receive-number-of-rooms-and-users", (totalR, totalU) => {
    totalRooms.innerText = `Total Rooms: ${totalR}`
    totalUsers.innerText = `Total Users: ${totalU}`
})

btn1.addEventListener("click", () => {
    flex3.classList.toggle("hidden");
    flex4.classList.toggle("hidden");
    btn1.classList.toggle("hidden");
    btn2.classList.toggle("hidden");
})

btn2.addEventListener("click", () => {
    flex3.classList.toggle("hidden");
    flex4.classList.toggle("hidden");
    btn1.classList.toggle("hidden");
    btn2.classList.toggle("hidden");
})