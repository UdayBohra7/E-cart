import { User } from "./user";

export interface QueryManagement {
    _id: string;
    type: "contact-us" | "help-&-support";
    status: "active" | "dismiss" | "acknowledged";
    userId: User;
    message: string;
    name?: string;
    subject?: string;
    createdAt?: string;
    updatedAt?: string;
}
