import ContentWrapper from "@/components/Layout/ContentWrapper";
import cusotmer from "@/assets/customer.png";
import { useEffect, useState } from "react";
import { getDashboardStats, getRecentCustomers, getSalesReport, getWeeklyOrderStats } from "../apis/reports";
import { SalesReport } from "./Charts/SalesReport";
import {
  LinearProgress,
  linearProgressClasses,
  styled,
  Theme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/Elements";

const BorderLinearProgress = styled(LinearProgress)(
  ({ theme }: { theme: Theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...(theme.palette.mode === "dark" && {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "#EB9AA8",
      ...(theme.palette.mode === "dark" && {
        backgroundColor: "#308fe8",
      }),
    },
  })
);
export const Reports = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    refundedOrders: 0,
  });
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [salesReport, setSalesReport] = useState<{ series: { name: string; data: any[] }[]; categories: string[] }>({ series: [], categories: [] });
  const [weeklyOrderStats, setWeeklyOrderStats] = useState<{ weeklyOrderStats: any[]; totalOrders: number }>({ weeklyOrderStats: [], totalOrders: 0 });
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, recentCustomersResponse, salesReportResponse] = await Promise.all([
          getDashboardStats(),
          getRecentCustomers(),
          getSalesReport(),
        ]);
        setStats(statsResponse || {});
        setRecentCustomers(recentCustomersResponse || []);

        const salesData = salesReportResponse.data.reduce((acc: any, report: any) => {
          acc.months.push(new Date(2024, report._id - 1, 1).toISOString());
          acc.sales.push(report.totalSales);
          return acc;
        }, { months: [], sales: [] });

        setSalesReport({
          series: [{ name: "Sales", data: salesData.sales }],
          categories: salesData.months
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchWeeklyOrderStats = async () => {
      try {
        const weeklyOrderStatsResponse = await getWeeklyOrderStats(days);
        setWeeklyOrderStats(weeklyOrderStatsResponse.data || { weeklyOrderStats: [], totalOrders: 0 });
      } catch (error) {
        console.error("Error fetching weekly ord3er stats:", error);
      }
    };

    fetchWeeklyOrderStats();
  }, [days]);

  return (
    <ContentWrapper title="Dashboard">
      {loading ? (
        <Spinner />
      ) : (
        <div className="dashboard-main">
          <div className="orders-box bg-white rounded-lg p-3">
            <div className="order-top mb-4 d-flex justify-content-between align-items-center gap-3">
              <p className="f-16">
                <span className="semi-bold">Admin -</span> here’s what’s
                happening with your store today
              </p>
              {/* <div className="filter-orders">
                <div className="filter-btn">
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.375 4.375H13.625"
                      stroke="#71717A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.72363 7.5L11.2761 7.5"
                      stroke="#71717A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.5625 10.625L9.43701 10.625"
                      stroke="#71717A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Filter
                </div>
              </div> */}
            </div>
            <div className="row mb-4">
              <div className="col-12 col-md-3 mb-3">
                <div className="orders-box border bg-white rounded-lg p-3">
                  <p className="f-14 uppercase grey">Today’s Sale</p>
                  <div className="bottom-order d-flex justify-content-between align-items-center">
                    <p className="f-24 bold mb-0">${stats.totalRevenue}</p>
                    <p className="f-14 mb-0">
                      <span className="green semi-bold">
                        + 0%
                        <i
                          className={` ps-2 fa-solid fa-caret-up`}
                        ></i>{" "}
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="orders-box border bg-white rounded-lg p-3">
                  <p className="f-14 uppercase grey">Total Sales</p>
                  <div className="bottom-order d-flex justify-content-between align-items-center">
                    <p className="f-24 bold mb-0">${stats.totalRevenue}</p>
                    <p className="f-14 mb-0">
                      <span className="green semi-bold">
                        + 0%
                        <i
                          className={` ps-2 fa-solid fa-caret-up`}
                        ></i>{" "}
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="orders-box border bg-white rounded-lg p-3">
                  <p className="f-14 uppercase grey">Total Orders</p>
                  <div className="bottom-order d-flex justify-content-between align-items-center">
                    <p className="f-24 bold mb-0">{stats.totalOrders}</p>
                    <p className="f-14 mb-0">
                      <span className="green semi-bold">
                        + 0%
                        <i
                          className={` ps-2 fa-solid fa-caret-up`}
                        ></i>{" "}
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="orders-box border bg-white rounded-lg p-3">
                  <p className="f-14 uppercase grey">Total Customers</p>
                  <div className="bottom-order d-flex justify-content-between align-items-center">
                    <p className="f-24 bold mb-0">{stats.totalCustomers}</p>
                    <p className="f-14 mb-0">
                      <span className="green semi-bold">
                        + 0%
                        <i className="ps-2 fa-solid fa-caret-up"></i>{" "}
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-12 col-md-7 col-lg-8">
                <div className="dash-chart border bg-white p-4 rounded-lg mb-4">
                  <p className="semi-bold f-18">Sales Report</p>
                  <SalesReport series={salesReport.series} categories={salesReport.categories} />
                </div>
                <div className="recent-orders sales-repot border bg-white p-4 rounded-lg">
                  <div className="table-header p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="f-16 semi-bold">Transactions</h4>
                      <p>Lorem ipsum dolor sit amet, consectetur adipis.</p>
                    </div>
                    <Link to="/" className="trans-btn">
                      See All Transactions{" "}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.81299 2.79134L8.02132 5.99967L4.81299 9.20801"
                          stroke="#EB9AA8"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                  <div className="table-reports">
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <td>
                            <span className="completed-paymt">Completed</span>
                          </td>
                          <td>
                            <p className="f-14 semi-bold m-0">
                              Visa card **** 4831
                            </p>
                            <p className="f-14 m-0 gray">Card payment</p>
                          </td>
                          <td>
                            <p className="f-14 semi-bold m-0">$182.94</p>
                            <p className="f-14  m-0 gray">Jan 17, 204</p>
                          </td>
                          <td>
                            <p className="f-14 grey m-0">Lorem Ipsum</p>
                          </td>
                          <td>
                            <div className="toogle-report">
                              <i className="fa-solid fa-ellipsis gray"></i>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="completed-paymt">Completed</span>
                          </td>
                          <td>
                            <p className="f-14 semi-bold m-0">
                              Visa card **** 4831
                            </p>
                            <p className="f-14 m-0 gray">Card payment</p>
                          </td>
                          <td>
                            <p className="f-14 semi-bold m-0">$182.94</p>
                            <p className="f-14  m-0 gray">Jan 17, 204</p>
                          </td>
                          <td>
                            <p className="f-14 grey m-0">Lorem Ipsum</p>
                          </td>
                          <td>
                            <div className="toogle-report">
                              <i className="fa-solid fa-ellipsis gray"></i>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-5 col-lg-4">
                <div className="dash-chart border mb-4 bg-white p-4 mb-4 rounded-lg">
                  <div className="op mb-4 d-flex justify-content-between align-items-center gap-3">
                    <p className="semi-bold">Weekly Order </p>
                    <select className="form-select w-max f-14" onChange={(e) => setDays(parseInt(e.target.value))}>
                      <option value="7">Last 7 days</option>
                      <option value="1">Last 1 day</option>
                      <option value="30">Last 30 days</option>
                    </select>
                  </div>
                  {weeklyOrderStats.weeklyOrderStats.map((stat, index) => (
                    <div className="weekly-orders pb-3" key={index}>
                      <p className="f-14 d-flex justify-content-between align-items-center mb-1">
                        <span>{stat._id}</span>
                        <span>{stat.count}</span>
                      </p>
                      <BorderLinearProgress variant="determinate" value={(stat.count / weeklyOrderStats.totalOrders) * 100} />
                    </div>
                  ))}
                </div>
                <div className="dash-chart border mb-4 bg-white p-4 rounded-lg">
                  <div className="op mb-4">
                    <p className="semi-bold mb-0">Recent Customers</p>
                    <p className="f-14">Lorem ipsum dolor sit ametis.</p>
                  </div>
                  <div className="weekly-customers pb-3">
                    {recentCustomers.map((customer, index) => (
                      <div className="f-14 weekly-details d-flex justify-content-between flex-wrap mb-1" key={index}>
                        <div className="week-left-side d-flex align-items-center gap-2">
                          <img
                            src={cusotmer}
                            className="week-cust-icon rounded-full"
                            height={50}
                            width={50}
                          />
                          <div className="rigth-content-week">
                            <h4 className="f-14 semi-bold mb-0">{customer.name}</h4>
                            <p className="f-14 mb-0">{customer.email}</p>
                          </div>
                        </div>
                        <div className="week-right-side">
                          <Link to={`/admin/users/${customer._id}`}>View</Link>
                          <p className="f-14">{new Date(customer.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/admin/users" className="text-decoration-none">
                    <span className="grey">See All Customers </span>
                    <svg
                      width="7"
                      height="10"
                      viewBox="0 0 7 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.27368 0.916341L6.20993 4.99967L1.27368 9.08301"
                        stroke="#151518"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ContentWrapper>
  );
};
