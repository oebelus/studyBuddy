import 'dotenv/config';
import 'module-alias/register';
import App from './app'
import validateEnv from '@/utils/validateEnv';
import UserController from '@/resources/user/user.controller';
import QuizController from './resources/quiz/quiz.controller';

validateEnv();

const app = new App([new UserController(), new QuizController], Number(process.env.PORT));

app.listen();