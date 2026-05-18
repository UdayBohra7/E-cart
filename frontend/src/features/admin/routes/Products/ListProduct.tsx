import ContentWrapper from "@/components/Layout/ContentWrapper";
import list from "@/assets/list.png";
import camera_placeholder from "@/assets/camera_placeholder.jpg";
import dollor from "@/assets/dollor.svg";
import { Button } from "@/components/Elements";
import { Form, InputField, MultiSelect, SelectField } from "@/components/Form";
import { z } from "zod";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "@/lib/axios";
import upload from "@/assets/upload.svg";
interface Category {
  _id: string;
  name: string;
}
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
} from "@mui/material";
import { addNewProduct } from "../../apis/products/createProduct";
import { toast } from "sonner";
import { AddEditProductForm } from "./AddEditProductForm";

// export const variantSchema = z
//   .object({
//     color: z.string().optional(),
//     size: z.string().optional(),
//     sizingCountry: z.string({ required_error: "Sizing country is required" }),
//     quantity: z
//       .number({
//         required_error: "Quantity is required",
//         invalid_type_error: "Quantity must be a number",
//       })
//       .min(1, "Quantity must be greater than 0"),
//     sizeAndFitNotes: z.string().optional(),
//     sellingPrice: z
//       .number({ invalid_type_error: "Selling price must be a number" })
//       .optional(),
//     cleaningPrice: z.number().optional(),
//     listingType: z.enum(["rent", "purchase", "both"]),
//     rentPrice4Day: z.coerce.number().optional(),
//     rentPrice8Day: z.coerce.number().optional(),
//     rentPrice30Day: z.coerce.number().optional(),
//     selectedDaysAndPrices: z.array(z.string()).optional(),
//   })
//   .refine(
//     (data) => {
//       if (data.listingType === "rent") {
//         return (
//           (data.rentPrice4Day && data.rentPrice4Day > 0) ||
//           (data.rentPrice8Day && data.rentPrice8Day > 0) ||
//           (data.rentPrice30Day && data.rentPrice30Day > 0)
//         );
//       }
//       return true;
//     },
//     {
//       message:
//         "For Rent, at least one rent price (4, 8, or 30 days) is required",
//       path: ["listingType"],
//     }
//   )
//   .refine(
//     (data) => {
//       if (data.listingType === "purchase") {
//         return data.sellingPrice !== undefined && data.sellingPrice > 0;
//       }
//       return true;
//     },
//     {
//       message: "For Purchase, Selling Price is required",
//       path: ["sellingPrice"],
//     }
//   )
//   .refine(
//     (data) => {
//       if (data.listingType === "both") {
//         const hasSellingPrice =
//           data.sellingPrice !== undefined && data.sellingPrice > 0;
//         const hasRentPrice =
//           (data.rentPrice4Day && data.rentPrice4Day > 0) ||
//           (data.rentPrice8Day && data.rentPrice8Day > 0) ||
//           (data.rentPrice30Day && data.rentPrice30Day > 0);
//         return hasSellingPrice && hasRentPrice;
//       }
//       return true;
//     },
//     {
//       message:
//         "For Both, Selling Price and at least one Rent Price (4, 8, or 30 days) are required",
//       path: ["listingType"],
//     }
//   );

