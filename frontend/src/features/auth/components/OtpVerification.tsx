import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/Elements";
import { Form } from "@/components/Form";
import "../routes/auth.css";
import { useEffect, useState } from "react";
import { useNotificationStore } from "@/stores/notifications";
import OtpInput from 'react-otp-input';
import { resendOtp, verifyOtp } from "../api/forget";


export const OtpVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams?.get("reset_token");
  const emailToken = searchParams?.get("email_token");
  const { addNotification } = useNotificationStore();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPasswordToken, setResetPasswordToken] = useState(resetToken || "");
  const [resendCoolDown, setResendCoolDown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data: any = await verifyOtp(resetPasswordToken, { otp });
      addNotification({
        type: "success",
        title: "Success",
        message: data?.message || "Verified successfully!",
      });
      navigate(`/auth/reset?reset_token=${resetPasswordToken}`)
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      if (isResendDisabled) return;
      setResendCoolDown(30);
      setIsResendDisabled(true);
      const { data } = await resendOtp({ emailToken: emailToken || "" });
      setResetPasswordToken(data);
      addNotification({
        type: "success",
        title: "Success",
        message: "Reset password link has been to sent to your email address!",
      });
    } catch (error: any) {
      if (error?.response?.data?.message === "jwt expired") {
        navigate("/auth/login")
      }
    }
  }

  useEffect(() => {
    let interval: any;
    if (isResendDisabled && resendCoolDown > 0) {
      interval = setInterval(() => {
        setResendCoolDown((prev) => prev - 1);
      }, 1000);
    } else if (resendCoolDown === 0) {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [isResendDisabled, resendCoolDown]);

  useEffect(() => {
    if (!resetToken || !emailToken) {
      navigate(-1);
    }
  }, [])

  return (
    <div className="forgot-passpg otp h-100 d-flex align-items-center justify-content-center ">
      <div className="forgot-form   bg-white rounded-lg p-5 container">
        <div className="forgotcard  p-4">
          <h5 className="f-34 text-primary text-center mb-3">Enter Verification Code</h5>
          <h6 className="mb-4 font-light text-center pb-4">Check Your Email Inbox</h6>
          <div className="forgot-width ">
            <Form onSubmit={handleSubmit}>
              {({ }) => (
                <>
                  <div className="otp-input text-center">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      // renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                    />
                  </div>
                  <div className="d-flex  mt-4 justify-content-center">
                    <Button
                      isLoading={loading}
                      type="submit"
                      className="w-100 semi-bold"
                    >
                      {loading ? "Verifying.." : "Verify"}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
        <p className="text-center mt-2">
          Didn’t you receive any code?
          <button
            disabled={isResendDisabled}
            onClick={handleResendOtp}
            className="forget-link semi-bold ms-1"
          >
            {isResendDisabled ? `Resend Code in ${resendCoolDown}s` : 'Resend Code'}
          </button>
        </p>
      </div>
    </div>
  );
};
