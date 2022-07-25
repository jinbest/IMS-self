const express = require("express")
const PORT = 5001

const app = express()

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.get("/about", (req, res) => {
  res.send("About route")
})

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`))
