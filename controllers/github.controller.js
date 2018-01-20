const mongoose = require("mongoose");
const { Client } = require("node-rest-client");

// create instance client
const client = new Client({});

exports.getAllUsers = (req, res) => {
  res.json("all");
};
