const mongoose = require("mongoose");
const cheerio = require("cheerio");
const { Client } = require("node-rest-client");
const { endpointGitHub } = require("../services/github");

// create instance client
const client = new Client();

exports.getDataGitHub = async (req, res) => {
  console.log(req);
  const result = [];
  const technology = req.params.technology;
  const location = req.params.location;
  const qtdUsers = await GetQtdUserToTechnology(req);
  for (let i = 1; i < 2; i++) {
    const dataList = await getHtmlPageGitHub(req, i);
    const obj = {
      name: dataList[0].nome,
      subTitle: dataList[0].titulo,
      city: dataList[0].city
    };
    result.push(obj);
  }
  return result;
};

const getHtmlPageGitHub = async (req, i) => {
  const url = `https://github.com/search?p=${i}&q=language%3A${
    req.params.technology
  }+location%3A${req.params.location}&type=Users&utf8=%E2%9C%93`;
  let args = {
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
    }
  };
  const dataStore = [];
  return new Promise((resolve, reject) => {
    client.get(url, args, (data, response) => {
      const names = getName(data.toString());
      const subTitle = getSubTitle(data.toString());
      const cities = getCity(data.toString());
      const emails = getEmail(data.toString());
      dataStore.push({
        nome: names,
        titulo: subTitle,
        city: cities,
        email: emails
      });
      resolve(dataStore);
    });
  });
};

const GetQtdUserToTechnology = req => {
  const url = endpointGitHub(req);
  const qtdUsers = [];
  return new Promise((resolve, reject) => {
    client.get(url, (data, response) => {
      const html = data.toString();
      const $ = cheerio.load(html);
      const qtdUser = $(
        ".d-flex.flex-justify-between.border-bottom.pb-3 > h3"
      ).text();
      const userCount = qtdUser.replace("users", "").trim();
      qtdUsers.push(userCount);
      resolve(qtdUsers);
    });
  });
};

const getSubTitle = html => {
  const titles = [];
  const $ = cheerio.load(html);
  const title = $(".user-list > div > .d-flex > .user-list-info.ml-2  > p").map(
    (i, elem) => {
      titles.push(
        $(elem)
          .text()
          .trim()
      );
    }
  );
  return titles;
};

const getName = html => {
  const names = [];
  const $ = cheerio.load(html);
  const name = $(
    ".user-list > div > .d-flex > .user-list-info.ml-2 > span"
  ).map((i, elem) => {
    names.push($(elem).text());
  });
  return names;
};

const getEmail = html => {
  const emails = [];
  const $ = cheerio.load(html);

  const aux = $(
    "#user_search_results > div.user-list > div:nth-child(3) > div.d-flex > div > ul > li:nth-child(2) > a"
  ).text();
  console.log(aux);

  const email = $(
    ".user-list > div > .d-flex > .user-list-info.ml-2 > ul > li"
  ).map((i, elem) => {
    emails.push($(elem).text());
  });
  return emails;
};

const getCity = html => {
  const cities = [];
  const $ = cheerio.load(html);
  const city = $(
    ".user-list > div > .d-flex > .user-list-info.ml-2 > ul > li"
  ).map((i, elem) => {
    cities.push(
      $(elem)
        .text()
        .trim()
    );
  });
  return cities;
};
