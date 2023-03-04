import createDebug from 'debug';
import http from 'http';
import { app } from './app';
const debug = createDebug('W6');

const PORT = process.env.PORT || 4500;

const server = http.createServer(app);
