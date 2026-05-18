import ContentWrapper from "@/components/Layout/ContentWrapper";
import { useParams } from "react-router-dom";
import customer from "@/assets/customer.jpg";
import { Button, Spinner } from "@/components/Elements";
import { useEffect, useState } from "react";
import { getUserById, deleteUser } from "../apis/user";
import { User } from "../apis/types/user";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserById(id || "");
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this user?')) return;

    setActionLoading(true);
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [])
  return (
    <ContentWrapper title="Add Users">
      <h3 className="pb-3">View Customer</h3>
      {loading ?
        <Spinner />
        :
        <>
          <div className="detail-card  customer mb-4">
            <div className="customer-title">
              <h4 className="f-14 bold grey mb-0">Customer details</h4>
            </div>
            <div className="add-box">
              <p className="text-end f-14">
                Status:
                {userDetails?.isActive ?
                  <span className="green semi-bold ml-2">Active</span>
                  :
                  <span className="red semi-bold ml-2">Inactive</span>
                }
              </p>
              <div className="row align-items-center">
                <div className="col-12 col-md-4 col-lg-3">
                  <div className="customer-img">
                    <img
                      src={userDetails?.image || customer}
                      className="customer-icon w-100 rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = customer;
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-8 col-lg-9">
                  <h5 className="f-20 semi-bold mb-3">{userDetails?.name || 'N/A'}</h5>
                  <p className="f-16 grey mb-2">
                    <i className="fa-solid fa-location-dot"></i> {userDetails?.businessLocation || 'Address not provided'}
                  </p>
                  <p className="f-16 grey mb-2">
                    <i className="fa-solid fa-phone"></i> {userDetails?.phone || 'Phone not provided'}
                  </p>
                  <p className="f-16 grey">
                    <i className="fa-solid fa-calendar-days"></i> DOB {userDetails?.dob || 'Not provided'}
                  </p>
                  <div className="customer-btns mt-3 d-flex align-items-center gap-4">
                    <Button
                      className="light-btn btn-primary"
                      onClick={() => navigate(`/admin/users/${id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="light-btn"
                      onClick={handleDelete}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Loading...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="detail-card view-card customer mb-4">
            <div className="add-box">
              <div className="row">
                <div className="col-12 col-lg-6">
                  <h4 className="f-18 semi-bold pb-2">User Information</h4>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Name</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Email Id</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Mobile Number</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Role</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.role || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <h4 className="f-18 semi-bold pb-2">Account Information</h4>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Email Verified</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.isEmailVerified ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Phone Verified</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.isPhoneVerified ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Provider</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.provider || 'Email'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="detail-card view-card customer mb-4">
            <div className="add-box">
              <h4 className="f-18 semi-bold pb-2">Identity Verification</h4>
              <div className="row">
                <div className="col-12 col-lg-6">
                  <p className="info-txt grey mb-0">Identity Verified</p>
                </div>
                <div className="col-12 col-lg-6">
                  {userDetails?.isIdentityVerified ?
                    <span className="green semi-bold">Verified</span>
                    :
                    <div className="d-flex align-items-center gap-3">
                      <span className="red semi-bold">Unverified</span>
                    </div>
                  }
                </div>
              </div>
              {userDetails?.identityDocs && userDetails.identityDocs.length > 0 && (
                <div className="row mt-3">
                  <div className="col-12">
                    <p className="info-txt grey mb-2">Identity Documents</p>
                    <div className="d-flex gap-2 flex-wrap">
                      {userDetails.identityDocs.map((doc, index) => (
                        <a href={doc} target="_blank" rel="noreferrer" key={index}>
                          <img src={doc} alt={`Identity Doc ${index + 1}`} className="img-thumbnail" style={{ height: '100px', width: 'auto', objectFit: 'contain' }} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="detail-card view-card customer mb-4">
            <div className="add-box">
              <div className="row">
                <div className="col-12 col-lg-6">
                  <h4 className="f-18 semi-bold pb-2">Other Information</h4>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Date Of Birth</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.dob || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">User Name</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.username || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Bio</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.bio || 'N/A'}</p>
                    </div>
                  </div>

                </div>
                <div className="col-12 col-lg-6">
                  <h4 className="f-18 semi-bold pb-2">Address</h4>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Address</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.personalAddress?.addressLine1 || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Country</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.personalAddress?.country || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Suburb</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.personalAddress?.suburb || "N/A"}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Postcode</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.personalAddress?.postcode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* <div className="col-12 col-lg-6">
                  <h4 className="f-18 semi-bold pb-2">Additional Information</h4>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Business Location</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.businessLocation || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Created By Admin</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.isCreatedByAdmin ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Account Status</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.isBlocked ? 'Blocked' : 'Active'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <p className="info-txt grey mb-0">Join Date</p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p className="info-txt bold grey mb-0">{userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </>
      }
    </ContentWrapper>
  );
};
