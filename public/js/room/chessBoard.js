// =================================================
// Constant Variables (Initial Values For The Game)
// =================================================
const xAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const yAxis = [1, 2, 3, 4, 5, 6, 7, 8]

const lightPiecesEndingPosition = ['A-8', 'B-8', 'C-8', 'D-8', 'E-8', 'F-8', 'G-8', 'H-8']
const blackPiecesEndingPosition = ['A-1', 'B-1', 'C-1', 'D-1', 'E-1', 'F-1', 'G-1', 'H-1']

let player = null;
let enemy = null;

let torreA1Movido = false;
let torreH1Movido = false;
let reiE1Movido = false;
let torreA8Movido = false;
let torreH8Movido = false;
let reiE8Movido = false;

let reiBrancoNuncaMovido = true;
let reiPretoNuncaMovido = true;
let torreDireitaBrancaNuncaMovido = true;
let torreEsquerdaBrancaNuncaMovido = true;
let torreDireitaPretaNuncaMovido = true;
let torreEsquerdaPretaNuncaMovido = true;

let isLeftCastlingPerformedWhite = false;
let isRightCastlingPerformedWhite = false;
let isLeftCastlingPerformedBlack = false;
let isRightCastlingPerformedBlack = false;

let selectedPiece = null

let pawnsToPerformElPassant = {}
let elPassantPositions = {};

const lightPieces = [
    {
        position: "A-1",
        icon: "../assets/chess-icons/light/chess-rook-light.svg",
        points: 5,
        piece: 'rook'
    },
    {
        position: "B-1",
        icon: "../assets/chess-icons/light/chess-knight-light.svg",
        points: 3,
        piece: 'knight'
    },
    {
        position: "C-1",
        icon: "../assets/chess-icons/light/chess-bishop-light.svg",
        points: 4,
        piece: 'bishop'
    },
    {
        position: "D-1",
        icon: "../assets/chess-icons/light/chess-queen-light.svg",
        points: 9,
        piece: 'queen'
    },
    {
        position: "E-1",
        icon: "../assets/chess-icons/light/chess-king-light.svg",
        points: 10,
        piece: 'king'
    },
    {
        position: "F-1",
        icon: "../assets/chess-icons/light/chess-bishop-light.svg",
        points: 4,
        piece: 'bishop'
    },
    {
        position: "G-1",
        icon: "../assets/chess-icons/light/chess-knight-light.svg",
        points: 3,
        piece: 'knight'
    },
    {
        position: "H-1",
        icon: "../assets/chess-icons/light/chess-rook-light.svg",
        points: 5,
        piece: 'rook'
    },
    {
        position: "A-2",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "B-2",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "C-2",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "D-2",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "E-2",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "F-2",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "G-2",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "H-2",
        icon: "../assets/chess-icons/light/chess-pawn-light.svg",
        points: 1,
        piece: 'pawn'
    }
]

const blackPieces = [
    {
        position: "A-8",
        icon: "../assets/chess-icons/black/chess-rook-black.svg",
        points: 5,
        piece: 'rook'
    },
    {
        position: "B-8",
        icon: "../assets/chess-icons/black/chess-knight-black.svg",
        points: 3,
        piece: 'knight'
    },
    {
        position: "C-8",
        icon: "../assets/chess-icons/black/chess-bishop-black.svg",
        points: 4,
        piece: 'bishop'
    },
    {
        position: "D-8",
        icon: "../assets/chess-icons/black/chess-queen-black.svg",
        points: 9,
        piece: 'queen'
    },
    {
        position: "E-8",
        icon: "../assets/chess-icons/black/chess-king-black.svg",
        points: 10,
        piece: 'king'
    },
    {
        position: "F-8",
        icon: "../assets/chess-icons/black/chess-bishop-black.svg",
        points: 4,
        piece: 'bishop'
    },
    {
        position: "G-8",
        icon: "../assets/chess-icons/black/chess-knight-black.svg",
        points: 3,
        piece: 'knight'
    },
    {
        position: "H-8",
        icon: "../assets/chess-icons/black/chess-rook-black.svg",
        points: 5,
        piece: 'rook'
    },
    {
        position: "A-7",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "B-7",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "C-7",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "D-7",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "E-7",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "F-7",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "G-7",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 1,
        piece: 'pawn'
    },
    {
        position: "H-7",
        icon: "../assets/chess-icons/black/chess-pawn-black.svg",
        points: 1,
        piece: 'pawn'
    }
]

