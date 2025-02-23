export class AddproductModel{
    ProductNo: string;
    ProductDate: string;
    ProductName: string;
    Category: string;
    Rate: string;
    Quantity: string;
    QuantityDescription: string;
    Status: string;
    Trending: string;
    Latest:string;
    ProductImage:any;
    ProductImageurl:string;
    createdBy:string;
    updatedBy:string;
    Void:string;
    OpsType:string;
    CartQuantity:string;
  
}


export class AddressInfoModel{
    orderId:string;
    Name: string;
    PhoneNo: string;
    APhoneNo: string;
    Address: string;
    City: string;
    PinCode: string;
    State: string;
    Country: string;
    LandMark:string;
    PaymentMode: string;
    createdBy:string;
    updatedBy:string;
    Void:string;
    OpsType:string;
    CartQuantity:string;
    CartDet:any;
}


export class PaymentModeModel{
    CardNumber:string;
    Year:string;
    Month:string;
    CCV:string;
}




export class RegisterModel{
    UserName:string;
    PhoneNo: string;
    Email: string;
    Password:string;
    role:string;
    Status: string;
}