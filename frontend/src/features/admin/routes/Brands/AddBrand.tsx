
import { Button } from "@/components/Elements";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrand } from "@/features/admin/apis/brands";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Spinner } from "@/components/Elements";

interface AddBrandForm {
    name: string;
    description: string;
    logo: FileList;
}

export const AddBrand = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<AddBrandForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mutation = useMutation({
        mutationFn: createBrand,
        onSuccess: () => {
            queryClient.invalidateQueries(["brands"]);
            toast.success("Brand created successfully");
            navigate("/admin/brands");
        },
        onError: (error: any) => {
            setIsSubmitting(false);
            const message = error.response?.data?.message || "Failed to create brand";
            toast.error(message);
        }
    });

    const onSubmit = (data: AddBrandForm) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        if (data.logo[0]) {
            formData.append("logo", data.logo[0]);
        }
        mutation.mutate(formData);
    };

    return (
        <ContentWrapper title="Add Brand">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Add New Brand</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label">Brand Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                {...register("name", { required: "Name is required" })}
                                placeholder="Enter brand name"
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                {...register("description")}
                                placeholder="Enter brand description"
                                rows={3}
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Logo</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                {...register("logo")}
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" /> : "Create Brand"}
                            </Button>
                            <Link to="/admin/brands" className="btn btn-light">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </ContentWrapper>
    );
};
