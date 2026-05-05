import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import "../routes/auth.css";
import useAnimateFn from "@/hooks/animate";
import { useEffect, useState } from "react";
import { resetPassword } from "../api/forget";
import { toast } from "sonner";

const passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const schema = z.object({
  new_password: z
    .string()
    .min(1, "Please enter new password")
    .regex(passwordStrength, "Password must be 8+ chars, with letter, number & symbol"),

  confirm_password: z
    .string()
    .min(1, "Please enter confirm password")
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"], // Only show the error on confirm_password
});

type ForgetValues = {
  new_password: string;
  confirm_password: string;
};

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams?.get("reset_token");
  const { callAfterAnimateFn } = useAnimateFn();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ForgetValues) => {
    try {
      setLoading(true);
      const data = await resetPassword(resetToken || "", { password: values?.new_password });
      // addNotification({
      //   type: "success",
      //   title: "Success",
      //   message: data?.message || "!",
      // });
      toast.success(data?.message||"Password changed successfully. You may now login with the new password.")
      navigate("/auth/login")
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!resetToken) {
      navigate(-1);
    }
  }, []);

  return (
    <div className="forgot-passpg h-100 d-flex align-items-center justify-content-center ">
      <div className="forgot-form   bg-white rounded-lg p-5 container">
        <div className="forgotcard  p-4">
          <h5 className="f-34 text-primary text-center mb-3">Reset Password</h5>
          <h6 className="mb-4 font-light text-center pb-4">Please enter your new password</h6>
          <div className="forgot-width ">
            <Form<ForgetValues, typeof schema>
              onSubmit={handleSubmit}
              schema={schema}
            >
              {({ register, formState }) => (
                <>
                  <InputField
                    type="password"
                    label="New Password"
                    error={formState.errors["new_password"]}
                    registration={register("new_password")}
                  />
                  <InputField
                    type="password"
                    label="Confirm Password"
                    error={formState.errors["confirm_password"]}
                    registration={register("confirm_password")}
                  />
                  <div className="d-flex justify-content-center">
                    <Button

                      isLoading={loading}
                      type="submit"
                      className="w-100 mt-2"
                    >
                      Reset Password
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
        <p className="text-center mt-2">
          Back to login screen?
          <Link
            to="#"
            onClick={callAfterAnimateFn(() => navigate("/auth/login"))}
            className="forget-link  semi-bold ms-1"
          >
            Login
          </Link>
        </p>

      </div></div>
  );
};
