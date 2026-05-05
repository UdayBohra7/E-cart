import { Spinner } from "@/components/Elements";
import Layout from "@/components/Layout/Layout";
import { AdminRoutes } from "@/features/admin";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </Layout>
  );
};

export const protectedRoutes = [
  {
    path: "/admin/*",
    element: <AdminLayout />,
    children: AdminRoutes,
  },
];