const totalPiecesPoints = lightPieces.reduce((acc, piece) => acc + piece.points, 0)

const getPawnPossibleMoves = (xAxisPos, yAxisPos, xAxisIndex, yAxisIndex, afogadoBool = false) => {
    let possibleMoves = []

    let forwardMoves = 1;

    let yAxisIndexForCapture = null;
    let canMoveForward = false;

    let corDoInimigo;

    if (afogadoBool) {
        corDoInimigo = enemy === "light" ? "black" : "light";
    }

    if (afogadoBool ? corDoInimigo === "light" : enemy === "light") {
        if (yAxisPos === 7) {
            forwardMoves = 2;
        }

        yAxisIndexForCapture = yAxisIndex - 1
        canMoveForward = yAxisIndex > 0

        for (let y = yAxisIndex - 1; y >= yAxisIndex - forwardMoves; y--) {
            if (y < 0) {
                break;
            }

            let box = document.getElementById(`${xAxisPos}-${yAxis[y]}`);

            if (box.childElementCount === 0) {
                possibleMoves.push(box);
            } else {
                break;
            }
        }
    } else {
        if (yAxisPos === 2) {
            forwardMoves = 2;
        }

        yAxisIndexForCapture = yAxisIndex + 1
        canMoveForward = yAxisIndex < yAxis.length

        for (let y = yAxisIndex + 1; y <= yAxisIndex + forwardMoves; y++) {
            if (y > yAxis.length) {
                break;
            }

            let box = document.getElementById(`${xAxisPos}-${yAxis[y]}`);

            if (box.childElementCount === 0) {
                possibleMoves.push(box);
            } else {
                break;
            }
        }
    }

    if (canMoveForward) {
        if (xAxisIndex > 0) {
            let pieceToCaptureLeft = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndexForCapture]}`);

            if (pieceToCaptureLeft.childElementCount > 0 && pieceToCaptureLeft.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(pieceToCaptureLeft)
            }
        }

        if (xAxisIndex < xAxis.length - 1) {
            let pieceToCaptureRight = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndexForCapture]}`);

            if (pieceToCaptureRight.childElementCount > 0 && pieceToCaptureRight.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(pieceToCaptureRight)
            }
        }
    }

    if (Object.keys(pawnsToPerformElPassant).length > 0) {
        if (xAxisIndex - 1 >= 0) {
            let leftBox = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxisPos}`);

            if (
                leftBox.children.length > 0 &&
                leftBox.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy) &&
                leftBox.children[0].dataset.piece === 'pawn' &&
                pawnsToPerformElPassant[`${xAxis[xAxisIndex - 1]}-${yAxisPos}`]
            ) {
                elPassantPositions[`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndexForCapture]}`] = true;

                let boxForElPassant = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndexForCapture]}`);

                possibleMoves.push(boxForElPassant)
            }
        }

        if (xAxisIndex + 1 < xAxis.length) {
            let rightBox = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxisPos}`);

            if (
                rightBox.children.length > 0 &&
                rightBox.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy) &&
                rightBox.children[0].dataset.piece === 'pawn' &&
                pawnsToPerformElPassant[`${xAxis[xAxisIndex + 1]}-${yAxisPos}`]
            ) {
                elPassantPositions[`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndexForCapture]}`] = true;

                let boxForElPassant = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndexForCapture]}`);

                possibleMoves.push(boxForElPassant)
            }
        }
    }

    return possibleMoves
}

