import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import view from "@/assets/view.svg";
import { Link } from "react-router-dom";
import pendingOrdersIcon from "@/assets/review.svg";
import book from "@/assets/cancel.svg";
import cusotmer from "@/assets/ship.svg";
import revenue from "@/assets/deliver.svg";
import refund from "@/assets/refund.svg";
import pending from "@/assets/pay.svg";
import delivered from "@/assets/delivered.svg";
import progress from "@/assets/progress.svg";
import { useEffect, useState } from "react";

import { getOrders, getOrderStats, Order, OrderStats } from "../../apis/order";
import moment from "moment";
import { getOrderStatusStyle } from "./style";

export const OrdersList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    pendingPayments: 0,
    refunds: 0,
    inProgress: 0
  });

  const getDateRange = (filter: string) => {
    let startDate, endDate;
    if (filter === 'This Week') {
      startDate = moment().startOf('week').toISOString();
      endDate = moment().endOf('week').toISOString();
    } else if (filter === 'This Month') {
      startDate = moment().startOf('month').toISOString();
      endDate = moment().endOf('month').toISOString();
    }
    return { startDate, endDate };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange(dateFilter);
      const [ordersResponse, statsResponse] = await Promise.all([
        getOrders({
          search: searchQuery || undefined,
          page: currentPage,
          limit: 10,
          startDate,
          endDate
        }),
        getOrderStats()
      ]);

      setOrders(ordersResponse.data.results);
      setTotalPages(ordersResponse.data.totalPages);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter]);

  const columns = [
    {
      id: "orderNumber",
      header: "Order Number",
      cell: (row: Order) => row._id,
    },
    {
      id: "productName",
      header: "Product Name",
      cell: (row: Order) => row.product_details?.name || 'N/A',
    },
    {
      id: "customer",
      header: "Customer",
      cell: (row: Order) => row.buyer_details?.name || 'N/A',
    },
    {
      id: "email",
      header: "Customer Email",
      cell: (row: Order) => row.buyer_details?.email || 'N/A',
    },
    {
      id: "amount",
      header: "Total Amount",
      cell: (row: Order) => `$${row.totalAmount}`,
    },
    {
      id: "status",
      header: "Order Status",
      cell: (row: Order) => (
        <div
          className="order-status py-2 text-center px-4 rounded-lg"
          style={getOrderStatusStyle(row.status)}
        >
          {row.status}
        </div>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: (row: Order) => (
        <div className="table-actions d-flex gap-2 align-items-center">
          <Link to={`/admin/orders/${row._id}`} className="border-0 bg-transparent p-0">
            <img src={view} className="table-view" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <ContentWrapper title="Orders List">
      <h3 className="pb-3 f-20">Orders List</h3>
      <div className="row mb-4">
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Payment Refund</p>
                <p className="mb-0 f-24 semi-bold">{stats.refunds}</p>
              </div>
              <img src={refund} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Order Cancel</p>
                <p className="mb-0 f-24 semi-bold">{stats.cancelledOrders}</p>
              </div>
              <img src={book} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Order Shipped</p>
                <p className="mb-0 f-24 semi-bold">{stats.shippedOrders}</p>
              </div>
              <img src={cusotmer} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Order Delivering</p>
                <p className="mb-0 f-24 semi-bold">{stats.deliveredOrders}</p>
              </div>
              <img src={revenue} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Pending Review</p>
                <p className="mb-0 f-24 semi-bold">{stats.pendingOrders}</p>
              </div>
              <img src={pendingOrdersIcon} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Pending Payment</p>
                <p className="mb-0 f-24 semi-bold">{stats.pendingPayments}</p>
              </div>
              <img src={pending} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">Delivered</p>
                <p className="mb-0 f-24 semi-bold">{stats.deliveredOrders}</p>
              </div>
              <img src={delivered} className="orders-icon" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="orders-box bg-white rounded-lg">
            <div className="order-title p-3 d-flex justify-content-between align-items-center">
              <div className="order-details-dash">
                <p className="f-14 grey mb-0">In Progress</p>
                <p className="mb-0 f-24 semi-bold">{stats.inProgress}</p>
              </div>
              <img src={progress} className="orders-icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="user-tabs">
        <div className="recent-orders table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold">All Orders List ({orders.length})</h4>
            <select
              className="admin-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="This Month">This Month</option>
              <option value="This Week">This Week</option>
            </select>
          </div>
          <div className="table-admin">
            <Table
              columns={columns}
              data={orders}
              pagination={true}
              itemsPerPage={10}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
