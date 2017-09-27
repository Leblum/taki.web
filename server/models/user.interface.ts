import { IBaseModel } from "./index";

export interface IUser extends IBaseModel {
    firstName?: string,
    lastName?: string,
    password: string;
    email: string;
    organizationId?: string;
    href?: string;
    // This will be set to true whenever a user changes their password / or we require them to login again
    // This is used by the authentication controller to revoke the renewal of a token.  
    isTokenExpired?: boolean; 
    isEmailVerified?: boolean;
    isActive?: boolean;
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
}