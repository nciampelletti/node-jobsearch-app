const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")

/*
- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token
- Send Response with Token
*/
const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

/*
- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token
*/
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }

  const user = await User.findOne({ email: email })

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials")
  }

  const isPasswordCorrect = await user.comparePasswords(password)

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials")
  }

  const token = user.createJWT()

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }
