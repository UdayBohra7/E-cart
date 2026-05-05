import ContentWrapper from "@/components/Layout/ContentWrapper";
import { TableLoader } from "@/components/Elements";
import { useNotificationList } from "../apis/notification";
import moment from "moment";

export const Notifications = () => {
  const { data, isLoading } = useNotificationList({});

  return (
    <ContentWrapper title="Notifications">
      <h3 className="pb-3 f-20">Notifications</h3>

      <div className="user-tabs">
        <div className="recent-orders table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold gray">Today</h4>
          </div>
          {isLoading ? <TableLoader /> : (
            data?.data?.length ? data?.data?.map((notification: any, index: number) =>
              <div key={index} className="notifications-box border-bottom d-flex gap-3 py-2 px-4">
                <div className="notes-icons">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="12"
                      height="12"
                      rx="6"
                      fill="white"
                      stroke="#5D7186"
                      stroke-width="4"
                    />
                  </svg>
                </div>
                <div className="notes-wrapepr">
                  <p className="mb-2 f-14">{`${moment(notification?.createdAt).format('dddd')}, ${moment(notification?.createdAt).format('MMMM DD YYYY')}`}</p>
                  <p className="mb-1 f-16">{notification?.title} {notification?.description}</p>
                </div>
              </div>
            )
              : <p className="text-center pb-4">No Notifications found</p>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};
