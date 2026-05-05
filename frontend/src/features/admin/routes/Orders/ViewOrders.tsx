import ContentWrapper from "@/components/Layout/ContentWrapper";
import master from "@/assets/master.svg";
import edit from "@/assets/custmr-edit.svg";
import fashion from "@/assets/fashion.png";
import customr from "@/assets/customer.png";
import lender from "@/assets/lender.svg";
import { Button } from "@/components/Elements";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Table from "@/components/Elements/Table/Table";
import { useParams } from "react-router-dom";
import { useOrder } from "../../apis/order";
import moment from "moment";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
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
    backgroundColor: "#00951B",
    ...(theme.palette.mode === "dark" && {
      backgroundColor: "#308fe8",
    }),
  },
}));

const BorderLinearProgress1 = styled(LinearProgress)(({ theme }) => ({
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
    backgroundColor: "#F9B931",
    ...(theme.palette.mode === "dark" && {
      backgroundColor: "#308fe8",
    }),
  },
}));

export const ViewOrders = () => {
  const { id } = useParams();
  const { data: orderResponse, isLoading } = useOrder({ id: id || "" });
  const order = orderResponse?.data;

  if (isLoading) {
    return (
      <ContentWrapper title="Order Details">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </ContentWrapper>
    );
  }

  if (!order) {
    return (
      <ContentWrapper title="Order Details">
        <div>Order not found</div>
      </ContentWrapper>
    )
  }

  const columns = [
    {
      id: "product",
      header: "Product Name & Size",
      cell: (row: any) => (
        <div className="product-category d-flex align-items-center gap-2">
          <img src={row.product?.images?.[0] || fashion} className="fashion-icon" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }} />
          <div className="prodt-details">
            <h5 className="font-medium f-16 mb-0">{row.product?.name}</h5>
            <p className="f-14 mb-0 gray">Size: {row.variant?.name || "N/A"}</p>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row: any) => (
        <div
          className="status-box px-3 py-1 rounded-lg semi-bold text-capitalize"
          style={{
            color: row.paymentStatus === "paid" ? "#00951B" : "#F9B931",
            backgroundColor: row.paymentStatus === "paid" ? "#D3F3DF" : "#FFF4E5",
            width: "fit-content"
          }}
        >
          {row.paymentStatus}
        </div>
      ),
    },
    {
      id: "date",
      header: "Date",
      cell: (row: any) => moment(row.createdAt).format("YYYY-MM-DD"),
    },
    {
      id: "price",
      header: "Price",
      cell: (row: any) => `$${row.totalPrice}`,
    },
    {
      id: "shipping",
      header: "Shipping Method",
      cell: (row: any) => <span className="text-capitalize">{row.shippingMethod}</span>,
    },
    {
      id: "type",
      header: "Type",
      cell: (row: any) => <span className="text-capitalize">{row.orderType}</span>,
    },
    {
      id: "amount",
      header: "Amount",
      cell: (row: any) => `$${row.totalPrice}`,
    },
  ];

  return (
    <ContentWrapper title="Order Details">
      <h3 className="pb-3 f-20">Orders Details</h3>
      <div className="row order-details mb-4">
        <div className="col-12 col-md-8 mb-3">
          <div className="orders-box p-3  bg-white rounded-lg mb-4">
            <div className="order-title d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="order-details-dash">
                <p className="mb-2  d-flex gap-2 align-items-center flex-wrap">
                  <span className="f-18 semi-bold">#{order.id || order._id}</span>
                  <span
                    className="f-13 rounded-lg px-2 py-1 text-capitalize"
                    style={{ backgroundColor: "#D3F3DF", color: "#00951B" }}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="mb-0 f-13 grey">
                  Order Details / #{order.id || order._id} - {moment(order.createdAt).format("MMMM DD, YYYY [at] h:mm a")}
                </p>
              </div>
              <div className="right-track d-flex gap-2 align-items-center">
                <Button className="border-btn">Refund</Button>
                <Button className="border-btn">Return</Button>
                <Button className="light-btn">Edit Order</Button>
              </div>
            </div>

            {/* Tracking Details */}
            <h6 className="f-18 semi-bold mt-4 pb-3">Tracking Details</h6>
            <div className="trackied-content flex-wrap  d-flex gap-4 align-items-start">
              <div className="track-cnt">
                <BorderLinearProgress variant="determinate" value={100} />
                <p className="mb-0 f-14 pt-1">Placed Order</p>
              </div>
              <div className="track-cnt">
                <BorderLinearProgress variant="determinate" value={100} />
                <p className="mb-0 f-14 pt-1">Delivery to Shipping</p>
              </div>
              <div className="track-cnt">
                <BorderLinearProgress variant="determinate" value={100} />
                <p className="mb-0 f-14 pt-1">Orders are being Shipped</p>
              </div>
              <div className="track-cnt">
                <BorderLinearProgress1 variant="determinate" value={60} />
                <p className="mb-0 f-14 pt-1">
                  Today Delivered{" "}
                  <i className="fa-solid fa-rotate-right yellow"></i>
                </p>
              </div>
              <div className="track-cnt">
                <BorderLinearProgress1 variant="determinate" value={0} />
                <p className="mb-0 f-14 pt-1">Delivered Successfully</p>
              </div>
            </div>
            <div className="estimated-date pt-4   d-flex gap-4 align-items-center justify-content-between">
              <div className="estimate-dte d-flex gap-1 align-items-center f-14">
                {" "}
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.67188 4.49658H4V12.4966H2.67188V4.49658ZM5.32812 9.16846H11.0625L8.20312 12.0278L9.14062 12.9653L13.6094 8.49658L9.14062 4.02783L8.20312 4.96533L11.0625 7.84033H5.32812V9.16846Z"
                    fill="#5D7186"
                  />
                </svg>
                Estimated shipping date : Apr 25 , 2024
              </div>
              <Button className="">Make As Ready To Ship</Button>
            </div>
          </div>

          <div className="recent-orders table-card mb-4 bg-white rounded-lg">
            <div className="table-header p-3">
              <h4 className="f-16 semi-bold">Product List</h4>
            </div>
            <div className="table-admin product-order-tb">
              <Table
                columns={columns}
                data={order.orderItems || []}
                pagination={false}
                currentPage={1}
                setCurrentPage={() => { }}
                searchQuery=""
                setSearchQuery={() => { }}
              />
            </div>
          </div>

          {order.orderItems?.map((item: any, index: number) => {
            const isConfirmed = ['confirmed', 'shipped', 'delivered'].includes(item.status);
            const isShipped = ['shipped', 'delivered'].includes(item.status);
            const isDelivered = ['delivered'].includes(item.status);

            const greenIcon = (
              <svg
                width="36"
                height="37"
                viewBox="0 0 36 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  y="0.719727"
                  width="36"
                  height="36"
                  rx="18"
                  fill="#EEF2F7"
                />
                <path
                  d="M18 10.1455C16.8542 10.1455 15.7734 10.3604 14.7578 10.79C13.7422 11.2327 12.8568 11.8317 12.1016 12.5869C11.3464 13.3421 10.7539 14.221 10.3242 15.2236C9.88151 16.2393 9.66016 17.32 9.66016 18.4658C9.66016 19.6117 9.88151 20.6924 10.3242 21.708C10.7539 22.7236 11.3464 23.609 12.1016 24.3643C12.8568 25.1195 13.7422 25.7119 14.7578 26.1416C15.7734 26.5843 16.8542 26.8057 18 26.8057C19.1458 26.8057 20.2266 26.5843 21.2422 26.1416C22.2578 25.7119 23.1432 25.1195 23.8984 24.3643C24.6536 23.609 25.2461 22.7236 25.6758 21.708C26.1185 20.6924 26.3398 19.6117 26.3398 18.4658C26.3398 17.32 26.1185 16.2393 25.6758 15.2236C25.2461 14.221 24.6536 13.3421 23.8984 12.5869C23.1432 11.8317 22.2578 11.2327 21.2422 10.79C20.2266 10.3604 19.1458 10.1455 18 10.1455ZM18 25.1455C17.0755 25.1455 16.2096 24.9697 15.4023 24.6182C14.5951 24.2666 13.8887 23.7881 13.2832 23.1826C12.6777 22.5771 12.2057 21.8708 11.8672 21.0635C11.5156 20.2562 11.3398 19.3903 11.3398 18.4658C11.3398 17.5544 11.5156 16.6885 11.8672 15.8682C12.2057 15.0609 12.6777 14.3577 13.2832 13.7588C13.8887 13.1598 14.5951 12.6846 15.4023 12.333C16.2096 11.9814 17.0755 11.8057 18 11.8057C18.9245 11.8057 19.7904 11.9814 20.5977 12.333C21.4049 12.6846 22.1113 13.1598 22.7168 13.7588C23.3223 14.3577 23.7943 15.0609 24.1328 15.8682C24.4844 16.6885 24.6602 17.5544 24.6602 18.4658C24.6602 19.3903 24.4844 20.2562 24.1328 21.0635C23.7943 21.8708 23.3223 22.5771 22.7168 23.1826C22.1113 23.7881 21.4049 24.2666 20.5977 24.6182C19.7904 24.9697 18.9245 25.1455 18 25.1455ZM16.3398 19.7939L14.4258 17.8799L13.2344 19.0518L16.3398 22.1377L21.9258 16.5518L20.7539 15.3799L16.3398 19.7939Z"
                  fill="#00951B"
                />
              </svg>
            );

            const greyIcon = (
              <svg
                width="36"
                height="37"
                viewBox="0 0 36 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  y="0.219727"
                  width="36"
                  height="36"
                  rx="18"
                  fill="#EEF2F7"
                />
                <path
                  d="M18 9.64551C16.8542 9.64551 15.7734 9.86035 14.7578 10.29C13.7422 10.7327 12.8568 11.3317 12.1016 12.0869C11.3464 12.8421 10.7539 13.721 10.3242 14.7236C9.88151 15.7393 9.66016 16.82 9.66016 17.9658C9.66016 19.1117 9.88151 20.1924 10.3242 21.208C10.7539 22.2236 11.3464 23.109 12.1016 23.8643C12.8568 24.6195 13.7422 25.2119 14.7578 25.6416C15.7734 26.0843 16.8542 26.3057 18 26.3057C19.1458 26.3057 20.2266 26.0843 21.2422 25.6416C22.2578 25.2119 23.1432 24.6195 23.8984 23.8643C24.6536 23.109 25.2461 22.2236 25.6758 21.208C26.1185 20.1924 26.3398 19.1117 26.3398 17.9658C26.3398 16.82 26.1185 15.7393 25.6758 14.7236C25.2461 13.721 24.6536 12.8421 23.8984 12.0869C23.1432 11.3317 22.2578 10.7327 21.2422 10.29C20.2266 9.86035 19.1458 9.64551 18 9.64551ZM18 24.6455C17.0755 24.6455 16.2096 24.4697 15.4023 24.1182C14.5951 23.7666 13.8887 23.2881 13.2832 22.6826C12.6777 22.0771 12.2057 21.3708 11.8672 20.5635C11.5156 19.7562 11.3398 18.8903 11.3398 17.9658C11.3398 17.0544 11.5156 16.1885 11.8672 15.3682C12.2057 14.5609 12.6777 13.8577 13.2832 13.2588C13.8887 12.6598 14.5951 12.1846 15.4023 11.833C16.2096 11.4814 17.0755 11.3057 18 11.3057C18.9245 11.3057 19.7904 11.4814 20.5977 11.833C21.4049 12.1846 22.1113 12.6598 22.7168 13.2588C23.3223 13.8577 23.7943 14.5609 24.1328 15.3682C24.4844 16.1885 24.6602 17.0544 24.6602 17.9658C24.6602 18.8903 24.4844 19.7562 24.1328 20.5635C23.7943 21.3708 23.3223 22.0771 22.7168 22.6826C22.1113 23.7881 21.4049 24.2666 20.5977 24.6182C19.7904 24.9697 18.9245 24.6455 18 24.6455ZM16.3398 19.2939L14.4258 17.3799L13.2344 18.5518L16.3398 21.6377L21.9258 16.0518L20.7539 14.8799L16.3398 19.2939Z"
                  fill="#838383"
                />
              </svg>
            );

            return (
              <div key={item.id || item._id || index} className="orders-box tracking-info bg-white rounded-lg mb-4">
                <div className="order-title border-bottom p-3 d-flex justify-content-between align-items-center">
                  <h4 className="f-16 semi-bold m-0">Order Timeline - {item.product?.name}</h4>
                </div>
                <div className="order-timeline-info p-3">
                  <div className="order-timeline relative d-flex align-items-center pb-4 justify-content-between">
                    <div className="timeline-left-side d-flex gap-4">
                      <div className="timeline-img">
                        {greenIcon}
                      </div>
                      <div className="content-timeline">
                        <h5 className="f-16 semi-bold mb-0">Placed Order</h5>
                        <p className="status-define semi-bold f-14">
                          Status : <span className={`paid-status bold ${item.paymentStatus === 'paid' ? 'text-[#00951B]' : 'text-[#F9B931]'}`} style={{ color: item.paymentStatus === 'paid' ? '#00951B' : '#F9B931' }}>{item.paymentStatus}</span>
                        </p>
                      </div>
                    </div>
                    <p className="grey f-14">{moment(item.createdAt).format("MMMM DD, YYYY, hh:mm a")}</p>
                  </div>

                  <div className="order-timeline relative d-flex align-items-center pb-4 justify-content-between">
                    <div className="timeline-left-side d-flex gap-4">
                      <div className="timeline-img">
                        {isConfirmed ? greenIcon : greyIcon}
                      </div>
                      <div className="content-timeline">
                        <h5 className="f-16 semi-bold mb-0">
                          Delivery to shipping
                        </h5>
                        <p className="f-14 mb-2">Order Confirmed</p>
                      </div>
                    </div>
                    {/* Timestamp removed as we don't have specific timestamps for these steps in the generic data structure */}
                  </div>

                  <div className="order-timeline relative d-flex align-items-center pb-4 justify-content-between">
                    <div className="timeline-left-side d-flex gap-4">
                      <div className="timeline-img">
                        {isShipped ? greenIcon : greyIcon}
                      </div>
                      <div className="content-timeline">
                        <h5 className="f-16 semi-bold">Order delivery today</h5>
                      </div>
                    </div>
                  </div>

                  <div className="order-timeline relative d-flex align-items-center pb-4 justify-content-between">
                    <div className="timeline-left-side d-flex gap-4">
                      <div className="timeline-img">
                        {isDelivered ? greenIcon : greyIcon}
                      </div>
                      <div className="content-timeline">
                        <h5 className="f-16 semi-bold">
                          Order Delivered successfully
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Lender Details (if applicable, using first item's seller) */}
          {order.orderItems?.[0]?.seller && (
            <div className="orders-box p-3 lender-details bg-white rounded-lg mb-4">
              <div className="lender-box-details  border-right d-flex justify-content-between align-items-center gap-1 ">
                <div className="lender-user-details">
                  <h6 className="semi-bold f-16">Seller</h6>
                  <p className="mb-0 grey f-14">{order.orderItems[0].seller.name}</p>
                </div>
                <img src={order.orderItems[0].seller.image || lender} className="lenders-icon" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              {/* Additional details */}
            </div>
          )}

          <div className="orders-box bg-white rounded-lg mb-4">
            <div className="order-pay-info p-3">Map</div>
          </div>
        </div>

        <div className="col-12 col-md-4 mb-3">
          {/* Order Summary */}
          <div className="orders-box bg-white rounded-lg mb-4">
            <div className="order-title border-bottom p-3 d-flex justify-content-between align-items-center">
              <h4 className="f-16 semi-bold m-0">Order Summary</h4>
            </div>
            <div className="order-summary p-3">
              <div className="order-summary-content border-bottom  py-2 d-flex justify-content-between align-items-center f-14">
                <span className="grey  d-flex gap-1 align-items-center">
                  Sub Total :
                </span>
                <span className="font-medium">${order.totalAmount}</span>
              </div>
              {/* Add tax/shipping logic if data available */}
            </div>
            <div className="order-bottom-details graybg p-3">
              <p className="f-14 mb-0 d-flex justify-content-between align-items-center">
                <span>Total Amount</span>
                <span>${order.totalAmount}</span>
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="orders-box bg-white rounded-lg mb-4">
            <div className="order-title border-bottom p-3 d-flex justify-content-between align-items-center">
              <h4 className="f-16 semi-bold m-0">Payment Information</h4>
            </div>
            <div className="order-pay-info p-3">
              <div className="order-summary-content  d-flex justify-content-start gap-2 align-items-center f-14">
                <span className=" d-flex gap-1 align-items-center">
                  Transaction ID :
                </span>
                <span className="font-medium grey ">{order.transactionId || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="orders-box bg-white rounded-lg mb-4">
            <div className="order-title border-bottom p-3 d-flex justify-content-between align-items-center">
              <h4 className="f-16 semi-bold m-0">Customer Details</h4>
            </div>
            <div className="order-pay-info p-3">
              <div className="order-pay-content d-flex justify-content-between align-items-center mb-3 f-14">
                <div className="pay-info-left d-flex gap-2 align-items-center ">
                  <img src={order.buyer?.image || customr} className="master-card" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div className="card-content">
                    <p className="m-0">{order.buyer?.name}</p>
                    <p className="m-0 light bold">{order.buyer?.email}</p>
                  </div>
                </div>
              </div>
              <div className="order-summary-content edit-cnt d-flex justify-content-between gap-2 align-items-center f-16 ">
                <span className="semi-bold">Contact Number</span>
                <p className="grey f-14 mb-0">{order.buyer?.phone || "N/A"}</p>
              </div>
             

              {/* Shipping Address - Assuming it's on the first order item or order object if added later */}
              {order.orderItems?.[0]?.toAddressId && (
                <>
                  <div className="order-summary-content edit-cnt d-flex justify-content-between gap-2 align-items-center f-16 ">
                    <span className="semi-bold">Shipping Address</span>
                    <p className="grey f-14 mb-0">
                    {/* Render address fields safely */}
                    {JSON.stringify(order.orderItems[0].toAddressId)}
                  </p>
                  </div>
                
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </ContentWrapper>
  );
};
