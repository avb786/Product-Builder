const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller - Login", function () {
  it("should throw an error accesing database", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };
    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });
    User.findOne.restore();
  });

  it("should send a response with a valid user status for an exsting user", function (done) {
    mongoose.connect(
      "mongodb+srv://dbavb786:Avb@90333@taskmanager-e8bqy.mongodb.net/test-product-maker?retryWrites=true&w=majority"
    ).then(result => {
        const user = new User({
            email: 'test@test.com',
            password: '12345678a',
            name: 'Tester',
            posts: [],
            _id: '5c0f66b979af55031b34728a'
        });
        return user.save()
    }).then(() => {
        const req = {
            userId: '5c0f66b979af55031b34728a'
        }
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStatus = data.status;

            }
        }
        AuthController.getUserStatus(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
            done();
        })
    })
  });
});
