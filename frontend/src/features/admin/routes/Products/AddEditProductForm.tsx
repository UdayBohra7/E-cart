import ContentWrapper from "@/components/Layout/ContentWrapper";
import camera_placeholder from "@/assets/camera_placeholder.jpg";
import dollor from "@/assets/dollor.svg";
import x_icon from "@/assets/x-icon.png";
import { Button } from "@/components/Elements";
import { Form, InputField, MultiSelect, SelectField } from "@/components/Form";
import { z } from "zod";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "@/lib/axios";
import upload from "@/assets/upload.svg";
import { TextareaAutosize } from "@mui/material";
import { addNewProduct } from "../../apis/products/createProduct";
import { toast } from "sonner";
import { updateProduct } from "../../apis/product";
import { getCategories } from "../../apis/category";
import { FormControlLabel, Checkbox } from "@mui/material";

export const variantSchema = z
  .object({
    color: z.string().optional(),
    size: z
      .string({ required_error: "Size is required." })
      .min(1, "Size is required."),
    sizingCountry: z
      .string({ required_error: "Sizing country is required" })
      .min(1, "Sizing country required."),
    quantity: z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
      })
      .min(1, "Quantity must be greater than 0"),
    sizeAndFitNotes: z.string().optional(),
    sellingPrice: z
      .number({ invalid_type_error: "Selling price must be a number" })
      .optional(),
    cleaningPrice: z.number().optional(),
    listingType: z.enum(["rent", "purchase", "both"]),
    rentPrice4Day: z.coerce.number().optional(),
    rentPrice8Day: z.coerce.number().optional(),
    rentPrice30Day: z.coerce.number().optional(),
    selectedDaysAndPrices: z.array(z.any()).optional(),
  })
  .refine(
    (data) => {
      if (data.listingType === "rent") {
        return (
          (data.rentPrice4Day && data.rentPrice4Day > 0) ||
          (data.rentPrice8Day && data.rentPrice8Day > 0) ||
          (data.rentPrice30Day && data.rentPrice30Day > 0)
        );
      }
      return true;
    },
    {
      message:
        "For Rent, at least one rent price (4, 8, or 30 days) is required",
      path: ["listingType"],
    }
  )
  .refine(
    (data) => {
      if (data.listingType === "purchase") {
        return data.sellingPrice !== undefined && data.sellingPrice > 0;
      }
      return true;
    },
    {
      message: "For Purchase, Selling Price is required",
      path: ["sellingPrice"],
    }
  );

const schema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    category: z.string().min(1, "Category is required"),
    designerName: z.string().optional(),
    description: z.string().optional(),
    productStyle: z.string().optional(),
    occasions: z.array(z.string()).optional(),
    listingType: z.enum(["rent", "purchase", "both"]).optional(),
    rentPrice4Day: z.coerce.number().optional(),
    rentPrice8Day: z.coerce.number().optional(),
    rentPrice30Day: z.coerce.number().optional(),
    selectedDaysAndPrices: z.array(z.string()).optional(),
    shippingOptions: z.enum(["pick-up", "express", "both"]),
    // pickUpAddress: z.string().optional(),
    sizeAndFitNotes: z.string().optional(),
    shippingPrice: z.coerce.number().optional(),
    sellingPrice: z.coerce.number().optional(),
    retailPrice: z.coerce.number().optional(),
    cleaningPrice: z.coerce.number().optional(),
    quantity: z.coerce.number().min(0).optional(),
    hasVariants: z.boolean().optional(),
    isInsuranceAvailable: z.boolean().optional(),
    insurancePrice: z.coerce.number().optional(),
  })
  // .refine(
  //     (data) => {
  //         if (data.listingType === "rent") {
  //             return (
  //                 (data.rentPrice4Day && data.rentPrice4Day > 0) ||
  //                 (data.rentPrice8Day && data.rentPrice8Day > 0) ||
  //                 (data.rentPrice30Day && data.rentPrice30Day > 0)
  //             );
  //         }
  //         return true;
  //     },
  //     {
  //         message:
  //             "For Rent, at least one rent price (4, 8, or 30 days) is required",
  //         path: ["listingType"],
  //     }
  // )
  .refine(
    (data) => {
      if (data.listingType === "purchase") {
        return data.sellingPrice !== undefined && data.sellingPrice > 0;
      }
      return true;
    },
    {
      message: "For Purchase, Selling Price is required",
      path: ["sellingPrice"],
    }
  );
