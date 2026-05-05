import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Button } from "@/components/Elements";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCoupon } from "../../apis/coupon";
import { toast } from "sonner";

const AddDiscount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountPrice: "",
    activeDate: "",
    limit: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const couponData = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        discountPrice: parseFloat(formData.discountPrice),
        activeDate: formData.activeDate,
        limit: parseInt(formData.limit)
      };
      
      await createCoupon(couponData);
      toast.success('Coupon created successfully!');
      navigate('/admin/discounts');
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error('Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentWrapper title="Add Discount Code">
      <h3 className="pb-3 f-20">Add New Discount Code</h3>
      
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
            </div>
            <div className="d-flex gap-3 mt-4">
              <Button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Coupon'}
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

export default AddDiscount;