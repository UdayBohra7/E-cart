import { Button } from "@/components/Elements";
import { Form, InputDate, InputField } from "@/components/Form";
import { InputPhone } from "@/components/Form/InputPhone";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { z } from "zod";
import { createUser, updateUser } from "../../apis/user"; // Assuming updateUser API exists
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import moment from "moment";
import { axios } from "@/lib/axios";
import { parsePhoneNumber } from 'react-phone-number-input';


const schema = z.object({
  name: z.string().min(1, "Please enter your name"),
  role: z.string().min(1, "Please select a role"),
  email: z
    .string()
    .min(1, "Please enter email address")
    .email("Please enter a valid email address!"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  dob: z.date().optional(),
  username: z.string().min(1, "Please enter a username"),
  bio: z.string().optional(),
  country: z.string().min(1, "Please select your country"),
  addressLine1: z.string().min(1, "Please enter your address line 1"),
  addressLine2: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  businessLocation: z.string().min(1, "Please enter your location"),
});

type UserValues = {
  name: string;
  role: string;
  email: string;
  phone: string;
  dob?: any;
  username: string;
  bio: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  suburb: string;
  state: string;
  postcode: string;
  businessLocation: string;
};

interface Props {
  isEdit: boolean;
  data?: any;
}

const AddEditUserForm = ({ isEdit, data }: Props) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState<"profile" | "business" | "form" | "">("");
  const [imageFile, setImageFile] = useState({
    profile: data?.image || "",
    business: data?.businessImage || "",
    profileImgName: "",
    businessImgName: "",
  });

  const handleSubmit = async (values: UserValues) => {
    try {
      setUploading("form");

      let countryCode = "";
      let phone = values.phone;

      try {
        const phoneNumber = parsePhoneNumber(values.phone);
        if (phoneNumber) {
          countryCode = "+" + phoneNumber.countryCallingCode;
          phone = phoneNumber.nationalNumber;
        }
      } catch (e) {
        console.error("Error parsing phone", e);
      }

      const finalData = {
        role: values.role,
        image: imageFile.profile,
        businessImage: imageFile.business,
        name: values.name,
        email: values.email,
        phone: phone,
        countryCode: countryCode,
        dob: values?.dob ? moment(values?.dob).format("ll") : "",
        username: values.username,
        bio: values.bio,
        businessLocation: values.businessLocation,
        address: {
          country: values.country,
          addressLine1: values.addressLine1,
          addressLine2: values?.addressLine2 || "",
          suburb: values?.suburb,
          state: values?.state,
          postcode: values?.postcode,
        },
      };

      if (isEdit) {
        const response = await updateUser(data._id, finalData); // Assuming updateUser API exists
        toast.success(response.message || "");
      } else {
        const response = await createUser(finalData);
        toast.success(response.message || "");
      }

      navigate("/admin/users");
    } catch (e) {
    } finally {
      setUploading("");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: "profile" | "business") => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      setUploading(type);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post("/app/upload-file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const fileUrl = response.data;
        if (type === "profile") {
          setImageFile((prev) => ({
            ...prev,
            profile: fileUrl,
            profileImgName: selectedFile?.name || "",
          }));
        } else {
          setImageFile((prev) => ({
            ...prev,
            business: fileUrl,
            businessImgName: selectedFile?.name || "",
          }));
        }
      } catch (error) {
        // Handle error
      } finally {
        setUploading("");
      }
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>, type: "profile" | "business") => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files ? event.dataTransfer.files[0] : null;

    if (droppedFile) {
      setUploading(type);
      try {
        const formData = new FormData();
        formData.append("file", droppedFile);

        const response = await axios.post("/app/upload-file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const fileUrl = response.data;
        if (type === "profile") {
          setImageFile((prev) => ({
            ...prev,
            profile: fileUrl,
            profileImgName: droppedFile?.name || "",
          }));
        } else {
          setImageFile((prev) => ({
            ...prev,
            business: fileUrl,
            businessImgName: droppedFile?.name || "",
          }));
        }
      } catch (error) {
        // Handle error
      } finally {
        setUploading("");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const defaultValues = useMemo<any>(() => isEdit
    ? {
      name: data?.name || "",
      email: data?.email,
      phone: (data?.countryCode || "") + (data?.phone || ""),
      role: data?.role || "user",
      dob: data?.dob ? moment(data.dob).toDate() : "",
      username: data?.username || "",
      bio: data?.bio || "",
      country: data?.personalAddress?.country || "",
      addressLine1: data?.personalAddress?.addressLine1 || "",
      addressLine2: data?.personalAddress?.addressLine2 || "",
      suburb: data?.personalAddress?.suburb || "",
      state: data?.personalAddress?.state || "",
      postcode: data?.personalAddress?.postcode || "",
      businessLocation: data?.businessLocation || "",
    }
    : { role: "user" }, [data])

  return (
    <ContentWrapper title={isEdit ? "Edit User" : "Add User"}>
      <h3 className="pb-3 f-20">{isEdit ? "Edit Customer" : "Add Customer"}</h3>
      <Form<UserValues, typeof schema> onSubmit={handleSubmit} schema={schema} options={{
        defaultValues: {
          ...defaultValues
        }
      }}>
        {({ register, formState, control }) => {
          return (
            <>
              <div className="detail-card mb-4">
                <div className="customer-title d-flex justify-content-between align-items-center">
                  <h4 className="f-14 bold grey mb-0">Customer Details</h4>
                  <Button disabled={uploading === "form"} type="submit" className={"light-btn"}>
                    {uploading === "form" ? "Please wait.." : "Save"}
                  </Button>
                </div>
                <div className="add-box">
                  <div className="row">
                    {/* Profile Photo */}
                    <div className="col-12 col-md-6 mb-4">
                      <div>
                        <label className="form-label">Profile Photo</label>
                        <div
                          className="upload-container relative"
                          style={{
                            border: "2px dashed #ccc",
                            padding: "20px",
                            borderRadius: "10px",
                            textAlign: "center",
                            cursor: "pointer",
                            background: `url('${imageFile.profile}') center/contain no-repeat`,
                          }}
                          onDrop={(e) => handleDrop(e, "profile")}
                          onDragOver={handleDragOver}
                        >
                          {imageFile?.profileImgName ? (
                            // <p>{imageFile.profileImgName}</p>
                            <span></span>
                          ) : (
                            <p>Drag and drop or click here to select file</p>
                          )}
                          <input
                            type="file"
                            className="pro-upload"
                            onChange={(e) => handleFileChange(e, "profile")}
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Photo */}
                    <div className="col-12 col-md-6 mb-4">
                      <div>
                        <label className="form-label">Business Photo</label>
                        <div
                          className="upload-container relative"
                          style={{
                            border: "2px dashed #ccc",
                            padding: "20px",
                            borderRadius: "10px",
                            textAlign: "center",
                            cursor: "pointer",
                            background: `url('${imageFile.business}') center/contain no-repeat`,
                          }}
                          onDrop={(e) => handleDrop(e, "business")}
                          onDragOver={handleDragOver}
                        >
                          {uploading === "business" ? (
                            <p>Uploading...</p>
                          ) : imageFile?.businessImgName ? (
                            // <p>{imageFile.businessImgName}</p>
                            <span></span>
                          ) : (
                            <p>Drag and drop or click here to select file</p>
                          )}
                          <input
                            type="file"
                            className="pro-upload"
                            onChange={(e) => handleFileChange(e, "business")}
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Information Fields */}
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Name"
                        error={formState.errors["name"]}
                        registration={register("name")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="email"
                        label="Email Address"
                        error={formState.errors["email"]}
                        registration={register("email")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                          className="form-control"
                          {...register("role")}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        {formState.errors["role"] && (
                          <div className="invalid-feedback d-block">
                            {formState.errors["role"]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <InputPhone
                        control={control}
                        label="Phone number"
                        error={formState.errors["phone"]}
                        registration={register("phone")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputDate
                        control={control}
                        label="Date of Birth"
                        registration={register("dob")}
                        error={formState.errors["dob"]}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="User Name"
                        error={formState.errors["username"]}
                        registration={register("username")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Add Bio"
                        error={formState.errors["bio"]}
                        registration={register("bio")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="detail-card mb-4">
                <div className="customer-title">
                  <h4 className="f-14 bold grey mb-0">Customer Address</h4>
                </div>
                <div className="add-box">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Country/Region"
                        error={formState.errors["country"]}
                        registration={register("country")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Address Line 1"
                        error={formState.errors["addressLine1"]}
                        registration={register("addressLine1")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Address Line 2"
                        error={formState.errors["addressLine2"]}
                        registration={register("addressLine2")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Suburb"
                        error={formState.errors["suburb"]}
                        registration={register("suburb")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="State/Territory"
                        error={formState.errors["state"]}
                        registration={register("state")}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <InputField
                        type="number"
                        label="Postcode"
                        error={formState.errors["postcode"]}
                        registration={register("postcode")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="detail-card mb-4">
                <div className="customer-title">
                  <h4 className="f-14 bold grey mb-0">Business Details</h4>
                </div>
                <div className="add-box">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <InputField
                        type="text"
                        label="Business Location"
                        error={formState.errors["businessLocation"]}
                        registration={register("businessLocation")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }}
      </Form>
    </ContentWrapper>
  );
};

export default AddEditUserForm;
