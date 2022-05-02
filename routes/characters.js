import { Router } from 'express';
import {
  deleteCharacters,
  getCharacters,
  uploadCharacters,
} from '../controllers/character.controller.js';

const charactersRouter = Router();

charactersRouter
  .route('/')
  .get(getCharacters)
  .post(uploadCharacters)
  .delete(deleteCharacters);

export default charactersRouter;
