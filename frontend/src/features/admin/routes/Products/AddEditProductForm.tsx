import ContentWrapper from "@/components/Layout/ContentWrapper";
import camera_placeholder from "@/assets/camera_placeholder.jpg";
import dollor from "@/assets/dollor.svg";
import x_icon from "@/assets/x-icon.png";
import { Button } from "@/components/Elements";
import { Form, InputField, SelectField } from "@/components/Form";
import { z } from "zod";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "@/lib/axios";
import upload from "@/assets/upload.svg";
import { toast } from "sonner";
import { updateProduct } from "../../apis/product";
import { getCategories } from "../../apis/category";
import { addNewProduct } from "../../apis/products/createProduct";

const schema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock must be 0 or greater"),
  description: z.string().min(1, "Description is required"),
});

type ProductValues = {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
};

interface UploadedImage {
  preview: string;
  url?: string;
}

interface Props {
  isEdit: boolean;
  data?: any;
}

export const AddEditProductForm = ({ isEdit = false, data }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

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
          toast.error("Failed to upload image");
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

  const handleRemoveImage = (e: any, index: number) => {
    e?.stopPropagation();
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories({});
      const data = response?.results?.map((ele: any) => ({
        label: ele?.name,
        value: ele?._id || ele?.id?.toString(),
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
    if (isEdit && data) {
      let parsedImages: string[] = [];
      if (data.images) {
        try {
          if (data.images.startsWith("[")) {
            parsedImages = JSON.parse(data.images);
          } else {
            parsedImages = data.images.split(",");
          }
        } catch (e) {
          parsedImages = [data.images];
        }
      }
      setImages(
        parsedImages.map((e: any) => ({
          preview: e,
          url: e,
        }))
      );

      const categoryVal = data.categoryId?.toString() || data.category?.id?.toString() || data.category?._id || "";

      setFormData({
        name: data.name || "",
        category: categoryVal,
        price: data.price || "",
        stock: data.stock !== undefined ? data.stock.toString() : "",
        description: data.description || "",
      });
    }
  }, [data, isEdit]);

  const defaultValues = useMemo(() => {
    if (isEdit && data) {
      const categoryVal = data.categoryId?.toString() || data.category?.id?.toString() || data.category?._id || "";
      return {
        name: data.name || "",
        category: categoryVal,
        price: data.price ? Number(data.price) : 0,
        stock: data.stock !== undefined ? Number(data.stock) : 0,
        description: data.description || "",
      };
    }
    return {
      name: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
    };
  }, [data, isEdit]);

  const handleSubmit = async (values: ProductValues) => {
    setLoading(true);
    try {
      const productImages = images.map((e) => e.url).filter(Boolean);
      const productData = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        stock: Number(values.stock),
        categoryId: Number(values.category),
        images: JSON.stringify(productImages),
      };

      if (isEdit) {
        await updateProduct(data?._id || data?.id?.toString(), productData);
        toast.success("Product updated successfully");
      } else {
        await addNewProduct(productData);
        toast.success("Product created successfully!");
      }
      navigate("/admin/product-list");
    } catch (error) {
      console.error("Error creating/updating product:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentWrapper title={isEdit ? "Edit Product" : "List Product"}>
      <h3 className="pb-3 f-20">{isEdit ? "Edit Product" : "List a Product"}</h3>
      <div className="row product-lisitng mb-4">
        {/* Left Side: Preview Card */}
        <div className="col-12 col-md-4 col-xxl-3 mb-3">
          <div className="list-pro-box p-4 bg-white rounded-lg border">
            <img
              src={
                images?.length
                  ? images[0]?.url || images[0]?.preview
                  : camera_placeholder
              }
              className="w-100 list-product rounded-lg"
              style={{ height: "200px", objectFit: "cover" }}
              alt="Product Preview"
            />
            <p className="f-18 semi-bold mt-3 txt text-dark">
              {formData.name || "Product Name"}{" "}
              <span className="f-14 text-muted">
                (
                {categories.find((c) => c?.value === formData.category)
                  ?.label || "Category"}
                )
              </span>
            </p>
            <p className="f-14 mb-1 semi-bold txt text-muted">Price :</p>
            <p className="d-flex txt gap-3 f-18 semi-bold mb-3">
              <span className="text-primary font-bold">
                ${formData.price || "0.00"}
              </span>
            </p>

            <p className="f-14 mb-1 semi-bold txt text-muted">Stock :</p>
            <p className="d-flex txt gap-3 f-18 semi-bold mb-3">
              <span className="text-dark font-medium">
                {formData.stock || "0"}
              </span>
            </p>

            <p className="f-16 mb-1 semi-bold txt text-muted">Description :</p>
            <p className="f-14 txt text-secondary text-truncate" style={{ maxWidth: "100%" }}>
              {formData.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Right Side: Form Fields */}
        <div className="col-12 col-md-8 col-xxl-9 mb-3">
          <Form<ProductValues, typeof schema>
            onSubmit={handleSubmit}
            schema={schema}
            options={{ defaultValues }}
          >
            {({ register, formState, control }) => {
              return (
                <>
                  {/* Photo Uploader Card */}
                  <div className="detail-card bg-white mb-4 border rounded p-4">
                    <div className="customer-title mb-3">
                      <h4 className="f-14 bold grey mb-0">Add Product Photos</h4>
                    </div>
                    <div
                      className="add-box border rounded p-4 text-center"
                      onClick={handleClick}
                      style={{ cursor: "pointer", borderStyle: "dashed" }}
                    >
                      {images?.length ? (
                        <div className="row g-3 mb-3">
                          {images.map((img, idx) => (
                            <div className="col-4 col-md-3" key={idx} onClick={(e) => e.stopPropagation()}>
                              <div className="relative list-product-col border rounded p-1">
                                <img
                                  src={img.url || img.preview}
                                  alt={`preview-${idx}`}
                                  className="img-fluid rounded"
                                  style={{ height: "100px", width: "100%", objectFit: "cover" }}
                                />
                                <button
                                  className="absolute top-0 right-0 btn btn-sm btn-danger p-1 rounded-circle"
                                  onClick={(e) => handleRemoveImage(e, idx)}
                                  style={{ transform: "translate(25%, -25%)", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <div className="dropbox text-center">
                        <div className="dropbox-images relative mb-2 text-center">
                          <img
                            src={upload}
                            className="dropbox-upload mx-auto"
                            alt="Upload Icon"
                            style={{ width: "48px" }}
                          />
                        </div>
                        <h4 className="f-20 bold">
                          Drop your images here,{" "}
                          <span className="light">or click to browse</span>
                        </h4>
                        <p className="f-12 txt text-muted">
                          PNG, JPG and GIF files are allowed
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

                  {/* Details Card */}
                  <div className="detail-card mb-4 border rounded p-4 bg-white">
                    <div className="customer-title mb-3">
                      <h4 className="f-14 bold grey mb-0">
                        Product Details
                      </h4>
                    </div>
                    <div className="add-box">
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <InputField
                            type="text"
                            label="Product Name"
                            error={formState.errors["name"]}
                            registration={{
                              ...register("name"),
                              onChange: (e: any) => {
                                handleInputChange("name", e.target.value);
                              },
                            }}
                          />
                        </div>
                        <div className="col-12 select-role col-md-6">
                          <SelectField
                            options={categories}
                            control={control}
                            label="Product Category"
                            error={formState.errors["category"]}
                            registration={{
                              ...register("category"),
                              onChange: (e: any) => {
                                handleInputChange("category", e.target.value);
                              },
                            }}
                          />
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col-12 col-md-6">
                          <InputField
                            type="number"
                            startIcon={
                              <img src={dollor} className="dollor-icon" alt="dollar" />
                            }
                            label="Price ($)"
                            error={formState.errors["price"]}
                            registration={{
                              ...register("price"),
                              onChange: (e: any) => {
                                handleInputChange("price", e.target.value);
                              },
                            }}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <InputField
                            type="number"
                            label="Stock Quantity"
                            error={formState.errors["stock"]}
                            registration={{
                              ...register("stock"),
                              onChange: (e: any) => {
                                handleInputChange("stock", e.target.value);
                              },
                            }}
                          />
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label font-medium text-dark">Description</label>
                            <textarea
                              {...register("description")}
                              className="form-control"
                              rows={4}
                              placeholder="Enter product description"
                              error={formState.errors["description"]}
                              onChange={(e) => {
                                register("description").onChange(e);
                                handleInputChange("description", e.target.value);
                              }}
                            />
                            {formState.errors["description"] && (
                              <div className="text-danger mt-1">
                                {formState.errors["description"]?.message}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-3 justify-content-end">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? "Saving..." : isEdit ? "Save Changes" : "List Product"}
                    </Button>
                    <Button
                      type="button"
                      className="border-btn"
                      onClick={() => navigate("/admin/product-list")}
                    >
                      Cancel
                    </Button>
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
