import { axios } from '@/lib/axios';

export type ForgetPasswordDTO = {
  email: string;
};

export type ResendOtpDTO = {
  emailToken: string;
};

export type verifyOtpDTO = {
  otp: string;
};

export type ResetPasswordDTO = {
  password: string;
}

export const forgetPassword = (data: ForgetPasswordDTO) => {
  return axios.post('/auth/forgot-password', data);
};

export const resendOtp = (data: ResendOtpDTO) => {
  return axios.post('/auth/resend-otp', data);
};

export const verifyOtp = (token: string, data: verifyOtpDTO) => {
  return axios.post(`/auth/verify-otp/${token}`, data);
};

export const resetPassword = (token: string, data: ResetPasswordDTO):Promise<any> => {
  return axios.post(`/auth/reset-password/${token}`, data);
};
