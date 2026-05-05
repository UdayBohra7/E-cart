import ContentWrapper from "@/components/Layout/ContentWrapper";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner } from "@/components/Elements";
import { useEffect, useState } from "react";
import { getProductById, Product, deleteProduct } from "../../apis/product";

export const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchProduct = async () => {
    if (!id) return;
    try {
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this product?')) return;
    
    setDeleting(true);
    try {
      await deleteProduct(id);
      alert('Product deleted successfully');
      navigate('/admin/product-list');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) return <div>Product not found</div>;

  return (
    <ContentWrapper title="View Product">
      <h3 className="pb-3">Product Details</h3>
      
      <div className="detail-card customer mb-4">
        <div className="customer-title">
          <h4 className="f-14 bold grey mb-0">Product Information</h4>
        </div>
        <div className="add-box">
          <div className="row align-items-center">
            <div className="col-12 col-md-4 col-lg-3">
              <div className="product-img">
                <img
                  src={product.images?.[0] || '/placeholder.jpg'}
                  className="w-100 rounded-lg"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="col-12 col-md-8 col-lg-9">
              <h5 className="f-20 semi-bold mb-3">{product.name}</h5>
              <p className="f-16 grey mb-2">
                <i className="fa-solid fa-tag"></i> Category: {product.category?.name || 'N/A'}
              </p>
              <p className="f-16 grey mb-2">
                <i className="fa-solid fa-user"></i> Designer: {product.designerName || 'N/A'}
              </p>
              <p className="f-16 grey mb-2">
                <i className="fa-solid fa-dollar-sign"></i> Price: ${product.sellingPrice || 'N/A'}
              </p>
              <div className="d-flex gap-3 mt-3">
                <Button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/admin/products/${id}/edit`)}
                >
                  Edit Product
                </Button>
                <Button 
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Product'}
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
              <h4 className="f-18 semi-bold pb-2">Basic Information</h4>
              <div className="row mb-2">
                <div className="col-6"><p className="info-txt grey mb-0">Name</p></div>
                <div className="col-6"><p className="info-txt bold grey mb-0">{product.name}</p></div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><p className="info-txt grey mb-0">Category</p></div>
                <div className="col-6"><p className="info-txt bold grey mb-0">{product.category?.name || 'N/A'}</p></div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><p className="info-txt grey mb-0">Designer</p></div>
                <div className="col-6"><p className="info-txt bold grey mb-0">{product.designerName || 'N/A'}</p></div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><p className="info-txt grey mb-0">Listing Type</p></div>
                <div className="col-6"><p className="info-txt bold grey mb-0">{product.listingType}</p></div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <h4 className="f-18 semi-bold pb-2">Pricing & Shipping</h4>
              <div className="row mb-2">
                <div className="col-6"><p className="info-txt grey mb-0">Selling Price</p></div>
                <div className="col-6"><p className="info-txt bold grey mb-0">${product.sellingPrice || 'N/A'}</p></div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><p className="info-txt grey mb-0">Shipping Options</p></div>
                <div className="col-6"><p className="info-txt bold grey mb-0">{product.shippingOptions}</p></div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><p className="info-txt grey mb-0">Owner</p></div>
                <div className="col-6"><p className="info-txt bold grey mb-0">{product.owner?.name || 'N/A'}</p></div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><p className="info-txt grey mb-0">Created Date</p></div>
                <div className="col-6"><p className="info-txt bold grey mb-0">{new Date(product.createdAt).toLocaleDateString()}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {product.description && (
        <div className="detail-card view-card customer mb-4">
          <div className="add-box">
            <h4 className="f-18 semi-bold pb-2">Description</h4>
            <p className="grey">{product.description}</p>
          </div>
        </div>
      )}

      {product.variants && product.variants.length > 0 && (
        <div className="detail-card view-card customer mb-4">
          <div className="add-box">
            <h4 className="f-18 semi-bold pb-2">Variants</h4>
            <div className="row">
              {product.variants.map((variant: any, index: number) => (
                <div key={index} className="col-12 col-md-6 mb-3">
                  <div className="border rounded p-3">
                    <h6 className="semi-bold">{variant.type}</h6>
                    <p className="mb-1">Values: {Array.isArray(variant.value) ? variant.value.join(', ') : variant.value}</p>
                    {variant.sizingCountry && <p className="mb-0">Sizing Country: {variant.sizingCountry}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ContentWrapper>
  );
};