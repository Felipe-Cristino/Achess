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
let draggedPiece = null;

// =====================
// Game Variables
// =====================
let user = null;

let search = window.location.search.split("&")
let positionHistory = new Map();

let roomId = null;
let password = null;

let gameDetails = null;

let gameHasTimer = false;
let timer = null;
let myTurn = false;
let kingIsAttacked = false;
let pawnToPromotePosition = null;
let castling = null;

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
    let playerIsLight = element.children[0].
        getAttribute("src").includes("light");
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
        piece.addEventListener("click", onClickPiece)
        piece.addEventListener("dragstart", onClickPiece);
    })

    document.querySelectorAll(`.piece.${enemy}`).forEach(piece => {
        piece.style.cursor = "default"
    })
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

const findPossibleMoves = (position, piece, afogadoBool = false) => {
    let splittedPos = position.split("-");
    let yAxisPos = +splittedPos[1]
    let xAxisPos = splittedPos[0]

    let yAxisIndex = yAxis.findIndex(y => y === yAxisPos)
    let xAxisIndex = xAxis.findIndex(x => x === xAxisPos)

    switch (piece) {
        case "pawn":
            return getPawnPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex, afogadoBool);
        case 'rook':
            return getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex, afogadoBool);
        case 'bishop':
            return getBishopPossibleMoves(xAxisIndex, yAxisIndex, afogadoBool)
        case 'knight':
            return getKnightPossibleMoves(xAxisIndex, yAxisIndex, afogadoBool)
        case 'queen':
            return Array.prototype.concat(
                getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex, afogadoBool),
                getBishopPossibleMoves(xAxisIndex, yAxisIndex, afogadoBool)
            )
        case 'king':
            return getKingPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex, afogadoBool)
        default:
            return []
    }
}

const checkIfReiAfogado = (player) => {

    let pecas = player === "light" ? "black" : "light";

    const allPieces = document.querySelectorAll(`.piece.${pecas}`);
    let possibleMoves2;
    let arrayPossibleMoves = [];

    allPieces.forEach(piece => {
        possibleMoves2 = findPossibleMoves(piece.parentNode.id, piece.dataset.piece, true);
        possibleMoves2.forEach(move => {
            arrayPossibleMoves.push({
                move: move,
                piece: piece.dataset.piece,
                currentSquare: piece.parentNode.id
            });
        });
    });

    let kingPosition = getKingPosition(pecas);
    let reiEmXeque = isCheck(kingPosition, false);

    arrayPossibleMoves = arrayPossibleMoves.filter(peca => {
        if (peca.piece === "king") {
            let kingBox = document.getElementById(kingPosition);
            let kingPiece = kingBox.children[0];
            kingBox.removeChild(kingPiece)
            if (!isCheck(peca.move.id, false)) {
                kingBox.appendChild(kingPiece);
                return true;
            }
            else {
                kingBox.appendChild(kingPiece);
                return false;
            }
        }
        else {
            let idPecaRemover = peca.currentSquare;
            let boxPecaRemover = document.getElementById(idPecaRemover);
            let pecaCompleta = boxPecaRemover.children[0];
            let casaFutura = document.getElementById(peca.move.id);
            let casaFuturaImg = null;
            let casaFuturaImgTemp = null;
            if (casaFutura.children.length > 0) {
                casaFuturaImg = casaFutura.children[0];
                casaFuturaImgTemp = casaFuturaImg;
                casaFutura.removeChild(casaFuturaImg);
            }
            casaFutura.appendChild(pecaCompleta);
            if (!isCheck(kingPosition, false)) {
                boxPecaRemover.appendChild(pecaCompleta);
                if (casaFuturaImgTemp !== null) {
                    casaFutura.appendChild(casaFuturaImgTemp)
                }
                return true;
            } else {
                boxPecaRemover.appendChild(pecaCompleta);
                if (casaFuturaImgTemp !== null) {
                    casaFutura.appendChild(casaFuturaImgTemp)
                }
                return false;
            }
        }
    });

    if (arrayPossibleMoves.length === 0 && !reiEmXeque) {
        return true;
    }

    return false;
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
    socket.emit('timer-ended', roomId, user.username, gameStartedAtTimestamp, ifDraw)
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
}

