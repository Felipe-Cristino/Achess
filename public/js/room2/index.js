// =====================
// DOM Elements
// =====================
const room = document.getElementById("game-room")
const boxes = document.querySelectorAll(".box")
const playerLight = document.getElementById("player-light")
const playerBlack = document.getElementById("player-black")
const waitingMessage = document.getElementById("waiting-message")
const playerLightTimer = playerLight.querySelector(".timer")
const playerBlackTimer = playerBlack.querySelector(".timer")
const lightCapturedPieces = document.getElementById("light-captured-pieces")
const blackCapturedPieces = document.getElementById("black-captured-pieces")
const piecesToPromoteContainer = document.getElementById("pieces-to-promote-container")
const piecesToPromote = document.getElementById("pieces-to-promote")
const gameOverMessageContainer = document.getElementById("game-over-message-container")
const myScoreElement = document.getElementById("my-score")
const enemyScoreElement = document.getElementById("enemy-score")
const addPecaContainer = document.getElementById("addPeca-container");
const addPecaPecas = document.getElementById("addPeca-pecas");
let draggedPiece = null;

const carta01LightCard = document.getElementById("carta01-light")
const carta02LightCard = document.getElementById("carta02-light")
const carta03LightCard = document.getElementById("carta03-light")
const carta04LightCard = document.getElementById("carta04-light")
const carta05LightCard = document.getElementById("carta05-light")

const carta01BlackCard = document.getElementById("carta01-black")
const carta02BlackCard = document.getElementById("carta02-black")
const carta03BlackCard = document.getElementById("carta03-black")
const carta04BlackCard = document.getElementById("carta04-black")
const carta05BlackCard = document.getElementById("carta05-black")

let lance = 1;
let waitLanceEspLight = 6;
let waitLanceCommonLight = 3;
let waitLanceEspBlack = 6;
let waitLanceCommonBlack = 3;

let estagioCarta01Light = 1;
let estagioCarta02Light = 1;
let estagioCarta03Light = 1;
let estagioCarta04Light = 1;
let estagioCarta05Light = 1;

let estagioCarta01Black = 1;
let estagioCarta02Black = 1;
let estagioCarta03Black = 1;
let estagioCarta04Black = 1;
let estagioCarta05Black = 1;

const showCard = document.getElementById("show-card");
let cartaImpedidoCorLight = false;
let cartaImpedidoCorBlack = false;
let cartaImpedidoPecaLight = null;
let cartaImpedidoNumLight = 0;
let cartaImpedidoPecaBlack = null;
let cartaImpedidoNumBlack = 0;

let addPieceImpedidoLight = false;
let addPieceImpedidoBlack = false;

let timeBlindMovesLight = 0;
let timeBlindMovesBlack = 0;
let blindBoolLight = false;
let blindBoolBlack = false;
// =====================
// Game Variables
// =====================
let user = null;
let increment = 1;

let search = window.location.search.split("&")
let positionHistory = new Map();

let roomId = null;
let password = null;

let gameDetails = null;

let gameHasTimer = false;
let timer = null;
let myTurn = false;
let pawnToPromotePosition = null;

let gameOver = false;
let myScore = 0;
let enemyScore = 0;

let gameStartedAtTimestamp = null

roomId = search[0].split("=")[1]
// const aguardando = document.querySelector(".aguardando")
// =====================
// Functions
// =====================

const fetchUserCallback = (data) => {
    user = data;

    socket.emit("user-connected", user, roomId);
    socket.emit("get-game-details", roomId, user)
}

fetchData("/api/user-info", fetchUserCallback)

// Display chess board logic
const displayChessPieces = () => {
    boxes.forEach(box => {
        box.innerHTML = ""
    })

    lightPieces.forEach(piece => {
        let box = document.getElementById(piece.position)

        box.innerHTML += `
            <div class="piece light" data-piece="${piece.piece}" 
            draggable="true" data-points="${piece.points}">
                <img src="${piece.icon}" alt="Chess Piece" >
            </div>
        `
    })

    blackPieces.forEach(piece => {
        let box = document.getElementById(piece.position)

        box.innerHTML += `
            <div class="piece black" data-piece="${piece.piece}" 
            draggable="true" data-points="${piece.points}">
                <img src="${piece.icon}" alt="Chess Piece" >
            </div>
        `
    })

    addPieceListeners()
}

const onClickPiece = (e) => {
    if (!myTurn || gameOver) {
        return;
    }

    hidePossibleMoves()

    let element = e.target.closest(".piece");
    let position = element.parentNode.id;
    let piece = element.dataset.piece;

    if (selectedPiece && selectedPiece.piece === piece && selectedPiece.position === position) {
        hidePossibleMoves()
        selectedPiece = null
        return;
    }

    let possibleMoves;

    selectedPiece = { position, piece }

    possibleMoves = findPossibleMoves(position, piece);

    element.addEventListener("dragstart", function () {
        draggedPiece = this;
    });

    possibleMoves.forEach((box) => {

        box.addEventListener("dragover", function (e) {
            e.preventDefault(); // Permite o drop
        });

        box.addEventListener("drop", function () {

            if (!draggedPiece) return;

            draggedPiece = null;
        });

    });

    showPossibleMoves(possibleMoves)
}

