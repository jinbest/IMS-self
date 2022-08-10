const express = require("express")
const app = express()
const path = require("path")
const port_number = process.env.PORT || 5000

// app.set("views", path.join(__dirname, "build"))
// app.set("view engine", "html")

app.use(express.static(path.join(__dirname, ".", "build")))
app.use(express.static("public"))

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, ".", "build", "index.html"))
})

app.listen(port_number, () => console.log(`Client is running on port ${port_number}!`))