// const schema = z
//   .object({
//     name: z.string().min(1, "Product name is required"),
//     category: z.string().min(1, "Category is required"),
//     designerName: z.string().optional(),
//     description: z.string().optional(),
//     productStyle: z.string().optional(),
//     occasions: z.array(z.string()).optional(),
//     listingType: z.enum(["rent", "purchase", "both"]).optional(),
//     rentPrice4Day: z.coerce.number().optional(),
//     rentPrice8Day: z.coerce.number().optional(),
//     rentPrice30Day: z.coerce.number().optional(),
//     selectedDaysAndPrices: z.array(z.string()).optional(),
//     shippingOptions: z.enum(["pick-up", "express", "both"]),
//     pickUpAddress: z.string().optional(),
//     sizeAndFitNotes: z.string().optional(),
//     shippingPrice: z.coerce.number().optional(),
//     sellingPrice: z.coerce.number().optional(),
//     cleaningPrice: z.coerce.number().optional(),
//     quantity: z.coerce.number().min(0).optional(),
//     hasVariants: z.boolean().optional(),
//   })
//   .refine(
//     (data) => {
//       if (data.listingType === "rent") {
//         return (
//           (data.rentPrice4Day && data.rentPrice4Day > 0) ||
//           (data.rentPrice8Day && data.rentPrice8Day > 0) ||
//           (data.rentPrice30Day && data.rentPrice30Day > 0)
//         );
//       }
//       return true;
//     },
//     {
//       message:
//         "For Rent, at least one rent price (4, 8, or 30 days) is required",
//       path: ["listingType"],
//     }
//   )
//   .refine(
//     (data) => {
//       if (data.listingType === "purchase") {
//         return data.sellingPrice !== undefined && data.sellingPrice > 0;
//       }
//       return true;
//     },
//     {
//       message: "For Purchase, Selling Price is required",
//       path: ["sellingPrice"],
//     }
//   )
//   .refine(
//     (data) => {
//       if (data.listingType === "both") {
//         const hasSellingPrice =
//           data.sellingPrice !== undefined && data.sellingPrice > 0;
//         const hasRentPrice =
//           (data.rentPrice4Day && data.rentPrice4Day > 0) ||
//           (data.rentPrice8Day && data.rentPrice8Day > 0) ||
//           (data.rentPrice30Day && data.rentPrice30Day > 0);
//         return hasSellingPrice && hasRentPrice;
//       }
//       return true;
//     },
//     {
//       message:
//         "For Both, Selling Price and at least one Rent Price (4, 8, or 30 days) are required",
//       path: ["listingType"],
//     }
//   );

// type ProductValues = {
//   name: string;
//   category: string;
//   designerName?: string;
//   description?: string;
//   productStyle?: string;
//   images?: string[];
//   variants?: z.infer<typeof variantSchema>[];
//   occasions?: string[];
//   listingType: "rent" | "purchase" | "both";
//   selectedDaysAndPrices?: {
//     days: string;
//     price: number;
//   }[];
//   shippingOptions: "pick-up" | "express" | "both";
//   pickUpAddress?: string;
//   sizingCountry?: string;
//   sizeAndFitNotes?: string;
//   shippingPrice?: number;
//   sellingPrice?: number;
//   cleaningPrice: number;
//   quantity?: number;
//   hasVariants?: boolean;
// };

// interface UploadedImage {
//   preview: string;
//   url?: string;
// }

