import { Button } from "@/components/Elements";
import { Form, InputField, SelectField } from "@/components/Form";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Switch } from "@mui/material";
import { z } from "zod";
import { useState } from "react";
import { axios } from "@/lib/axios";
import { createAccess } from "../../apis/access-rights/createAccess";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const schema = z.object({
  name: z.string().min(1, "Please enter name"),
  email: z
    .string()
    .min(1, "Please enter email address")
    .email("Please enter a valid email address!"),
  // role: z.string().min(1, "Please select role"),
  // product: z.string().min(1, "Please select product option"),
});

type UserValues = {
  name: string;
  email: string;
  // role: string;
  // product: string;
};

type AccessRights = {
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
  settings: string[];
};

const label = { inputProps: { "aria-label": "Switch demo" } };

const AddRole = () => {
  const navigate = useNavigate();
  const [accessRights, setAccessRights] = useState<AccessRights>({
    users: [],
    category: [],
    order: [],
    product: [],
    discount: [],
    roles: [],
    notification: [],
    report: [],
    support: [],
    content: [],
    faq: [],
    settings: [],
  });

  const togglePermission = (category: keyof AccessRights, action: string) => {
    setAccessRights(prev => {
      const current = prev[category] || [];
      let newArr: string[];

      if (action === "all") {
        if (current.includes("all")) {
          newArr = [];
        } else {
          newArr = ["all", "index", "create", "update", "delete"];
        }
      } else {
        if (current.includes(action)) {
          newArr = current.filter(a => a !== action && a !== "all");
        } else {
          newArr = [...current, action];
        }
      }
      return { ...prev, [category]: newArr };
    });
  };

  const handleSubmit = async (data: UserValues) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        access_rights: accessRights
      };
      await createAccess(payload)
      toast.success("Add Successfully !")
      navigate("/roles")
    } catch (e: any) {
      console.log(e);
      toast.error("error :", e);
    }
  };
  const options = [
    {
      label: "Product Manager",
      value: "product_manager",
    },
    {
      label: "Manager",
      value: "manager",
    },
  ];
  const product = [
    {
      label: "Product Manager",
      value: "product_manager",
    },
    {
      label: "Manager",
      value: "manager",
    },
  ];
  return (
    <ContentWrapper title="Add Role">
      <h3 className="pb-3 f-20">Add New Role</h3>
      <Form<UserValues, typeof schema> onSubmit={handleSubmit} schema={schema}>
        {({ register, formState, control }) => (
          <>
            <div className="detail-card mb-4">
              <div className="customer-title d-flex justify-content-between align-items-center">
                <h4 className="f-14 bold grey mb-0">Add Role</h4>
                <Button type="submit" className="light-btn">Save Role</Button>
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
                  {/* <div className="col-12 col-md-6 select-role">
                    <SelectField
                      control={control}
                      options={options}
                      label="Role"
                      error={formState.errors["role"]}
                      registration={register("role")}
                    />
                  </div> */}
                  <div className="col-12 col-md-6">
                    <InputField
                      type="email"
                      label="Email Address"
                      error={formState.errors["email"]}
                      registration={register("email")}
                    />
                  </div>
                  {/* <div className="col-12 col-md-6 select-role">
                    <SelectField
                      control={control}
                      options={product}
                      label="Product Option"
                      error={formState.errors["product"]}
                      registration={register("product")}
                    />
                  </div> */}
                </div>
                <h4 className="f-14 bold grey mb-4 mt-3">
                  Permission Settings
                </h4>
                <div className="permission-table">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Users</th>
                        <th>Product</th>
                        {/* <th>Location</th> */}
                        <th>Category</th>
                        <th>Order</th>
                        <th>Discount</th>
                        <th>Roles</th>
                        <th>Notif.</th>
                        <th>Report</th>
                        <th>Support</th>
                        <th>Content</th>
                        <th>FAQ</th>
                        <th>Settings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Using a helper array to avoid repetition would be cleaner, but keeping style consistent for now */}
                      {["All", "Index", "Create", "Update", "Delete"].map(actionLabel => {
                        const action = actionLabel.toLowerCase();
                        return (
                          <tr key={action}>
                            <td>{actionLabel}</td>
                            {["users", "product", "category", "order", "discount", "roles", "notification", "report", "support", "content", "faq", "settings"].map(key => (
                              <td key={key}>
                                <Switch
                                  {...label}
                                  checked={(accessRights[key as keyof AccessRights] || []).includes(action)}
                                  onChange={() => togglePermission(key as keyof AccessRights, action)}
                                />
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </Form>
    </ContentWrapper>
  );
};

export default AddRole;
