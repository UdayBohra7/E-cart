import { lazyImport } from "@/lib/lazyImport";
import { Navigate } from "react-router-dom";
import { useUser } from "@/lib/auth";
import { Spinner } from "@/components/Elements";

import AddUser from "./AddUser";
import { ViewUser } from "./ViewUser";
import { EditUser } from "./EditUser";

import { ProductsList } from "./Products/ProductsList";
import { ListProduct } from "./Products/ListProduct";
import { ViewProduct } from "./Products/ViewProduct";
import { EditProduct } from "./Products/EditProduct";

import { CategoryList } from "./Category/CategoryList";
import AddCategory from "./Category/AddCategory";
import EditCategory from "./Category/EditCategory";

const { Dashboard } = lazyImport(() => import("./Dashboard"), "Dashboard");
const { Users } = lazyImport(() => import("./Users"), "Users");

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <Spinner />;

  if (!user) return <Navigate to="/auth/login" replace />;

  return children;
};

export const AdminRoutes = [
  {
    path: "",
    element: <Dashboard />,
  },
  {
    path: "users",
    element: <ProtectedRoute><Users /></ProtectedRoute>,
  },
  {
    path: "users/:id",
    element: <ProtectedRoute><ViewUser /></ProtectedRoute>,
  },
  {
    path: "users/:id/edit",
    element: <ProtectedRoute><EditUser /></ProtectedRoute>,
  },
  {
    path: "users/add",
    element: <ProtectedRoute><AddUser /></ProtectedRoute>,
  },
  {
    path: "product-list",
    element: <ProtectedRoute><ProductsList /></ProtectedRoute>,
  },
  {
    path: "list-a-product",
    element: <ProtectedRoute><ListProduct /></ProtectedRoute>,
  },
  {
    path: "products/:id",
    element: <ProtectedRoute><ViewProduct /></ProtectedRoute>,
  },
  {
    path: "products/:id/edit",
    element: <ProtectedRoute><EditProduct /></ProtectedRoute>,
  },
  {
    path: "categories",
    element: <ProtectedRoute><CategoryList /></ProtectedRoute>,
  },
  {
    path: "categories/add",
    element: <ProtectedRoute><AddCategory /></ProtectedRoute>,
  },
  {
    path: "categories/:id/edit",
    element: <ProtectedRoute><EditCategory /></ProtectedRoute>,
  }
];
