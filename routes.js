import {
  deleteCharacters,
  getCharacters,
  uploadCharacters,
} from './controllers/character.controller.js';

function routes(app) {
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to the Marvel Challenge API',
    });
  });

  app.get('/characters', getCharacters);
  app.post('/characters', uploadCharacters);
  app.delete('/characters', deleteCharacters);
}

export default routes;