// .refine(
//     (data) => {
//         if (data.listingType === "both") {
//             const hasSellingPrice =
//                 data.sellingPrice !== undefined && data.sellingPrice > 0;
//             const hasRentPrice =
//                 (data.rentPrice4Day && data.rentPrice4Day > 0) ||
//                 (data.rentPrice8Day && data.rentPrice8Day > 0) ||
//                 (data.rentPrice30Day && data.rentPrice30Day > 0);
//             return hasSellingPrice && hasRentPrice;
//         }
//         return true;
//     },
//     {
//         message:
//             "For Both, Selling Price and at least one Rent Price (4, 8, or 30 days) are required",
//         path: ["listingType"],
//     }
// );

type ProductValues = {
  name: string;
  category: string;
  designerName?: string;
  description?: string;
  productStyle?: string;
  images?: string[];
  variants?: z.infer<typeof variantSchema>[];
  occasions?: string[];
  listingType: "rent" | "purchase" | "both";
  // selectedDaysAndPrices?: {
  //     days: string;
  //     price: number;
  // }[];
  rentPrice4Day?: number;
  rentPrice8Day?: number;
  rentPrice30Day?: number;
  shippingOptions: "pick-up" | "express" | "both";
  // pickUpAddress?: string;
  sizingCountry?: string;
  sizeAndFitNotes?: string;
  shippingPrice?: number;
  sellingPrice?: number;
  retailPrice?: number;
  cleaningPrice: number;
  quantity?: number;
  hasVariants?: boolean;
  isInsuranceAvailable?: boolean;
  insurancePrice?: number;
};

interface UploadedImage {
  preview: string;
  url?: string;
}

interface Props {
  isEdit: boolean;
  data?: any;
}

const listingOptions = [
  { label: "Purchase", value: "purchase" },
  { label: "Rent", value: "rent" },
  { label: "Both", value: "both" },
];

