import * as supertest from 'supertest';
import * as app from '../server';
import { connect, connection } from 'mongoose';
import { mongodbUri } from '../config/config'

let qId; 

beforeAll(async () => {
  await connect(mongodbUri);
  console.log('Connected to database for testing');
});

afterAll(async () => {
  await connection.close();
});

describe('Testing of question apis', () => {

  it('should get all questions', async () => {
    const response = await supertest(app).get('/api/questions');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should create question', async () => {
    const createResponse = await supertest(app)
      .post('/api/questions')
      .send({
        title: 'Create Question',
        description: 'This is for testing question creation.',
        complexity: 'Medium',
        category: 'Create',
      });
    expect(createResponse.status).toBe(200);
    expect(createResponse.body.title).toBe('Create Question');
    qId = createResponse.body._id; 
  });

  it('should edit question', async () => {
    const editedQuestion = {
      title: 'Edit Question',
      description: 'This is an edited question',
      complexity: 'Hard',
      category: 'Edited',
    };

    const editResponse = await supertest(app)
      .patch(`/api/questions/${qId}`)
      .send(editedQuestion);

    expect(editResponse.status).toBe(200);
    expect(editResponse.body.title).toBe('Edit Question');
  });

  it('should add tag', async () => {
    const addTagResponse = await supertest(app)
      .patch(`/api/questions/${qId}/tags`)
      .send({
        userId: '123',
        tag: 'sample',
      });

    expect(addTagResponse.status).toBe(200);
    expect(addTagResponse.body.userTags[0].tags).toContain('sample');
  });

  it('should remove tag', async () => {
    const removeTagResponse = await supertest(app)
      .delete(`/api/questions/${qId}/tags`)
      .send({
        userId: '123',
        tag: 'sample',
      });

    expect(removeTagResponse.status).toBe(200);
    expect(removeTagResponse.body.userTags[0].tags).not.toContain('sample');
  });

  it('should delete question', async () => {
    const deleteResponse = await supertest(app).delete(`/api/questions/${qId}`);
    expect(deleteResponse.status).toBe(200);
  });

});
