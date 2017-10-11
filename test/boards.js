import './auth';

import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';
import Board from '../models/board';

chai.use(chaiHttp);

import * as api from './utils/api';

describe('Boards', () => {
  let token, board_id;

  before((done) => { // Before each test we empty the database
    token = process.env.USER_TOKEN;
    Board.find().remove().exec(() => {
      done();
    });
  });

  after((done) => {
    process.env.BOARD_ID = board_id;
    done();
  })

  describe('[POST] /api/boards', () => {
    it('It should CREATE the board', (done) => {
      api.post({
        url: '/api/boards',
        body: {
          title: 'Test board 1',
        },
        token,
      }, (err, res) => {
        res.should.have.status(201);
        board_id = res.body.board._id;
        done();
      });
    });

    it('It should REJECT wrong board', (done) => {
      api.post({
        url: '/api/boards',
        body: {
          title: null,
        },
        token,
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });
  });

  describe('[GET] /api/boards', () => {
    it('It should GET all boards', (done) => {
      api.get({
        url: '/api/boards',
        token,
      }, (err, res) => {
        res.should.have.status(200);
        res.body.boards.length.should.be.eql(1);
        done();
      });
    });
  });
});
