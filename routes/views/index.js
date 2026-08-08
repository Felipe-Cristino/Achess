const {Router} = require("express")
const { getRegisterPage, getLoginPage, getLobbyPage, getGamesPage,
    getGames2Page, getRoomPage1, getRoomPage2, getRoomPage3, getRoomPage4,
     getStatsPage, getPlayedGamesPage, getProfilePage 
} = require("../../controllers/views")

const router = Router()

router.get("/register", getRegisterPage)

router.get("/login", getLoginPage)

router.get("/", getLobbyPage)

router.get("/games", getGamesPage)

router.get("/games2", getGames2Page)

router.get("/room1", getRoomPage1)

router.get("/room2", getRoomPage2)

router.get("/room3", getRoomPage3)

router.get("/room4", getRoomPage4)

router.get("/my-stats", getStatsPage)

router.get("/my-stats/played-games/:gameId", getPlayedGamesPage)

router.get("/profile", getProfilePage)

module.exports = router;