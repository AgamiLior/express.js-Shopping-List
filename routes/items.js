const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const items = require("../fakeDb");

router.get("/", (req, res, next) => {
    try {
        res.json(items);
    } catch (e) {
        next(e);
    }
});

router.post("/", (req, res, next) => {
    try {
        if (!req.body.name || !req.body.price)
            throw new ExpressError("Must enter name and price", 400);

        let newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        res.status(200).json({ added: newItem });
    } catch (error) {
        next(error);
    }
});

router.get("/:name", (req, res, next) => {
    try {
        let foundItem = items.find((item) => item.name === req.params.name);
        if (!foundItem) {
            throw new ExpressError("No item found", 404);
        }
        res.status(200).json(foundItem);
    } catch (e) {
        next(e);
    }
});


router.patch("/:name", (req, res, next) => {
    try {
        let foundItem = items.find((item) => item.name === req.params.name);
        if (!foundItem) {
            throw new ExpressError("No item found", 404);
        }
        foundItem.name = req.body.name || foundItem.name;
        foundItem.price = req.body.price || foundItem.price;
        res.status(200).json({ updated: foundItem })
    } catch (e) {
        next(e);
    }
});

router.delete("/:name", (req, res, next) => {
    try {
        let foundItemIdx = items.findIndex((item) => item.name === req.params.name);
        console.log(foundItemIdx, req.params.name);
        if (foundItemIdx === -1) {
            throw new ExpressError("Item not found", 404);
        }
        items.splice(foundItemIdx, 1);
        res.status(200).json({
            message: 'Item Deleted'
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
