
import { Button } from "@/components/Elements";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOccasion } from "@/features/admin/apis/occasion";
import { uploadFile } from "@/features/admin/apis/common";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/Elements";

interface AddOccasionForm {
    title: string;
    description: string;
    image: FileList;
}

export const AddOccasion = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<AddOccasionForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mutation = useMutation({
        mutationFn: createOccasion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["occasions"] });
            toast.success("Occasion created successfully");
            navigate("/admin/occasions");
        },
        onError: (error: any) => {
            setIsSubmitting(false);
            const message = error.response?.data?.message || "Failed to create occasion";
            toast.error(message);
        }
    });

    const onSubmit = async (data: AddOccasionForm) => {
        setIsSubmitting(true);
        try {
            let imageUrl = "";
            if (data.image && data.image[0]) {
                const uploadResponse = await uploadFile(data.image[0]);
                imageUrl = uploadResponse.data;
            } else {
                toast.error("Image is required");
                setIsSubmitting(false);
                return;
            }

            const occasionData = {
                title: data.title,
                description: data.description,
                image: imageUrl
            };

            mutation.mutate(occasionData);
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image");
            setIsSubmitting(false);
        }
    };

    return (
        <ContentWrapper title="Add Occasion">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Add New Occasion</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label">Occasion Title</label>
                            <input
                                type="text"
                                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                {...register("title", { required: "Title is required", minLength: { value: 2, message: "Title must be at least 2 characters" } })}
                                placeholder="Enter occasion title"
                            />
                            {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                {...register("description", { required: "Description is required" })}
                                placeholder="Enter description"
                                rows={3}
                            ></textarea>
                            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Image</label>
                            <input
                                type="file"
                                className={`form-control ${errors.image ? "is-invalid" : ""}`}
                                accept="image/*"
                                {...register("image", { required: "Image is required" })}
                            />
                            {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
                        </div>

                        <div className="d-flex gap-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" /> : "Create Occasion"}
                            </Button>
                            <Link to="/admin/occasions" className="btn btn-light">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </ContentWrapper>
    );
};

export default AddOccasion;
