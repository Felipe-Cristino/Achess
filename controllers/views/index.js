exports.getRegisterPage = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/")
    }

    res.render("auth/register", { authorized: false })
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

exports.getRoomPage1 = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }
    res.render("room1", { authorized: true });
}

exports.getRoomPage2 = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }
    res.render("room2", { authorized: true });
}

exports.getRoomPage3 = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }
    res.render("room3", { authorized: true });
}

exports.getRoomPage4 = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }
    res.render("room4", { authorized: true });
}

exports.getStatsPage = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/login")
    }

    res.render("stats", { authorized: true });
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