const addPieceListeners = () => {
    document.querySelectorAll(`.piece.${player}`).forEach(piece => {

        piece.addEventListener("click", (e) => {
            if (cartaImpedidoCorLight === true &&
                player === "light" &&
                cartaImpedidoPecaLight === piece.dataset.piece
                && cartaImpedidoNumLight === 2) {
                return;
            }

            if (cartaImpedidoCorBlack === true &&
                player === "black" &&
                cartaImpedidoPecaBlack === piece.dataset.piece
                && cartaImpedidoNumBlack === 2) {
                return;
            }

            onClickPiece(e)
        });

        piece.addEventListener("dragstart", (e) => {
            if (cartaImpedidoCorLight === true &&
                player === "light" &&
                cartaImpedidoPecaLight === piece.dataset.piece
                && cartaImpedidoNumLight === 2) {
                return;
            }

            if (cartaImpedidoCorBlack === true &&
                player === "black" &&
                cartaImpedidoPecaBlack === piece.dataset.piece
                && cartaImpedidoNumBlack === 2) {
                return;
            }

            onClickPiece(e)
        });
    })

    document.querySelectorAll(`.piece.${enemy}`).forEach(piece => {
        piece.style.cursor = "default"
    })
}

const cartaImpedido = (player, peca) => {

    socket.emit("carta-impedida", {
        roomId: roomId,
        cor: player,
        peca: peca,
        num: 2
    });
}

const blindMoves = () => {
    let minhaCor = null;
    if (enemy === "light") {
        minhaCor = "black";
    }
    else {
        minhaCor = "light";
    }

    socket.emit("blind-moves", {
        roomId: roomId,
        corDoInimigo: enemy,
        minhaCor: minhaCor
    });
}
// --------------------------------------

// Possible Moves Logic

const showPossibleMoves = (possibleMoves) => {
    possibleMoves.forEach(box => {
        let possibleMoveBox = document.createElement('div')
        possibleMoveBox.classList.add("possible-move");

        possibleMoveBox.addEventListener("click", move)
        possibleMoveBox.addEventListener("drop", move)

        box.appendChild(possibleMoveBox)
    })
}

const hidePossibleMoves = () => {
    document.querySelectorAll('.possible-move').forEach(possibleMoveBox => {
        let parent = possibleMoveBox.parentNode;
        possibleMoveBox.removeEventListener('click', move)
        possibleMoveBox.removeEventListener('drop', move)
        parent.removeChild(possibleMoveBox)
    })
}

const findPossibleMoves = (position, piece) => {
    let splittedPos = position.split("-");
    let yAxisPos = +splittedPos[1]
    let xAxisPos = splittedPos[0]

    let yAxisIndex = yAxis.findIndex(y => y === yAxisPos)
    let xAxisIndex = xAxis.findIndex(x => x === xAxisPos)

    switch (piece) {
        case "pawn":
            return getPawnPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex);
        case 'rook':
            return getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex);
        case 'bishop':
            return getBishopPossibleMoves(xAxisIndex, yAxisIndex)
        case 'knight':
            return getKnightPossibleMoves(xAxisIndex, yAxisIndex)
        case 'queen':
            return Array.prototype.concat(
                getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex),
                getBishopPossibleMoves(xAxisIndex, yAxisIndex)
            )
        case 'king':
            return getKingPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex)
        default:
            return []
    }
}
// --------------------------------------

// Timer Logic
const updateTimer = (currentPlayer, minutes, seconds) => {
    if (currentPlayer === 'light') {
        playerLightTimer.innerText =
            `${minutes >= 10 ? minutes : "0" + minutes}:${seconds >= 10 ? seconds : "0" + seconds}`
    } else {
        playerBlackTimer.innerText =
            `${minutes >= 10 ? minutes : "0" + minutes}:${seconds >= 10 ? seconds : "0" + seconds}`
    }
}

const timerEndedCallback = () => {
    let ifDraw = false;
    if (myScore === 41) {
        ifDraw = true;
    }
    else {
        ifDraw = false;
    }
    socket.emit('timer-ended2', roomId, user.username, gameStartedAtTimestamp, ifDraw)
}
// --------------------------------------

// Game Logic
const setCursor = (cusror) => {
    document.querySelectorAll(`.piece.${player}`).forEach(piece => {
        piece.getElementsByClassName.cursor = cusror
    })
}

const startGame = (playerTwo) => {

    playerBlack.querySelector(".username").innerText = playerTwo.username;

    waitingMessage.classList.add("hidden")
    playerBlack.classList.remove("hidden")
    room.classList.remove("hidden")
    // aguardando.classList.add("hidden")

    displayChessPieces();

    setPiecesToPromote();

    sortearCartas();
}

const endMyTurn = (newPieceBox, pawnPromoted = false, elPassantPerformed = false) => {

    myTurn = false;
    setCursor("default")

    saveMove(newPieceBox, pawnPromoted, elPassantPerformed);

    lance += 1;

    addBrilhoCards();
}

// Move Logic

const move = (e) => {

    let currentBox = document.getElementById(selectedPiece.position);
    let boxToMove = e.target.parentNode;
    let piece = currentBox.querySelector(".piece");

    hidePossibleMoves();

    let pieceToRemove = null;
    let pieceToRemovePieceImg = null;

    if (boxToMove.children.length > 0) {
        pieceToRemove = boxToMove.children[0];
        pieceToRemovePieceImg = pieceToRemove.children[0]
    }

    currentBox.innerHTML = "";

    if (pieceToRemove) {
        capturePiece(pieceToRemove)
        boxToMove.innerHTML = ""
    }

    boxToMove.appendChild(piece)

    if (piece.dataset.piece === 'pawn') {
        // Pawn promotion check
        if (
            (player === 'light' && boxToMove.id[2] === '8') ||
            (player === 'black' && boxToMove.id[2] === '1')
        ) {
            let canBePromoted = isPawnAtTheEndOfTheBoard(player, boxToMove.id);

            if (canBePromoted) {
                pawnToPromotePosition = boxToMove.id;

                piecesToPromoteContainer.classList.remove('hidden');

                return;
            }
        }

        if (elPassantPositions[boxToMove.id]) {
            performElPassant(player, currentBox.id, boxToMove.id)

            return
        }
    }

    if (checkForWin()) {
        socket.emit("checkmate-room", roomId, user.username);
    }

    endMyTurn(boxToMove)

    savePosition()

    cartaImpedidoNumLight -= 1;
    cartaImpedidoNumBlack -= 1;
    cartaImpedidoCorLight = true;
    cartaImpedidoCorBlack = true;
    addPieceImpedidoLight = false;
    addPieceImpedidoBlack = false;

    let cor = null;

    if (blindBoolLight) {
        cor = "black";
        if (timeBlindMovesLight === 0) {
            let allPieces = document.querySelectorAll(`.piece.${cor}`)
            allPieces.forEach(piece => {
                piece.classList.remove("hidden");
            })
        }
        timeBlindMovesLight -= 1;
    }

    if (blindBoolBlack) {
        cor = "light";
        if (timeBlindMovesBlack <= 0) {
            let allPieces = document.querySelectorAll(`.piece.${cor}`)
            allPieces.forEach(piece => {
                piece.classList.remove("hidden");
            })
        }
        timeBlindMovesBlack -= 1;
    }
}

