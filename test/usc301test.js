const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")

chai.should()
chai.use(chaiHttp)

describe("UC301 Maaltijd Toevoegen", () => {


  it("TC 301-1-1 Niet ingelogd", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        // emailadress: "email",
        password: "wachtwoord",
      })
      .end((err, res) => {

        console.log(res.body)

        res.should.have.status(400)
        res.body.should.be.a("object")
        res.body.should.have.property("status").eq(400)
        res.body.should.have.property("message").eq("Email and password are required")
        res.body.should.have.property("data").that.is.empty // niet ingelogd

        done()
      })
  })

  it("TC 301-1-1 Maaltijd toegevoegd", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        emailadress: "email",
        //password: "wachtwoord",
      })
      .end((err, res) => {

        console.log(res.body)

        res.should.have.status(400)
        res.body.should.be.a("object")
        res.body.should.have.property("status").eq(400)
        res.body.should.have.property("message").eq("Email and password are required")
        res.body.should.have.property("data").that.is.empty // niet ingelogd

        done()
      })
  })

  it("TC 301-2 Maaltijd bestaat al", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        emailAdress: "a.doesnotexist@server.com", // does not exist
        password: "notsecret"
      })
      .end((err, res) => {

        console.log(res.body)

        res.should.have.status(404)
        res.body.should.be.a("object")
        res.body.should.have.property("status").eq(404)
        res.body.should.have.property("message").eq("User not found")
        res.body.should.have.property("data").that.is.empty // niet ingelogd

        done()
      })
  })

  it("TC 301-2 Incorrect wachtwoord", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        emailAdress: "a@server.nl",
        password: "scret"
      })
      .end((err, res) => {

        console.log(res.body)

        res.should.have.status(404)
        res.body.should.be.a("object")
        res.body.should.have.property("status").eq(404)
        res.body.should.have.property("message").eq("User not found")
        res.body.should.have.property("data").that.is.empty // niet ingelogd

        done()
      })
  })
})