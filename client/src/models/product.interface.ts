import { IBaseModel } from "./index";
import * as enums from "../enumerations";

export interface IProduct extends IBaseModel {
    // Add ownerships to the interface
    _id: string,
    __v: number,
    ownerships?: [{
        ownerId: string,
        ownershipType: enums.OwnershipType
    }],
    displayName?: string,
    commonName?: string,
    shortDescription?: string,
    longDescription?: string,
    thumbnailDescription?: string,
    type?: enums.ProductType,
    category?: string,
    tags?: [string],
    isTemplate: boolean,
    isLocal?: boolean,
    masterProductId?: string,
    sku?: string,
    primaryColor?: enums.PrimaryColor,
    productLocation?: {
        type:string,
        coordinates: Array<number>
    },
    deliveryOptions?: {
        personalPickup?: {
            pickupLocation?: {
                type:string,
                coordinates: Array<number>
            }
        },
        supplierDelivery?: {
            serviceZipCodes?: [number],
            serviceRadius?: number
        },
        courierDelivery?: {
            serviceZipCodes?: [number]
        }
    },
    reviews?: {
        customerEmail?: string,
        customerFirstName?: string,
        customerLastName?: string,
        customerUserId?: string,
        createdDate?: Date,
        rating?: number,
        purchaseDate?: Date,
        message?: string,
        isVerified?: boolean,
        isActive?: boolean,
        sellerResponse?: {
            name?: string,
            message?: string,
            responseDate?: Date,
        }
    },
    sizes?: [string],
    weights?: [string],
    cutDate?: Date,
    combinedWith?: [string],
    similarTo?: [string],
    pricing?: {
        supplier?: {
            perStem?: number,
            markdownPercentage?: number,
            stemsPerBundle?: number
        },
        markupPercentage?: number,
        industryPrice?: number,
        meanPrice?: number
    },
    lastUpdated?: Date,
    active?: {
        startDate?: Date,
        endDate?: Date,
    },
    images?: [{
        type?: enums.ImageType,
        url?: string,
        width?: number,
        height?: number,
        order?: number,
        isActive?: boolean
    }],
    version?: string,
    stemAttributes?: {
        version?: string,
        latinName?: string,
        varietal?: string,
        nickname?: string,
        grade?: string,
        stemLength?: string,
        grams?: number,
        inflorescence?: string,
        bloomSize?: string,
        bloomsPerStem?: string,
        lifespan?: string,
        season?: string,
    }
    href?: string,
    createdBy?: string;
    modifiedBy?: string;
    createdAt?: Date,
    modifiedAt?: Date,
}
