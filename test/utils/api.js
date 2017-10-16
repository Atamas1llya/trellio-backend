import chai from 'chai'
import chaiHttp from 'chai-http';

import server from '../../server';

const should = chai.should();

export const post = ({ url, body, token }, end) => {
  chai.request(server)
    .post(url)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(body)
    .end(end);
}

export const get = ({ url, token }, end) => {
  chai.request(server)
    .get(url)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .end(end);
}

export const put = ({ url, body, token }, end) => {
  chai.request(server)
    .put(url)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(body)
    .end(end);
}

export const remove = ({ url, token }, end) => {
  chai.request(server)
    .delete(url)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .end(end);
}

export const patch = ({ url, token }, end) => {
  chai.request(server)
    .patch(url)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .end(end);
}
