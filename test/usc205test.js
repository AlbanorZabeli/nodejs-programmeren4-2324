const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")
const { expect } = chai;
chai.should()
chai.use(chaiHttp)

describe("UC205 Opvragen profiel", () => {

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

    it('should update user details successfully', (done) => {
        chai.request(server)
            .put('/api/user/1') // Update the user with ID 1
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Updated',
                lastName: 'User'
            })
            .end((err, res) => {
                console.log('Update user details response:', res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('status', 200);
                expect(res.body.data).to.have.property('firstName', 'Updated');
                expect(res.body.data).to.have.property('lastName', 'User');
                done();
            });
    });

    it('should return an error if the user does not exist', (done) => {
        chai.request(server)
            .put('/api/user/999')
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Updated',
                lastName: 'User'
            })
            .end((err, res) => {
                console.log('Error if user does not exist response:', res.body);
                expect(res).to.have.status(500);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('status', 500);
                expect(res.body).to.have.property('message', 'No existing user was found with id: 999');
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