function savePosition() {

    let key = generatePositionKey();

    let repetitions = positionHistory.get(key) || 0;

    repetitions++;

    positionHistory.set(key, repetitions);

    if (repetitions >= 3) {
        socket.emit("draw2", roomId, gameStartedAtTimestamp)
        socket.emit("draw-room", roomId)
    }

}

function generatePositionKey() {
    let pieces = [];

    document.querySelectorAll(".piece.light").forEach(piece => {
        pieces.push(
            "light" +
            "-" +
            piece.dataset.piece +
            "-" +
            piece.parentNode.id
        );
    });

    document.querySelectorAll(".piece.black").forEach(piece => {
        pieces.push(
            "black" +
            "-" +
            piece.dataset.piece +
            "-" +
            piece.parentNode.id
        );
    });

    pieces.sort();

    return JSON.stringify({ pieces });
}

const capturePiece = (pieceToRemove) => {
    let pawnImg = pieceToRemove.children[0];

    let li = document.createElement('li')
    li.appendChild(pawnImg);

    if (pieceToRemove.classList.contains('black')) {
        blackCapturedPieces.appendChild(li);

        if (!gameOver) {
            if (player === 'light') {
                myScore += parseInt(pieceToRemove.dataset.points)
            } else {
                enemyScore += parseInt(pieceToRemove.dataset.points)
            }
        }
    } else {
        lightCapturedPieces.appendChild(li);

        if (!gameOver) {
            if (player === 'black') {
                myScore += parseInt(pieceToRemove.dataset.points)
            } else {
                enemyScore += parseInt(pieceToRemove.dataset.points)
            }
        }
    }
}

const saveMove = (newPieceBox, pawnPromoted, elPassantPerformed) => {
    let move = { from: selectedPiece.position, to: newPieceBox.id, piece: selectedPiece.piece, pieceColor: player }
    selectedPiece = null
    pawnToPromotePosition = null;

    if (gameHasTimer) {
        let currentTime;

        if (player === 'light') {
            currentTime = playerLightTimer.innerText
        } else {
            currentTime = playerBlackTimer.innerText
        }

        move.time = currentTime

        timer.stop()
    }

    if (pawnPromoted) {
        let promotedPiece = newPieceBox.children[0];

        let pawnPromotion = {
            promotedTo: promotedPiece.dataset.piece,
            pieceImg: promotedPiece.children[0].src
        }

        socket.emit('move-made', roomId, move, pawnPromotion)
    } else if (elPassantPerformed) {
        socket.emit('move-made', roomId, move, null, null, true)
    } else {
        socket.emit('move-made', roomId, move)
    }
}

const moveEnemy = (move, pawnPromotion = null, elPassantPerformed = false) => {
    pawnsToPerformElPassant = {}
    elPassantPositions = {}

    const { from, to, piece } = move;

    let boxMovedFrom = document.getElementById(from);
    let boxMovedTo = document.getElementById(to);

    if (boxMovedTo.children.length > 0) {
        let pieceToRemove = boxMovedTo.children[0];

        capturePiece(pieceToRemove)
    }

    boxMovedTo.innerHTML = "";

    let enemyPiece = boxMovedFrom.children[0];

    if (pawnPromotion) {
        const { promotedTo, pieceImg } = pawnPromotion

        enemyPiece.dataset.piece = promotedTo;
        enemyPiece.children[0].src = pieceImg
    }

    boxMovedFrom.innerHTML = ""
    boxMovedTo.appendChild(enemyPiece);

    if (elPassantPerformed) {
        let capturedPieceBox = null
        if (player === 'black') {
            capturedPieceBox = document.getElementById(`${to[0]}-${parseInt(to[2]) - 1}`)
        } else {
            capturedPieceBox = document.getElementById(`${to[0]}-${parseInt(to[2]) + 1}`)
        }

        capturePiece(capturedPieceBox.children[0])

        capturedPieceBox.innerHTML = ""
    }

    if (piece === 'pawn') {
        let canPerformElPassant = checkForElPassant(move)

        if (canPerformElPassant) {
            pawnsToPerformElPassant[to] = true
        }
    }

    myTurn = true;
    setCursor('pointer')

    if (gameHasTimer) {
        timer.start()
    }
}
// --------------------------------------

