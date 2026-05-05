
import { Button } from "@/components/Elements";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBrandById, updateBrand } from "@/features/admin/apis/brands";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/Elements";

interface EditBrandForm {
    name: string;
    description: string;
    logo?: FileList;
}

export const EditBrand = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<EditBrandForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch brand data
    const { data: brandData, isLoading } = useQuery({
        queryKey: ["brand", id],
        queryFn: () => getBrandById(id!),
        enabled: !!id,
    });

    const brand = brandData?.brand;

    // Pre-fill form
    useEffect(() => {
        if (brand) {
            setValue("name", brand.name);
            setValue("description", brand.description || "");
        }
    }, [brand, setValue]);

    const mutation = useMutation({
        mutationFn: (data: FormData) => updateBrand(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["brands"]);
            queryClient.invalidateQueries(["brand", id]);
            toast.success("Brand updated successfully");
            navigate("/admin/brands");
        },
        onError: (error: any) => {
            setIsSubmitting(false);
            const message = error.response?.data?.message || "Failed to update brand";
            toast.error(message);
        }
    });

    const onSubmit = (data: EditBrandForm) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        if (data.logo && data.logo[0]) {
            formData.append("logo", data.logo[0]);
        }
        mutation.mutate(formData);
    };

    if (isLoading) return <Spinner />;
    if (!brand) return <div>Brand not found</div>;

    return (
        <ContentWrapper title="Edit Brand">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Edit Brand</h5>
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
                            {brand.logo && (
                                <div className="mb-2">
                                    <img src={brand.logo} alt="Current Logo" style={{ height: '100px' }} />
                                    <p className="text-muted small">Current Logo</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                {...register("logo")}
                            />
                            <div className="form-text">Upload a new logo to replace the current one.</div>
                        </div>

                        <div className="d-flex gap-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" /> : "Update Brand"}
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
