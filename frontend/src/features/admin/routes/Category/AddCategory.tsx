
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { createCategory } from "@/features/admin/apis/category";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const schema = z.object({
    name: z.string().min(2, "Name must have at least 2 letters"),
    description: z.string().min(2, "Description must have at least 2 letters"),
});

type CategoryValues = {
    name: string;
    description: string;
};

export const AddCategory = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            toast.success("Category created successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            navigate("/admin/categories");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });

    return (
        <ContentWrapper title="Add Category">
            <h3 className="pb-3 f-20">Add Category</h3>
            <Form<CategoryValues, typeof schema>
                onSubmit={(values) => mutation.mutate(values)}
                schema={schema}
            >
                {({ register, formState }) => (
                    <>
                        <div className="detail-card mb-4">
                            <div className="customer-title d-flex justify-content-between align-items-center">
                                <h4 className="f-14 bold grey mb-0">Add Category Details</h4>
                                <Button type="submit" isLoading={mutation.isLoading} className="light-btn">Create Category</Button>
                            </div>
                            <div className="add-box">
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <InputField
                                            label="Name"
                                            registration={register("name")}
                                            error={formState.errors["name"]}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <InputField
                                            label="Description"
                                            registration={register("description")}
                                            error={formState.errors["description"]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </ContentWrapper>
    );
};

export default AddCategory;
