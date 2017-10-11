import './auth';

import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';

chai.use(chaiHttp);

import * as api from './utils/api';

describe('Profile', () => {
  let token;

  before((done) => { // Before each test we empty the database
    token = process.env.USER_TOKEN;
    done();
  });

  describe('[POST] /api/profile', () => {
    it('It should GET user profile', (done) => {
      api.get({
        url: '/api/profile',
        token,
      }, (err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });
});