const getRookPossibleMoves = (xAxisPos, yAxisPos, xAxisIndex, yAxisIndex, afogadoBool = false) => {
    let possibleMoves = []

    let topCollision = false;
    let bottomCollision = false;
    let rightCollision = false;
    let leftCollision = false;
    let yInc = 1;
    let xInc = 1;

    let corDoInimigo;

    if (afogadoBool) {
        corDoInimigo = enemy === "light" ? "black" : "light";
    }

    while (!topCollision || !bottomCollision || !leftCollision || !rightCollision) {
        if (!topCollision || !bottomCollision) {
            if (yAxisIndex + yInc < yAxis.length) {
                if (!topCollision) {
                    let topBlock = document.getElementById(`${xAxisPos}-${yAxis[yAxisIndex + yInc]}`);

                    if (topBlock.childElementCount > 0) {
                        if (topBlock.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                            possibleMoves.push(topBlock)
                        }

                        topCollision = true
                    } else {
                        possibleMoves.push(topBlock)
                    }
                }
            } else {
                topCollision = true
            }

            if (yAxisIndex - yInc > -1) {
                if (!bottomCollision) {
                    let bottomBlock = document.getElementById(`${xAxisPos}-${yAxis[yAxisIndex - yInc]}`);

                    if (bottomBlock.childElementCount > 0) {
                        if (bottomBlock.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                            possibleMoves.push(bottomBlock)
                        }

                        bottomCollision = true
                    } else {
                        possibleMoves.push(bottomBlock)
                    }
                }
            } else {
                bottomCollision = true
            }

            yInc++
        }

        if (!leftCollision || !rightCollision) {
            if (xAxisIndex + xInc < xAxis.length) {
                if (!rightCollision) {
                    let rightBlock = document.getElementById(`${xAxis[xAxisIndex + xInc]}-${yAxisPos}`);
                    if (rightBlock.childElementCount > 0) {

                        if (rightBlock.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                            possibleMoves.push(rightBlock);
                        }

                        rightCollision = true;
                    } else {
                        possibleMoves.push(rightBlock)
                    }
                }
            } else {
                rightCollision = true
            }

            if (xAxisIndex - xInc > -1) {
                if (!leftCollision) {
                    let leftBlock = document.getElementById(`${xAxis[xAxisIndex - xInc]}-${yAxisPos}`);

                    if (leftBlock.childElementCount > 0) {
                        if (leftBlock.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                            possibleMoves.push(leftBlock);
                        }

                        leftCollision = true;
                    } else {
                        possibleMoves.push(leftBlock)
                    }
                }

            } else {
                leftCollision = true
            }

            xInc++;
        }
    }

    return possibleMoves
}

const getBishopPossibleMoves = (xAxisIndex, yAxisIndex, afogadoBool = false) => {
    let possibleMoves = []

    let topLeftCollision = false;
    let topRightCollision = false;
    let bottomLeftCollision = false;
    let bottomRightCollision = false;

    let yInc = 1;
    let xInc = 1;

    let corDoInimigo;

    if (afogadoBool) {
        corDoInimigo = enemy === "light" ? "black" : "light";
    }

    while (!topLeftCollision || !topRightCollision || !bottomLeftCollision || !bottomRightCollision) {
        if (!topLeftCollision || !topRightCollision) {
            if (yAxisIndex + yInc < yAxis.length && xAxisIndex - xInc > -1) {
                if (!topLeftCollision) {
                    let topLeftBlock = document.getElementById(`${xAxis[xAxisIndex - xInc]}-${yAxis[yAxisIndex + yInc]}`);

                    if (topLeftBlock.childElementCount > 0) {
                        if (topLeftBlock.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                            possibleMoves.push(topLeftBlock)
                        }

                        topLeftCollision = true
                    } else {
                        possibleMoves.push(topLeftBlock)
                    }
                }
            } else {
                topLeftCollision = true
            }

            if (yAxisIndex + yInc < yAxis.length && xAxisIndex + xInc < xAxis.length) {
                if (!topRightCollision) {
                    let topRightBlock = document.getElementById(`${xAxis[xAxisIndex + xInc]}-${yAxis[yAxisIndex + yInc]}`);

                    if (topRightBlock.childElementCount > 0) {
                        if (topRightBlock.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                            possibleMoves.push(topRightBlock)
                        }

                        topRightCollision = true
                    } else {
                        possibleMoves.push(topRightBlock)
                    }
                }
            } else {
                topRightCollision = true
            }
        }

        if (!bottomLeftCollision || !bottomRightCollision) {
            if (yAxisIndex - yInc > -1 && xAxisIndex - xInc > -1) {
                if (!bottomLeftCollision) {
                    let bottomLeftBlock = document.getElementById(`${xAxis[xAxisIndex - xInc]}-${yAxis[yAxisIndex - yInc]}`);

                    if (bottomLeftBlock.childElementCount > 0) {
                        if (bottomLeftBlock.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                            possibleMoves.push(bottomLeftBlock)
                        }

                        bottomLeftCollision = true
                    } else {
                        possibleMoves.push(bottomLeftBlock)
                    }
                }
            } else {
                bottomLeftCollision = true
            }

            if (yAxisIndex - yInc > -1 && xAxisIndex + xInc < xAxis.length) {
                if (!bottomRightCollision) {
                    let bottomRightBlock = document.getElementById(`${xAxis[xAxisIndex + xInc]}-${yAxis[yAxisIndex - yInc]}`);

                    if (bottomRightBlock.childElementCount > 0) {
                        if (bottomRightBlock.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                            possibleMoves.push(bottomRightBlock)
                        }

                        bottomRightCollision = true
                    } else {
                        possibleMoves.push(bottomRightBlock)
                    }
                }
            } else {
                bottomRightCollision = true
            }
        }

        xInc++;
        yInc++;
    }

    return possibleMoves
}