// Pawn Promotion Logic
const setPiecesToPromote = () => {
    piecesToPromote.innerHTML = "";
    if (player === 'light') {
        let pieces = ["knight", "bishop", "rook", "queen"];
        let icons = [
            "../assets/chess-icons/light/chess-knight-light.svg",
            "../assets/chess-icons/light/chess-bishop-light.svg",
            "../assets/chess-icons/light/chess-rook-light.svg",
            "../assets/chess-icons/light/chess-queen-light.svg"
        ];

        let i = 0;
        while (i <= 3) {
            const li = document.createElement("li");
            li.setAttribute("data-piece", pieces[i]);

            const img = document.createElement("img");
            img.src = icons[i];

            li.appendChild(img);
            piecesToPromote.appendChild(li);

            i++;
        }
    } else {
        let pieces = ["knight", "bishop", "rook", "queen"];
        let icons = [
            "../assets/chess-icons/black/chess-knight-black.svg",
            "../assets/chess-icons/black/chess-bishop-black.svg",
            "../assets/chess-icons/black/chess-rook-black.svg",
            "../assets/chess-icons/black/chess-queen-black.svg"
        ];

        let i = 0;
        while (i <= 3) {
            const li = document.createElement("li");
            li.setAttribute("data-piece", pieces[i]);

            const img = document.createElement("img");
            img.src = icons[i];

            li.appendChild(img);
            piecesToPromote.appendChild(li);

            i++;
        }
    }

    addListenerToPiecesToPromote();
}

const onChoosePieceToPromote = e => {
    if (!pawnToPromotePosition) {
        return;
    }

    const pieceToPromote = e.target.closest("li");
    const pieceToPromoteImg = pieceToPromote.children[0];
    const pieceToPromoteType = pieceToPromote.dataset.piece;

    let pieceToChange = document.getElementById(pawnToPromotePosition).children[0];

    pieceToChange.innerHTML = ""
    pieceToChange.appendChild(pieceToPromoteImg)
    pieceToChange.dataset.piece = pieceToPromoteType;

    piecesToPromoteContainer.classList.add('hidden');

    endMyTurn(document.getElementById(pawnToPromotePosition), true);
}

const addListenerToPiecesToPromote = () => {
    for (let i = 0; i < piecesToPromote.children.length; i++) {
        piecesToPromote.children[i].addEventListener("click", onChoosePieceToPromote)
    }
}
// --------------------------------------

const setAddPieces = () => {
    addPecaPecas.innerHTML = "";
    if (player === 'light') {
        let pieces = ["knight", "bishop", "rook"];
        let icons = [
            "../assets/chess-icons/light/chess-knight-light.svg",
            "../assets/chess-icons/light/chess-bishop-light.svg",
            "../assets/chess-icons/light/chess-rook-light.svg",
        ];

        let i = 0;
        while (i <= 2) {
            const li = document.createElement("li");
            li.setAttribute("data-piece", pieces[i]);

            const img = document.createElement("img");
            img.src = icons[i];

            li.appendChild(img);
            addPecaPecas.appendChild(li);

            i++;
        }
    } else {
        let pieces = ["knight", "bishop", "rook"];
        let icons = [
            "../assets/chess-icons/black/chess-knight-black.svg",
            "../assets/chess-icons/black/chess-bishop-black.svg",
            "../assets/chess-icons/black/chess-rook-black.svg",
        ];

        let i = 0;
        while (i <= 2) {
            const li = document.createElement("li");
            li.setAttribute("data-piece", pieces[i]);

            const img = document.createElement("img");
            img.src = icons[i];

            li.appendChild(img);
            addPecaPecas.appendChild(li);

            i++;
        }
    }

    addPecasListener();
}

const addPecasListener = () => {
    addPecaContainer.classList.remove("hidden");

    const selecionarPeca = (e) => {
        const peca = e.target.closest("[data-piece]");

        if (!peca || !addPecaPecas.contains(peca)) {
            return;
        }

        const boxClick = (e) => {
            const box = e.target.closest(".box");

            if (!box) {
                return;
            }

            // Se a box já possui uma peça, não adiciona
            if (box.children.length > 0) {
                return;
            }

            const elementoPeca = peca.children[0];

            if (!elementoPeca) {
                return;
            }

            const div = document.createElement("div");
            div.appendChild(elementoPeca);
            div.dataset.piece = peca.dataset.piece;
            div.classList.add("piece");
            let corPeca = null;
            if (elementoPeca.getAttribute("src").includes("light")) {
                div.classList.add("light");
                corPeca = "light";
                addPieceImpedidoLight = true;
            } else {
                div.classList.add("black");
                corPeca = "black";
                addPieceImpedidoBlack = true;
            }
            box.appendChild(div);

            box.addEventListener("click", (e) => {
                if (addPieceImpedidoLight) {
                    return;
                }

                if (addPieceImpedidoBlack) {
                    return;
                }

                onClickPiece(e)
            });
            box.addEventListener("dragstart", (e) => {
                if (addPieceImpedidoLight) {
                    return;
                }

                if (addPieceImpedidoBlack) {
                    return;
                }

                onClickPiece(e)
            });

            socket.emit("add-piece", {
                roomId,
                piece: peca.dataset.piece,
                img: div.children[0].getAttribute("src"),
                corPeca: corPeca,
                boxId: box.id
            });

            addPecaContainer.classList.add("hidden");

            // Remove o listener depois que a box for escolhida
            document.removeEventListener("click", boxClick);
        };

        addPecaContainer.classList.add("hidden");

        // Espera o próximo clique para escolher a casa
        document.addEventListener("click", boxClick);
    };

    addPecaPecas.addEventListener("click", selecionarPeca);
}

// El Passant Logic
const checkForElPassant = (enemyMove) => {
    const { from, to, piece } = enemyMove;

    if (piece !== 'pawn' || (from[2] !== '7' && from[2] !== '2')) {
        return false
    }

    let enemyPawn = null

    if (player === 'light') {
        enemyPawn = blackPieces.find(enemyPiece => enemyPiece.piece === 'pawn' && enemyPiece.position === from)
    } else {
        enemyPawn = lightPieces.find(enemyPiece => enemyPiece.piece === 'pawn' && enemyPiece.position === from)
    }

    if (!enemyPawn) {
        return false
    }

    if (Math.abs(parseInt(to[2]) - parseInt(from[2])) === 2) {
        let splittedPos = to.split("-");
        let xAxisPos = splittedPos[0]
        let yAxisPos = +splittedPos[1]

        let xAxisIndex = xAxis.findIndex(x => x === xAxisPos)

        if (xAxisIndex - 1 >= 0) {
            let leftBox = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxisPos}`)

            if (
                leftBox.children.length > 0 &&
                leftBox.children[0].classList.contains(player) &&
                leftBox.children[0].dataset.piece === 'pawn'
            ) {
                return true
            }
        }

        if (xAxisIndex + 1 < xAxis.length) {
            let rightBox = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxisPos}`)

            if (
                rightBox.children.length > 0 &&
                rightBox.children[0].classList.contains(player) &&
                rightBox.children[0].dataset.piece === 'pawn'
            ) {
                return true
            }
        }
    }

    return false
}

