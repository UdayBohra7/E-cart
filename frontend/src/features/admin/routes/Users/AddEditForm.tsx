import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { z } from "zod";
import { createUser, updateUser } from "../../apis/user";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

interface Props {
  isEdit: boolean;
  data?: any;
}

const getValidationSchema = (isEdit: boolean) => {
  return z.object({
    name: z.string().min(1, "Please enter name"),
    email: z
      .string()
      .min(1, "Please enter email address")
      .email("Please enter a valid email address!"),
    role: z.enum(["USER", "ADMIN"], { required_error: "Please select a role" }),
    phone: z.string().optional(),
    countryCode: z.string().optional(),
    businessLocation: z.string().optional(),
    password: isEdit
      ? z.string().optional()
      : z.string().min(8, "Password must be at least 8 characters"),
    isActive: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
  });
};

type UserValues = {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  phone?: string;
  countryCode?: string;
  businessLocation?: string;
  password?: string;
  isActive?: boolean;
  isBlocked?: boolean;
};

const AddEditUserForm = ({ isEdit, data }: Props) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const schema = useMemo(() => getValidationSchema(isEdit), [isEdit]);

  const handleSubmit = async (values: UserValues) => {
    try {
      setSaving(true);

      const finalData: any = {
        name: values.name,
        email: values.email,
        role: values.role,
        phone: values.phone || null,
        countryCode: values.countryCode || null,
        businessLocation: values.businessLocation || null,
        isActive: values.isActive ?? true,
        isBlocked: values.isBlocked ?? false,
      };

      if (!isEdit && values.password) {
        finalData.password = values.password;
      } else if (isEdit && values.password && values.password.trim() !== "") {
        finalData.password = values.password;
      }

      if (isEdit) {
        await updateUser(data?._id || data?.id?.toString(), finalData);
        toast.success("User updated successfully");
      } else {
        await createUser(finalData);
        toast.success("User created successfully");
      }

      navigate("/admin/users");
    } catch (e: any) {
      console.error("Error saving user:", e);
      toast.error(e?.response?.data?.message || "An error occurred while saving user details.");
    } finally {
      setSaving(false);
    }
  };

  const defaultValues = useMemo<any>(() => {
    if (isEdit && data) {
      return {
        name: data.name || "",
        email: data.email || "",
        role: data.role || "USER",
        phone: data.phone || "",
        countryCode: data.countryCode || "",
        businessLocation: data.businessLocation || "",
        isActive: data.isActive ?? true,
        isBlocked: data.isBlocked ?? false,
        password: "",
      };
    }
    return {
      role: "USER",
      isActive: true,
      isBlocked: false,
      password: "",
    };
  }, [data, isEdit]);

  return (
    <ContentWrapper title={isEdit ? "Edit User" : "Add User"}>
      <h3 className="pb-3 f-20">{isEdit ? "Edit User Details" : "Add User"}</h3>
      <Form<UserValues, typeof schema>
        onSubmit={handleSubmit}
        schema={schema}
        options={{
          defaultValues: defaultValues
        }}
      >
        {({ register, formState }) => {
          return (
            <>
              {/* User details card */}
              <div className="detail-card mb-4 border rounded p-4 bg-white">
                <div className="customer-title mb-3">
                  <h4 className="f-14 bold grey mb-0">Account Information</h4>
                </div>
                <div className="add-box">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Name"
                        error={formState.errors["name"]}
                        registration={register("name")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="email"
                        label="Email Address"
                        error={formState.errors["email"]}
                        registration={register("email")}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label font-medium">Role</label>
                        <select
                          className="form-control"
                          {...register("role")}
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        {formState.errors["role"] && (
                          <div className="invalid-feedback d-block">
                            {formState.errors["role"]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="password"
                        label={isEdit ? "New Password (leave empty to keep current)" : "Password"}
                        error={formState.errors["password"]}
                        registration={register("password")}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Phone Number"
                        error={formState.errors["phone"]}
                        registration={register("phone")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Country Code (e.g. +1)"
                        error={formState.errors["countryCode"]}
                        registration={register("countryCode")}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Business Location"
                        error={formState.errors["businessLocation"]}
                        registration={register("businessLocation")}
                      />
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-12 col-md-6 d-flex align-items-center gap-4">
                      <FormControlLabel
                        control={
                          <input
                            type="checkbox"
                            className="form-check-input mr-2"
                            {...register("isActive")}
                            defaultChecked={defaultValues.isActive}
                          />
                        }
                        label="Active Status"
                      />
                      <FormControlLabel
                        control={
                          <input
                            type="checkbox"
                            className="form-check-input mr-2"
                            {...register("isBlocked")}
                            defaultChecked={defaultValues.isBlocked}
                          />
                        }
                        label="Blocked Status"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form buttons */}
              <div className="d-flex gap-3 justify-content-end">
                <Button disabled={saving} type="submit" className="btn btn-primary">
                  {saving ? "Please wait.." : "Save"}
                </Button>
                <Button type="button" className="border-btn" onClick={() => navigate("/admin/users")}>
                  Cancel
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </ContentWrapper>
  );
};

export default AddEditUserForm;