export const AddEditProductForm = ({ isEdit = false, data }: Props) => {
  const navigate = useNavigate();
  const [hasVariants, setHasVariants] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [occasions, setOccasions] = useState<any[]>([]);
  const [variants, setVariants] = useState<z.infer<typeof variantSchema>[]>([]);
  const [currentVariant, setCurrentVariant] = useState<
    z.infer<typeof variantSchema>
  >({
    color: "",
    size: "",
    sizingCountry: "",
    quantity: 0,
    sizeAndFitNotes: "",
    sellingPrice: 0,
    cleaningPrice: 0,
    listingType: "rent",
    selectedDaysAndPrices: [],
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    designerName: "",
    description: "",
    sellingPrice: "",
    rentPrice4Day: "",
    quantity: "",
    rentPrice8Day: "",
    rentPrice30Day: "",
    retailPrice: "",
    size: [] as string[],
    color: [] as string[],
    listingType: "rent" as "rent" | "purchase" | "both",
    category: "",
    occasions: [] as string[],
    shippingOptions: "pick-up" as "pick-up" | "express" | "both",
    // pickUpAddress: "",
    isInsuranceAvailable: false,
    insurancePrice: 0,
  });
  const [platformInsurancePrice, setPlatformInsurancePrice] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [colorInput, setColorInput] = useState("");

  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = colorInput.trim();
      if (val && !formData.color.includes(val)) {
        handleInputChange("color", [...formData.color, val]);
        setColorInput("");
      }
    }
  };

  const removeColor = (colorToRemove: string) => {
    handleInputChange(
      "color",
      formData.color.filter((c) => c !== colorToRemove)
    );
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      for (const file of files) {
        const previewUrl = URL.createObjectURL(file);

        const newImage: UploadedImage = { preview: previewUrl };
        setImages((prev) => [...prev, newImage]);

        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await axios.post("/app/upload-file", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const fileUrl = response.data;

          setImages((prev) =>
            prev.map((img) =>
              img.preview === previewUrl ? { ...img, url: fileUrl } : img
            )
          );
        } catch (error) {
          console.error("Upload failed", error);
        }
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (value: any) => {
    console.log({ value, formData });
    setLoading(true);
    try {
      const productImages = images.map((e) => e.url);
      const productData: any = {
        name: value.name,
        images: productImages,
        category: value.category,
        designerName: value.designerName,
        description: formData?.description,
        shippingOptions: value.shippingOptions,
        // pickUpAddress: value.pickUpAddress,
        shippingPrice:
          value.shippingOptions === "pick-up"
            ? 0
            : value.shippingPrice
              ? parseFloat(value.shippingPrice)
              : undefined,
        retailPrice: value.retailPrice
          ? parseFloat(value.retailPrice)
          : undefined,
        occasions: value.occasions,
        // quantity: value.quantity || 1,
        // listingType: value.listingType || "rent",
        // sellingPrice: value.sellingPrice
        //     ? parseFloat(value.sellingPrice)
        //     : undefined,
        // selectedDaysAndPrices: [
        //     ...(value.rentPrice4Day
        //         ? [{ days: "4", price: parseFloat(value.rentPrice4Day) }]
        //         : []),
        //     ...(value.rentPrice8Day
        //         ? [{ days: "8", price: parseFloat(value.rentPrice8Day) }]
        //         : []),
        // ],
        // variants: [
        //     ...(value?.size?.length > 0
        //         ? [{ type: "size", value: value.size }]
        //         : []),
        //     ...(value?.color?.length > 0
        //         ? [{ type: "color", value: value.color }]
        //         : []),
        // ],
      };
      if (hasVariants) {
        productData.variants = variants.map((e) => ({
          ...e,
          rentPrice4Day: undefined,
          rentPrice8Day: undefined,
          rentPrice30Day: undefined,
        }));
        productData.hasVariants = hasVariants;
      } else {
        productData.quantity = value.quantity || 1;
        productData.listingType = value.listingType || "rent";
        productData.size = formData.size;
        productData.color = formData.color;
        productData.sellingPrice = value.sellingPrice
          ? parseFloat(value.sellingPrice)
          : undefined;
        if (value.listingType !== "purchase") {
          productData.selectedDaysAndPrices = [
            ...(value.rentPrice4Day
              ? [{ days: "4", price: parseFloat(value.rentPrice4Day) }]
              : []),
            ...(value.rentPrice8Day
              ? [{ days: "8", price: parseFloat(value.rentPrice8Day) }]
              : []),
            ...(value.rentPrice30Day
              ? [{ days: "30", price: parseFloat(value.rentPrice30Day) }]
              : []),
          ];
        }
      }
      // Add insurance data
      productData.isInsuranceAvailable = hasVariants ? false : (value.isInsuranceAvailable || false);
      productData.insurancePrice = hasVariants ? 0 : (value.isInsuranceAvailable ? platformInsurancePrice : 0);

      if (isEdit) {
        await updateProduct(data?._id, productData);
        toast.success("Product updated successfully");
      } else {
        await addNewProduct(productData);
        toast.success("Product created successfully!");
      }
      navigate("/admin/product-list");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateVariant = () => {
    try {
      const validated = variantSchema.parse(currentVariant);
      const variantData: any = { ...validated };

      if (validated.listingType !== "purchase") {
        variantData.selectedDaysAndPrices = [
          ...(validated.rentPrice4Day
            ? [{ days: "4", price: validated.rentPrice4Day }]
            : []),
          ...(validated.rentPrice8Day
            ? [{ days: "8", price: validated.rentPrice8Day }]
            : []),
          ...(validated.rentPrice30Day
            ? [{ days: "30", price: validated.rentPrice30Day }]
            : []),
        ];
      }
      if (editingIndex !== null) {
        const updated = [...variants];
        updated[editingIndex] = variantData;
        setVariants(updated);
        setEditingIndex(null);
        toast.success("Variant updated successfully");
      } else {
        setVariants((prev) => [...prev, variantData]);
        toast.success("Variant added successfully");
      }

      setCurrentVariant({
        color: "",
        size: "",
        sizingCountry: "",
        quantity: 0,
        sizeAndFitNotes: "",
        sellingPrice: 0,
        cleaningPrice: 0,
        listingType: "rent",
        selectedDaysAndPrices: [],
      });
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || "Invalid variant data");
    }
  };

  const handleEditVariant = (index: number) => {
    const variantData = { ...variants[index] };
    if (
      variantData.listingType !== "purchase" &&
      variantData.selectedDaysAndPrices?.length
    ) {
      variantData.selectedDaysAndPrices?.forEach((ele: any) => {
        if (ele?.days === "4") variantData.rentPrice4Day = ele.price;
        if (ele?.days === "8") variantData.rentPrice8Day = ele.price;
        if (ele?.days === "30") variantData.rentPrice30Day = ele.price;
      });
    }
    setCurrentVariant(variantData);
    setEditingIndex(index);
  };

  const handleDeleteVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentVariant({
        color: "",
        size: "",
        sizingCountry: "",
        quantity: 0,
        sizeAndFitNotes: "",
        sellingPrice: 0,
        cleaningPrice: 0,
        listingType: "rent",
        selectedDaysAndPrices: [],
      });
    }
  };

  const handleRemoveImage = (e: any, index: number) => {
    e?.stopPropagation();
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories({});
      const data = response?.results?.map((ele: any) => ({
        label: ele?.name,
        value: ele?._id,
      }));
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEdit) {
      if (data?.hasVariants) {
        setVariants(data?.variants);
      }
      setHasVariants(data?.hasVariants);
      setImages(
        data?.images?.map((e: any) => ({
          preview: e,
          url: e,
        }))
      );

      setFormData({
        name: data?.name || "",
        category: data?.category?._id || "",
        occasions: data?.occasions?.map((e: any) => e?._id) || [],
        designerName: data?.designerName || "",
        description: data?.description || "",
        sellingPrice: data?.sellingPrice || "",
        quantity: data?.quantity || "",
        size: data?.size || [],
        color: data?.color || [],
        listingType: data?.listingType || "rent",
        shippingOptions: data?.shippingOptions || "pick-up",
        // pickUpAddress: data?.pickUpAddress || "",
        rentPrice4Day: data?.selectedDaysAndPrices
          ? data?.selectedDaysAndPrices?.find((e: any) => e?.days === "4")
            ?.price
          : "",
        rentPrice8Day: data?.selectedDaysAndPrices
          ? data?.selectedDaysAndPrices?.find((e: any) => e?.days === "8")
            ?.price
          : "",
        rentPrice30Day: data?.selectedDaysAndPrices
          ? data?.selectedDaysAndPrices?.find((e: any) => e?.days === "30")
            ?.price
          : "",
        retailPrice: data?.retailPrice || "",
        isInsuranceAvailable: data?.isInsuranceAvailable || false,
        insurancePrice: data?.insurancePrice || 0,
      });
    }
  }, [data]);

  const defaultValues = useMemo(
    () =>
      isEdit
        ? {
          name: data?.name || "",
          category: data?.category?._id || data?.category || "",
          designerName: data?.designerName || "",
          description: data?.description || "",
          occasions: data?.occasions?.map((o: any) => o._id || o) || [],
          sellingPrice: data?.sellingPrice || "",
          quantity: data?.quantity || "",
          size: data?.size || [],
          color: data?.color || [],
          listingType: data?.listingType || "rent",
          shippingOptions: data?.shippingOptions || "pick-up",
          // pickUpAddress: data?.pickUpAddress || "",
          shippingPrice: data?.shippingPrice || "",
          rentPrice4Day: data?.selectedDaysAndPrices
            ? data?.selectedDaysAndPrices?.find((e: any) => e?.days === "4")
              ?.price
            : "",
          rentPrice8Day: data?.selectedDaysAndPrices
            ? data?.selectedDaysAndPrices?.find((e: any) => e?.days === "8")
              ?.price
            : "",
          rentPrice30Day: data?.selectedDaysAndPrices
            ? data?.selectedDaysAndPrices?.find((e: any) => e?.days === "30")
              ?.price
            : "",
          retailPrice: data?.retailPrice || "",
          isInsuranceAvailable: data?.isInsuranceAvailable || false,
          insurancePrice: data?.insurancePrice || 0,
        }
        : {},
    [data]
  );
  // ... existing render code ...
  return (
    <ContentWrapper title="List Product">
      <h3 className="pb-3 f-20">List a Product </h3>
      <div className="row product-lisitng mb-4">
        <div className="col-12 col-md-4 col-xxl-3 mb-3">
          <div className="list-pro-box p-4 bg-white rounded-lg">
            <img
              src={
                images?.length
                  ? images[0]?.url || images[0]?.preview
                  : camera_placeholder
              }
              className="w-100 list-product"
            />
            <p className="f-18 semi-bold mt-2 txt">
              {formData.name || "Product Name"}{" "}
              <span className="f-14">
                (
                {categories.find((c) => c?.value === formData.category)
                  ?.label || "Category"}
                )
              </span>
            </p>
            <p className="d-flex txt gap-3 f-18 semi-bold mb-3">
              <span className="text-black">
                ${formData.retailPrice || "0"}
              </span>
            </p>
            {formData.isInsuranceAvailable && (
              <>
                <p className="f-14 mb-1 semi-bold txt">Insurance Price :</p>
                <p className="d-flex txt gap-3 f-18 semi-bold mb-3">
                  <span className="text-black">
                    ${platformInsurancePrice || "0"}
                  </span>
                </p>
              </>
            )}
            <p className="f-14 mb-1 semi-bold txt">Retail Price :</p>
            <p className="d-flex txt gap-3 f-18 semi-bold mb-3">
              <span className="text-black">
                ${formData.retailPrice || "0"}
              </span>
            </p>

            {(formData.listingType === "rent" ||
              formData.listingType === "both") && (
                <>
                  <p className="f-14 mb-1 semi-bold txt">Rent Price :</p>
                  <p className="d-flex txt gap-3 f-18 semi-bold">
                    <span className="text-black">
                      ${formData.rentPrice4Day || "0"}
                    </span>{" "}
                    <span className="f-12">(4 Days)</span>
                  </p>
                  <p className="d-flex txt gap-3 f-18 semi-bold">
                    <span className="text-black">
                      ${formData.rentPrice8Day || "0"}
                    </span>{" "}
                    <span className="f-12">(8 Days)</span>
                  </p>
                  <p className="d-flex txt gap-3 f-18 semi-bold">
                    <span className="text-black">
                      ${formData.rentPrice30Day || "0"}
                    </span>{" "}
                    <span className="f-12">(30 Days)</span>
                  </p>
                </>
              )}

            {(formData.listingType === "purchase" ||
              formData.listingType === "both") && (
                <>
                  <p className="f-14 mb-1 semi-bold txt">Buy Price :</p>
                  <p className="d-flex txt gap-3 f-18 semi-bold">
                    <span className="text-black">
                      ${formData.sellingPrice || "0"}
                    </span>{" "}
                    <span className="f-12">(Selling Price)</span>
                  </p>
                </>
              )}

            <p className="f-14 mb-1 semi-bold txt">Size :</p>
            <div className="size-cahrt d-flex gap-3 flex-wrap align-items-center">
              {formData.size.length > 0 ? (
                formData.size.map((size, index) => (
                  <span key={index} className="px-3 py-2 rounded-lg graybg">
                    {size}
                  </span>
                ))
              ) : (
                <span className="px-3 py-2 rounded-lg graybg">
                  No sizes selected
                </span>
              )}
            </div>

            <p className="f-14 mb-1 semi-bold txt mt-3">Colors :</p>
            <div className="size-cahrt d-flex gap-3 flex-wrap align-items-center">
              {formData.color.length > 0 ? (
                formData.color.map((color, index) => (
                  <span key={index} className="px-3 py-2 rounded-lg graybg">
                    {color}
                  </span>
                ))
              ) : (
                <span className="px-3 py-2 rounded-lg graybg">
                  No colors selected
                </span>
              )}
            </div>
            {/* <div className="product-listed d-flex align-items-center gap-2 txt f-14 my-3">
                            <FormControlLabel label="Is this product contains variants?"
                                control={isEdit && data?.hasVariants ?
                                    <Checkbox defaultChecked value={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} className="p-0" />
                                    :
                                    <Checkbox value={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} className="p-0" />
                                }
                            />
                        </div> */}

            <p className="f-16 mb-1 semi-bold txt mt-3">Description :</p>
            <p className="f-14 txt">
              {formData.description || "No description provided"}
            </p>
          </div>
        </div>

        <div className="col-12 col-md-8 col-xxl-9 mb-3">
          <Form<ProductValues, typeof schema>
            onSubmit={handleSubmit}
            schema={schema}
            options={{ defaultValues: { ...defaultValues } }}
          >
            {({ register, formState, control, getValues }) => {
              const listingType = getValues("listingType");

              return (
                <>
                  <div className="detail-card bg-white mb-4">
                    <div className="customer-title bg-white">
                      <h4 className="f-14 bold grey mb-0">Add Product Photo</h4>
                    </div>
                    <div
                      className="add-box"
                      onClick={handleClick}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Uploaded image previews */}
                      {images?.length ? (
                        <div className="row g-3 mb-3">
                          {images.map((img, idx) => (
                            <div className="col-4 col-md-3" key={idx}>
                              <div className="relative list-product-col">
                                <img
                                  src={img.url || img.preview}
                                  alt={`preview-${idx}`}
                                  className="img-fluid rounded product-image-list"
                                />
                                <button
                                  onClick={(e) => handleRemoveImage(e, idx)}
                                >
                                  <img src={x_icon} alt="x_icon" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="dropbox text-center">
                        <div className="dropbox-images relative mb-4 text-center">
                          <img
                            src={upload}
                            className="dropbox-upload mx-auto"
                            alt="Upload Icon"
                          />
                        </div>
                        <h4 className="f-24 bold">
                          Drop your images here,{" "}
                          <span className="light">or click to browse</span>
                        </h4>
                        <p className="f-14 txt">
                          1600 x 1200 (4:3) recommended. PNG, JPG and GIF files
                          are allowed
                        </p>
                      </div>

                      {/* Hidden input */}
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        multiple
                        className="d-none"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="detail-card mb-4">
                    <div className="customer-title bg-white">
                      <h4 className="f-14 bold grey mb-0">
                        Product Information
                      </h4>
                    </div>
                    <div className="add-box">
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <InputField
                            type="text"
                            label="Name Of Item"
                            onChange={(e: any) =>
                              handleInputChange("name", e.target.value)
                            }
                            error={formState.errors["name"]}
                            registration={{
                              ...register("name"),
                            }}
                          />
                        </div>
                        <div className="col-12 select-role col-md-6">
                          <SelectField
                            options={categories}
                            control={control}
                            label="Product Category"
                            handleChange={(value) =>
                              handleInputChange("category", value)
                            }
                            error={formState.errors["category"]}
                            registration={{
                              ...register("category"),
                            }}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <InputField
                            type="text"
                            label="Designer Name"
                            error={formState.errors["designerName"]}
                            registration={{
                              ...register("designerName"),
                            }}
                          />
                        </div>
                        <div className="col-12 occasion col-md-6">
                          <MultiSelect
                            control={control}
                            options={occasions}
                            label="Occasions"
                            handleChange={(v) =>
                              handleInputChange("occasions", v)
                            }
                            error={formState.errors["occasions"]}
                            registration={{
                              ...register("occasions"),
                            }}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <InputField
                            type="number"
                            startIcon={
                              <img src={dollor} className="dollor-icon" />
                            }
                            label="Retail Price"
                            error={formState.errors["retailPrice"]}
                            registration={register("retailPrice")}
                            onChange={(e: any) => {
                              register("retailPrice").onChange(e);
                              handleInputChange("retailPrice", e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.isInsuranceAvailable}
                                onChange={(e) => {
                                  handleInputChange("isInsuranceAvailable", e.target.checked);
                                }}
                                name="isInsuranceAvailable"
                              />
                            }
                            label="Enable Insurance"
                          />
                          {formData.isInsuranceAvailable && (
                            <p className="mt-1 text-muted">
                              Insurance Price: <strong>${platformInsurancePrice}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        {!hasVariants && (
                          <>
                            <div className="col-12 col-md-6 col-lg-6">
                              <InputField
                                type="number"
                                label="Quantity"
                                error={formState.errors["quantity"]}
                                registration={register("quantity")}
                              />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                              <SelectField
                                options={listingOptions}
                                control={control}
                                label="Listing Type"
                                handleChange={(value) =>
                                  handleInputChange("listingType", value)
                                }
                                error={formState.errors["listingType"]}
                                registration={{
                                  ...register("listingType"),
                                }}
                              />
                            </div>

                            {listingType !== "purchase" && (
                              <div className="col-12 mb-3">
                                <h4 className="f-14 bold grey py-2">
                                  Rent Price Details
                                </h4>
                                <div className="row">
                                  <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <InputField
                                      type="number"
                                      className="form-control"
                                      label="4 Day Price"
                                      error={formState.errors["rentPrice4Day"]}
                                      registration={{
                                        ...register("rentPrice4Day"),
                                      }}
                                      onChange={(e: any) => {
                                        register("rentPrice4Day").onChange(e);
                                        handleInputChange("rentPrice4Day", e.target.value);
                                      }}
                                    />
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <InputField
                                      type="number"
                                      className="form-control"
                                      label="8 Day Price"
                                      error={formState.errors["rentPrice8Day"]}
                                      registration={{
                                        ...register("rentPrice8Day"),
                                      }}
                                      onChange={(e: any) => {
                                        register("rentPrice8Day").onChange(e);
                                        handleInputChange("rentPrice8Day", e.target.value);
                                      }}
                                    />
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-4 mb-3">
                                    <InputField
                                      type="number"
                                      className="form-control"
                                      label="30 Day Price"
                                      error={formState.errors["rentPrice30Day"]}
                                      registration={{
                                        ...register("rentPrice30Day"),
                                      }}
                                      onChange={(e: any) => {
                                        register("rentPrice30Day").onChange(e);
                                        handleInputChange("rentPrice30Day", e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* Moved size and color to new section */}
                            {listingType !== "rent" && (
                              <div className="col-12 col-md-6">
                                <InputField
                                  type="number"
                                  startIcon={
                                    <img src={dollor} className="dollor-icon" />
                                  }
                                  label="Selling Price"
                                  error={formState.errors["sellingPrice"]}
                                  registration={{
                                    ...register("sellingPrice"),
                                  }}
                                />
                              </div>
                            )}
                          </>
                        )}

                        <div className="col-12 area-ip col-md-12">
                          <label className="form-label">Description</label>
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            className="w-100"
                            placeholder="Enter product description"
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            value={formData.description}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {!hasVariants && (
                    <div className="detail-card mb-4">
                      <div className="customer-title bg-white">
                        <h4 className="f-14 bold grey mb-0">Sizes & Colors</h4>
                      </div>
                      <div className="add-box">
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <label className="form-label">Sizes</label>
                            <div className="d-flex gap-2 flex-wrap">
                              {["XS", "S", "M", "L", "XL", "XXL"].map(
                                (sizeOption) => (
                                  <label
                                    key={sizeOption}
                                    className="form-check-label"
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-check-input me-1"
                                      checked={formData.size.includes(
                                        sizeOption
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          handleInputChange("size", [
                                            ...formData.size,
                                            sizeOption,
                                          ]);
                                        } else {
                                          handleInputChange(
                                            "size",
                                            formData.size.filter(
                                              (s) => s !== sizeOption
                                            )
                                          );
                                        }
                                      }}
                                    />
                                    {sizeOption}
                                  </label>
                                )
                              )}
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <label className="form-label">Colors</label>
                            <div className="mb-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Type a color and press Enter"
                                value={colorInput}
                                onChange={(e) => setColorInput(e.target.value)}
                                onKeyDown={handleColorKeyDown}
                              />
                            </div>
                            <div className="d-flex gap-2 flex-wrap">
                              {formData.color.map((colorOption) => (
                                <span
                                  key={colorOption}
                                  className="badge bg-light text-dark border d-flex align-items-center gap-2 p-2"
                                >
                                  {colorOption}
                                  <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    style={{
                                      fontSize: "10px",
                                      filter: "invert(0)",
                                    }}
                                    onClick={() => removeColor(colorOption)}
                                  >
                                    <img
                                      src={x_icon}
                                      alt="remove"
                                      style={{ width: "10px", height: "10px" }}
                                    />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasVariants && (
                    <div className="detail-card mb-4">
                      <div className="customer-title bg-white d-flex justify-content-between align-items-center">
                        <h4 className="f-14 bold grey mb-0">Variant</h4>
                        <Button size="sm" onClick={handleAddOrUpdateVariant}>
                          {editingIndex !== null
                            ? "Update Variant"
                            : "Add Variant"}
                        </Button>
                      </div>

                      <div className="add-box">
                        <div className="row">
                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">Color</label>
                            <input
                              type="text"
                              className="form-control"
                              value={currentVariant.color}
                              onChange={(e: any) =>
                                setCurrentVariant({
                                  ...currentVariant,
                                  color: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">Size</label>
                            <input
                              type="text"
                              className="form-control"
                              value={currentVariant.size}
                              onChange={(e: any) =>
                                setCurrentVariant({
                                  ...currentVariant,
                                  size: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">Sizing Country</label>
                            <input
                              type="text"
                              className="form-control"
                              value={currentVariant.sizingCountry}
                              onChange={(e: any) =>
                                setCurrentVariant({
                                  ...currentVariant,
                                  sizingCountry: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">Quantity</label>
                            <input
                              type="number"
                              className="form-control"
                              value={currentVariant.quantity}
                              onChange={(e: any) =>
                                setCurrentVariant({
                                  ...currentVariant,
                                  quantity: Number(e.target.value),
                                })
                              }
                            />
                          </div>

                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">
                              Size & Fit Notes
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={currentVariant.sizeAndFitNotes}
                              onChange={(e: any) =>
                                setCurrentVariant({
                                  ...currentVariant,
                                  sizeAndFitNotes: e.target.value,
                                })
                              }
                            />
                          </div>

                          {currentVariant.listingType !== "rent" && (
                            <div className="col-12 col-md-6 mb-3">
                              <label className="form-label">
                                Selling Price
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={currentVariant.sellingPrice}
                                onChange={(e: any) =>
                                  setCurrentVariant({
                                    ...currentVariant,
                                    sellingPrice: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                          )}

                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">Cleaning Price</label>
                            <input
                              type="number"
                              className="form-control"
                              value={currentVariant.cleaningPrice}
                              onChange={(e: any) =>
                                setCurrentVariant({
                                  ...currentVariant,
                                  cleaningPrice: Number(e.target.value),
                                })
                              }
                            />
                          </div>

                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">Listing Type</label>
                            <select
                              className="form-control"
                              value={currentVariant.listingType}
                              onChange={(e: any) =>
                                setCurrentVariant({
                                  ...currentVariant,
                                  listingType: e.target.value,
                                })
                              }
                            >
                              <option value="purchase">Purchase</option>
                              <option value="rent">Rent</option>
                              <option value="both">Both</option>
                            </select>
                          </div>

                          {currentVariant.listingType !== "purchase" && (
                            <div className="col-12 mb-3">
                              <h4 className="f-14 bold grey py-2">
                                Rent Price Details
                              </h4>
                              <div className="row">
                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                  <label className="form-label">
                                    4 Day Price
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    className="form-control"
                                    value={currentVariant.rentPrice4Day || ""}
                                    onChange={(e: any) =>
                                      setCurrentVariant({
                                        ...currentVariant,
                                        rentPrice4Day: Number(e.target.value),
                                      })
                                    }
                                  />
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                  <label className="form-label">
                                    8 Day Price
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    className="form-control"
                                    value={currentVariant.rentPrice8Day || ""}
                                    onChange={(e: any) =>
                                      setCurrentVariant({
                                        ...currentVariant,
                                        rentPrice8Day: Number(e.target.value),
                                      })
                                    }
                                  />
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 mb-3">
                                  <label className="form-label">
                                    30 Day Price
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    className="form-control"
                                    value={currentVariant.rentPrice30Day || ""}
                                    onChange={(e: any) =>
                                      setCurrentVariant({
                                        ...currentVariant,
                                        rentPrice30Day: Number(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* List of Added Variants */}
                      {variants.map((variant, index) => (
                        <div
                          key={index}
                          className="p-3 mb-2 border rounded d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <p className="mb-0">
                              <b>Color:</b> {variant.color} | <b>Size:</b>{" "}
                              {variant.size} | <b>Price:</b> $
                              {variant.sellingPrice ||
                                variant.rentPrice4Day ||
                                variant.rentPrice8Day ||
                                variant.rentPrice30Day}{" "}
                              | <b>Qty:</b> {variant.quantity}
                            </p>
                          </div>
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              className="border-btn"
                              onClick={() => handleEditVariant(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              className="border-btn"
                              onClick={() => handleDeleteVariant(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="detail-card mb-4">
                    <div className="customer-title bg-white">
                      <h4 className="f-14 bold grey mb-0">
                        Delivery & Pick Up
                      </h4>
                    </div>
                    <div className="add-box">
                      <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                          <SelectField
                            control={control}
                            options={[
                              { label: "Pick-up", value: "pick-up" },
                              { label: "Express", value: "express" },
                              { label: "Both", value: "both" },
                            ]}
                            label="Shipping Option"
                            error={formState.errors["shippingOptions"]}
                            registration={{
                              ...register("shippingOptions"),
                            }}
                            handleChange={(value) =>
                              handleInputChange("shippingOptions", value)
                            }
                          />
                        </div>

                        {(formData.shippingOptions === "express" ||
                          formData.shippingOptions === "both") && (
                            <div className="col-12 col-md-6 col-lg-4">
                              <InputField
                                type="number"
                                startIcon={
                                  <img src={dollor} className="dollor-icon" />
                                }
                                label="Shipping Fee"
                                error={formState.errors["shippingPrice"]}
                                registration={{
                                  ...register("shippingPrice"),
                                }}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="listing-btns">
                    <div className="product-libtns d-flex gap-2 align-items-center justify-content-end">
                      <Button
                        className=""
                        onClick={() => navigate("/admin/product-list")}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="border-btn"
                        onClick={() => {
                          console.log(formState.errors);
                          // toast.error(formState.errors)
                        }}
                        type="submit"
                        disabled={loading}
                      >
                        {loading
                          ? "Saving..."
                          : isEdit
                            ? "Update Product"
                            : "Create Product"}
                      </Button>
                    </div>
                  </div>
                </>
              );
            }}
          </Form>
        </div>
      </div>
    </ContentWrapper>
  );
};
