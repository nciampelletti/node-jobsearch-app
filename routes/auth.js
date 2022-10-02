const { register, login, updateUser } = require("../controllers/auth")
const authenticateUser = require("../middleware/authentication")
const testUser = require("../middleware/testUser")

const express = require("express")
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/updateUser").patch(authenticateUser, testUser, updateUser)
//router.patch("/updateUser", authenticateUser, testUser, updateUser)

module.exports = router