const performElPassant = (currentPlayer, prevPawnPosition, newPawnPosition) => {
    let capturedPawnPos = newPawnPosition[0] + '-' + prevPawnPosition[2]
    let capturedPawnBox = document.getElementById(capturedPawnPos)

    capturePiece(capturedPawnBox.children[0])

    if (currentPlayer === player) {
        endMyTurn(document.getElementById(newPawnPosition), false, true)

        delete pawnsToPerformElPassant[capturedPawnPos]
        delete elPassantPositions[newPawnPosition]
    } else {
        myTurn = true
        setCursor('pointer')

        if (gameHasTimer) {
            timer.start()
        }
    }
}
// --------------------------------------

const checkForWin = () => {
    if (myScore >= 41) {
        return true;
    }
    return false;
}

// Game Over Logic
const endGame = (playerOne, playerTwo, winner = null) => {
    gameOver = true
    myTurn = false
    setCursor("default")

    if (gameHasTimer) {
        timer.stop()
    }

    let loser;
    let winnerScore;
    let loserScore;
    let winningPoints = 0;

    if (winner) {

        if (winner === playerOne.username) {
            loser = playerTwo.username;
            winnerScore = playerOne.user_points;
            loserScore = playerTwo.user_points;

            winningPoints = parseInt(10 + ((loserScore - winnerScore) * 1.4 / 100));
            if (winningPoints > 19) {
                winningPoints = 19;
            }
            if (winningPoints < 0) {
                winningPoints = 0;
            }
            myScoreElement.innerText = playerOne.username + " += "
                + winningPoints + " pts";
            enemyScoreElement.innerText = playerTwo.username + " -= "
                + winningPoints + " pts";
            myScoreElement.classList.add("positive-score")
            socket.emit("update-score", roomId, winningPoints, -Math.abs(winningPoints), playerOne, playerTwo);
        } else {
            loser = playerOne.username;
            winnerScore = playerTwo.user_points;
            loserScore = playerOne.user_points;

            winningPoints = parseInt(10 + ((loserScore - winnerScore) * 1.4 / 100));
            if (winningPoints > 19) {
                winningPoints = 19;
            }
            if (winningPoints < 0) {
                winningPoints = 0;
            }
            myScoreElement.innerText = playerTwo.username + " += "
                + winningPoints + " pts";
            enemyScoreElement.innerText = playerOne.username + " -= "
                + winningPoints + " pts";
            myScoreElement.classList.add("positive-score")
            socket.emit("update-score", roomId, -Math.abs(winningPoints), winningPoints, playerOne, playerTwo);
        }
    } else {
        if (playerOne.user_points > playerTwo.user_points) {
            winningPoints = parseInt((playerOne.user_points - playerTwo.user_points) * 1.4 / 100)
            if (winningPoints >= 9) {
                winningPoints = 9;
            }
            if (winningPoints < 0) {
                winningPoints = 0;
            }
            myScoreElement.innerText = playerTwo.username + " += "
                + winningPoints + " pts";
            enemyScoreElement.innerText = playerOne.username + " -="
                + winningPoints + " pts";
            myScoreElement.classList.add("positive-score")
            socket.emit("update-score", roomId, -Math.abs(winningPoints), winningPoints, playerOne, playerTwo);
        } else {
            winningPoints = parseInt((playerTwo.user_points - playerOne.user_points) * 1.4 / 100)
            if (winningPoints >= 9) {
                winningPoints = 9;
            }
            if (winningPoints < 0) {
                winningPoints = 0;
            }
            myScoreElement.innerText = playerOne.username + " += "
                + winningPoints + " pts";
            enemyScoreElement.innerText = playerTwo.username + " -="
                + winningPoints + " pts";
            myScoreElement.classList.add("positive-score")
            socket.emit("update-score", roomId, winningPoints, -Math.abs(winningPoints), playerOne, playerTwo);
        }
    }
    gameOverMessageContainer.classList.remove("hidden")
}
// --------------------------------------
const sortearCartas = () => {

    let numeros = [1, 2, 3];

    for (let i = numeros.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
    }

    const carta01LightNum = numeros[0];
    const carta02LightNum = numeros[1];

    numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = numeros.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
    }

    const carta03LightNum = numeros[0];
    const carta04LightNum = numeros[1];
    const carta05LightNum = numeros[2];

    const carta01LightImg = "../../assets/cartas/esp-carta" + carta01LightNum + ".jpeg";
    const carta02LightImg = "../../assets/cartas/esp-carta" + carta02LightNum + ".jpeg";
    const carta03LightImg = "../../assets/cartas/carta" + carta03LightNum + ".jpeg";
    const carta04LightImg = "../../assets/cartas/carta" + carta04LightNum + ".jpeg";
    const carta05LightImg = "../../assets/cartas/carta" + carta05LightNum + ".jpeg";

    numeros = [1, 2, 3];

    for (let i = numeros.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
    }

    const carta01BlackNum = numeros[0];
    const carta02BlackNum = numeros[1];

    numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = numeros.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
    }

    const carta03BlackNum = numeros[0];
    const carta04BlackNum = numeros[1];
    const carta05BlackNum = numeros[2];

    const carta01BlackImg = "../../assets/cartas/esp-carta" + carta01BlackNum + ".jpeg";
    const carta02BlackImg = "../../assets/cartas/esp-carta" + carta02BlackNum + ".jpeg";
    const carta03BlackImg = "../../assets/cartas/carta" + carta03BlackNum + ".jpeg";
    const carta04BlackImg = "../../assets/cartas/carta" + carta04BlackNum + ".jpeg";
    const carta05BlackImg = "../../assets/cartas/carta" + carta05BlackNum + ".jpeg";

    const lightCards =
        [carta01LightImg, carta02LightImg,
            carta03LightImg, carta04LightImg, carta05LightImg];

    const blackCards = [carta01BlackImg, carta02BlackImg,
        carta03BlackImg, carta04BlackImg, carta05BlackImg];

    const lightCardsNum =
        [carta01LightNum, carta02LightNum,
            carta03LightNum, carta04LightNum, carta05LightNum];

    const blackCardsNum = [carta01BlackNum, carta02BlackNum,
        carta03BlackNum, carta04BlackNum, carta05BlackNum];

    listenersCartas(lightCards, blackCards,
        lightCardsNum, blackCardsNum);
}

