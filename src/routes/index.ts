import express, {NextFunction, Request, Response} from "express";
import path from "path";
const IndexRoute = express.Router();

IndexRoute.get('/',async (req: Request, res: Response,next:NextFunction) => {
    try {
        const response = "API is working";
        res.send(response);
    }catch (e) {
        next(e)
    }
});

export {IndexRoute}