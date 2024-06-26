const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")
 
chai.should()
chai.use(chaiHttp)
 
describe("UC101 Inloggen", () => {
 
 
  it("TC 101-1-1 geen e-mail meegegeven", (done) => {
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
 
  it("TC 101-2 gebruiker bestaat niet", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        emailAdress: "j.doesnotexist@server.com", // does not exist
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
})