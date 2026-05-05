import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import dele from "@/assets/del.svg";
import view from "@/assets/view.svg";
import { Link } from "react-router-dom";
import book from "@/assets/cancel.svg";
import cusotmer from "@/assets/ship.svg";
import revenue from "@/assets/deliver.svg";
import refund from "@/assets/refund.svg";
import { useEffect, useState } from "react";

import { getOrders, Order } from "../../apis/order";

export const ReOrdersList = () => {
  const [reorders, setReorders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReturns: 0,
    pendingReturns: 0,
    completedReturns: 0,
    refundedReturns: 0
  });

  const fetchReorders = async () => {
    try {
      const response = await getOrders();
      // Filter for returned orders and rental orders that might be returned
      const returnedOrders = response.data.results.filter(
        (order: any) => order.orderStatus === 'returned' ||
          (order.orderType === 'rent' && ['delivered', 'returned'].includes(order.orderStatus))
      );

      setReorders(returnedOrders);

      // Calculate stats
      setStats({
        totalReturns: returnedOrders.length,
        pendingReturns: returnedOrders.filter((o: any) => o.orderStatus === 'delivered').length,
        completedReturns: returnedOrders.filter((o: any) => o.orderStatus === 'returned').length,
        refundedReturns: returnedOrders.filter((o: any) => o.paymentStatus === 'refunded').length
      });
    } catch (error) {
      console.error('Error fetching reorders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReorders();
  }, []);

  const getReturnStatusStyle = (order: any) => {
    if (order.orderStatus === 'returned') {
      return { border: "1px solid #00951B", color: "#00951B" };
    } else if (order.orderStatus === 'delivered' && order.orderType === 'rent') {
      return { border: "1px solid #FFA500", color: "#FFA500" };
    }
    return { border: "1px solid #6C757D", color: "#6C757D" };
  };

  const getReturnStatus = (order: any) => {
    if (order.orderStatus === 'returned') {
      return 'Returned';
    } else if (order.orderStatus === 'delivered' && order.orderType === 'rent') {
      return 'Pending Return';
    }
    return 'Processing';
  };

  const columns = [
    {
      header: "Order Number",
      cell: (row: any) => row.orderNumber,
    },
    {
      header: "Customer Name",
      cell: (row: any) => row.customer?.name || 'N/A',
    },
    {
      header: "Product",
      cell: (row: any) => row.product?.name || 'N/A',
    },
    {
      header: "Total Amount",
      cell: (row: any) => `$${row.totalAmount}`,
    },
    {
      header: "Order Date",
      cell: (row: any) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "Owner",
      cell: (row: any) => row.owner?.name || 'N/A',
    },
    {
      header: "Order Type",
      cell: (row: any) => row.orderType,
    },
    {
      header: "Return Status",
      cell: (row: any) => (
        <div
          className="order-status w-max py-2 text-center px-4 rounded-lg"
          style={getReturnStatusStyle(row)}
        >
          {getReturnStatus(row)}
        </div>
      ),
    },
    {
      header: "Action",
      cell: (row: any) => (
        <div className="table-actions d-flex gap-2 align-items-center">
          <Link to={`/admin/orders/${row._id}`} className="border-0 bg-transparent p-0">
            <img src={view} className="table-view" />
          </Link>
          <button className="border-0 bg-transparent p-0">
            <img src={dele} className="table-view" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ContentWrapper title="Re-Orders List">
      <h3 className="pb-3 f-20">Returns & Reorders List</h3>
      <div className="row mb-4">
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Total Returns</p>
                <p className="mb-0 f-24 semi-bold">{stats.totalReturns}</p>
              </div>
              <img src={refund} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Pending Returns</p>
                <p className="mb-0 f-24 semi-bold">{stats.pendingReturns}</p>
              </div>
              <img src={book} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Completed Returns</p>
                <p className="mb-0 f-24 semi-bold">{stats.completedReturns}</p>
              </div>
              <img src={cusotmer} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Refunded Returns</p>
                <p className="mb-0 f-24 semi-bold">{stats.refundedReturns}</p>
              </div>
              <img src={revenue} className="orders-icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="user-tabs">
        <div className="recent-orders table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold">All Returns List ({reorders.length})</h4>
            <select className="admin-select">
              <option>This Month</option>
              <option>This Week</option>
            </select>
          </div>
          <div className="table-admin">
            <Table
              columns={columns}
              data={reorders}
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
