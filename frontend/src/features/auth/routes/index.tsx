import { Route, Routes } from "react-router-dom";

import { Login } from "./Login";
import { ForgetPassword } from "./ForgetPassword";
import { ResetPassword } from "./ResetPassword";
import { VerifyOtp } from "./VerifyOtp";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      {/* <Route path="register" element={<Register />} /> */}
      <Route path="forget" element={<ForgetPassword />} />
      <Route path="verify-otp" element={<VerifyOtp />} />
      <Route path="reset" element={<ResetPassword />} />
    </Routes>
  );
};
