const mongoose = require("mongoose");
const User = mongoose.model("User");
const { Counters } = require("../models/Url");

exports.curretStats = async (req, res) => {
  let urlCount = await totalUrls();
  let doc = await totalHits();
  const total = doc.reduce((prevVal, elem) => prevVal + elem.hits, 0);
  const arraySort = doc.sort((l, r) => r.hits - l.hits).slice(0, 10);

  const topUrls = arraySort.map(url => {
    return {
      id: url._id,
      created_at: url.created_at,
      long_url: url.long_url,
      hits: url.hits,
      shortUrl: url.shortUrl
    };
  });

  const statsGlobal = {
    hits: total,
    urlCount: urlCount,
    topUrls: [topUrls]
  };
  res.json(statsGlobal);
};

exports.curretUserStats = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById({ _id: userId });

  if (user != null) {
    const userDoc = await totalUserHits(userId);
    const totalUrl = userDoc.length;
    const total = userDoc.reduce((prevVal, elem) => prevVal + elem.hits, 0);
    const arraySort = userDoc.sort((l, r) => r.hits - l.hits).slice(0, 10);

    const topUrls = arraySort.map(url => {
      return {
        id: url._id,
        created_at: url.created_at,
        long_url: url.long_url,
        hits: url.hits,
        shortUrl: url.shortUrl
      };
    });

    const statsUser = {
      hits: total,
      urlCount: totalUrl,
      topUrls: [topUrls]
    };

    res.json(statsUser);
  } else {
    res.sendStatus(404).end("Not Found!");
  }
};

exports.curretStatsUrl = async (req, res) => {
  const urlID = req.params.id;
  const statsUrl = await Url.findById({ _id: urlID });

  return res.json({
    id: statsUrl._id,
    hits: statsUrl.hits,
    url: statsUrl.long_url,
    shortUrl: statsUrl.shortUrl
  });
};

async function totalHits() {
  let doc = await Url.find({});
  return doc;
}

async function totalUrls() {
  let doc = await Counters.findOne();
  return doc.seq;
}

async function totalUserHits(userId) {
  let doc = await Url.find({ user_id: userId });
  return doc;
}
