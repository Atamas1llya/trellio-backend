import './boards';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';
import Task from '../models/task';

chai.use(chaiHttp);

import * as api from './utils/api';

describe('Tasks', () => {
  let token,
    board_id,
    tasks = [];

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
          title: 'Task 1'
        },
        token
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
          dueDate: new Date().setDate(new Date().getDate() + 2)
        },
        token
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
          description: 'Wrong task without title'
        },
        token
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });

    it('It should REJECT task to nonexistent board', (done) => {
      api.post({
        url: `/api/boards/wrong_id/tasks`,
        body: {
          title: 'Task 1'
        },
        token
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });
  });

  describe('[PUT] /api/boards/tasks/:task_id', () => {
    it('It should UPDATE the task on the board', (done) => {
      api.put({
        url: `/api/boards/tasks/${tasks[0]}`,
        body: {
          title: 'Task 1 modified',
          description: 'Modified descr'
        },
        token
      }, (err, res) => {
        Task.findOne({
          title: 'Task 1 modified'
        }, (err, data) => {
          expect(data).to.have.property('title').equal('Task 1 modified');
          res.should.have.status(200);
          done();
        })
      });
    });

    it('It should REJECT update to the nonexistent task', (done) => {
      api.put({
        url: `/api/boards/tasks/wrong_task_id`,
        body: {
          title: 'Task 1 modified',
          description: 'Modified descr'
        },
        token
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });
  });

  describe('[PATCH] /api/boards/tasks/:task_id/:status', () => {
    it('It should UPDATE task status', (done) => {
      api.patch({
        url: `/api/boards/tasks/${tasks[0]}/complete`,
        token
      }, (err, res) => {
        res.should.have.status(200);
        done();
      });
    });

    it('It should REJECT wrong status', (done) => {
      api.patch({
        url: `/api/boards/tasks/${tasks[0]}/wrong_status`,
        token
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });

    it('It should REJECT status update to nonexistent task', (done) => {
      api.patch({
        url: `/api/boards/tasks/wrong_task_id/complete`,
        token
      }, (err, res) => {
        res.should.have.status(400);
        done();
      });
    });
  });

  describe('[GET] /api/boards/tasks', () => {
    it('It should GET all tasks', (done) => {
      api.get({
        url: `/api/boards/tasks`
      }, (err, res) => {
        res.should.have.status(200);
        res.body.tasks.length.should.be.eql(2);
        done();
      });
    });
  });

  describe('[DELETE] /api/boards/tasks/:task_id', () => {
    it('It should DELETE task', (done) => {
      api.remove({
        url: `/api/boards/tasks/${tasks[1]}`,
        token,
      }, (err, res) => {
        res.should.have.status(200);
        done();
      });
    });

    it('It should REJECT delete request to wrong task_id', (done) => {
      api.remove({
        url: `/api/boards/tasks/wrong_task_id`,
        token,
      }, (err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });

  describe('[GET] /api/boards/:board_id/tasks', () => {
    it('It should GET all tasks on the board', (done) => {
      api.get({
        url: `/api/boards/${board_id}/tasks`
      }, (err, res) => {
        res.should.have.status(200);
        res.body.tasks.length.should.be.eql(1);
        done();
      });
    });

    it('It should REJECT request to nonexistent board', (done) => {
      api.get({
        url: `/api/boards/wrong_board_id/tasks`
      }, (err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });
});
