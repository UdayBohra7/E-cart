import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Button, Spinner } from "@/components/Elements";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCouponById, updateCoupon, Coupon } from "../../apis/coupon";
import { toast } from "sonner";

export const EditDiscount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountPrice: "",
    activeDate: "",
    limit: "",
    isActive: true
  });

  const fetchCoupon = async () => {
    if (!id) return;
    
    try {
      const response = await getCouponById(id);
      const couponData = response.data;
      setCoupon(couponData);
      setFormData({
        name: couponData.name,
        code: couponData.code,
        discountPrice: couponData.discountPrice.toString(),
        activeDate: couponData.activeDate.split('T')[0],
        limit: couponData.limit.toString(),
        isActive: couponData.isActive
      });
    } catch (error) {
      console.error('Error fetching coupon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        discountPrice: parseFloat(formData.discountPrice),
        activeDate: formData.activeDate,
        limit: parseInt(formData.limit),
        isActive: formData.isActive
      };
      
      await updateCoupon(id, updateData);
      toast.success('Coupon updated successfully!');
      navigate('/admin/discounts');
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Failed to update coupon');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  if (loading) return <Spinner />;
  if (!coupon) return <div>Coupon not found</div>;

  return (
    <ContentWrapper title="Edit Discount Code">
      <h3 className="pb-3 f-20">Edit Discount Code</h3>
      
      <div className="detail-card bg-white rounded-lg">
        <div className="customer-title">
          <h4 className="f-14 bold grey mb-0">Coupon Information</h4>
        </div>
        <div className="add-box">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label">Coupon Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label">Coupon Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label">Discount Price ($)</label>
                <input
                  type="number"
                  className="form-control"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label">Active Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="activeDate"
                  value={formData.activeDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label">Usage Limit</label>
                <input
                  type="number"
                  className="form-control"
                  name="limit"
                  value={formData.limit}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">
                    Active
                  </label>
                </div>
              </div>
              <div className="col-12 mb-3">
                <p className="text-muted">
                  Used: {coupon.usedCount} / {coupon.limit} times
                </p>
              </div>
            </div>
            <div className="d-flex gap-3 mt-4">
              <Button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Update Coupon'}
              </Button>
              <Button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/admin/discounts')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ContentWrapper>
  );
};