displayChessPieces()

const switchCartasEsp = (cartaNum) => {
    let poderCarta;
    switch (cartaNum) {
        case 1:
            poderCarta = "Add peça tab";
            break;

        case 2:
            poderCarta = "Impede card";
            break;

        case 3:
            poderCarta = "Win 1/4 time";
            break;

        default:
            poderCarta = "Carta errada";
            break;
    }

    return poderCarta;
}

const switchCartas = (cartaNum) => {
    let poderCarta;
    switch (cartaNum) {
        case 1:
            poderCarta = "Rei = dama";
            break;

        case 2:
            poderCarta = "Ganha 30 seg";
            break;

        case 3:
            poderCarta = "Ganha 10 seg";
            break;

        case 4:
            poderCarta = "Remove piece";
            break;

        case 5:
            poderCarta = "2 move blind";
            break;

        case 6:
            poderCarta = "Impede captura";
            break;

        case 7:
            poderCarta = "Trocar peça"
            break;

        case 8:
            poderCarta = "Impede carta";
            break;

        case 9:
            poderCarta = "Move enemy";
            break;

        default:
            poderCarta = "Carta errada";
            break;
    }

    return poderCarta;
}

const efeitoCartasEsp = (cartaNum) => {
    switch (cartaNum) {

        // "Add peça tab"



        // "Impede card"

        case 1:
        case 2:
        case 3:
            // cartaImpedido(enemy, "bishop");
            // setAddPieces();
            // timer.multiplyTime(5 / 4);
            blindMoves();
    }

    return;
}

const efeitoCartas = (cartaNum) => {
    switch (cartaNum) {
        case 1:
            // "Rei = dama";
            break;

        case 2:
            // "Ganha 30 seg"
            break;

        case 3:
            // "Ganha 10 seg"
            break;

        case 4:
            // "Remove piece"
            break;

        case 5:
            // "2 move blind"
            break;

        case 6:
            // "Impede captura"
            break;

        case 7:
            // "Trocar peça"
            break;

        case 8:
            // "Impede carta"
            break;

        case 9:
            // "Move enemy"
            break;
    }

    return;
}

const popUp = (div, texto) => {
    const div1 = document.createElement("div")
    div1.classList.add("pop-up")
    div1.textContent = texto;
    div.appendChild(div1);
}

