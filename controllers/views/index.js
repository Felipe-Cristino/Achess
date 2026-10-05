const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

exports.getRegisterPage = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/")
    }

    res.render("auth/register", { authorized: false })
}

exports.getVerifyEmailPage = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/")
    }

    res.render("auth/verifyEmail", { authorized: false })
}

exports.getLoginPage = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/")
    }

    res.render("auth/login", { authorized: false })
}

exports.getLobbyPage = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }

    res.render("lobby", { authorized: true });
}

exports.getGamesPage = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }

    res.render("games", { authorized: true });
}

exports.getGames2Page = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }

    res.render("games2", { authorized: true });
}

exports.getRoomPage1 = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/login");
        }

        // Decodifica e verifica o JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Pega o ID que foi colocado no JWT
        const userId = decoded.id;

        const db = mysql.createPool({
            host: "localhost",
            user: "felipebc",
            password: "abfelipe12",
            database: "achess"
        });

        const [result] = await db.query(
            "SELECT board FROM user_config WHERE user_id = ?",
            [userId]
        );

        const playerOneBoard = result[0]?.board;

        res.render("room1", {
            playerOneBoard, authorized: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar configuração");
    }
};

exports.getRoomPage2 = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/login");
        }

        // Decodifica e verifica o JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Pega o ID que foi colocado no JWT
        const userId = decoded.id;

        const db = mysql.createPool({
            host: "localhost",
            user: "felipebc",
            password: "abfelipe12",
            database: "achess"
        });

        const [result] = await db.query(
            "SELECT board FROM user_config WHERE user_id = ?",
            [userId]
        );

        const playerTwoBoard = result[0]?.board;

        res.render("room2", {
            playerTwoBoard, authorized: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar configuração");
    }
}

exports.getRoomPage3 = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/login");
        }

        // Decodifica e verifica o JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Pega o ID que foi colocado no JWT
        const userId = decoded.id;

        const db = mysql.createPool({
            host: "localhost",
            user: "felipebc",
            password: "abfelipe12",
            database: "achess"
        });

        const [result] = await db.query(
            "SELECT board FROM user_config WHERE user_id = ?",
            [userId]
        );

        const playerOneBoard = result[0]?.board;

        res.render("room3", {
            playerOneBoard, authorized: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar configuração");
    }
}

exports.getRoomPage4 = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/login");
        }

        // Decodifica e verifica o JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Pega o ID que foi colocado no JWT
        const userId = decoded.id;

        const db = mysql.createPool({
            host: "localhost",
            user: "felipebc",
            password: "abfelipe12",
            database: "achess"
        });

        const [result] = await db.query(
            "SELECT board FROM user_config WHERE user_id = ?",
            [userId]
        );

        const playerTwoBoard = result[0]?.board;

        res.render("room4", {
            playerTwoBoard, authorized: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar configuração");
    }
}

exports.getStatsPage = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }

    res.render("stats", { authorized: true });
}

exports.getIconsPage = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }

    res.render("icons", { authorized: true });
}

exports.getConfigPage = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }

    res.render("config", { authorized: true });
}

exports.getPlayedGamesPage = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }

    res.render("stats/playedGames", { authorized: true });
}

exports.getProfilePage = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }

    res.render("profile", { authorized: true });
}