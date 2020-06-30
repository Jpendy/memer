const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const Meme = require('../lib/models/Meme');



describe('memer routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let memeZero;
  let memeOne;

  beforeEach(async() => {
    [memeZero, memeOne] = await Meme.create([...Array(2)].map((_, i) => (
      { 
        top: `this is the top of post ${i}`,
        image: 'image url placeholder',
        bottom: 'this is the bottom'
      }
    )));

  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('it creates a meme with POST', () => {
    
    return request(app)
      .post('/api/v1/memes')
      .send({ 
        top: 'this is the top',
        image: 'image url placeholder',
        bottom: 'this is the bottom'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          top: 'this is the top',
          image: 'image url placeholder',
          bottom: 'this is the bottom',
          __v: 0
        });
      });

  });

  it('it gets all memes with GET', () => {
    
    return request(app)
      .get('/api/v1/memes')
      .then(res => {
        expect(res.body).toEqual([
          { 
            _id: memeZero.id,
            top: 'this is the top of post 0',
            image: 'image url placeholder',
            bottom: 'this is the bottom',
            __v: 0
          },
          { 
            _id: memeOne.id,
            top: 'this is the top of post 1',
            image: 'image url placeholder',
            bottom: 'this is the bottom',
            __v: 0
          }
        ]);
      });
  });

  it('it gets a meme by id with GET', () => {
    
    return request(app)
      .get(`/api/v1/memes/${memeZero._id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          _id: memeZero.id,
          top: 'this is the top of post 0',
          image: 'image url placeholder',
          bottom: 'this is the bottom',
          __v: 0
        });
      });
  });

  it('it updates a meme BY id using PUT', () => {
    
    return request(app)
      .put(`/api/v1/memes/${memeZero._id}`)
      .send({
        top: 'this is the super new and improved top of post 0',
        image: 'super new updated image url placeholder',
        bottom: 'this is the super new and improved bottom',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: memeZero.id,
          top: 'this is the super new and improved top of post 0',
          image: 'super new updated image url placeholder',
          bottom: 'this is the super new and improved bottom',
          __v: 0
        });
      });
  });

  it('it deletes a meme by id with DELETE', () => {

    return request(app)
      .delete(`/api/v1/memes/${memeZero._id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          _id: memeZero.id,
          top: 'this is the top of post 0',
          image: 'image url placeholder',
          bottom: 'this is the bottom',
          __v: 0
        });
      });

  });
});
