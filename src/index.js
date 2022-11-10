const express = require("express")
const bodyParser = express.json()
const route = require("./route/route")
const mongoose = require("mongoose")
const app = express()

app.use(bodyParser)

mongoose.connect("mongodb+srv://hsupare:2kZE1zdHBT5kzVVm@cluster0.5drhi.mongodb.net/himanshu-DB", { useNewUrlParser: true }
)
    .then(() => { console.log("MongoDB is Connected") })
    .catch((err) => { console.log(err) })

app.use("/", route)

app.listen(3000, function () {
    console.log("Express app running on port " + 3000);
});
