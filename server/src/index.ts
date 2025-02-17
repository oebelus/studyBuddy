import 'dotenv/config';
import 'module-alias/register';
import App from './app'
import validateEnv from '@/utils/validateEnv';
import UserController from '@/resources/user/user.controller';
import QuizController from './resources/quiz/controllers/quiz.controller';
import analyticsController from './resources/quiz/controllers/analytics.controller';
import FlashcardController from './resources/quiz/controllers/flashcard.controller';
import GenerateController from './resources/quiz/controllers/generate.controller';

validateEnv();

const app = new App([new UserController, new GenerateController, new QuizController, new FlashcardController , new analyticsController], Number(process.env.PORT));

app.listen();