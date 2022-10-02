require("dotenv").config()
require("express-async-errors")

// extra security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

// // Swagger
// const swaggerUI = require("swagger-ui-express")
// const YAML = require("yamljs")
// const swaggerDocument = YAML.load("./swagger.yaml")

const express = require("express")
const app = express()

//connect DB
const connectDB = require("./db/connect")

//routes
const authRoute = require("./routes/auth")
const jobsRoute = require("./routes/jobs")

// error handler
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")
const authenticatedMiddlewear = require("./middleware/authentication")

app.use(express.json())

// extra packages
app.set("trust proxy", 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/jobs", authenticatedMiddlewear, jobsRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
