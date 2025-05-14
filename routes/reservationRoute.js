var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Day = require("../models/day").model;
const Reservation = require("../models/reservation").model;

// Parameters:
// {
//   "date": String ("Dec 02 2019 06:00"),
//   "table": table id,
// 	"name": String,
// 	"phone": String,
// 	"email": String
// }

router.post("/", async (req, res) => {
  try {
    const { date, table: tableId, name, phone, email } = req.body;

    const day = await Day.findOne({ date });

    if (!day) {
      return res.status(404).send("Ziua nu a fost găsită");
    }

    const table = day.tables.find(t => t._id.toString() === tableId.toString());

    if (!table) {
      return res.status(404).send("Masa nu a fost găsită");
    }

    table.reservation = new Reservation({ name, phone, email });
    table.isAvailable = false;

    await day.save();

    return res.status(200).send("Rezervare adăugată cu succes");

  } catch (error) {
    console.error("Eroare la rezervare:", error);
    return res.status(500).send("Eroare internă server");
  }
});


module.exports = router;
