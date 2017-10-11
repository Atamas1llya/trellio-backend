import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';
import User from '../models/user';

chai.use(chaiHttp);

import * as api from './utils/api';

describe('Authentication', () => {
  let token;

  before((done) => { // Before each test we empty the database
    User.find().remove().exec(() => {
      done();
    });
  });

  after((done) => { // Before each test we empty the database
    process.env.USER_TOKEN = token;
    done();
  });

  describe('[POST] /api/register', () => {
    it('It should REGISTER the user', (done) => {
      api.post({
        url: '/api/register',
        body: {
          email: 'test@gmail.com',
          password: 'tester',
        },
      }, (err, res) => {
        res.should.have.status(201);
        done();
      });
    });

    it('It should REJECT user duplicate', (done) => {
      api.post({
        url: '/api/register',
        body: {
          email: 'test@gmail.com',
          password: 'tester',
        },
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });

    it('It should REJECT wrong user', (done) => {
      api.post({
        url: '/api/register',
        body: {
          email: '',
          password: 'shrt',
        },
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });
  });

  describe('[POST] /api/login', () => {
    it('It should LOGIN the user', (done) => {
      api.post({
        url: '/api/login',
        body: {
          email: 'test@gmail.com',
          password: 'tester',
        },
      }, (err, res) => {
        token = res.body.token;
        res.should.have.status(200);
        done();
      });
    });

    it('It should REJECT wrong credentials', (done) => {
      api.post({
        url: '/api/login',
        body: {
          email: 'test@gmail.com',
          password: 'wrong_password',
        },
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });
  });

});
