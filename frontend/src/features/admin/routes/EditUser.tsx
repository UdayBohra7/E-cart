import ContentWrapper from "@/components/Layout/ContentWrapper";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner } from "@/components/Elements";
import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../apis/user";
import { User } from "../apis/types/user";
import { toast } from "sonner";
import AddEditUserForm from "./Users/AddEditForm";

export const EditUser = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // const navigate = useNavigate();
  // const [saving, setSaving] = useState<boolean>(false);
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   username: "",
  //   dob: "",
  //   bio: "",
  //   businessLocation: "",
  //   role: "user",
  //   isEmailVerified: false,
  //   isPhoneVerified: false,
  //   isActive: false,
  //   isBlocked: false,
  //   provider: "",
  //   providerId: ""
  // });

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value
  //   }));
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!id) return;

  //   setSaving(true);
  //   try {
  //     await updateUser(id, formData);
  //     toast.success('User updated successfully');
  //     navigate(`/admin/users`);
  //   } catch (error) {
  //   } finally {
  //     setSaving(false);
  //   }
  // };


  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getUserById(id || "");
      setUserDetails(data);
      // console.log(data);

      // setFormData({
      //   name: userData?.name || "",
      //   email: userData?.email || "",
      //   phone: userData?.phone || "",
      //   username: userData?.username || "",
      //   dob: userData?.dob || "",
      //   bio: userData?.bio || "",
      //   businessLocation: userData?.businessLocation || "",
      //   role: userData?.role || "user",
      //   isEmailVerified: userData?.isEmailVerified || false,
      //   isPhoneVerified: userData?.isPhoneVerified || false,
      //   isActive: userData?.isActive || false,
      //   isBlocked: userData?.isBlocked || false,
      //   provider: userData?.provider || "",
      //   providerId: userData?.providerId || ""
      // });
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <>{
      loading ? <div><Spinner /></div>
        : <AddEditUserForm isEdit data={userDetails} />
    }
    </>

    // <ContentWrapper title="Edit User">
    //   <h3 className="pb-3">Edit User Profile</h3>
    //   {loading ? (
    //     <Spinner />
    //   ) : (
    //     <form onSubmit={handleSubmit}>
    //       <div className="detail-card customer mb-4">
    //         <div className="customer-title">
    //           <h4 className="f-14 bold grey mb-0">User Information</h4>
    //         </div>
    //         <div className="add-box">
    //           <div className="row">
    //             <div className="col-12 col-md-6 mb-3">
    //               <label className="form-label">Name</label>
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 name="name"
    //                 value={formData.name}
    //                 onChange={handleInputChange}
    //                 required
    //               />
    //             </div>
    //             <div className="col-12 col-md-6 mb-3">
    //               <label className="form-label">Email</label>
    //               <input
    //                 type="email"
    //                 className="form-control"
    //                 name="email"
    //                 value={formData.email}
    //                 onChange={handleInputChange}
    //                 required
    //               />
    //             </div>
    //             <div className="col-12 col-md-6 mb-3">
    //               <label className="form-label">Phone</label>
    //               <input
    //                 type="tel"
    //                 className="form-control"
    //                 name="phone"
    //                 value={formData.phone}
    //                 onChange={handleInputChange}
    //               />
    //             </div>
    //             <div className="col-12 col-md-6 mb-3">
    //               <label className="form-label">Username</label>
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 name="username"
    //                 value={formData.username}
    //                 onChange={handleInputChange}
    //               />
    //             </div>
    //             <div className="col-12 col-md-6 mb-3">
    //               <label className="form-label">Date of Birth</label>
    //               <input
    //                 type="date"
    //                 className="form-control"
    //                 name="dob"
    //                 value={formData.dob}
    //                 onChange={handleInputChange}
    //               />
    //             </div>
    //             <div className="col-12 col-md-6 mb-3">
    //               <label className="form-label">Role</label>
    //               <select
    //                 className="form-control"
    //                 name="role"
    //                 value={formData.role}
    //                 onChange={handleInputChange}
    //                 required
    //               >
    //                 <option value="user">User</option>
    //                 <option value="admin">Admin</option>
    //               </select>
    //             </div>
    //             <div className="col-12 col-md-6 mb-3">
    //               <label className="form-label">Provider</label>
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 name="provider"
    //                 value={formData.provider}
    //                 onChange={handleInputChange}
    //               />
    //             </div>
    //             <div className="col-12 col-md-6 mb-3">
    //               <label className="form-label">Provider ID</label>
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 name="providerId"
    //                 value={formData.providerId}
    //                 onChange={handleInputChange}
    //               />
    //             </div>
    //             <div className="col-12 mb-3">
    //               <label className="form-label">Business Location</label>
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 name="businessLocation"
    //                 value={formData.businessLocation}
    //                 onChange={handleInputChange}
    //               />
    //             </div>
    //             <div className="col-12 mb-3">
    //               <label className="form-label">Bio</label>
    //               <textarea
    //                 className="form-control"
    //                 name="bio"
    //                 rows={4}
    //                 value={formData.bio}
    //                 onChange={handleInputChange}
    //               />
    //             </div>
    //             <div className="col-12 mb-3">
    //               <h5 className="mb-3">Account Status</h5>
    //               <div className="row">
    //                 <div className="col-md-3 mb-2">
    //                   <div className="form-check">
    //                     <input
    //                       className="form-check-input"
    //                       type="checkbox"
    //                       name="isEmailVerified"
    //                       checked={formData.isEmailVerified}
    //                       onChange={handleInputChange}
    //                     />
    //                     <label className="form-check-label">Email Verified</label>
    //                   </div>
    //                 </div>
    //                 <div className="col-md-3 mb-2">
    //                   <div className="form-check">
    //                     <input
    //                       className="form-check-input"
    //                       type="checkbox"
    //                       name="isPhoneVerified"
    //                       checked={formData.isPhoneVerified}
    //                       onChange={handleInputChange}
    //                     />
    //                     <label className="form-check-label">Phone Verified</label>
    //                   </div>
    //                 </div>
    //                 <div className="col-md-3 mb-2">
    //                   <div className="form-check">
    //                     <input
    //                       className="form-check-input"
    //                       type="checkbox"
    //                       name="isActive"
    //                       checked={formData.isActive}
    //                       onChange={handleInputChange}
    //                     />
    //                     <label className="form-check-label">Active</label>
    //                   </div>
    //                 </div>
    //                 <div className="col-md-3 mb-2">
    //                   <div className="form-check">
    //                     <input
    //                       className="form-check-input"
    //                       type="checkbox"
    //                       name="isBlocked"
    //                       checked={formData.isBlocked}
    //                       onChange={handleInputChange}
    //                     />
    //                     <label className="form-check-label">Blocked</label>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="d-flex gap-3 mt-4">
    //             <Button 
    //               type="submit" 
    //               className="btn btn-primary"
    //               disabled={saving}
    //             >
    //               {saving ? 'Saving...' : 'Save Changes'}
    //             </Button>
    //             <Button 
    //               type="button" 
    //               className="btn btn-secondary"
    //               onClick={() => navigate(`/admin/users/${id}`)}
    //             >
    //               Cancel
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //     </form>
    //   )}
    // </ContentWrapper>
  );
};