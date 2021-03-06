import './profile';

import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';
import Board from '../models/board';

chai.use(chaiHttp);

import * as api from './utils/api';

describe('Boards', () => {
  let token, board_id, secondBoard_id;

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

    it('It should CREATE another one board', (done) => {
      api.post({
        url: '/api/boards',
        body: {
          title: 'Test board 2',
        },
        token,
      }, (err, res) => {
        res.should.have.status(201);
        secondBoard_id = res.body.board._id;
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

  describe('[PUT] /api/boards/:board_id', () => {
    it('It should UPDATE the board', (done) => {
      api.put({
        url: `/api/boards/${board_id}`,
        body: {
          title: 'Test board 1 updated',
        },
        token,
      }, (err, res) => {
        res.should.have.status(200);
        done();
      });
    });

    it('It should NOT UPDATE board (wrong parameters)', (done) => {
      api.put({
        url: `/api/boards/${board_id}`,
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

  describe('[DELETE] /api/boards/:board_id', () => {
    it('It should DELETE the board', (done) => {
      api.remove({
        url: `/api/boards/${secondBoard_id}`,
        token,
      }, (err, res) => {
        res.should.have.status(200);
        done();
      });
    });

    it('It should REJECT request with wrong board_id', (done) => {
      api.remove({
        url: `/api/boards/wrong_board_id`,
        token,
      }, (err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });

  describe('[GET] /api/boards', () => {
    it('It should GET all boards. First board should be updated', (done) => {
      api.get({
        url: '/api/boards',
        token,
      }, (err, res) => {
        res.should.have.status(200);
        res.body.boards.length.should.be.eql(1);
        res.body.boards[0].title.should.be.eql('Test board 1 updated');
        done();
      });
    });
  });
});
