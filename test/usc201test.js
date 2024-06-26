const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")
const { expect } = chai;
chai.should()
chai.use(chaiHttp)



describe("UC201 Registreren als nieuwe gebruiker", () => {

  it("TC 201-1 succesvol geregistreerd", (done) => {
    chai
      .request(server)
      .post("/api/user")
      .send({
        "firstName": "Mark",
        "lastName": "Van Dam",
        "emailAdress": "ae123sttest@server.nl",
        "password": "secret",
        "isActive": true,
        "street": "Lovensdijkstraat 61",
        "city": "Breda",
        "phoneNumber": "06 12312345",
        "roles": []
      })
      .end((err, res) => {
        if (err) {
            console.error('Error details:', err);
            console.error('Response body:', res.body);
            done(err);
        } else {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body)
                .to.have.property('message')
                .that.includes('User created with id');

            done();
        }
      })
  })

  it("TC 201-2 incorrect firstName", (done) => {
    chai
      .request(server)
      .post("/api/user")
      .send({
        emailadress: "email",
        //password: "wachtwoord",
      })
      .end((err, res) => {

        console.log(res.body)

        res.should.have.status(400)
        res.body.should.be.a("object")
        res.body.should.have.property("status").eq(400)
        res.body.should.have.property("message").eq("Missing or incorrect firstName field")


        done()
      })
  })

  it("TC 201-4 al bestaande e-mail", (done) => {
    chai
      .request(server)
      .post("/api/user")
      .send({
        "firstName": "Mark",
        "lastName": "Van Dam",
        "emailAdress": "a@server.nl",
        "password": "secret",
        "isActive": true,
        "street": "Lovensdijkstraat 61",
        "city": "Breda",
        "phoneNumber": "06 12312345",
        "roles": []
      })
      .end((err, res) => {

        console.log(res.body)

        res.should.have.status(500)
        res.body.should.be.a("object")
        res.body.should.have.property("status").eq(500)
        res.body.should.have.property("message").eq("A user with the same email adress already exists.")
        res.body.should.have.property("data").that.is.empty // niet ingelogd

        done()
      })
  })
})