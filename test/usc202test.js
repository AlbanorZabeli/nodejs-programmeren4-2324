const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")
const { expect } = chai;
chai.should()
chai.use(chaiHttp)

describe("UC202 Gebruikers ophalen", () => {

    beforeEach((done) => {
        // Log in to get a token
        chai.request(server)
            .post('/api/login')
            .send({ emailAdress: 'a@server.nl', password: 'secret' })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    token = res.body.data.token;
                    done();
                }
            });
    });

  it("TC 202-1 Gebruikers ophalen", (done) => {
        chai.request(server)
            .get('/api/user')
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('status', 401);
                expect(res.body).to.have.property('message', 'No token provided or invalid token format');
                done();
            });
    });

    it('should retrieve all users successfully', (done) => {
        chai.request(server)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('status', 200);
                expect(res.body)
                    .to.have.property('message')
                    .that.includes('Found');
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
})