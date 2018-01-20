const mongoose = require("mongoose");
const cheerio = require("cheerio");
const { Client } = require("node-rest-client");

// create instance client
const client = new Client({});

exports.getAllUsers = (req, res) => {
  getHtmlPageGitHub(req, res);
};

const getHtmlPageGitHub = (language, technology) => {
  const url =
    "https://github.com/search?p=0&q=language%3Ajavascript+location%3Arecife&type=Users&utf8=%E2%9C%93";

  const html = client.get(url, (data, response) => {
    GetQtdUserToTechnology(data.toString());
    getName(data.toString());
  });
};

const GetQtdUserToTechnology = html => {
  const $ = cheerio.load(html);
  const qtdUsers = $(
    ".d-flex.flex-justify-between.border-bottom.pb-3 > h3"
  ).text();
  return qtdUsers;
};

const getName = html => {
  const $ = cheerio.load(html);
  const name = $(".user-list").each((i, elem) => {
    //console.log(elem);
    console.log($(this));
  });
};
