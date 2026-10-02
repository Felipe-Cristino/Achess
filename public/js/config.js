let chosenPiece = "square";
let chosenBoard = "green-board";
const piecesConfig = document.querySelectorAll(".flex9");
const boardConfig = document.querySelectorAll(".flex10");
const configForm = document.getElementById("config-form");
let user;

piecesConfig.forEach((piece)=>{
    piece.addEventListener("click", ()=>{

        piecesConfig.forEach((p) => {
            p.classList.remove("selecionado2");
        });

        chosenPiece = piece.id;
        piece.classList.add("selecionado2");
    });
});

boardConfig.forEach((board)=>{
    board.addEventListener("click", ()=>{

        boardConfig.forEach((b) => {
            b.classList.remove("selecionado2");
        });

        chosenBoard = board.id;
        board.classList.add("selecionado2");
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

const handleConfigSubmit = (e) => {
    e.preventDefault();

    submitForm(`/api/user/configStyles/${user.id}`, {chosenPiece, chosenBoard});
}

configForm.addEventListener("submit", handleConfigSubmit);