const setKingIsAttacked = (isAttacked) => {
    kingIsAttacked = isAttacked;

    let myKing = document.getElementById(getKingPosition(player)).children[0];

    if (isAttacked) {
        myKing.classList.add('warning-block');
        displayToast("Your king is under attack");
    } else {
        myKing.classList.remove('warning-block');
    }
}

const endMyTurn = (newPieceBox, pawnPromoted = false, castlingPerformed = false, elPassantPerformed = false) => {
    if (kingIsAttacked) {
        setKingIsAttacked(false);
    }

    myTurn = false;
    setCursor("default")

    saveMove(newPieceBox, pawnPromoted, castlingPerformed, elPassantPerformed);

    const afogado = checkIfReiAfogado(player);

    if (afogado) {
        socket.emit("draw", roomId, gameStartedAtTimestamp)
        socket.emit("draw-room", roomId)
    }

    setTimeout(() => {
        checkIfKingIsAttacked(enemy);
    }, 300);

}
// --------------------------------------

const pecasMovidas = (currentBox, boxToMove) => {

    if (currentBox === "A-1") {
        torreA1Movido = true;
    }

    if (boxToMove === "A-1") {
        torreA1Movido = true;
    }

    if (currentBox === "H-1") {
        torreH1Movido = true;
    }

    if (boxToMove === "H-1") {
        torreH1Movido = true;
    }

    if (currentBox === "A-8") {
        torreA8Movido = true;
    }

    if (boxToMove === "A-8") {
        torreA8Movido = true;
    }

    if (currentBox === "H-8") {
        torreH8Movido = true;
    }

    if (boxToMove === "H-8") {
        torreH8Movido = true;
    }

    if (currentBox === "E-1") {
        reiE1Movido = true;
    }

    if (currentBox === "E-8") {
        reiE8Movido = true;
    }
}

const pecasVoltadas = (currentBox, boxToMove) => {

    if (currentBox === "A-1") {
        torreA1Movido = false;
    }

    if (boxToMove === "A-1") {
        torreA1Movido = false;
    }

    if (currentBox === "H-1") {
        torreH1Movido = false;
    }

    if (boxToMove === "H-1") {
        torreH1Movido = false;
    }

    if (currentBox === "A-8") {
        torreA8Movido = false;
    }

    if (boxToMove === "A-8") {
        torreA8Movido = false;
    }

    if (currentBox === "H-8") {
        torreH8Movido = false;
    }

    if (boxToMove === "H-8") {
        torreH8Movido = false;
    }

    if (currentBox === "E-1") {
        reiE1Movido = false;
    }

    if (currentBox === "E-8") {
        reiE8Movido = false;
    }
}

const castleVerified = () => {
    if (torreA1Movido) {
        torreEsquerdaBrancaNuncaMovido = false;
    }

    if (torreH1Movido) {
        torreDireitaBrancaNuncaMovido = false;
    }

    if (torreA8Movido) {
        torreEsquerdaPretaNuncaMovido = false;
    }

    if (torreH8Movido) {
        torreDireitaPretaNuncaMovido = false;
    }

    if (reiE1Movido) {
        reiBrancoNuncaMovido = false;
    }

    if (reiE8Movido) {
        reiPretoNuncaMovido = false;
    }
}

// Move Logic

