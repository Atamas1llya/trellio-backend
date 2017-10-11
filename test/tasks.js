import './boards';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';
import Task from '../models/task';

chai.use(chaiHttp);

import * as api from './utils/api';

describe('Tasks', () => {
  let token, board_id, tasks = [];

  before((done) => { // Before each test we empty the database
    token = process.env.USER_TOKEN;
    board_id = process.env.BOARD_ID;
    Task.find().remove().exec(() => {
      done();
    });
  });

  describe('[POST] /api/boards/:board_id/tasks', () => {
    it('It should CREATE a task on the board', (done) => {
      api.post({
        url: `/api/boards/${board_id}/tasks`,
        body: {
          title: 'Task 1',
        },
        token,
      }, (err, res) => {
        res.should.have.status(201);
        tasks.push(res.body.task._id);
        done();
      });
    });

    it('It should CREATE another one task on the board', (done) => {
      api.post({
        url: `/api/boards/${board_id}/tasks`,
        body: {
          title: 'Task 2',
          description: 'Simple test task',
           // dues tomorrow
          dueDate: new Date().setDate(new Date().getDate() + 2),
        },
        token,
      }, (err, res) => {
        res.should.have.status(201);
        tasks.push(res.body.task._id);
        done();
      });
    });

    it('It should REJECT wrong task', (done) => {
      api.post({
        url: `/api/boards/${board_id}/tasks`,
        body: {
          description: 'Wrong task without title',
        },
        token,
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });

    it('It should REJECT task to nonexistent board', (done) => {
      api.post({
        url: `/api/boards/wrong_id/tasks`,
        body: {
          title: 'Task 1',
        },
        token,
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });
  });

  describe('[PUT] /api/boards/:board_id/tasks/:task_id', () => {
    it('It should UPDATE the task on the board', (done) => {
      api.put({
        url: `/api/boards/${board_id}/tasks/${tasks[0]}`,
        body: {
          title: 'Task 1 modified',
          description: 'Modified descr',
        },
        token,
      }, (err, res) => {
        Task.findOne({
          title: 'Task 1 modified',
        }, (err, data) => {
          expect(data).to.have.property('title').equal('Task 1 modified');
          res.should.have.status(204);
          done();
        })
      });
    });
  });
});
