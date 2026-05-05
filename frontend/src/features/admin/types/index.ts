export type PrivacyPolicy = {
  title: string;
  description: string;
};

export type Faq = {
  _id?: string;
  question: string;
  answer: string;
};

export type Terms = {
  title: string;
  description: string;
};

export type Content = {
  _id: string;
  privacyPolicy: PrivacyPolicy;
  faq: Faq[];
  terms: Terms;
};