export type AuthUser = {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  bio: string;
  role: 'ADMIN' | 'USER';
  access_rights: {
    users: string[];
    category: string[];
    order: string[];
    product: string[];
    discount: string[];
    roles: string[];
    notification: string[];
    report: string[];
    support: string[];
    content: string[];
    faq: string[];
  };
};

export type Token = {
  token: string;
  expires: string;
};

export type Tokens = {
  access: Token;
  refresh: Token;
};

export type UserResponse = {
  tokens: Tokens;
  user: AuthUser;
};
