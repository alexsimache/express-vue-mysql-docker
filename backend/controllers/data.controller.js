const Data = require("../models/data.model.js");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: "eu",
  useTLS: true,
});

exports.findAll = (req, res) => {
  const counter = req.query.counter;
  Data.getAll(counter, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the data.",
      });
    else if (data === undefined) {
      res.send({ id: 0, counter: 0 });
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Bad request! You have to send some payload!",
    });
  }
  Data.updateById(req.params.id, new Data(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found row with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating row with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
      pusher
        .trigger("counter-channel", "update-event", {
          updatedCounter: data?.counter,
        })
        .then(() => {});
    }
  });
};
