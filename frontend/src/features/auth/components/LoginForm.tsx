import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import { useLogin } from "@/lib/auth";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { Checkbox, FormControlLabel } from "@mui/material";

const schema = z.object({
  email: z.string().min(1, "Please enter email address"),
  password: z.string().min(1, "Please enter password"),
});

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: () => void
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin();
  const navigate = useNavigate();
  const { animate, callAfterAnimateFn } = useAnimateFn();

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <div className="login-form p-5">
            <div className="login-box">
            <h2 className="f-34 text-primary">Login</h2>
            <h5 className="f-24 text-primary">Login to your account</h5>
            <p className="f-14 pb-4">Thank you for get back to Grovia, lets access our the best
            recommendation contact for you.</p>
            <Form<LoginValues, typeof schema>
              onSubmit={async (values) => {
                // values;
                await login.mutate(values, { onSuccess });
                // onSuccess();
              }}
              options={{ defaultValues: {
                email: "",
                password: ""
              }}}
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
                  <InputField
                    type="password"
                    label="Password"
                    error={formState.errors["password"]}
                    registration={register("password")}
                  />
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="remember-me">
                    <FormControlLabel control={<Checkbox defaultChecked />} className="semi-bold" label="Remember Me" />
                    </div>
                    <button
                      type="button"
                      onClick={callAfterAnimateFn(() => navigate("/auth/forget"))}
                      className="forget-link red text-decoration-none border-0 bg-white"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="d-flex justify-content-center mt-4">
                    <Button
                      // startIcon={<i className="fa-solid fa-lock" />}
                      isLoading={login.isLoading}
                      type="submit"
                      className="w-100"
                    >
                      Log In
                    </Button>
                  </div>
                </>
              )}
            </Form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
