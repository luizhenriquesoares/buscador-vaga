const mongoose = require("mongoose");
const { expect } = require("chai");
const sinon = require("sinon");
require("sinon-mongoose");

const User = require("../models/User");
const { Url } = require("../models/Url");

describe("User Model", () => {
  it("should create a new user", done => {
    const UserMock = sinon.mock(
      new User({ email: "test@gmail.com", password: "root", username: "test" })
    );
    const user = UserMock.object;

    UserMock.expects("save").yields(null);

    user.save(function(err, result) {
      UserMock.verify();
      UserMock.restore();
      expect(err).to.be.null;
      done();
    });
  });
});

it("should find user by email", done => {
  const userMock = sinon.mock(User);
  const expectedUser = {
    _id: "5700a128bd97c1341d8fb365",
    email: "test@gmail.com"
  };

  userMock
    .expects("findOne")
    .withArgs({ email: "test@gmail.com" })
    .yields(null, expectedUser);

  User.findOne({ email: "test@gmail.com" }, (err, result) => {
    userMock.verify();
    userMock.restore();
    expect(result.email).to.equal("test@gmail.com");
    done();
  });
});

it("should remove user by email", done => {
  const userMock = sinon.mock(User);
  const expectedResult = {
    nRemoved: 1
  };

  userMock
    .expects("remove")
    .withArgs({ email: "test@gmail.com" })
    .yields(null, expectedResult);

  User.remove({ email: "test@gmail.com" }, (err, result) => {
    userMock.verify();
    userMock.restore();
    expect(err).to.be.null;
    expect(result.nRemoved).to.equal(1);
    done();
  });
});

describe("URL Model", () => {
  it("should create a new url", done => {
    const UrlMock = sinon.mock(new Url({ long_url: "www.stackoverflow.com" }));
    const url = UrlMock.object;

    UrlMock.expects("save").yields(null);

    url.save(function(err, result) {
      UrlMock.verify();
      UrlMock.restore();
      expect(err).to.be.null;
      done();
    });
  });
});

it("should remove url by id", done => {
  const UrlMock = sinon.mock(Url);
  const expectedResult = {
    nRemoved: 1
  };

  UrlMock.expects("remove")
    .withArgs({ _id: "34" })
    .yields(null, expectedResult);

  Url.remove({ _id: "34" }, (err, result) => {
    UrlMock.verify();
    UrlMock.restore();
    expect(err).to.be.null;
    expect(result.nRemoved).to.equal(1);
    done();
  });
});
