export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    otp?: string;
    image?: string | null;
    phone: string;
    username?: string;
    favoriteBrands: string[];
    isCreatedByAdmin: boolean;
    dob?: string;
    bio?: string;
    sid?: string;
    personalAddress?: Address;
    businessLocation?: string;
    isDeleted: boolean;
    isBlocked: boolean;
    isActive: boolean;
    provider?: string;
    createdAt?: string;
    updatedAt?: string;
    countryCode?: string;
    isIdentityVerified?: boolean;
    identityDocs?: string[];
}

export interface Address {
    country: string;
    addressLine1: string;
    addressLine2?: string;
    suburb?: string;
    state: string;
    postcode: string;
    userId: string;
    type: "personal" | "shipping";
    firstName?: string;
    lastName?: string;
    email?: string;
    street?: string;
    isPrimaryAddress: boolean;
    createdAt?: string;
    updatedAt?: string;
}