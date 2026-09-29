// ============================
// DOM Elements
// ============================
const profile = document.getElementById("profile")
const deleteAccountBtn = document.getElementById("delete-account-btn")

// - Username elements
const changeUsernameBtn = document.getElementById("change-username-btn")
const usernameInput = document.getElementById("username")
const usernameForm = document.getElementById("username-form")
const usernameFormSubmitBtn = usernameForm.querySelector("button.hidden")
const usernameInputGroup = usernameForm.querySelector(".input-group")
const submitUsernameChangeBtn = document.getElementById("submit-username-change");
// --------------------------------------------------------

// - Password elements
const changePasswordBtn = document.getElementById("change-password-btn")
const cancelPasswordChange = document.getElementById("cancel-password-change");
const passwordForm = document.getElementById("password-form")
const oldPasswordInput = document.getElementById("old-password")
const newPasswordInput = document.getElementById("new-password")
const submitPasswordChangeBtn = document.getElementById("submit-password-change")
// --------------------------------------------------------
usernameInput.readOnly = true;
// =========================================================

// Variables
let mostradoChangeUsername = false;
let mostradoChangePassword = false;

let user;

// Functions
const fetchUserCallback = (data) => {
    user = data;

    socket.emit('user-connected', user);

    usernameInput.value = user.username;
    profile.classList.remove("hidden");

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

        if(body.username){
            user.username = body.username;
        }

        setToastType('success');
        displayToast(data.message);
    })
    .catch(err => {
        setToastType("error");
        displayToast(err.message)
    })
    .finally(() => {
        if(mostradoChangeUsername){
            hideChangeUsername();
        }
        else{
            hideChangePassword();
            oldPasswordInput.value = ""
            newPasswordInput.value = ""
            submitPasswordChangeBtn.disabled = false;
            submitPasswordChangeBtn.classList.remove("disabled");
        }
    })
}

const handleUsernameSubmit = (e) => {
    e.preventDefault();

    submitForm(`/api/user/username/${user.id}`, {username: usernameInput.value})
}

const handlePasswordSubmit = (e) => {
    e.preventDefault();

    oldPassword = oldPasswordInput.value;
    newPassword = newPasswordInput.value

    submitPasswordChangeBtn.disabled = true;
    submitPasswordChangeBtn.classList.add('disabled');

    submitForm(`/api/user/password/${user.id}`, {oldPassword, newPassword})
}

const showChangeUsername = () => {
    changeUsernameBtn.innerText = "Cancel";
    changeUsernameBtn.classList.add("cancel");
    usernameFormSubmitBtn.classList.remove("hidden");
    usernameInputGroup.classList.remove("disabled");
    mostradoChangeUsername = true;
    usernameInput.readOnly = false;
}

const hideChangeUsername = () => {
    changeUsernameBtn.innerText = "Change";
    changeUsernameBtn.classList.remove("cancel");
    usernameFormSubmitBtn.classList.add("hidden");
    usernameInputGroup.classList.add("disabled");
    mostradoChangeUsername = false;
    usernameInput.readOnly = true;
    usernameInput.value = user.username
}

const showChangePassword = () => {
    changePasswordBtn.classList.add("hidden");
    passwordForm.classList.remove("hidden");

    mostradoChangePassword = true;
}

const hideChangePassword = () => {
    changePasswordBtn.classList.remove("hidden");
    passwordForm.classList.add("hidden");
    oldPasswordInput.value = ""
    newPasswordInput.value = "";

    mostradoChangePassword = false;
}

fetchData('/api/user-info', fetchUserCallback)

changeUsernameBtn.addEventListener("click", () => {
    if(mostradoChangeUsername){
        hideChangeUsername()
    }else{
        showChangeUsername()
    }
})

changePasswordBtn.addEventListener("click", showChangePassword);

cancelPasswordChange.addEventListener("click", hideChangePassword);

deleteAccountBtn.addEventListener("click", async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");

    if(confirm){
        const res = await fetch(`/api/user/${user.id}`, {method: "DELETE"});

        if(res.ok){
            window.location.href = "http://localhost:5000/api/logout";
        }else{
            setToastType("error");
            displayToast("Account couldn't be deleted");
        }
    }
})

usernameForm.addEventListener("submit", handleUsernameSubmit)
passwordForm.addEventListener("submit", handlePasswordSubmit)