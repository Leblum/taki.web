import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler, Application } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { Config } from '../config/config';
import { ITokenPayload, IBaseModelDoc } from '../models/';
import { CONST } from "../constants";
import { ApiErrorHandler } from "../api-error-handler";


export class ImageUploadController {


    public imageUploadMiddleware(request: Request, response: Response, next: NextFunction): Response {
        try {

            next();
            return response;
        } catch (err) {
            ApiErrorHandler.sendError("Image Upload Failed", 500, response,null, err);
        }
    }
}