const listenersCartas = (lightCards, blackCards,
    lightCardsNum, blackCardsNum) => {

    let carta01LightImg = lightCards[0];
    let carta02LightImg = lightCards[1];
    let carta03LightImg = lightCards[2];
    let carta04LightImg = lightCards[3];
    let carta05LightImg = lightCards[4];

    let carta01BlackImg = blackCards[0];
    let carta02BlackImg = blackCards[1];
    let carta03BlackImg = blackCards[2];
    let carta04BlackImg = blackCards[3];
    let carta05BlackImg = blackCards[4];

    let carta01LightNum = lightCardsNum[0];
    let carta02LightNum = lightCardsNum[1];
    let carta03LightNum = lightCardsNum[2];
    let carta04LightNum = lightCardsNum[3];
    let carta05LightNum = lightCardsNum[4];

    let carta01BlackNum = blackCardsNum[0];
    let carta02BlackNum = blackCardsNum[1];
    let carta03BlackNum = blackCardsNum[2];
    let carta04BlackNum = blackCardsNum[3];
    let carta05BlackNum = blackCardsNum[4];

    carta01LightCard.addEventListener("click", () => {
        if (lance >= waitLanceEspLight && estagioCarta01Light === 1
            && myTurn && lance % 2 === 0
        ) {
            carta01LightCard.children[0].src = carta01LightImg;
            estagioCarta01Light += 1;
            waitLanceEspLight += 4;
            popUp(carta01LightCard, switchCartasEsp(carta01LightNum));
        }
        if (lance >= waitLanceEspLight && estagioCarta01Light === 2
            && myTurn && lance % 2 === 0
        ) {
            showCard.children[0].src = carta01LightImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta01LightCard.remove();
            efeitoCartasEsp(carta01LightNum);

            carta02LightCard.children[0].src = carta02LightImg;
            estagioCarta02Light += 1;
            waitLanceEspLight += 4;
            popUp(carta02LightCard, switchCartasEsp(carta02LightNum));
        }
    })

    carta02LightCard.addEventListener("click", () => {
        if (lance >= waitLanceEspLight && estagioCarta02Light === 2
            && myTurn && lance % 2 === 0
        ) {
            showCard.children[0].src = carta02LightImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta02LightCard.remove();
            efeitoCartasEsp(carta02LightNum);
        }
    })

    carta03LightCard.addEventListener("click", () => {
        if (lance >= waitLanceCommonLight && estagioCarta03Light === 1
            && myTurn && lance % 2 === 1
        ) {
            carta03LightCard.children[0].src = carta03LightImg;
            estagioCarta03Light += 1;
            waitLanceCommonLight += 2;
            popUp(carta03LightCard, switchCartas(carta03LightNum));
        }
        if (lance >= waitLanceCommonLight && estagioCarta03Light === 2
            && myTurn && lance % 2 === 1
        ) {
            showCard.children[0].src = carta03LightImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta03LightCard.remove();
            efeitoCartasEsp(carta02LightNum);

            carta04LightCard.children[0].src = carta04LightImg;
            estagioCarta04Light += 1;
            waitLanceCommonLight += 2;
            popUp(carta04LightCard, switchCartas(carta04LightNum));
        }
    })

    carta04LightCard.addEventListener("click", () => {
        if (lance >= waitLanceCommonLight && estagioCarta04Light === 2
            && myTurn && lance % 2 === 1
        ) {
            showCard.children[0].src = carta04LightImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta04LightCard.remove();
            efeitoCartasEsp(carta02LightNum);

            carta05LightCard.children[0].src = carta05LightImg;
            estagioCarta05Light += 1;
            waitLanceCommonLight += 2;
            popUp(carta05LightCard, switchCartas(carta05LightNum));
        }
    })

    carta05LightCard.addEventListener("click", () => {
        if (lance >= waitLanceCommonLight && estagioCarta05Light === 2
            && myTurn && lance % 2 === 1
        ) {
            showCard.children[0].src = carta05LightImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta05LightCard.remove();
            efeitoCartasEsp(carta02LightNum);
        }
    })

    //======================================================

    carta01BlackCard.addEventListener("click", () => {
        if (lance >= waitLanceEspBlack && estagioCarta01Black === 1
            && myTurn && lance % 2 === 0
        ) {
            carta01BlackCard.children[0].src = carta01BlackImg;
            estagioCarta01Black += 1;
            waitLanceEspBlack += 4;
            popUp(carta01BlackCard, switchCartasEsp(carta01BlackNum));
        }
        if (lance >= waitLanceEspBlack && estagioCarta01Black === 2
            && myTurn && lance % 2 === 0
        ) {
            showCard.children[0].src = carta01BlackImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta01BlackCard.remove();
            efeitoCartasEsp(carta01BlackNum);

            carta02BlackCard.children[0].src = carta02BlackImg;
            estagioCarta02Black += 1;
            waitLanceEspBlack += 4;
            popUp(carta02BlackCard, switchCartasEsp(carta02BlackNum));
        }
    })

    carta02BlackCard.addEventListener("click", () => {
        if (lance >= waitLanceEspBlack && estagioCarta02Black === 2
            && myTurn && lance % 2 === 0
        ) {
            showCard.children[0].src = carta02BlackImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta02BlackCard.remove();
            efeitoCartasEsp(carta02BlackNum);
        }
    })

    carta03BlackCard.addEventListener("click", () => {
        if (lance >= waitLanceCommonBlack && estagioCarta03Black === 1
            && myTurn && lance % 2 === 1
        ) {
            carta03BlackCard.children[0].src = carta03BlackImg;
            estagioCarta03Black += 1;
            waitLanceCommonBlack += 2;
            popUp(carta03BlackCard, switchCartas(carta03BlackNum));
        }
        if (lance >= waitLanceCommonBlack && estagioCarta03Black === 2
            && myTurn && lance % 2 === 1
        ) {
            showCard.children[0].src = carta03BlackImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta03BlackCard.remove();
            efeitoCartasEsp(carta02BlackNum);

            carta04BlackCard.children[0].src = carta04BlackImg;
            estagioCarta04Black += 1;
            waitLanceCommonBlack += 2;
            popUp(carta04BlackCard, switchCartas(carta04BlackNum));
        }
    })

    carta04BlackCard.addEventListener("click", () => {
        if (lance >= waitLanceCommonBlack && estagioCarta04Black === 2
            && myTurn && lance % 2 === 1
        ) {
            showCard.children[0].src = carta04BlackImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta04BlackCard.remove();
            efeitoCartasEsp(carta02BlackNum);

            carta05BlackCard.children[0].src = carta05BlackImg;
            estagioCarta05Black += 1;
            waitLanceCommonBlack += 2;
            popUp(carta05BlackCard, switchCartas(carta05BlackNum));
        }
    })

    carta05BlackCard.addEventListener("click", () => {
        if (lance >= waitLanceCommonBlack && estagioCarta05Black === 2
            && myTurn && lance % 2 === 1
        ) {
            showCard.children[0].src = carta05BlackImg;
            showCard.classList.remove("hidden");
            setTimeout(() => {
                showCard.classList.add("hidden")
                showCard.children[0].src = "";
            }, 2000)
            carta05BlackCard.remove();
            efeitoCartasEsp(carta02BlackNum);
        }
    })
}

