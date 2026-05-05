
import { Button, Spinner } from "@/components/Elements";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOccasionById, updateOccasion } from "@/features/admin/apis/occasion";
import { uploadFile } from "@/features/admin/apis/common";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface EditOccasionForm {
    title: string;
    description: string;
    image: FileList;
}

export const EditOccasion = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditOccasionForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data: occasion, isLoading } = useQuery({
        queryKey: ["occasion", id],
        queryFn: () => getOccasionById(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (occasion?.data) {
            setValue("title", occasion.data.title);
            setValue("description", occasion.data.description);
            setPreviewImage(occasion.data.image);
        }
    }, [occasion, setValue]);

    const mutation = useMutation({
        mutationFn: (values: { title?: string; description?: string; image?: string }) => updateOccasion(id!, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["occasions"] });
            queryClient.invalidateQueries({ queryKey: ["occasion", id] });
            toast.success("Occasion updated successfully");
            navigate("/admin/occasions");
        },
        onError: (error: any) => {
            setIsSubmitting(false);
            const message = error.response?.data?.message || "Failed to update occasion";
            toast.error(message);
        }
    });

    const onSubmit = async (data: EditOccasionForm) => {
        setIsSubmitting(true);
        try {
            let imageUrl = previewImage || "";
            if (data.image && data.image[0]) {
                const uploadResponse = await uploadFile(data.image[0]);
                imageUrl = uploadResponse.data;
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

    if (isLoading) return <Spinner />;

    return (
        <ContentWrapper title="Edit Occasion">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Edit Occasion</h5>
                </div>
                <div className="card-body">
                    {occasion?.data && (
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
                                    {...register("description")}
                                    placeholder="Enter description"
                                    rows={3}
                                ></textarea>
                                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Image</label>
                                {previewImage && (
                                    <div className="mb-2">
                                        <img src={previewImage} alt="Current" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    {...register("image")}
                                />
                                <small className="text-muted">Leave empty to keep current image</small>
                            </div>

                            <div className="d-flex gap-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <Spinner size="sm" /> : "Update Occasion"}
                                </Button>
                                <Link to="/admin/occasions" className="btn btn-light">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </ContentWrapper>
    );
};

export default EditOccasion;
