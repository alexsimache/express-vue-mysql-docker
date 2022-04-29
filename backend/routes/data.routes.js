module.exports = (app) => {
  const data = require("../controllers/data.controller.js");

  const router = require("express").Router();

  router.get("/data", data.findAll);
  router.put("/:id", data.update);

  app.use("/api", router);
};
