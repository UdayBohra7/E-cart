import ContentWrapper from "@/components/Layout/ContentWrapper";
import { useParams } from "react-router-dom";
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
      fetchData();
    }
  }, [id]);

  return (
    <ContentWrapper title="View User">
      <h3 className="pb-3">View User Profile</h3>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="detail-card customer mb-4 border rounded p-4 bg-white">
            <div className="customer-title mb-3">
              <h4 className="f-14 bold grey mb-0">User Details</h4>
            </div>
            <div className="add-box">
              <div className="row align-items-center">
                <div className="col-12 col-md-8">
                  <h5 className="f-24 semi-bold mb-3 text-dark">{userDetails?.name || 'N/A'}</h5>
                  <p className="f-16 text-muted mb-2">
                    <i className="fa-solid fa-envelope text-primary mr-2"></i> Email: <strong className="text-dark">{userDetails?.email || 'N/A'}</strong>
                  </p>
                  <p className="f-16 text-muted mb-2">
                    <i className="fa-solid fa-phone text-primary mr-2"></i> Phone: <strong className="text-dark">{(userDetails?.countryCode || "") + (userDetails?.phone || 'N/A')}</strong>
                  </p>
                  <p className="f-16 text-muted mb-2">
                    <i className="fa-solid fa-user text-primary mr-2"></i> Role: <strong className="text-dark">{userDetails?.role || 'N/A'}</strong>
                  </p>
                  <p className="f-16 text-muted mb-3">
                    <i className="fa-solid fa-location-dot text-primary mr-2"></i> Business Location: <strong className="text-dark">{userDetails?.businessLocation || 'N/A'}</strong>
                  </p>
                  <div className="customer-btns mt-3 d-flex align-items-center gap-3">
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

          <div className="detail-card view-card customer mb-4 border rounded p-4 bg-white">
            <div className="add-box">
              <div className="row">
                <div className="col-12 col-lg-6">
                  <h4 className="f-18 semi-bold pb-2 border-bottom text-dark">User Information</h4>
                  <div className="row mt-3 mb-2">
                    <div className="col-6"><p className="info-txt text-muted mb-0">Name</p></div>
                    <div className="col-6"><p className="info-txt bold text-dark mb-0">{userDetails?.name || 'N/A'}</p></div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6"><p className="info-txt text-muted mb-0">Email ID</p></div>
                    <div className="col-6"><p className="info-txt bold text-dark mb-0">{userDetails?.email || 'N/A'}</p></div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6"><p className="info-txt text-muted mb-0">Mobile Number</p></div>
                    <div className="col-6"><p className="info-txt bold text-dark mb-0">{userDetails?.phone || 'N/A'}</p></div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6"><p className="info-txt text-muted mb-0">Role</p></div>
                    <div className="col-6"><p className="info-txt bold text-dark mb-0">{userDetails?.role || 'N/A'}</p></div>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <h4 className="f-18 semi-bold pb-2 border-bottom text-dark">Account Status</h4>
                  <div className="row mt-3 mb-2">
                    <div className="col-6"><p className="info-txt text-muted mb-0">Email Verified</p></div>
                    <div className="col-6">
                      <p className="info-txt bold mb-0">
                        {userDetails?.isEmailVerified ? (
                          <span className="text-success semi-bold">Yes</span>
                        ) : (
                          <span className="text-warning semi-bold">No</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6"><p className="info-txt text-muted mb-0">Active Status</p></div>
                    <div className="col-6">
                      <p className="info-txt bold mb-0">
                        {userDetails?.isActive ? (
                          <span className="text-success semi-bold">Active</span>
                        ) : (
                          <span className="text-danger semi-bold">Inactive</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6"><p className="info-txt text-muted mb-0">Blocked Status</p></div>
                    <div className="col-6">
                      <p className="info-txt bold mb-0">
                        {userDetails?.isBlocked ? (
                          <span className="text-danger semi-bold">Blocked</span>
                        ) : (
                          <span className="text-success semi-bold">Allowed</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6"><p className="info-txt text-muted mb-0">Join Date</p></div>
                    <div className="col-6"><p className="info-txt bold text-dark mb-0">{userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'N/A'}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </ContentWrapper>
  );
};
