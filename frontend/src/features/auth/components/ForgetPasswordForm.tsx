import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import "../routes/auth.css";
import useAnimateFn from "@/hooks/animate";
import { useState } from "react";
import { useNotificationStore } from "@/stores/notifications";
import { forgetPassword } from "../api/forget";

const schema = z.object({
  email: z
    .string()
    .min(1, "Please enter email address")
    .email("Please enter a valid email address!"),
});

type ForgetValues = {
  email: string;
};

export const ForgetPasswordForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const { callAfterAnimateFn } = useAnimateFn();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ForgetValues) => {
    try {
      setLoading(true);
      values;
      const { data } = await forgetPassword(values);
      console.log()
      addNotification({
        type: "success",
        title: "Success",
        message: "Reset password link has been to sent to your email address!",
      });
      navigate(`/auth/verify-otp?reset_token=${data?.resetToken}&email_token=${data?.emailToken}`)
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-passpg h-100 d-flex align-items-center justify-content-center ">
      <div className="forgot-form bg-white rounded-lg p-5 container">
        <div className="forgotcard  p-4">
          <h5 className="f-34 text-primary uppercase text-center mb-3">Forget Password</h5>
          {/* <h6 className="mb-4 font-light text-center pb-4">Lorem ipsum is a dummy content send to otp johnsmoth@*******</h6> */}
          <div className="forgot-width ">
            <Form<ForgetValues, typeof schema>
              onSubmit={handleSubmit}
              schema={schema}
            >
              {({ register, formState }) => (
                <>
                  <InputField
                    type="email"
                    label="Email Address"
                    error={formState.errors["email"]}
                    registration={register("email")}
                  />
                  <div className="d-flex  mt-4 justify-content-center">
                    <Button
                      isLoading={loading}
                      type="submit"
                      className="w-100"
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}
            </Form></div>
        </div>
        <p className="text-center mt-2">
          Back to login screen?
          <Link
            to="#"
            onClick={callAfterAnimateFn(() => navigate("/auth/login"))}
            className="forget-link semi-bold ms-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
