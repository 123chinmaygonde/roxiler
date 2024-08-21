const express = require("express")
const bodyParser = require("body-parser")

const app =express()

app.use(bodyParser.json())
const PORT = process.env.PORT|| 6000

app.listen(PORT,()=>{
    console.log(`server is ruuning on ${PORT}`)
})