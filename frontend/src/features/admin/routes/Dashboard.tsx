import ContentWrapper from "@/components/Layout/ContentWrapper";
import orders from "@/assets/order.png";
import book from "@/assets/book.svg";
import customerImg from "@/assets/new.png";
import revenue from "@/assets/revenue.png";
import { Button, Link, Spinner } from "@/components/Elements";
import { TotalCustomer } from "./Charts/TotalCustomer";
import { RevenueChart } from "./Charts/RevenueChart";
import Table from "@/components/Elements/Table/Table";
import { useEffect, useState } from "react";
// import { getStats } from "../apis/stats/getStats";
import { getRecentProducts } from "../apis/products/getRecentProducts";
import { getDashboardStats } from "../apis/reports";
import { useRevenueChart } from "../apis/dashboard/revenueQuery";
import { useNavigate } from "react-router-dom";
import { Order } from "../apis/order";
import { getOrderStatusStyle } from "./Orders/style";


export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    orderPercentage: 0,
    revenuePercentage: 0,
    usersPercentage: 0,
    bookingPercentage: 0,
    totalRegisterUserLastMonthPercentage: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState("1y");
  const { isLoading: revenueChartLoading, data: revenueChart } = useRevenueChart({ duration })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, productsResponse] = await Promise.all([
          getDashboardStats(),
          getRecentProducts()
        ]);
        setStats(statsResponse || []);
        setRecentProducts(productsResponse?.results || []);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const data = recentProducts;

  const columns = [
    {
      header: "Order ID",
      id: "orderId",
      cell: (row: Order) => row._id,
    },
    {
      header: "Product",
      id: "product",
      cell: (row: Order) => row.product_details?.name || 'N/A',
    },
    {
      header: "Customer",
      id: "customer",
      cell: (row: Order) => row.buyer_details?.name || 'N/A',
    },
    {
      header: "Email ID",
      id: "email",
      cell: (row: Order) => row.buyer_details?.email,
    },
    {
      header: "Amount",
      id: "amount",
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
  ];
  return (
    <ContentWrapper title="Dashboard">
      <div className="dashboard-main">
        <div className="row mb-4">
          <div className="col-12 col-md-3 mb-3">
            <div className="orders-box bg-white rounded-lg">
              <div className="order-title p-3 d-flex justify-content-between align-items-center">
                <img src={orders} className="orders-icon" />
                <div className="order-details-dash">
                  <p className="f-14 grey mb-0">Total Orders</p>
                  <p className="mb-0 f-24 semi-bold">{loading ? <Spinner size="sm" /> : stats.totalOrders}</p>
                </div>
              </div>
              <div className="bottom-order d-flex justify-content-between align-items-center graybg px-3 py-2">
                <p className="f-14 mb-0">
                  <span className={stats?.orderPercentage >= 0 ? "green semi-bold" : "red semi-bold"}>
                    <i className={`fa-solid fa-caret-${stats?.orderPercentage >= 0 ? 'up' : 'down'}`}></i> {Math?.abs(stats?.orderPercentage)}%{" "}
                  </span>{" "}
                  <span className="grey">Last week</span>
                </p>
                <Link
                  to="/admin/orders"
                  className="semi-bold text-decoration-none  grey f-14"
                >
                  View More
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3 mb-3">
            <div className="orders-box bg-white rounded-lg">
              <div className="order-title p-3 d-flex justify-content-between align-items-center">
                <img src={book} className="orders-icon" />
                <div className="order-details-dash">
                  <p className="f-14 grey mb-0">Total bookings</p>
                  <p className="mb-0 f-24 semi-bold">{loading ? <Spinner size="sm" /> : stats.totalBookings}</p>
                </div>
              </div>
              <div className="bottom-order d-flex justify-content-between align-items-center graybg px-3 py-2">
                <p className="f-14 mb-0">
                  <span className={stats?.bookingPercentage >= 0 ? "green semi-bold" : "red semi-bold"}>
                    <i className={`fa-solid fa-caret-${stats?.bookingPercentage >= 0 ? 'up' : 'down'}`}></i> {Math.abs(stats?.bookingPercentage)}%{" "}
                  </span>{" "}
                  <span className="grey">Last Month</span>
                </p>
                <Link
                  to="/admin/orders"
                  className="semi-bold text-decoration-none  grey f-14"
                >
                  View More
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3 mb-3">
            <div className="orders-box bg-white rounded-lg">
              <div className="order-title p-3 d-flex justify-content-between align-items-center">
                <img src={customerImg} className="orders-icon" />
                <div className="order-details-dash">
                  <p className="f-14 grey mb-0">Total Users</p>
                  <p className="mb-0 f-24 semi-bold">{loading ? <Spinner size="sm" /> : stats.totalUsers}</p>
                </div>
              </div>
              <div className="bottom-order d-flex justify-content-between align-items-center graybg px-3 py-2">
                <p className="f-14 mb-0">
                  <span className={stats?.usersPercentage >= 0 ? "green semi-bold" : "red semi-bold"}>
                    <i className={`fa-solid fa-caret-${stats?.usersPercentage >= 0 ? 'up' : 'down'}`}></i> {Math.abs(stats?.usersPercentage)}%{" "}
                  </span>{" "}
                  <span className="grey">Last Month</span>
                </p>
                <Link
                  to="/admin/users"
                  className="semi-bold text-decoration-none  grey f-14"
                >
                  View More
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3 mb-3">
            <div className="orders-box bg-white rounded-lg">
              <div className="order-title p-3 d-flex justify-content-between align-items-center">
                <img src={revenue} className="orders-icon" />
                <div className="order-details-dash">
                  <p className="f-14 grey mb-0">Total Revenue</p>
                  <p className="mb-0 f-24 semi-bold">{loading ? <Spinner size="sm" /> : `$${(stats.totalRevenue / 1000).toFixed(1)}k`}</p>
                </div>
              </div>
              <div className="bottom-order d-flex justify-content-between align-items-center graybg px-3 py-2">
                <p className="f-14 mb-0">
                  <span className={stats?.revenuePercentage >= 0 ? "green semi-bold" : "red semi-bold"}>
                    <i className={`fa-solid fa-caret-${stats?.revenuePercentage >= 0 ? 'up' : 'down'}`}></i> {Math.abs(stats?.revenuePercentage)}%{" "}
                  </span>{" "}
                  <span className="grey">Last Month</span>
                </p>
                <Link
                  to="/admin/reports"
                  className="semi-bold text-decoration-none  grey f-14"
                >
                  View More
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12 col-md-5 col-lg-4">
            <div className="white-card dash-chart bg-white p-4 rounded-lg">
              <p className="semi-bold">Total Users</p>
              <TotalCustomer loading={loading} newUsers={stats.totalRegisterUserLastMonthPercentage} />
            </div>
          </div>
          <div className="col-12 col-md-7 col-lg-8">
            <div className="white-card dash-chart bg-white p-4 rounded-lg">
              <p className="semi-bold">{revenueChart?.data?.year || ''} Revenue</p>
              <RevenueChart chartData={revenueChart?.data} loading={revenueChartLoading} duration={duration} setDuration={setDuration} />
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <div className="recent-orders table-card bg-white rounded-lg">
              <div className="table-header p-3 d-flex justify-content-between align-items-center">
                <h4 className="f-16 semi-bold">Recent Orders</h4>
                <Button onClick={() => navigate('/admin/orders')} className="light-btn"><i className="fa-regular fa-eye"></i> View All</Button>
              </div>
              <div className="table-admin">
                <Table currentPage={1} setCurrentPage={() => { }} searchQuery="" setSearchQuery={() => { }} columns={columns} data={data} pagination={false} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
