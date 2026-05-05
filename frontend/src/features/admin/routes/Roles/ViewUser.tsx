import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Button } from "@/components/Elements";
import { Switch } from "@mui/material";
import { axios } from "@/lib/axios";
import { usePermission } from "@/hooks/usePermission";

type UserValues = {
  name: string;
  role: string;
  email: string;
  product: string;
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
};

const label = { inputProps: { "aria-label": "Switch demo" } };

const ViewUserRoles = () => {
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = usePermission();
  const [userData, setUserData] = useState<UserValues>({
    name: "",
    role: "",
    email: "",
    product: "",
  });
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
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/roles/user/${id}`);
        const data = response.data;
        setUserData({
          name: data.name || "",
          role: data.role || "",
          email: data.email || "",
          product: data.product_option || "",
        });
        setAccessRights(data.access_rights || {
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
        });
      } catch (error) {
        // Handle error, e.g., show notification
      }
    };
    if (id) {
      fetchUser();
    }
  }, [id]);

  return (
    <ContentWrapper title="View User">
      <h3 className="pb-3 f-20">User Details</h3>
      <div className="detail-card mb-4">
        <div className="customer-title d-flex justify-content-between align-items-center">
          <h4 className="f-14 bold grey mb-0">User Info</h4>
          {hasPermission("roles", "update") && (
            <Link to={`/admin/roles/${id}/edit`}>
              <Button className="light-btn">
                <i className="fa-regular fa-pen-to-square me-2"></i>Edit Role
              </Button>
            </Link>
          )}
        </div>
        <div className="add-box">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.name}
                  disabled
                />
              </div>
            </div>
            {/* <div className="col-12 col-md-6 select-role">
              <div className="form-group">
                <label>Role</label>
                <select
                  className="form-control"
                  value={userData.role}
                  disabled
                >
                  <option value="product_manager">Product Manager</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div> */}
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={userData.email}
                  disabled
                />
              </div>
            </div>
            {/* <div className="col-12 col-md-6 select-role">
              <div className="form-group">
                <label>Product Option</label>
                <select
                  className="form-control"
                  value={userData.product}
                  disabled
                >
                  <option value="product_manager">Product Manager</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div> */}
          </div>
          <h4 className="f-14 bold grey mb-4 mt-3">Permission Settings</h4>
          <div className="permission-table">
            <table className="w-100 table-responsive">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Users</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Order</th>
                  <th>Discount</th>
                  <th>Roles</th>
                  <th>Notif.</th>
                  <th>Report</th>
                  <th>Support</th>
                  <th>Content</th>
                  <th>FAQ</th>
                </tr>
              </thead>
              <tbody>
                {/* Using a helper array to avoid repetition */}
                {["All", "Index", "Create", "Update", "Delete"].map(actionLabel => {
                  const action = actionLabel.toLowerCase();
                  return (
                    <tr key={action}>
                      <td>{actionLabel}</td>
                      {["users", "product", "category", "order", "discount", "roles", "notification", "report", "support", "content", "faq"].map(key => (
                        <td key={key}>
                          <Switch
                            {...label}
                            disabled={true}
                            checked={(accessRights?.[key as keyof AccessRights] || []).includes(action)}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ViewUserRoles;
