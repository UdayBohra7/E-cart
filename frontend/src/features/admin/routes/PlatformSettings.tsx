import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Button, Spinner } from "@/components/Elements";
import { InputField } from "@/components/Form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getPlatformSettings, updatePlatformSettings } from "../apis/platform-settings";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    platformFeePercentage: z.coerce.number().min(0, "Fee cannot be negative").max(100, "Fee cannot exceed 100%"),
    insurancePrice: z.coerce.number().min(0, "Price cannot be negative"),
});

type FormValues = z.infer<typeof schema>;

export const PlatformSettings = () => {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await getPlatformSettings();
            if (data) {
                setValue("platformFeePercentage", data.platformFeePercentage);
                setValue("insurancePrice", data.insurancePrice);
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            toast.error("Failed to fetch settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            setUpdating(true);
            await updatePlatformSettings(data);
            toast.success("Settings updated successfully");
        } catch (error) {
            console.error("Failed to update settings:", error);
            toast.error("Failed to update settings");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <ContentWrapper title="Platform Settings">
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <Spinner />
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="Platform Settings">
            <div className="row">
                <div className="col-12 col-lg-6">
                    <div className="detail-card">
                        <h4 className="f-18 semi-bold mb-4">General Settings</h4>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <InputField
                                    label="Platform Fee Percentage (%)"
                                    type="number"
                                    placeholder="Enter percentage"
                                    registration={register("platformFeePercentage")}
                                    error={errors.platformFeePercentage}
                                />
                            </div>

                            <div className="mb-4">
                                <InputField
                                    label="Insurance Price"
                                    type="number"
                                    placeholder="Enter price"
                                    registration={register("insurancePrice")}
                                    error={errors.insurancePrice}
                                />
                            </div>

                            <div className="d-flex justify-content-end">
                                <Button type="submit" disabled={updating}>
                                    {updating ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};