const getKnightPossibleMoves = (xAxisIndex, yAxisIndex, afogadoBool = false) => {
    let possibleMoves = []

    let corDoInimigo;

    if (afogadoBool) {
        corDoInimigo = enemy === "light" ? "black" : "light";
    }
    // LEFT-UP
    if (xAxisIndex - 2 > -1 && yAxisIndex + 1 < yAxis.length) {
        let block = document.getElementById(`${xAxis[xAxisIndex - 2]}-${yAxis[yAxisIndex + 1]}`);

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // LEFT-DOWN
    if (xAxisIndex - 2 > -1 && yAxisIndex - 1 > -1) {
        let block = document.getElementById(`${xAxis[xAxisIndex - 2]}-${yAxis[yAxisIndex - 1]}`);

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // RIGHT-UP
    if (xAxisIndex + 2 < xAxis.length && yAxisIndex + 1 < yAxis.length) {
        let block = document.getElementById(`${xAxis[xAxisIndex + 2]}-${yAxis[yAxisIndex + 1]}`);

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // RIGHT-DOWN
    if (xAxisIndex + 2 < xAxis.length && yAxisIndex - 1 > -1) {
        let block = document.getElementById(`${xAxis[xAxisIndex + 2]}-${yAxis[yAxisIndex - 1]}`);

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // UP-LEFT
    if (xAxisIndex - 1 > -1 && yAxisIndex + 2 < yAxis.length) {
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndex + 2]}`);

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // UP-RIGHT
    if (xAxisIndex + 1 < xAxis.length && yAxisIndex + 2 < yAxis.length) {
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndex + 2]}`);

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // DOWN-LEFT
    if (xAxisIndex - 1 > -1 && yAxisIndex - 2 > -1) {
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndex - 2]}`);

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // DOWN-RIGHT
    if (xAxisIndex + 1 < xAxis.length && yAxisIndex - 2 > -1) {
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndex - 2]}`);

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    return possibleMoves;
}

