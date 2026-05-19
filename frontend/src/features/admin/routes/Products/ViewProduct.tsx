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
      setProduct(response);
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

  let parsedImages: string[] = [];
  if (product.images) {
    try {
      if (product.images.startsWith('[')) {
        parsedImages = JSON.parse(product.images);
      } else {
        parsedImages = product.images.split(',');
      }
    } catch (e) {
      parsedImages = [product.images];
    }
  }

  return (
    <ContentWrapper title="View Product">
      <h3 className="pb-3">Product Details</h3>
      
      <div className="detail-card customer mb-4">
        <div className="customer-title">
          <h4 className="f-14 bold grey mb-0">Product Information</h4>
        </div>
        <div className="add-box">
          <div className="row">
            <div className="col-12 col-md-4 col-lg-3 mb-3">
              <div className="product-img">
                <img
                  src={parsedImages[0] || '/placeholder.jpg'}
                  className="w-100 rounded-lg"
                  style={{ height: '220px', objectFit: 'cover' }}
                  alt={product.name}
                />
              </div>
            </div>
            <div className="col-12 col-md-8 col-lg-9">
              <h5 className="f-24 semi-bold mb-3 text-dark">{product.name}</h5>
              <p className="f-16 text-muted mb-2">
                <i className="fa-solid fa-tag text-primary mr-2"></i> Category: <strong className="text-dark">{product.category?.name || 'N/A'}</strong>
              </p>
              <p className="f-16 text-muted mb-2">
                <i className="fa-solid fa-dollar-sign text-primary mr-2"></i> Price: <strong className="text-dark">${product.price || '0.00'}</strong>
              </p>
              <p className="f-16 text-muted mb-2">
                <i className="fa-solid fa-boxes-stacked text-primary mr-2"></i> Stock: <strong className="text-dark">{product.stock !== undefined ? product.stock : 0}</strong>
              </p>
              <p className="f-16 text-muted mb-3">
                <i className="fa-solid fa-calendar-days text-primary mr-2"></i> Created: <span className="text-dark">{new Date(product.createdAt).toLocaleDateString()}</span>
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
        <div className="add-box p-4">
          <h4 className="f-18 semi-bold pb-2 border-bottom text-dark">Product Images</h4>
          {parsedImages.length > 0 ? (
            <div className="row mt-3 g-3">
              {parsedImages.map((imgUrl, index) => (
                <div key={index} className="col-6 col-md-4 col-lg-3">
                  <div className="border rounded p-1 bg-white">
                    <img 
                      src={imgUrl} 
                      alt={`Product Image ${index + 1}`} 
                      className="w-100 rounded" 
                      style={{ height: '150px', objectFit: 'contain' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted mt-2">No images uploaded for this product.</p>
          )}
        </div>
      </div>

      {product.description && (
        <div className="detail-card view-card customer mb-4">
          <div className="add-box p-4">
            <h4 className="f-18 semi-bold pb-2 border-bottom text-dark">Description</h4>
            <p className="text-secondary mt-2" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {product.description}
            </p>
          </div>
        </div>
      )}
    </ContentWrapper>
  );
};