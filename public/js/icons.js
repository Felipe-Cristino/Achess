const submitProfileImageBtn = document.getElementById("submit-profile-image-btn");
const profileImageForm = document.getElementById("profile-image-form");
let user;

const icons =
    [
        "/assets/icones/confidence.jpeg",
        "/assets/icones/confused-dark-blue.jpeg",
        "/assets/icones/dont-care.jpeg",
        "/assets/icones/happy-blue.jpeg",
        "/assets/icones/in-love.jpeg",
        "/assets/icones/mad-red.jpeg",
        "/assets/icones/sad-purple.jpeg"
    ];

const lista = document.getElementById("lista");

icons.forEach((icon) => {
    const img = document.createElement("img");
    img.src = icon;

    const li = document.createElement("li");
    li.appendChild(img);
    li.classList.add("icon");

    lista.appendChild(li);
});

const icones = document.querySelectorAll(".icon");
const p1 = document.getElementById("p1");
p1.classList.add("hidden");

icones.forEach(icon => {
    icon.addEventListener("click", () => {
        const src = icon.children[0].getAttribute("src");
        p1.innerText = src;
        const selecionados = document.querySelectorAll(".selecionado");
        selecionados.forEach((selected) => {
            selected.classList.remove("selecionado");
        })
        icon.classList.add("selecionado");
    });
});

const fetchUserCallback = (data) => {
    
    user = data;
    socket.emit('user-connected', user);
    hideSpinner()
}

const submitForm = (url, body) => {
    fetch(url, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        if(data.error){
            throw Error(data.error);
        }

        if(body.imagemProfile){
            user.imagemProfile = body.imagemProfile;
        }

        setToastType('success');
        displayToast(data.message);
    })
    .catch(err => {
        setToastType("error");
        displayToast(err.message)
    })
    .finally(() => {
        window.location.href = "/";
    });
}

fetchData('/api/user-info', fetchUserCallback)

const handleProfileImageSubmit = (e) => {
    e.preventDefault();

    submitForm(`/api/user/profileImage/${user.id}`, {profileImage: p1.innerText});
}

profileImageForm.addEventListener("submit", handleProfileImageSubmit)