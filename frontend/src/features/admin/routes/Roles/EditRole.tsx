import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Switch } from "@mui/material";
import { z } from "zod";
import { useEffect, useState } from "react";
import { createAccess } from "../../apis/access-rights/createAccess";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { axios } from "@/lib/axios";

const schema = z.object({
    name: z.string().min(1, "Please enter name"),
    email: z
        .string()
        .min(1, "Please enter email address")
        .email("Please enter a valid email address!"),
});

type UserValues = {
    name: string;
    email: string;
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

const EditRole = () => {
    const { id } = useParams<{ id: string }>();
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

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/roles/user/${id}`);
                const data = response.data;
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
                    settings: [],
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch user data");
                navigate("/admin/roles");
            }
        };
        if (id) {
            fetchUser();
        }
    }, [id, navigate]);


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
            await createAccess(payload);
            toast.success("Role Updated Successfully!");
            navigate("/admin/roles");
        } catch (e: any) {
            console.log(e);
            toast.error("Error updating role:", e);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <ContentWrapper title="Edit Role">
            <h3 className="pb-3 f-20">Edit Role</h3>
            <Form<UserValues, typeof schema>
                onSubmit={handleSubmit}
                schema={schema}
                options={{
                    defaultValues: async () => {
                        const response = await axios.get(`/roles/user/${id}`);
                        return {
                            name: response.data.name,
                            email: response.data.email
                        }
                    }
                }}
            >
                {({ register, formState }) => (
                    <>
                        <div className="detail-card mb-4">
                            <div className="customer-title d-flex justify-content-between align-items-center">
                                <h4 className="f-14 bold grey mb-0">Edit Role Details</h4>
                                <Button type="submit" className="light-btn">Update Role</Button>
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
                                            disabled // Email is read-only for updates
                                        />
                                    </div>
                                </div>
                                <h4 className="f-14 bold grey mb-4 mt-3">
                                    Permission Settings
                                </h4>
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
                                                <th>Settings</th>
                                            </tr>
                                        </thead>
                                        <tbody>
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

export default EditRole;