export const ListProduct = () => {
  // const navigate = useNavigate();
  // const [hasVariants, setHasVariants] = useState(false);
  // const [creating, setCreating] = useState(false);
  // const [categories, setCategories] = useState<any[]>([]);
  // const [occasions, setOccasions] = useState<any[]>([]);
  // const [variants, setVariants] = useState<z.infer<typeof variantSchema>[]>([]);
  // const [currentVariant, setCurrentVariant] = useState<any>({
  //   color: "",
  //   size: "",
  //   sizingCountry: "",
  //   quantity: 0,
  //   sizeAndFitNotes: "",
  //   sellingPrice: 0,
  //   cleaningPrice: 0,
  //   listingType: "rent",
  //   selectedDaysAndPrices: [],
  // });
  // const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // const [formData, setFormData] = useState({
  //   name: "",
  //   designerName: "",
  //   description: "",
  //   sellingPrice: "",
  //   rentPrice4Day: "",
  //   quantity: "",
  //   rentPrice8Day: "",
  //   sizes: [] as string[],
  //   colors: [] as string[],
  //   listingType: "rent" as "rent" | "purchase" | "both",
  //   category: "",
  //   shippingOptions: "pick-up" as "pick-up" | "express" | "both",
  //   pickUpAddress: "",
  // });
  // const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [images, setImages] = useState<UploadedImage[]>([]);

  // const handleClick = () => {
  //   fileInputRef.current?.click();
  // };

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const files = Array.from(e.target.files);

  //     for (const file of files) {
  //       const previewUrl = URL.createObjectURL(file);

  //       const newImage: UploadedImage = { preview: previewUrl };
  //       setImages((prev) => [...prev, newImage]);

  //       try {
  //         const formData = new FormData();
  //         formData.append("file", file);

  //         const response = await axios.post("/app/upload-file", formData, {
  //           headers: { "Content-Type": "multipart/form-data" },
  //         });

  //         const fileUrl = response.data;

  //         setImages((prev) =>
  //           prev.map((img) =>
  //             img.preview === previewUrl ? { ...img, url: fileUrl } : img
  //           )
  //         );
  //       } catch (error) {
  //         console.error("Upload failed", error);
  //       }
  //     }
  //   }
  // };

  // const handleInputChange = (field: string, value: any) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  // const handleSubmit = async (data: any) => {
  //   console.log({ data });
  //   debugger;
  //   setCreating(true);
  //   try {
  //     const productImages = images.map((e) => e.url);
  //     const productData = {
  //       name: data.name,
  //       images: productImages,
  //       category: data.category,
  //       designerName: data.designerName,
  //       quantity: data.quantity || 1,
  //       description: data.description,
  //       listingType: data.listingType || "rent",
  //       shippingOptions: data.shippingOptions,
  //       sellingPrice: data.sellingPrice
  //         ? parseFloat(data.sellingPrice)
  //         : undefined,
  //       pickUpAddress: data.pickUpAddress,
  //       selectedDaysAndPrices: [
  //         ...(data.rentPrice4Day
  //           ? [{ days: "4", price: parseFloat(data.rentPrice4Day) }]
  //           : []),
  //         ...(data.rentPrice8Day
  //           ? [{ days: "8", price: parseFloat(data.rentPrice8Day) }]
  //           : []),
  //       ],
  //       variant: [
  //         ...(data?.sizes?.length > 0
  //           ? [{ type: "size", value: data.sizes }]
  //           : []),
  //         ...(data?.colors?.length > 0
  //           ? [{ type: "color", value: data.colors }]
  //           : []),
  //       ],
  //     };
  //     console.log(" productData : ", { productData });
  //     await addNewProduct(productData);
  //     toast.success("Product created successfully!");
  //     navigate("/admin/product-list");
  //   } catch (error) {
  //     console.error("Error creating product:", error);
  //     toast.error("Failed to create product");
  //   } finally {
  //     setCreating(false);
  //   }
  // };

  // const handleAddOrUpdateVariant = () => {
  //   try {
  //     const validated = variantSchema.parse(currentVariant);
  //     if (editingIndex !== null) {
  //       const updated = [...variants];
  //       updated[editingIndex] = validated;
  //       setVariants(updated);
  //       setEditingIndex(null);
  //       toast.success("Variant updated successfully");
  //     } else {
  //       setVariants((prev) => [...prev, validated]);
  //       toast.success("Variant added successfully");
  //     }

  //     setCurrentVariant({
  //       color: "",
  //       size: "",
  //       sizingCountry: "",
  //       quantity: 0,
  //       sizeAndFitNotes: "",
  //       sellingPrice: 0,
  //       cleaningPrice: 0,
  //       listingType: "rent",
  //       selectedDaysAndPrices: [],
  //     });
  //   } catch (err: any) {
  //     toast.error(err?.errors?.[0]?.message || "Invalid variant data");
  //   }
  // };

  // const handleEditVariant = (index: number) => {
  //   setCurrentVariant(variants[index]);
  //   setEditingIndex(index);
  // };

  // const handleDeleteVariant = (index: number) => {
  //   setVariants((prev) => prev.filter((_, i) => i !== index));
  //   if (editingIndex === index) {
  //     setEditingIndex(null);
  //     setCurrentVariant({
  //       color: "",
  //       size: "",
  //       sizingCountry: "",
  //       quantity: 0,
  //       sizeAndFitNotes: "",
  //       sellingPrice: 0,
  //       cleaningPrice: 0,
  //       listingType: "rent",
  //       selectedDaysAndPrices: [],
  //     });
  //   }
  // };

  // const fetchCategories = async () => {
  //   try {
  //     const response = await axios.get("/categories");
  //     const data = response?.data?.map((ele: any) => ({
  //       label: ele?.name,
  //       value: ele?._id,
  //     }));
  //     setCategories(data || []);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };
  // const fetchOccasions = async () => {
  //   try {
  //     const res = await getOccasions();
  //     const data = res.map((ele: any) => ({
  //       label: ele?.title,
  //       value: ele?._id,
  //     }));
  //     setOccasions(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   fetchCategories();
  //   fetchOccasions();
  // }, []);

  return (
    <AddEditProductForm isEdit={false} />
    // <ContentWrapper title="List Product">
    //   <h3 className="pb-3 f-20">List a Product </h3>
    //   <div className="row product-lisitng mb-4">
    //     <div className="col-12 col-md-4 col-xxl-3 mb-3">
    //       <div className="list-pro-box p-4 rounded-lg bg-white rounded-lg">
    //         <img src={images[0]?.url || images[0]?.preview || camera_placeholder} className="w-100 list-product" />
    //         <p className="f-18 semi-bold mt-2 txt">
    //           {formData.name || "Product Name"}{" "}
    //           <span className="f-14">
    //             (
    //             {categories.find((c) => c?.value === formData.category)
    //               ?.label || "Category"}
    //             )
    //           </span>
    //         </p>
    //         {(formData.listingType === "rent" ||
    //           formData.listingType === "both") && (
    //             <>
    //               <p className="f-14 mb-1 semi-bold txt">Rent Price :</p>
    //               <p className="d-flex txt gap-3 f-18 semi-bold">
    //                 <span className="text-black">
    //                   ${formData.rentPrice4Day || "0"}
    //                 </span>{" "}
    //                 <span className="f-12">(4 Days)</span>
    //               </p>
    //               <p className="d-flex txt gap-3 f-18 semi-bold">
    //                 <span className="text-black">
    //                   ${formData.rentPrice8Day || "0"}
    //                 </span>{" "}
    //                 <span className="f-12">(8 Days)</span>
    //               </p>
    //             </>
    //           )}

    //         {(formData.listingType === "purchase" ||
    //           formData.listingType === "both") && (
    //             <>
    //               <p className="f-14 mb-1 semi-bold txt">Buy Price :</p>
    //               <p className="d-flex txt gap-3 f-18 semi-bold">
    //                 <span className="text-black">
    //                   ${formData.sellingPrice || "0"}
    //                 </span>{" "}
    //                 <span className="f-12">(Selling Price)</span>
    //               </p>
    //             </>
    //           )}

    //         <p className="f-14 mb-1 semi-bold txt">Size :</p>
    //         <div className="size-cahrt d-flex gap-3 flex-wrap align-items-center">
    //           {formData.sizes.length > 0 ? (
    //             formData.sizes.map((size, index) => (
    //               <span key={index} className="px-3 py-2 rounded-lg graybg">
    //                 {size}
    //               </span>
    //             ))
    //           ) : (
    //             <span className="px-3 py-2 rounded-lg graybg">
    //               No sizes selected
    //             </span>
    //           )}
    //         </div>

    //         <p className="f-14 mb-1 semi-bold txt mt-3">Colors :</p>
    //         <div className="size-cahrt d-flex gap-3 flex-wrap align-items-center">
    //           {formData.colors.length > 0 ? (
    //             formData.colors.map((color, index) => (
    //               <span key={index} className="px-3 py-2 rounded-lg graybg">
    //                 {color}
    //               </span>
    //             ))
    //           ) : (
    //             <span className="px-3 py-2 rounded-lg graybg">
    //               No colors selected
    //             </span>
    //           )}
    //         </div>
    //         {/* <div className="product-listed d-flex align-items-center gap-2 txt f-14 my-3">
    //           <Checkbox value={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} className="p-0" />
    //           <span>Is this product contains variants?</span>
    //         </div> */}

    //         <p className="f-16 mb-1 semi-bold txt mt-3">Description :</p>
    //         <p className="f-14 txt">
    //           {formData.description || "No description provided"}
    //         </p>
    //         {/* <div className="product-libtns d-flex gap-2 align-items-center">
    //           <Button
    //             className="border-btn"

    //             disabled={creating || !formData.name || !formData.category}
    //           >
    //             {creating ? "Creating..." : "Create Product"}
    //           </Button>
    //           <Button
    //             className=""
    //             onClick={() => navigate("/admin/product-list")}
    //           >
    //             Cancel
    //           </Button>
    //         </div> */}
    //       </div>
    //     </div>

    //     <div className="col-12 col-md-8 col-xxl-9 mb-3">
    //       <Form<ProductValues, typeof schema>
    //         onSubmit={handleSubmit}
    //         schema={schema}
    //       >
    //         {({ register, formState, control }) => (
    //           <>
    //             <div className="detail-card bg-white mb-4">
    //               <div className="customer-title bg-white">
    //                 <h4 className="f-14 bold grey mb-0">Add Product Photo</h4>
    //               </div>
    //               <div
    //                 className="add-box"
    //                 onClick={handleClick}
    //                 style={{ cursor: "pointer" }}
    //               >
    //                 {/* Uploaded image previews */}
    //                 <div className="row g-3 mb-3">
    //                   {images.map((img, idx) => (
    //                     <div className="col-4 col-md-3" key={idx}>
    //                       <img
    //                         src={img.url || img.preview}
    //                         alt={`preview-${idx}`}
    //                         className="img-fluid rounded"
    //                       />
    //                     </div>
    //                   ))}
    //                 </div>

    //                 <div className="dropbox text-center">
    //                   <div className="dropbox-images relative mb-4">
    //                     <img
    //                       src={upload}
    //                       className="dropbox-upload"
    //                       alt="Upload Icon"
    //                     />
    //                   </div>
    //                   <h4 className="f-24 bold">
    //                     Drop your images here,{" "}
    //                     <span className="light">or click to browse</span>
    //                   </h4>
    //                   <p className="f-14 txt">
    //                     1600 x 1200 (4:3) recommended. PNG, JPG and GIF files
    //                     are allowed
    //                   </p>
    //                 </div>

    //                 {/* Hidden input */}
    //                 <input
    //                   type="file"
    //                   accept="image/png, image/jpeg, image/gif"
    //                   multiple
    //                   className="d-none"
    //                   ref={fileInputRef}
    //                   onChange={handleFileChange}
    //                 />
    //               </div>
    //             </div>
    //             <div className="detail-card mb-4">
    //               <div className="customer-title bg-white">
    //                 <h4 className="f-14 bold grey mb-0">Product Information</h4>
    //               </div>
    //               <div className="add-box">
    //                 <div className="row">
    //                   <div className="col-12 col-md-6">
    //                     <InputField
    //                       type="text"
    //                       label="Name Of Item"
    //                       onChange={(e: any) => {
    //                         handleInputChange("name", e.target.value)
    //                       }}
    //                       error={formState.errors["name"]}
    //                       registration={{
    //                         ...register("name"),
    //                       }}
    //                     />
    //                   </div>
    //                   <div className="col-12 select-role col-md-6">
    //                     <SelectField
    //                       options={categories}
    //                       control={control}
    //                       label="Product Category"
    //                       error={formState.errors["category"]}
    //                       handleChange={(value) => handleInputChange("category", value)}
    //                       registration={{
    //                         ...register("category"),
    //                       }}
    //                     />
    //                     {/* <label className="form-label">Product Category</label>
    //                     <select
    //                       className="form-control"
    //                       value={formData.category}
    //                       onChange={(e) =>
    //                         handleInputChange("category", e.target.value)
    //                       }
    //                     >
    //                       <option value="">Choose a category</option>
    //                       {categories.map((cat) => (
    //                         <option key={cat._id} value={cat._id}>
    //                           {cat.name}
    //                         </option>
    //                       ))}
    //                     </select>
    //                     {formState.errors["category"] && (
    //                       <div className="text-danger">
    //                         {formState.errors["category"]?.message}
    //                       </div>
    //                     )} */}
    //                   </div>
    //                 </div>
    //                 <div className="row">
    //                   <div className="col-12 col-md-6">
    //                     <InputField
    //                       type="text"
    //                       label="Designer Name"
    //                       error={formState.errors["designerName"]}
    //                       registration={{
    //                         ...register("designerName"),
    //                       }}
    //                     />
    //                   </div>
    //                   <div className="col-12 col-md-6">
    //                     <MultiSelect
    //                       control={control}
    //                       options={occasions}
    //                       label="Occasions"
    //                       error={formState.errors["occasions"]}
    //                       registration={{
    //                         ...register("occasions"),
    //                       }}
    //                     />
    //                   </div>
    //                 </div>
    //                 <div className="row">
    //                   {!hasVariants && (
    //                     <>
    //                       <div className="col-12 col-md-6">
    //                         <InputField
    //                           type="number"
    //                           startIcon={
    //                             <img src={dollor} className="dollor-icon" />
    //                           }
    //                           label="Selling Price"
    //                           error={formState.errors["sellingPrice"]}
    //                           registration={{
    //                             ...register("sellingPrice"),
    //                           }}
    //                         />
    //                       </div>
    //                       <div className="col-12 col-md-6 col-lg-6">
    //                         <InputField
    //                           type="number"
    //                           label="Quantity"
    //                           error={formState.errors["quantity"]}
    //                           registration={register("quantity")}
    //                         />
    //                       </div>
    //                       <div className="col-12 col-md-6">
    //                         <label className="form-label">Sizes</label>
    //                         <div className="d-flex gap-2 flex-wrap">
    //                           {["XS", "S", "M", "L", "XL", "XXL"].map(
    //                             (sizeOption) => (
    //                               <label
    //                                 key={sizeOption}
    //                                 className="form-check-label"
    //                               >
    //                                 <input
    //                                   type="checkbox"
    //                                   className="form-check-input me-1"
    //                                   checked={formData.sizes.includes(
    //                                     sizeOption
    //                                   )}
    //                                   onChange={(e) => {
    //                                     if (e.target.checked) {
    //                                       handleInputChange("sizes", [
    //                                         ...formData.sizes,
    //                                         sizeOption,
    //                                       ]);
    //                                     } else {
    //                                       handleInputChange(
    //                                         "sizes",
    //                                         formData.sizes.filter(
    //                                           (s) => s !== sizeOption
    //                                         )
    //                                       );
    //                                     }
    //                                   }}
    //                                 />
    //                                 {sizeOption}
    //                               </label>
    //                             )
    //                           )}
    //                         </div>
    //                       </div>
    //                       <div className="col-12 col-md-6">
    //                         <label className="form-label">Colors</label>
    //                         <div className="d-flex gap-2 flex-wrap">
    //                           {[
    //                             "Black",
    //                             "White",
    //                             "Red",
    //                             "Blue",
    //                             "Green",
    //                             "Yellow",
    //                           ].map((colorOption) => (
    //                             <label
    //                               key={colorOption}
    //                               className="form-check-label"
    //                             >
    //                               <input
    //                                 type="checkbox"
    //                                 className="form-check-input me-1"
    //                                 checked={formData.colors.includes(
    //                                   colorOption
    //                                 )}
    //                                 onChange={(e) => {
    //                                   if (e.target.checked) {
    //                                     handleInputChange("colors", [
    //                                       ...formData.colors,
    //                                       colorOption,
    //                                     ]);
    //                                   } else {
    //                                     handleInputChange(
    //                                       "colors",
    //                                       formData.colors.filter(
    //                                         (c) => c !== colorOption
    //                                       )
    //                                     );
    //                                   }
    //                                 }}
    //                               />
    //                               {colorOption}
    //                             </label>
    //                           ))}
    //                         </div>
    //                       </div>
    //                     </>
    //                   )}

    //                   <div className="col-12 area-ip col-md-12">
    //                     <label className="form-label">Description</label>
    //                     <TextareaAutosize
    //                       aria-label="minimum height"
    //                       minRows={3}
    //                       className="w-100"
    //                       placeholder="Enter product description"
    //                       style={{ width: "100%" }}
    //                       onChange={(e) =>
    //                         handleInputChange("description", e.target.value)
    //                       }
    //                       value={formData.description}
    //                     />
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>

    //             {hasVariants && (
    //               <div className="detail-card mb-4">
    //                 <div className="customer-title bg-white d-flex justify-content-between align-items-center">
    //                   <h4 className="f-14 bold grey mb-0">Variant</h4>
    //                   <Button size="sm" onClick={handleAddOrUpdateVariant}>
    //                     {editingIndex !== null
    //                       ? "Update Variant"
    //                       : "Add Variant"}
    //                   </Button>
    //                 </div>

    //                 <div className="add-box">
    //                   <div className="row">
    //                     <div className="col-12 col-md-6 mb-3">
    //                       <label className="form-label">Color</label>
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         value={currentVariant.color}
    //                         onChange={(e: any) =>
    //                           setCurrentVariant({
    //                             ...currentVariant,
    //                             color: e.target.value,
    //                           })
    //                         }
    //                       />
    //                     </div>

    //                     <div className="col-12 col-md-6 mb-3">
    //                       <label className="form-label">Size</label>
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         value={currentVariant.size}
    //                         onChange={(e: any) =>
    //                           setCurrentVariant({
    //                             ...currentVariant,
    //                             size: e.target.value,
    //                           })
    //                         }
    //                       />
    //                     </div>

    //                     <div className="col-12 col-md-6 mb-3">
    //                       <label className="form-label">Sizing Country</label>
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         value={currentVariant.sizingCountry}
    //                         onChange={(e: any) =>
    //                           setCurrentVariant({
    //                             ...currentVariant,
    //                             sizingCountry: e.target.value,
    //                           })
    //                         }
    //                       />
    //                     </div>

    //                     <div className="col-12 col-md-6 mb-3">
    //                       <label className="form-label">Quantity</label>
    //                       <input
    //                         type="number"
    //                         className="form-control"
    //                         value={currentVariant.quantity}
    //                         onChange={(e: any) =>
    //                           setCurrentVariant({
    //                             ...currentVariant,
    //                             quantity: Number(e.target.value),
    //                           })
    //                         }
    //                       />
    //                     </div>

    //                     <div className="col-12 col-md-6 mb-3">
    //                       <label className="form-label">Size & Fit Notes</label>
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         value={currentVariant.sizeAndFitNotes}
    //                         onChange={(e: any) =>
    //                           setCurrentVariant({
    //                             ...currentVariant,
    //                             sizeAndFitNotes: e.target.value,
    //                           })
    //                         }
    //                       />
    //                     </div>

    //                     <div className="col-12 col-md-6 mb-3">
    //                       <label className="form-label">Selling Price</label>
    //                       <input
    //                         type="number"
    //                         className="form-control"
    //                         value={currentVariant.sellingPrice}
    //                         onChange={(e: any) =>
    //                           setCurrentVariant({
    //                             ...currentVariant,
    //                             sellingPrice: Number(e.target.value),
    //                           })
    //                         }
    //                       />
    //                     </div>

    //                     <div className="col-12 col-md-6 mb-3">
    //                       <label className="form-label">Cleaning Price</label>
    //                       <input
    //                         type="number"
    //                         className="form-control"
    //                         value={currentVariant.cleaningPrice}
    //                         onChange={(e: any) =>
    //                           setCurrentVariant({
    //                             ...currentVariant,
    //                             cleaningPrice: Number(e.target.value),
    //                           })
    //                         }
    //                       />
    //                     </div>

    //                     <div className="col-12 col-md-6 mb-3">
    //                       <label className="form-label">Listing Type</label>
    //                       <select
    //                         className="form-control"
    //                         value={currentVariant.listingType}
    //                         onChange={(e: any) =>
    //                           setCurrentVariant({
    //                             ...currentVariant,
    //                             listingType: e.target.value,
    //                           })
    //                         }
    //                       >
    //                         <option value="rent">Rent</option>
    //                         <option value="purchase">Purchase</option>
    //                         <option value="both">Both</option>
    //                       </select>
    //                     </div>

    //                     <div className="col-12 mb-3">
    //                       <h4 className="f-14 bold grey py-2">
    //                         Rent Price Details
    //                       </h4>
    //                       <div className="row">
    //                         <div className="col-12 col-md-6 col-lg-4 mb-3">
    //                           <label className="form-label">4 Day Price</label>
    //                           <input
    //                             type="number"
    //                             min={1}
    //                             className="form-control"
    //                             value={currentVariant.rentPrice4Day || ""}
    //                             onChange={(e: any) =>
    //                               setCurrentVariant({
    //                                 ...currentVariant,
    //                                 rentPrice4Day: Number(e.target.value),
    //                               })
    //                             }
    //                           />
    //                         </div>

    //                         <div className="col-12 col-md-6 col-lg-4 mb-3">
    //                           <label className="form-label">8 Day Price</label>
    //                           <input
    //                             type="number"
    //                             min={1}
    //                             className="form-control"
    //                             value={currentVariant.rentPrice8Day || ""}
    //                             onChange={(e: any) =>
    //                               setCurrentVariant({
    //                                 ...currentVariant,
    //                                 rentPrice8Day: Number(e.target.value),
    //                               })
    //                             }
    //                           />
    //                         </div>

    //                         <div className="col-12 col-md-6 col-lg-4 mb-3">
    //                           <label className="form-label">30 Day Price</label>
    //                           <input
    //                             type="number"
    //                             min={1}
    //                             className="form-control"
    //                             value={currentVariant.rentPrice30Day || ""}
    //                             onChange={(e: any) =>
    //                               setCurrentVariant({
    //                                 ...currentVariant,
    //                                 rentPrice30Day: Number(e.target.value),
    //                               })
    //                             }
    //                           />
    //                         </div>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>

    //                 {/* List of Added Variants */}
    //                 {variants.map((variant, index) => (
    //                   <div
    //                     key={index}
    //                     className="p-3 mb-2 border rounded d-flex justify-content-between align-items-center"
    //                   >
    //                     <div>
    //                       <p className="mb-0">
    //                         <b>Color:</b> {variant.color} | <b>Size:</b>{" "}
    //                         {variant.size} | <b>Price:</b> $
    //                         {variant.sellingPrice} | <b>Qty:</b>{" "}
    //                         {variant.quantity}
    //                       </p>
    //                     </div>
    //                     <div className="d-flex gap-2">
    //                       <Button
    //                         size="sm"
    //                         className="border-btn"
    //                         onClick={() => handleEditVariant(index)}
    //                       >
    //                         Edit
    //                       </Button>
    //                       <Button
    //                         size="sm"
    //                         className="border-btn"
    //                         onClick={() => handleDeleteVariant(index)}
    //                       >
    //                         Delete
    //                       </Button>
    //                     </div>
    //                   </div>
    //                 ))}
    //               </div>
    //             )}

    //             <div className="detail-card mb-4">
    //               <div className="customer-title bg-white">
    //                 <h4 className="f-14 bold grey mb-0">Delivery & Pick Up</h4>
    //               </div>
    //               <div className="add-box">
    //                 <div className="row">
    //                   <div className="col-12 col-md-6 col-lg-4">
    //                     <SelectField
    //                       control={control}
    //                       options={[
    //                         { label: "Pick-up", value: "pick-up" },
    //                         { label: "Express", value: "express" },
    //                         { label: "Both", value: "both" },
    //                       ]}
    //                       label="Shipping Option"
    //                       error={formState.errors["shippingOptions"]}
    //                       registration={{
    //                         ...register("shippingOptions"),
    //                       }}
    //                     />
    //                   </div>
    //                   <div className="col-12 col-md-6 col-lg-4">
    //                     <InputField
    //                       type="text"
    //                       label="Pick Up Address"
    //                       error={formState.errors["pickUpAddress"]}
    //                       registration={{
    //                         ...register("pickUpAddress"),
    //                       }}
    //                     />
    //                   </div>
    //                   <div className="col-12 col-md-6 col-lg-4">
    //                     <InputField
    //                       type="number"
    //                       startIcon={
    //                         <img src={dollor} className="dollor-icon" />
    //                       }
    //                       label="Shipping Fee"
    //                       error={formState.errors["shippingPrice"]}
    //                       registration={{
    //                         ...register("shippingPrice"),
    //                       }}
    //                     />
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>

    //             <div className="listing-btns">
    //               <div className="product-libtns d-flex gap-2 align-items-center justify-content-end">
    //                 <Button
    //                   className=""
    //                   onClick={() => navigate("/admin/product-list")}
    //                 >
    //                   Cancel
    //                 </Button>
    //                 <Button
    //                   className="border-btn"
    //                   onClick={() => {
    //                     console.log(formState.errors);
    //                   }}
    //                   type="submit"
    //                   disabled={creating}
    //                 >
    //                   {creating ? "Creating..." : "Create Product"}
    //                 </Button>
    //               </div>
    //             </div>
    //           </>
    //         )}
    //       </Form>
    //     </div>
    //   </div>
    // </ContentWrapper>
  );
};
