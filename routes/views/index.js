const {Router} = require("express")
const { getRegisterPage, getLoginPage, getLobbyPage, getGamesPage, getRoomPage1, getRoomPage2, getStatsPage, getPlayedGamesPage, getProfilePage } = require("../../controllers/views")

const router = Router()

router.get("/register", getRegisterPage)

router.get("/login", getLoginPage)

router.get("/", getLobbyPage)

router.get("/games", getGamesPage)

router.get("/room1", getRoomPage1)

router.get("/room2", getRoomPage2)

router.get("/my-stats", getStatsPage)

router.get("/my-stats/played-games/:gameId", getPlayedGamesPage)

router.get("/profile", getProfilePage)

module.exports = router;