const addBrilhoCards = () => {

    if (lance >= waitLanceEspLight && estagioCarta01Light === 1) {
        carta01LightCard.classList.add("card-brilhante1");
    }

    if (lance >= waitLanceEspLight - 3 && estagioCarta01Light === 2) {
        carta01LightCard.classList.remove("card-brilhante1");
    }

    if (lance >= waitLanceCommonLight && estagioCarta03Light === 1) {
        carta03LightCard.classList.add("card-brilhante1");
    }

    if (lance >= waitLanceCommonLight - 1 && estagioCarta03Light === 2) {
        carta03LightCard.classList.remove("card-brilhante1");
    }

    if (lance >= waitLanceEspBlack && estagioCarta01Black === 1) {
        carta01BlackCard.classList.add("card-brilhante1");
    }

    if (lance >= waitLanceEspBlack - 3 && estagioCarta01Black === 2) {
        carta01BlackCard.classList.remove("card-brilhante1");
    }

    if (lance >= waitLanceCommonBlack && estagioCarta03Black === 1) {
        carta03BlackCard.classList.add("card-brilhante1");
    }

    if (lance >= waitLanceCommonBlack - 1 && estagioCarta03Black === 2) {
        carta03BlackCard.classList.remove("card-brilhante1");
    }

    //=============================================================

    if (lance >= waitLanceEspLight && estagioCarta01Light === 2) {
        carta01LightCard.classList.add("card-brilhante2");
    }

    if (lance >= waitLanceEspLight && estagioCarta02Light === 2) {
        carta02LightCard.classList.add("card-brilhante2");
    }

    if (lance >= waitLanceCommonLight && estagioCarta03Light === 2) {
        carta03LightCard.classList.add("card-brilhante2");
    }

    if (lance >= waitLanceCommonLight && estagioCarta04Light === 2) {
        carta04LightCard.classList.add("card-brilhante2");
    }

    if (lance >= waitLanceCommonLight && estagioCarta05Light === 2) {
        carta05LightCard.classList.add("card-brilhante2");
    }

    if (lance >= waitLanceEspBlack && estagioCarta01Black === 2) {
        carta01BlackCard.classList.add("card-brilhante2");
    }

    if (lance >= waitLanceEspBlack && estagioCarta02Black === 2) {
        carta02BlackCard.classList.add("card-brilhante2");
    }

    if (lance >= waitLanceCommonBlack && estagioCarta03Black === 2) {
        carta03BlackCard.classList.add("card-brilhante2");
    }

    if (lance >= waitLanceCommonBlack && estagioCarta04Black === 2) {
        carta04BlackCard.classList.add("card-brilhante2");
    }

    if (lance >= waitLanceCommonBlack && estagioCarta05Black === 2) {
        carta05BlackCard.classList.add("card-brilhante2");
    }
}
// =====================
// Socket Listeners
// =====================

socket.on("users-points", (winner, playerOne, playerTwo) => {
    endGame(playerOne, playerTwo, winner);
});

socket.on("receive-game-details", (details) => {
    gameDetails = details;

    let playerOne = gameDetails.players[0];
    gameHasTimer = gameDetails.time > 0

    if (!gameHasTimer) {
        playerLightTimer.classList.add("hidden")
        playerBlackTimer.classList.add("hidden")
    } else {
        playerLightTimer.innerText = gameDetails.time + ":00";
        playerBlackTimer.innerText = gameDetails.time + ":00";
    }

    playerLight.querySelector(".username").innerText = playerOne.username;

    if (playerOne.username === user.username) {
        player = 'light'
        enemy = 'black'

        myTurn = true
    } else {
        gameStartedAtTimestamp = new Date().toISOString().slice(0, 19).replace("T", ' ')

        player = 'black'
        enemy = 'light'

        setCursor('default')
        startGame(user)
    }

    if (gameHasTimer) {
        timer = new Timer(player, roomId, gameDetails.time, 0, updateTimer, timerEndedCallback)
    }

    hideSpinner();
})

// If we are the first player and someone joins then this event is emitted
socket.on("game-started", (playerTwo) => {
    gameStartedAtTimestamp = new Date().toISOString().slice(0, 19).replace("T", ' ')
    startGame(playerTwo)

    if (gameHasTimer) {
        timer.start()
    }
})

socket.on("enemy-moved", (move) => {
    moveEnemy(move)
})

socket.on('enemy-moved_pawn-promotion', (move, pawnPromotion) => {
    moveEnemy(move, pawnPromotion)
})

socket.on('enemy-moved_el-passant', (move) => {
    moveEnemy(move, null, true)
})

socket.on("enemy-timer-updated", (minutes, seconds) => {
    updateTimer(enemy, minutes, seconds)
})

socket.on("time-ended", (winner, playerOne, playerTwo, ifDraw) => {
    if (ifDraw) {
        endGame(playerOne, playerTwo, null);
    } else {
        endGame(playerOne, playerTwo, winner);
    }
})

socket.on("desconectado", (winner, playerOne, playerTwo) => {
    endGame(playerOne, playerTwo, winner);
})

socket.on("carta-impedida", (cor, peca, num) => {

    if (cor === "light") {
        cartaImpedidoCorLight = true;
        cartaImpedidoPecaLight = peca;
        cartaImpedidoNumLight = num;
    } else {
        cartaImpedidoCorBlack = true;
        cartaImpedidoPecaBlack = peca;
        cartaImpedidoNumBlack = num;
    }
});

socket.on("blind-moves", (corDoInimigo, minhaCor) => {

    if (player === corDoInimigo) {
        let allPieces = document.querySelectorAll(`.piece.${minhaCor}`)
        allPieces.forEach(piece => {
            piece.classList.add("hidden");
        })
    }
    if (corDoInimigo === "light") {
        timeBlindMovesLight = 2;
        blindBoolLight = true;
    }
    else {
        timeBlindMovesBlack = 2;
        blindBoolBlack = true;
    }
});

socket.on("add-piece", ({ piece, img, corPeca, boxId }) => {

    const box = document.getElementById(boxId);

    if (!box) {
        return;
    }

    if (box.children.length > 0) {
        return;
    }

    const elementoPeca = document.createElement("img");

    elementoPeca.src = img;
    const div = document.createElement("div");
    div.appendChild(elementoPeca);
    div.dataset.piece = piece;
    div.classList.add("piece");
    if (corPeca === "light") {
        div.classList.add("light")
    }
    else {
        div.classList.add("black")
    }

    box.appendChild(div);
});

window.addEventListener("beforeunload", (event) => {

    if (!gameOver) {
        event.preventDefault();
        event.returnValue = "";
    }
});