const getKingPossibleMoves = (xAxisPos, yAxisPos, xAxisIndex, yAxisIndex, afogadoBool = false) => {
    let possibleMoves = []

    let corDoInimigo;

    if (afogadoBool) {
        corDoInimigo = enemy === "light" ? "black" : "light";
    }
    // TOP
    if (yAxisIndex + 1 < yAxis.length) {
        let block = document.getElementById(`${xAxisPos}-${yAxis[yAxisIndex + 1]}`)

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // BOTTOM
    if (yAxisIndex - 1 > -1) {
        let block = document.getElementById(`${xAxisPos}-${yAxis[yAxisIndex - 1]}`)

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // LEFT
    if (xAxisIndex - 1 > -1) {
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxisPos}`)

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // RIGHT
    if (xAxisIndex + 1 < xAxis.length) {
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxisPos}`)

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // TOP-LEFT
    if (xAxisIndex - 1 > -1 && yAxisIndex + 1 < yAxis.length) {
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndex + 1]}`)

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // TOP-RIGHT
    if (xAxisIndex + 1 < xAxis.length && yAxisIndex + 1 < yAxis.length) {
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndex + 1]}`)

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // BOTTOM-LEFT
    if (xAxisIndex - 1 > -1 && yAxisIndex - 1 > -1) {
        let block = document.getElementById(`${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndex - 1]}`)

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    // BOTTOM-RIGHT
    if (xAxisIndex + 1 < xAxis.length && yAxisIndex - 1 > -1) {
        let block = document.getElementById(`${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndex - 1]}`)

        if (block.childElementCount > 0) {
            if (block.children[0].classList.contains(afogadoBool ? corDoInimigo : enemy)) {
                possibleMoves.push(block)
            }
        } else {
            possibleMoves.push(block)
        }
    }

    let kingPositionNow = xAxisPos + "-" + yAxisPos;

    if (!isCheck(kingPositionNow)) {
        if (!isLeftCastlingPerformedWhite && !isRightCastlingPerformedWhite) {
            if (torreEsquerdaBrancaNuncaMovido && reiBrancoNuncaMovido) {
                if (xAxisPos + "-" + yAxisPos === "E-1") {
                    let block = document.getElementById(`${xAxisPos}-${yAxisPos}`);
                    if (block.children[0].classList.contains("light")) {
                        let pieceOne = document.getElementById("A-1");
                        let squareOne = document.getElementById("B-1").children.length > 0;
                        let squareTwo = document.getElementById("C-1").children.length > 0;
                        let squareThree = document.getElementById("D-1").children.length > 0;
                        let squareTwoBox = document.getElementById("C-1");

                        if (
                            pieceOne.children.length > 0 &&
                            pieceOne.children[0].dataset.piece === "rook"
                            && !squareOne && !squareTwo
                            && !squareThree
                        ) {
                            possibleMoves.push(squareTwoBox);
                        }
                    }
                }
            }

            if (torreDireitaBrancaNuncaMovido && reiBrancoNuncaMovido) {
                if (xAxisPos + "-" + yAxisPos === "E-1") {
                    let block = document.getElementById(`${xAxisPos}-${yAxisPos}`);
                    if (block.children[0].classList.contains("light")) {
                        let pieceOne = document.getElementById("H-1");
                        let squareOne = document.getElementById("G-1").children.length > 0;
                        let squareTwo = document.getElementById("F-1").children.length > 0;
                        let squareOneBox = document.getElementById("G-1");

                        if (
                            pieceOne.children.length > 0 &&
                            pieceOne.children[0].dataset.piece === "rook"
                            && !squareOne && !squareTwo
                        ) {
                            possibleMoves.push(squareOneBox);
                        }
                    }
                }
            }
        }

        if (!isLeftCastlingPerformedBlack && !isRightCastlingPerformedBlack) {
            if (torreEsquerdaPretaNuncaMovido && reiPretoNuncaMovido) {
                if (xAxisPos + "-" + yAxisPos === "E-8") {
                    let block = document.getElementById(`${xAxisPos}-${yAxisPos}`);
                    if (block.children[0].classList.contains("black")) {
                        let pieceOne = document.getElementById("A-8");
                        let squareOne = document.getElementById("B-8").children.length > 0;
                        let squareTwo = document.getElementById("C-8").children.length > 0;
                        let squareThree = document.getElementById("D-8").children.length > 0;
                        let squareTwoBox = document.getElementById("C-8");

                        if (
                            pieceOne.children.length > 0 &&
                            pieceOne.children[0].dataset.piece === "rook"
                            && !squareOne && !squareTwo
                            && !squareThree
                        ) {
                            possibleMoves.push(squareTwoBox);
                        }
                    }
                }
            }

            if (torreDireitaPretaNuncaMovido && reiPretoNuncaMovido) {
                if (xAxisPos + "-" + yAxisPos === "E-8") {
                    let block = document.getElementById(`${xAxisPos}-${yAxisPos}`);
                    if (block.children[0].classList.contains("black")) {
                        let pieceOne = document.getElementById("H-8");
                        let squareOne = document.getElementById("G-8").children.length > 0;
                        let squareTwo = document.getElementById("F-8").children.length > 0;
                        let squareOneBox = document.getElementById("G-8");

                        if (
                            pieceOne.children.length > 0 &&
                            pieceOne.children[0].dataset.piece === "rook"
                            && !squareOne && !squareTwo
                        ) {
                            possibleMoves.push(squareOneBox);
                        }
                    }
                }
            }
        }
    }

    let kingBox = document.getElementById(kingPositionNow);
    let kingPiece = kingBox?.querySelector(".piece");

    possibleMoves = possibleMoves.filter(possibleMove => {
        // Move o rei temporariamente
        possibleMove.appendChild(kingPiece);

        const emXeque = isCheck(possibleMove.id);

        // Volta o rei para a posição original
        kingBox.appendChild(kingPiece);

        return !emXeque;
    });

    return possibleMoves

}

