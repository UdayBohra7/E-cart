import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import dele from "@/assets/del.svg";
import view from "@/assets/view.svg";
import edit from "@/assets/edit.svg";

import del from "@/assets/del.png";
import { Link } from "react-router-dom";
import wedd from "@/assets/wedding.png";
import bride from "@/assets/bridal.png";
import party from "@/assets/party.png";
import refund from "@/assets/cock.png";
import fashion from "@/assets/fashion.png";
import { Button } from "@/components/Elements";
import { useEffect, useState } from "react";
import { getProducts, Product, deleteProduct } from "../../apis/product";
import { toast } from "sonner";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import moment from "moment";


export const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const handleClose = () => {
    setOpen(false);
  };
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({
        page: currentPage,
        limit: 10,
        search: debouncedSearchQuery,
      });
      setProducts(response.results);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(selectedProduct);
      await fetchProducts();
      setOpen(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchQuery, currentPage]);

  const columns = [
    {
      id: "name",
      header: "Product",
      cell: (row: Product) => {
        let firstImage = fashion;
        if (row.images) {
          try {
            if (row.images.startsWith('[')) {
              const parsed = JSON.parse(row.images);
              firstImage = parsed[0] || fashion;
            } else {
              firstImage = row.images.split(',')[0] || fashion;
            }
          } catch (e) {
            firstImage = row.images || fashion;
          }
        }
        return (
          <div className="product-category d-flex align-items-center gap-2">
            <img src={firstImage} className="fashion-icon" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
            <div className="prodt-details">
              <h5 className="font-medium f-16 mb-0">{row.name}</h5>
            </div>
          </div>
        );
      },
    },
    {
      id: "price",
      header: "Price",
      cell: (row: Product) => {
        return row.price ? `$${row.price}` : "$0.00";
      },
    },
    {
      id: "stock",
      header: "Stock",
      cell: (row: Product) => {
        return row.stock !== undefined ? row.stock : 0;
      },
    },
    {
      id: "category",
      header: "Category",
      cell: (row: Product) => row.category?.name || "N/A",
    },
    {
      id: "createdAt",
      header: "Created Date",
      cell: (row: Product) => moment(row.createdAt).format("ll"),
    },
    {
      id: "action",
      header: "Action",
      cell: (row: Product) => (
        <div className="table-actions d-flex gap-2 align-items-center">
          <Link
            to={`/admin/products/${row._id}`}
            className="border-0 bg-transparent p-0"
          >
            <img src={view} className="table-view" />
          </Link>
          <Link
            to={`/admin/products/${row._id}/edit`}
            className="border-0 bg-transparent p-0"
          >
            <img src={edit} className="table-view" />
          </Link>
          <button
            onClick={() => {
              setSelectedProduct(row?._id);
              setOpen(true);
            }}
            className="border-0 bg-transparent p-0"
          >
            <img src={dele} className="table-view" />
          </button>
        </div>
      ),
    },
  ];

  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (Number(p.price || 0) * (p.stock || 0)), 0).toFixed(2);

  return (
    <ContentWrapper title="Products List">
      <h3 className="pb-3 f-20">Products List</h3>
      <div className="row mb-4">
        <div className="col-12 col-md-4 mb-3">
          <div className="orders-box bg-white rounded-lg border p-3">
            <div className="order-title d-flex align-items-center gap-3">
              <div className="cocktail text-center" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                <img src={refund} className="cock-icon" />
              </div>
              <div className="order-details-dash">
                <p className="f-14 mb-0 text-muted">Total Products</p>
                <p className="f-24 semi-bold mb-0 text-dark">
                  {loading ? "..." : totalProducts}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3">
          <div className="orders-box bg-white rounded-lg border p-3">
            <div className="order-title d-flex align-items-center gap-3">
              <div className="cocktail text-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <img src={wedd} className="cock-icon" />
              </div>
              <div className="order-details-dash">
                <p className="f-14 mb-0 text-muted">Total Stock</p>
                <p className="f-24 semi-bold mb-0 text-dark">
                  {loading ? "..." : totalStock}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3">
          <div className="orders-box bg-white rounded-lg border p-3">
            <div className="order-title d-flex align-items-center gap-3">
              <div className="cocktail text-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <img src={bride} className="cock-icon" />
              </div>
              <div className="order-details-dash">
                <p className="f-14 mb-0 text-muted">Inventory Value</p>
                <p className="f-24 semi-bold mb-0 text-dark">
                  {loading ? "..." : `$${totalValue}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-tabs">
        <div className="recent-orders table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold">
              All Products List ({loading ? "..." : products.length})
            </h4>
            <div className="d-flex gap-2 align-items-center">
              <Link to="/admin/list-a-product">
                <Button>List Product</Button>
              </Link>
            </div>
          </div>

          <div className="table-admin">
            <Table
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
              columns={columns}
              data={products}
              pagination={true}
              itemsPerPage={10}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <Dialog
        className="confirm-del"
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="text-center delete-modal">
            <img
              src={del}
              height={60}
              className="table-delete-icon mb-4 mx-auto"
            />
            <h4 className="f-20 semi-bold mb-4">
              Are you sure you want to delete ?
            </h4>
            <div className="delete-dialog d-flex justify-content-center gap-3">
              <Button onClick={handleClose} className="border-btn">Cancel</Button>
              <Button disabled={loading} onClick={handleDelete} className="pink-btn">{loading ? "Deleting.." : "Delete"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </ContentWrapper >
  );
};
