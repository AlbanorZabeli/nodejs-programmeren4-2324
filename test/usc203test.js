const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")
const { expect } = chai;
chai.should()
chai.use(chaiHttp)

describe("UC203 Opvragen profiel", () => {

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

    it('should retrieve the user profile successfully', (done) => {
        chai.request(server)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('status', 200);
                    expect(res.body).to.have.property('message', 'Profile fetched successfully');
                    expect(res.body.data).to.include({
                        emailAdress: 'a@server.nl'
                    });
                    done();
                }
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