const switchPlayerAndEnemy = () => {
    if (player === 'light') {
        player = 'black'
        enemy = 'light'
    } else {
        player = 'light'
        enemy = 'black'
    }
}

const isCheck = (kingPosition, myKing = true) => {
    let splittedPos = kingPosition.split("-")

    let xAxisPos = splittedPos[0];
    let yAxisPos = +splittedPos[1];

    let xAxisIndex = xAxis.findIndex(x => x === xAxisPos)
    let yAxisIndex = yAxis.findIndex(y => y === yAxisPos)
    
    if (!myKing) {
        switchPlayerAndEnemy()
    }

    let possibleMoves = Array.prototype.concat(
        getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex),
        getBishopPossibleMoves(xAxisIndex, yAxisIndex),
        getKnightPossibleMoves(xAxisIndex, yAxisIndex)
    )

    for (let i = 0; i < possibleMoves.length; i++) {
        let box = possibleMoves[i];

        if (box.children.length > 0) {
            let piece = box.children[0]

            let pieceXPos = box.id.split("-")[0]
            let pieceYPos = +box.id.split('-')[1]

            let pieceXAxisIndex = xAxis.findIndex(x => x === pieceXPos)
            let pieceYAxisIndex = yAxis.findIndex(y => y === pieceYPos)

            let xyBlockDiffIsTheSame = Math.abs(xAxisIndex - pieceXAxisIndex) === Math.abs(yAxisIndex - pieceYAxisIndex);

            switch (piece.dataset.piece) {
                case 'pawn':
                    if (enemy === 'black') {
                        if (
                            (pieceXAxisIndex === xAxisIndex - 1 && pieceYAxisIndex === yAxisIndex + 1) ||
                            (pieceXAxisIndex === xAxisIndex + 1 && pieceYAxisIndex === yAxisIndex + 1)
                        ) {
                            if (!myKing) {
                                switchPlayerAndEnemy()
                            }

                            return true;
                        }
                    } else {
                        if (
                            (pieceXAxisIndex === xAxisIndex - 1 && pieceYAxisIndex === yAxisIndex - 1) ||
                            (pieceXAxisIndex === xAxisIndex + 1 && pieceYAxisIndex === yAxisIndex - 1)
                        ) {
                            if (!myKing) {
                                switchPlayerAndEnemy()
                            }

                            return true;
                        }
                    }
                    break;
                case 'knight':
                    if (
                        (pieceXAxisIndex === xAxisIndex - 1 && pieceYAxisIndex === yAxisIndex + 2) ||
                        (pieceXAxisIndex === xAxisIndex - 1 && pieceYAxisIndex === yAxisIndex - 2) ||
                        (pieceXAxisIndex === xAxisIndex + 1 && pieceYAxisIndex === yAxisIndex + 2) ||
                        (pieceXAxisIndex === xAxisIndex + 1 && pieceYAxisIndex === yAxisIndex - 2) ||
                        (pieceXAxisIndex === xAxisIndex - 2 && pieceYAxisIndex === yAxisIndex + 1) ||
                        (pieceXAxisIndex === xAxisIndex - 2 && pieceYAxisIndex === yAxisIndex - 1) ||
                        (pieceXAxisIndex === xAxisIndex + 2 && pieceYAxisIndex === yAxisIndex + 1) ||
                        (pieceXAxisIndex === xAxisIndex + 2 && pieceYAxisIndex === yAxisIndex - 1)
                    ) {
                        if (!myKing) {
                            switchPlayerAndEnemy()
                        }

                        return true;
                    }
                    break
                case 'rook':
                    if (pieceXPos === xAxisPos || pieceYPos === yAxisPos) {
                        if (!myKing) {
                            switchPlayerAndEnemy()
                        }

                        return true;
                    }
                    break;
                case 'bishop':
                    if (xyBlockDiffIsTheSame) {
                        if (!myKing) {
                            switchPlayerAndEnemy()
                        }

                        return true;
                    }
                    break;
                case 'queen':
                    if ((pieceXPos === xAxisPos || pieceYPos === yAxisPos)
                        || xyBlockDiffIsTheSame) {
                        if (!myKing) {
                            switchPlayerAndEnemy()
                        }

                        return true;
                    }
                    break;
                case 'king':
                    if (Math.abs(pieceXAxisIndex - xAxisIndex) <= 1 &&
                        Math.abs(pieceYAxisIndex - yAxisIndex) <= 1) {

                        if (!myKing) {
                            switchPlayerAndEnemy();
                        }

                        return true;
                    }

                    break;
                default:
                    break;
            }
        }
    }

    if (!myKing) {
        switchPlayerAndEnemy()
    }

    return false;
}

