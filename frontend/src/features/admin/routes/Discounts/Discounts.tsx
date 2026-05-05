import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Button } from "@/components/Elements";
import dele from "@/assets/del.svg";
import edit from "@/assets/editnew.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCoupons, deleteCoupon, Coupon } from "../../apis/coupon";
import { toast } from "sonner";

export const Discounts = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      const response = await getCoupons();
      setCoupons(response.data.results);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {

    setDeleting(id);
    try {
      await deleteCoupon(id);
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success('Coupon deleted successfully');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const columns = [
    {
      header: "Name",
      cell: (row: Coupon) => row.name,
    },
    {
      header: "Code",
      cell: (row: Coupon) => row.code,
    },
    {
      header: "Discount Price",
      cell: (row: Coupon) => `$${row.discountPrice}`,
    },
    {
      header: "Active Date",
      cell: (row: Coupon) => new Date(row.activeDate).toLocaleDateString(),
    },
    {
      header: "Limit",
      cell: (row: Coupon) => `${row.usedCount}/${row.limit}`,
    },
    {
      header: "Status",
      cell: (row: Coupon) => (
        <span className={`px-2 py-1 rounded ${row.isActive ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (row: Coupon) => (
        <div className="table-actions d-flex gap-2 align-items-center">
          <Link to={`/admin/coupons/${row._id}/edit`} className="border-0 bg-transparent p-0">
            <img src={edit} className="table-view" />
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="border-0 bg-transparent p-0"
            disabled={deleting === row._id}
          >
            <img src={dele} className="table-view" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ContentWrapper title="Discount Codes">
      <h3 className="pb-3 f-20">Discount Code</h3>

      <div className="user-tabs">
        <div className="recent-orders table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold">All Discount Code List ({coupons.length})</h4>
            <Link to="/admin/add-discount">
              <Button className="light-btn">
                <i className="fa-regular fa-plus"></i> Add Code
              </Button>
            </Link>
          </div>
          <div className="table-admin">
            <Table
              columns={columns}
              data={coupons}
              pagination={true}
              itemsPerPage={10}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
