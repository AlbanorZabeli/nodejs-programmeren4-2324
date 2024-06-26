const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")
const { expect } = chai;
chai.should()
chai.use(chaiHttp)

describe("UC204 Opvragen profiel", () => {

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

    it('should retrieve the user details by ID successfully', (done) => {
        chai.request(server)
            .get('/api/user/1')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'User found with id 1.');
                    expect(res.body.data).to.include({
                        "id": 1,
                        "firstName": "Mariëtte",
                        "lastName": "van den Dullemen",
                        "isActive": 1,
                        "emailAdress": "m.vandullemen@server.nl",
                    });
                    done();
                }
            });
    });

    it('should return an error for non-existent user ID', (done) => {
        chai.request(server)
            .get('/api/user/99')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('status', 500);
                expect(res.body).to.have.property('message', 'User not found with id 99');
                done();
            });
    });

    it('should return an error for missing token', (done) => {
        chai.request(server)
            .get('/api/user/profile')
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('status', 401);
                expect(res.body).to.have.property('message', 'No token provided or invalid token format');
                done();
            });
    });

})