const isCheckmate = (enemyKingPosition) => {
    switchPlayerAndEnemy()

    let splittedPos = enemyKingPosition.split("-")

    let xAxisPos = splittedPos[0];
    let yAxisPos = +splittedPos[1];

    let xAxisIndex = xAxis.findIndex(x => x === xAxisPos)
    let yAxisIndex = yAxis.findIndex(y => y === yAxisPos)

    let kingPossibleMoves = getKingPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex);

    let myPieces = document.querySelectorAll(`.piece.${player}`);

    for (let i = 0; i < myPieces.length; i++) {
        let myPiece = myPieces[i]

        if (myPiece.dataset.piece === 'king') continue;

        let myPieceXPos = myPiece.parentNode.id.split("-")[0]
        let myPieceYPos = +myPiece.parentNode.id.split('-')[1]

        let myPieceXAxisIndex = xAxis.findIndex(x => x === myPieceXPos)
        let myPieceYAxisIndex = yAxis.findIndex(y => y === myPieceYPos)

        let piecePossibleMoves;

        switch (myPiece.dataset.piece) {
            case "pawn":
                piecePossibleMoves = getPawnPossibleMoves(myPieceXPos, myPieceYPos, myPieceXAxisIndex, myPieceYAxisIndex);
                break;
            case 'rook':
                piecePossibleMoves = getRookPossibleMoves(myPieceXPos, myPieceYPos, myPieceXAxisIndex, myPieceYAxisIndex);
                break;
            case 'bishop':
                piecePossibleMoves = getBishopPossibleMoves(myPieceXAxisIndex, myPieceYAxisIndex)
                break;
            case 'knight':
                piecePossibleMoves = getKnightPossibleMoves(myPieceXAxisIndex, myPieceYAxisIndex)
                break;
            case 'queen':
                piecePossibleMoves = Array.prototype.concat(
                    getRookPossibleMoves(myPieceXPos, myPieceYPos, myPieceXAxisIndex, myPieceYAxisIndex),
                    getBishopPossibleMoves(myPieceXAxisIndex, myPieceYAxisIndex)
                )
                break;
            default:
                break;
        }

        let currentBox = myPiece.parentNode
        currentBox.innerHTML = ""

        for (let j = 0; j < piecePossibleMoves.length; j++) {
            let possibleMove = piecePossibleMoves[j];

            let boxToMove = document.getElementById(possibleMove.id);

            let removedPiece = null;

            if (boxToMove.children.length > 0) {
                removedPiece = boxToMove.children[0]
            }

            boxToMove.innerHTML = ""

            boxToMove.appendChild(myPiece);

            let check = isCheck(enemyKingPosition);

            boxToMove.innerHTML = ""

            if (removedPiece) {
                boxToMove.appendChild(removedPiece)
            }

            if (!check) {
                currentBox.appendChild(myPiece);
                switchPlayerAndEnemy()
                return false
            }
        }

        currentBox.appendChild(myPiece)
    }

    switchPlayerAndEnemy()

    if (kingPossibleMoves.length === 0) {
        return true
    }

    return false
}

const getKingPosition = pieceColor => {
    let pieces = document.querySelectorAll(`.piece.${pieceColor}`);

    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].dataset.piece === 'king') {
            return pieces[i].parentNode.id
        }
    }
}

const isPawnAtTheEndOfTheBoard = (currentPlayer, pawnPosition) => {
    let isAtTheEndOfBoard = false;

    if (currentPlayer === 'light') {
        let positionIndex = lightPiecesEndingPosition.findIndex(pos => pos === pawnPosition);

        if (positionIndex !== -1) {
            isAtTheEndOfBoard = true;
        }
    } else {
        let positionIndex = blackPiecesEndingPosition.findIndex(pos => pos === pawnPosition);

        if (positionIndex !== -1) {
            isAtTheEndOfBoard = true;
        }
    }

    return isAtTheEndOfBoard;
}