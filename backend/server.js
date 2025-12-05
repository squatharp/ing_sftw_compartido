const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv").config()
const connectDB = require("./config/db")
const {errorHandler} = require("./middleware/errorMiddleware")
const cors = require("cors")

const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.use(cors())

app.use("/api/auth", require("./routes/authRoutes") )
app.use("/api/cuentas", require("./routes/cuentaRoutes") )
app.use("/api/restaurantero", require("./routes/restauranteroRoutes") );
app.use("/api/auth", require("./routes/authRoutes") );

app.use(errorHandler)

app.listen(port, ()=> console.log (`Servidor Iniciado en el puerto: ${port}`))


