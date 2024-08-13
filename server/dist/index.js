"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
const validateEnv_1 = __importDefault(require("@/utils/validateEnv"));
const user_controller_1 = __importDefault(require("@/resources/user/user.controller"));
const quiz_controller_1 = __importDefault(require("./resources/quiz/quiz.controller"));
(0, validateEnv_1.default)();
const app = new app_1.default([new user_controller_1.default(), new quiz_controller_1.default], Number(process.env.PORT));
app.listen();