const move = (e) => {

    let currentBox = document.getElementById(selectedPiece.position);
    let boxToMove = e.target.parentNode;
    let piece = currentBox.querySelector(".piece");

    hidePossibleMoves();

    let pieceToRemove = null;
    let pieceToRemovePieceImg = null;
    let xAxis = ["A", "B", "C", "D", "E", "F", "G", "H"];
    let boxToMoveIndex = xAxis.findIndex(x => x === boxToMove.id.split("-")[0])
    let currentBoxIndex = xAxis.findIndex(x => x === currentBox.id.split("-")[0])

    if (Math.abs(boxToMoveIndex - currentBoxIndex) === 2 &&
        currentBox.children[0].dataset.piece === "king") {
        performCastling(player, currentBox.id, boxToMove.id)

        return;
    }

    pecasMovidas(currentBox.id, boxToMove.id);

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

    let boxesNeededForCheck = {
        currentBox, boxToMove
    }

    let piecesNeededForCheck = {
        piece, pieceToRemove, pieceToRemovePieceImg
    }

    let isMovePossible = canMakeMove(boxesNeededForCheck, piecesNeededForCheck);

    if (!isMovePossible) {
        pecasVoltadas(currentBox.id, boxToMove.id);
        return;
    }

    castleVerified();

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

    if (checkForDraw()) {
        socket.emit("draw", roomId, gameStartedAtTimestamp)
        socket.emit("draw-room", roomId)
    }

    endMyTurn(boxToMove)

    savePosition()
}

