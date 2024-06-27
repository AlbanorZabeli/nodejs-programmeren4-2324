const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")

chai.should()
chai.use(chaiHttp)

describe("UC205 Profiel updaten", () => {


  it("TC 205-1-1 Niet ingelogd", (done) => {
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

  it("TC 205-1-1 Correct gegevens gewijzigd", (done) => {
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

})