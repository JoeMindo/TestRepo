process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../config/server');
let should = chai.should();

chai.use(chaiHttp)
describe('/GET ussd', () => {
    it('it should GET the first page', (done) => {
      chai.request(server)
          .get('/ussd')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
          });
    });
});