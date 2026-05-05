
import { Button, Spinner } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "@/features/admin/apis/category";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const schema = z.object({
    name: z.string().min(2, "Name must have at least 2 letters"),
    description: z.string().min(2, "Description must have at least 2 letters"),
});

type CategoryValues = {
    name: string;
    description: string;
};

export const EditCategory = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: category, isLoading } = useQuery({
        queryKey: ["category", id],
        queryFn: () => getCategoryById(id!),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: (values: { name: string, description: string }) => updateCategory(id!, values),
        onSuccess: () => {
            toast.success("Category updated successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["category", id] });
            navigate("/admin/categories");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });

    if (isLoading) return <Spinner />;

    return (
        <ContentWrapper title="Edit Category">
            <h3 className="pb-3 f-20">Edit Category</h3>
            {category?.data && (
                <Form<CategoryValues, typeof schema>
                    onSubmit={(values) => mutation.mutate(values)}
                    schema={schema}
                    options={{
                        defaultValues: {
                            name: category.data.name,
                            description: category.data.description
                        }
                    }}
                >
                    {({ register, formState }) => (
                        <>
                            <div className="detail-card mb-4">
                                <div className="customer-title d-flex justify-content-between align-items-center">
                                    <h4 className="f-14 bold grey mb-0">Edit Category Details</h4>
                                    <Button type="submit" isLoading={mutation.isPending} className="light-btn">Update Category</Button>
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
            )}
        </ContentWrapper>
    );
};

export default EditCategory;
