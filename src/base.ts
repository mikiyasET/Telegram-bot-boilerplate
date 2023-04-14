import express from "express";
import {IndexRoute} from "./routes";
import {WebhooksRoute} from "./routes/Webhooks";
const baseRoute = express.Router();

baseRoute.use('/', IndexRoute);
baseRoute.use('/webhooks', WebhooksRoute);
export default baseRoute;