const express = require('express');
const app = express();
const ExpressError = require("./expressError");
const itemsRoutes = require("./routes/items");


app.get('/', (Req,res) => {
    res.send("Shooping list, chose the right route");
})

app.use(express.json())
app.use('/items', itemsRoutes)

app.use((req, res,next) => {
    return new ExpressError("Not Found", 404);
});

app.use ((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        status: err.status,
        message: err.message
    });
});


module.exports = app;