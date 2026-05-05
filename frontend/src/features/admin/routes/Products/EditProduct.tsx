import ContentWrapper from "@/components/Layout/ContentWrapper";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner } from "@/components/Elements";
import { useEffect, useState, useRef } from "react";
import { getProductById, Product, updateProduct } from "../../apis/product";
import { axios } from "@/lib/axios";
import upload from "@/assets/upload.svg";
import { toast } from "sonner";
import { AddEditProductForm } from "./AddEditProductForm";

interface UploadedImage {
  preview: string;
  url?: string;
}

export const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();
  // const [saving, setSaving] = useState(false);
  // const [formData, setFormData] = useState({
  //   name: "",
  //   designerName: "",
  //   description: "",
  //   listingType: "rent" as "rent" | "purchase" | "both",
  //   shippingOptions: "pick-up" as "pick-up" | "express" | "both",
  //   sellingPrice: "",
  //   pickUpAddress: ""
  // });
  // const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [images, setImages] = useState<UploadedImage[]>([]);

  const fetchProduct = async () => {
    if (!id) return;
    try {
      const {data} = await getProductById(id);
      setProduct(data);
      // setFormData({
      //   name: productData.name || "",
      //   designerName: productData.designerName || "",
      //   description: productData.description || "",
      //   listingType: productData.listingType || "rent",
      //   shippingOptions: productData.shippingOptions || "pick-up",
      //   sellingPrice: productData.sellingPrice?.toString() || "",
      //   pickUpAddress: productData.pickUpAddress || ""
      // });
      // Set existing images
      // if (productData.images && productData.images.length > 0) {
      //   const existingImages = productData.images.map((url: string) => ({
      //     preview: url,
      //     url: url
      //   }));
      //   setImages(existingImages);
      // }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

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

  // const removeImage = (index: number) => {
  //   setImages(prev => prev.filter((_, i) => i !== index));
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!id) return;
    
  //   setSaving(true);
  //   try {
  //     const productImages = images.map((img) => img.url).filter(Boolean);
  //     const updateData = {
  //       ...formData,
  //       images: productImages,
  //       sellingPrice: formData.sellingPrice ? parseFloat(formData.sellingPrice) : undefined
  //     };
  //     await updateProduct(id, updateData);
  //     toast.success('Product updated successfully');
  //     navigate(`/admin/products`);
  //   } catch (error) {
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) return <div>Product not found</div>;

  return (
    <AddEditProductForm isEdit={true} data={product} />
    // <ContentWrapper title="Edit Product">
    //   <h3 className="pb-3">Edit Product</h3>
      
    //   <form onSubmit={handleSubmit}>
    //     <div className="detail-card bg-white mb-4">
    //       <div className="customer-title bg-white">
    //         <h4 className="f-14 bold grey mb-0">Product Images</h4>
    //       </div>
    //       <div
    //         className="add-box"
    //         onClick={handleClick}
    //         style={{ cursor: "pointer" }}
    //       >
    //         {/* Uploaded image previews */}
    //         <div className="row g-3 mb-3">
    //           {images.map((img, idx) => (
    //             <div className="col-4 col-md-3 position-relative" key={idx}>
    //               <img
    //                 src={img.url || img.preview}
    //                 alt={`preview-${idx}`}
    //                 className="img-fluid rounded"
    //               />
    //               <button
    //                 type="button"
    //                 className="btn btn-danger btn-sm position-absolute top-0 end-0"
    //                 style={{ transform: 'translate(50%, -50%)' }}
    //                 onClick={(e) => {
    //                   e.stopPropagation();
    //                   removeImage(idx);
    //                 }}
    //               >
    //                 ×
    //               </button>
    //             </div>
    //           ))}
    //         </div>

    //         <div className="dropbox text-center">
    //           <div className="dropbox-images relative mb-4">
    //             <img
    //               src={upload}
    //               className="dropbox-upload"
    //               alt="Upload Icon"
    //             />
    //           </div>
    //           <h4 className="f-24 bold">
    //             Drop your images here,{" "}
    //             <span className="light">or click to browse</span>
    //           </h4>
    //           <p className="f-14 txt">
    //             1600 x 1200 (4:3) recommended. PNG, JPG and GIF files
    //             are allowed
    //           </p>
    //         </div>

    //         {/* Hidden input */}
    //         <input
    //           type="file"
    //           accept="image/png, image/jpeg, image/gif"
    //           multiple
    //           className="d-none"
    //           ref={fileInputRef}
    //           onChange={handleFileChange}
    //         />
    //       </div>
    //     </div>
        
    //     <div className="detail-card customer mb-4">
    //       <div className="customer-title">
    //         <h4 className="f-14 bold grey mb-0">Product Information</h4>
    //       </div>
    //       <div className="add-box">
    //         <div className="row">
    //           <div className="col-12 col-md-6 mb-3">
    //             <label className="form-label">Product Name</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               name="name"
    //               value={formData.name}
    //               onChange={handleInputChange}
    //               required
    //             />
    //           </div>
    //           <div className="col-12 col-md-6 mb-3">
    //             <label className="form-label">Designer Name</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               name="designerName"
    //               value={formData.designerName}
    //               onChange={handleInputChange}
    //             />
    //           </div>
    //           <div className="col-12 col-md-6 mb-3">
    //             <label className="form-label">Listing Type</label>
    //             <select
    //               className="form-control"
    //               name="listingType"
    //               value={formData.listingType}
    //               onChange={handleInputChange}
    //               required
    //             >
    //               <option value="rent">Rent</option>
    //               <option value="purchase">Purchase</option>
    //               <option value="both">Both</option>
    //             </select>
    //           </div>
    //           <div className="col-12 col-md-6 mb-3">
    //             <label className="form-label">Shipping Options</label>
    //             <select
    //               className="form-control"
    //               name="shippingOptions"
    //               value={formData.shippingOptions}
    //               onChange={handleInputChange}
    //               required
    //             >
    //               <option value="pick-up">Pick-up</option>
    //               <option value="express">Express</option>
    //               <option value="both">Both</option>
    //             </select>
    //           </div>
    //           <div className="col-12 col-md-6 mb-3">
    //             <label className="form-label">Selling Price</label>
    //             <input
    //               type="number"
    //               className="form-control"
    //               name="sellingPrice"
    //               value={formData.sellingPrice}
    //               onChange={handleInputChange}
    //               min="0"
    //               step="0.01"
    //             />
    //           </div>
    //           <div className="col-12 col-md-6 mb-3">
    //             <label className="form-label">Pick Up Address</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               name="pickUpAddress"
    //               value={formData.pickUpAddress}
    //               onChange={handleInputChange}
    //             />
    //           </div>
    //           <div className="col-12 mb-3">
    //             <label className="form-label">Description</label>
    //             <textarea
    //               className="form-control"
    //               name="description"
    //               rows={4}
    //               value={formData.description}
    //               onChange={handleInputChange}
    //             />
    //           </div>
    //         </div>
    //         <div className="d-flex gap-3 mt-4">
    //           <Button 
    //             type="submit" 
    //             className="btn btn-primary"
    //             disabled={saving}
    //           >
    //             {saving ? 'Saving...' : 'Save Changes'}
    //           </Button>
    //           <Button 
    //             type="button" 
    //             className="btn btn-secondary"
    //             onClick={() => navigate(`/admin/products/${id}`)}
    //           >
    //             Cancel
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </form>
    // </ContentWrapper>
  );
};