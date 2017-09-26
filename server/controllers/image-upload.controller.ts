import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler, Application } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { Config } from '../config/config';
import { ITokenPayload, IBaseModelDoc } from '../models/';
import { CONST } from "../constants";
import { ApiErrorHandler } from "../api-error-handler";
import * as rimraf from 'rimraf';
import * as path from 'path';
import * as multer from 'multer';
import * as sharp from 'sharp';
import log = require('winston');
import * as enums from '../enumerations';
import { ProductApiService2 } from '../services/index';

export interface MulterFile {
    path: string // Available using `DiskStorage`.
    mimetype: string
    originalname: string,
    encoding: string,
    destination: string,
    filename: string,
    size: number
}

export class ImageUploadController {


    public async imageUploadMiddleware(request: Request, response: Response, next: NextFunction) {
        try {
            // Here we're going to create a few different versions of the file so we can use those later.
            const rawImageFile = request.files[0] as MulterFile;

            // request.body.relatedId hold the id of the current product.
            console.log(request.body);

            // Because this is created as a middleware this doesn't point to the class.
            const controller = new ImageUploadController();

            // Create image variations
            let raw = await controller.formatImage(enums.ImageType[enums.ImageType.raw], rawImageFile);
            let thumb = await controller.formatImage(enums.ImageType[enums.ImageType.thumbnail], rawImageFile, 150, 150);
            let icon = await controller.formatImage(enums.ImageType[enums.ImageType.icon], rawImageFile, 50, 50, 50);
            let small = await controller.formatImage(enums.ImageType[enums.ImageType.small], rawImageFile, 300);
            let medium = await controller.formatImage(enums.ImageType[enums.ImageType.medium], rawImageFile, 500);
            let large = await controller.formatImage(enums.ImageType[enums.ImageType.large], rawImageFile, 1024);

            //Now we go get the product
            await new ProductApiService2(CONST.ep.PRODUCTS).get(request.body.relatedId).subscribe(product => {
                console.log(product);
                response.status(200).json(request.files);
                next();
            });

        } catch (err) {
            ApiErrorHandler.sendError(`Image Uploading / Resizing failed. ${err}`, 500, response, null, err);
        }
    }

    public async formatImage(imagePrefix: string, rawImageFile: MulterFile, width: number = null, height: number = null, quality: number = 80): Promise<sharp.OutputInfo> {
        return await sharp(path.resolve(__dirname, '../../', `${CONST.IMAGE_UPLOAD_PATH}${rawImageFile.filename}`))
            .resize(width, height)
            .crop(sharp.gravity.center)
            .toFormat(sharp.format.png, {
                quality: quality,
            })
            .toFile(`${CONST.IMAGE_UPLOAD_PATH}${imagePrefix}-${rawImageFile.filename}`);

    }
}