function savePosition() {

    let key = generatePositionKey();

    let repetitions = positionHistory.get(key) || 0;

    repetitions++;

    positionHistory.set(key, repetitions);

    if (repetitions >= 3) {
        socket.emit("draw", roomId, gameStartedAtTimestamp)
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

const canMakeMove = ({ currentBox, boxToMove }, { piece, pieceToRemove, pieceToRemovePieceImg }) => {
    // TODO: Check if move is valid
    let moveIsNotValid = checkIfKingIsAttacked(player);

    if (moveIsNotValid) {
        selectedPiece = null;

        if (pieceToRemove) {
            pieceToRemove.appendChild(pieceToRemovePieceImg)

            boxToMove.removeChild(piece);
            boxToMove.appendChild(pieceToRemove);

            if (pieceToRemove.classList.contains("black")) {
                blackCapturedPieces.removeChild(blackCapturedPieces.lastChild)
            } else {
                lightCapturedPieces.removeChild(lightCapturedPieces.lastChild)
            }
        }

        currentBox.appendChild(piece);

        displayToast("You can't make this move. Your king is under attack")

        return false
    }

    return true
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

const checkIfKingIsAttacked = (playerToCheck) => {
    let kingPosition = getKingPosition(playerToCheck);

    let check = isCheck(kingPosition, playerToCheck === player);

    if (check) {
        if (player !== playerToCheck) {
            if (isCheckmate(kingPosition)) {
                socket.emit('checkmate', roomId, gameStartedAtTimestamp)
                socket.emit("checkmate-room", roomId, user.username);
            } else {
                socket.emit('check', roomId);
            }
        }

        return true;
    }

    return false;
}

const saveMove = (newPieceBox, pawnPromoted, castlingPerformed, elPassantPerformed) => {
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
    } else if (castlingPerformed) {
        socket.emit('move-made', roomId, move, null, castling)
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

// Castling Logic
const performCastling = (currentPlayer, kingPosition, kingToCastle) => {

    let kingBox = document.getElementById(kingPosition)
    let king = kingBox.children[0]
    let newKingPosition = kingToCastle;
    let rook;
    let rookFuturePosition;
    let rookBox;

    if (currentPlayer === "light") {
        if (kingToCastle.split("-")[0] === "C") {
            rookBox = document.getElementById("A-1");
            rook = rookBox.children[0];
            rookFuturePosition = "D-1";
        }
        else {
            rookBox = document.getElementById("H-1");
            rook = rookBox.children[0];
            rookFuturePosition = "F-1";
        }
    }
    else {
        if (kingToCastle.split("-")[0] === "C") {
            rookBox = document.getElementById("A-8");
            rook = rookBox.children[0];
            rookFuturePosition = "D-8";
        }
        else {
            rookBox = document.getElementById("H-8");
            rook = rookBox.children[0];
            rookFuturePosition = "F-8";
        }
    }

    let newRookBox = document.getElementById(rookFuturePosition);
    let newKingBox = document.getElementById(kingToCastle);

    newRookBox.appendChild(rook)
    newKingBox.appendChild(king)

    if (currentPlayer === player) {
        let check = isCheck(newKingPosition);
        let check2 = isCheck(rookFuturePosition);
        let check3 = isCheck(kingPosition);

        if (check || check2 || check3) {
            newRookBox.innerHTML = ""
            newKingBox.innerHTML = ""

            rookBox.appendChild(rook)
            kingBox.appendChild(king)

            displayToast("Your king is under attack")
        } else {
            if (rookBox.id.split("-")[0] === 'A') {
                if (currentPlayer === "light") {
                    isLeftCastlingPerformedWhite = true;
                }
                else {
                    isLeftCastlingPerformedBlack = true;
                }
            } else {
                if (currentPlayer === "light") {
                    isRightCastlingPerformedWhite = true;
                }
                else {
                    isRightCastlingPerformedBlack = true;
                }
            }

            castling = {
                kingPosition,
                kingToCastle
            }

            endMyTurn(document.getElementById(kingPosition), false, true)
        }
    } else {
        castling = null;

        myTurn = true;
        setCursor('pointer');

        if (gameHasTimer) {
            timer.start()
        }
    }
}
// --------------------------------------

// Pawn Promotion Logic
const setPiecesToPromote = () => {
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
        endMyTurn(document.getElementById(newPawnPosition), false, false, true)

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

// Draw Logic
const checkForDraw = () => {
    let myTotalPieces = document.querySelectorAll(`.piece.${player}`).length
    let enemyTotalPieces = document.querySelectorAll(`.piece.${enemy}`).length

    const pawnsBlack = blackCapturedPieces.querySelectorAll('li img[src*="pawn"]');
    const quantidadePeoesBlackCaptured = pawnsBlack.length;
    const rooksBlack = blackCapturedPieces.querySelectorAll('li img[src*="rook"]');
    const quantidadeTorresBlackCaptured = rooksBlack.length;

    const pawnsLight = lightCapturedPieces.querySelectorAll('li img[src*="pawn"]');
    const quantidadePeoesLightCaptured = pawnsLight.length;
    const rooksLight = lightCapturedPieces.querySelectorAll('li img[src*="rook"]');
    const quantidadeTorresLightCaptured = rooksLight.length;

    if (myScore > 34 && enemyScore > 34 &&
        quantidadePeoesBlackCaptured === 8 &&
        quantidadePeoesLightCaptured === 8 &&
        quantidadeTorresBlackCaptured === 2 &&
        quantidadeTorresLightCaptured === 2
    ) {
        return true;
    }

    return false;
}
// --------------------------------------

// Game Over Logic
const endGame = (winner = null, playerOne = null, playerTwo = null) => {
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

displayChessPieces()

// =====================
// Socket Listeners
// =====================

socket.on("users-points", (winner, playerOne, playerTwo) => {
    endGame(winner, playerOne, playerTwo);
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

socket.on("enemy-moved_castling", (enemyCastling) => {
    const { kingPosition, kingToCastle } = enemyCastling
    performCastling(enemy, kingPosition, kingToCastle);
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

socket.on("king-is-attacked", () => {
    setKingIsAttacked(true);
})


socket.on("draw-points", (playerOne, playerTwo) => {
    endGame(null, playerOne, playerTwo);
})

socket.on("time-ended", (winner, playerOne, playerTwo, ifDraw) => {
    if (ifDraw) {
        endGame(null, playerOne, playerTwo);
    } else {
        endGame(winner, playerOne, playerTwo);
    }
})

socket.on("desconectado", (winner, playerOne, playerTwo)=>{
    endGame(winner, playerOne, playerTwo);
})

window.addEventListener("beforeunload", (event) => {

    if (!gameOver) {
        event.preventDefault();
        event.returnValue = "";
    }
});