const request = require("supertest");
const app = require("../app");
const items = require("../fakeDb");

let list = { name: "flower", price: 2 };

beforeEach(function () {
    items.push(list);
});

afterEach(function () {
    items.length = 0;
});

describe("GET /items", () => {
    it("retrieves all items via GET method", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([list]);
        expect(res.body).toHaveLength(1);
    });
});

describe("POST /items", () => {
    it("creates and adds an item to current items list via POST method", async () => {
        const newItem = { name: "tree", price: 10 };
        const res = await request(app).post("/items").send(newItem);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ added: newItem });
    });
    it("responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            message: "Must enter name and price",
            status: 400,
        });
    });
    it("responds with 400 if price is missing", async () => {
        const res = await request(app).post("/items").send({ name: "noprice" });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            message: "Must enter name and price",
            status: 400,
        });
    });
});

describe("GET /items/:name", () => {
    it("retrieves a specific item by name via GET method", async () => {
        const res = await request(app).get(`/items/${list.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(list);
    });
    it("responds with 404 for invalid item", async () => {
        const res = await request(app).delete(`/items/nothere`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Item not found", status: 404 });
    });
});

describe("/PATCH /items/:name", () => {
    it("updates a specific item's name with PATCH method", async () => {
        const res = await request(app)
            .patch(`/items/${list.name}`)
            .send({
                name: "book",
                price: 3
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "book", price: 3 } });
    });
    it("responds with 404 for an invalid name", async () => {
        const res = await request(app)
            .patch(`/items/nothere`)
            .send({ name: "nothere" });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "No item found", status: 404 });
    });
});

describe("/DELETE /items/:name", () => {
    it("deletes a specific item", async () => {
        const res = await request(app).delete(`/items/${list.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Item Deleted" });
    });
    it("responds with 404 for deleting an invalid item", async () => {
        const res = await request(app).delete(`/items/nothere`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Item not found", status: 404 });
    });
});