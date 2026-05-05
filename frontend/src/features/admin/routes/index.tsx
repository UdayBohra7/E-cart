import { lazyImport } from "@/lib/lazyImport";
import { Navigate } from "react-router-dom";
import { useUser } from "@/lib/auth";
import { Spinner } from "@/components/Elements";
import AddUser from "./AddUser";
import { ViewUser } from "./ViewUser";
import { EditUser } from "./EditUser";
import { Discounts } from "./Discounts/Discounts";
import AddDiscount from "./Discounts/AddDiscount";
import { EditDiscount } from "./Discounts/EditDiscount";
import { OrdersList } from "./Orders/OrdersList";
import { ReOrdersList } from "./ReOrders/ReOrdersList";
import { TicketHistory } from "./TicketHistory";
import { Roles } from "./Roles/Roles";
import AddRole from "./Roles/AddRole";
import EditRole from "./Roles/EditRole";
import { ProductsList } from "./Products/ProductsList";
import { ListProduct } from "./Products/ListProduct";
import { ViewProduct } from "./Products/ViewProduct";
import { EditProduct } from "./Products/EditProduct";
import { ContentList } from "./ContentManagement/ContentList";
import { FaqManagement } from "./ContentManagement/FaqManagement";
import { ViewOrders } from "./Orders/ViewOrders";
import { Reports } from "./Reports";
import ViewUserRoles from "./Roles/ViewUser";
import { Notifications } from "./Notifications";
import { AddEditContentForm } from "./ContentManagement/components/AddEditContent";
import { EditContent } from "./ContentManagement/EditContent";
import { AddEditFaqForm } from "./ContentManagement/components/AddEditFaq";
import { EditFaq } from "./ContentManagement/EditFaq";
import { CategoryList } from "./Category/CategoryList";
import AddCategory from "./Category/AddCategory";
import EditCategory from "./Category/EditCategory";

import { BrandsList } from "./Brands/BrandsList";
import { AddBrand } from "./Brands/AddBrand";
import { EditBrand } from "./Brands/EditBrand";

import { OccasionList } from "./Occasion/OccasionList";
import AddOccasion from "./Occasion/AddOccasion";
import EditOccasion from "./Occasion/EditOccasion";

const { Dashboard } = lazyImport(() => import("./Dashboard"), "Dashboard");
const { QueryManagementList } = lazyImport(() => import("./QueryManagement/index"), "QueryManagementList");
const { ViewQuery } = lazyImport(() => import("./QueryManagement/ViewQuery"), "ViewQuery");
const { Users } = lazyImport(() => import("./Users"), "Users");
const { PlatformSettings } = lazyImport(() => import("./PlatformSettings"), "PlatformSettings");

import { usePermission } from "@/hooks/usePermission";

const ProtectedRoute = ({ children, module }: { children: JSX.Element; module: string }) => {
  const { data: user, isLoading } = useUser();
  const { hasPermission } = usePermission();

  if (isLoading) return <Spinner />;

  if (!user) return <Navigate to="/auth/login" replace />;

  if (!hasPermission(module)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};


export const AdminRoutes = [
  {
    path: "",
    element: <Dashboard />,
  },
  {
    path: "users",
    element: <ProtectedRoute module="users"><Users /></ProtectedRoute>,
  },
  {
    path: "users/:id",
    element: <ProtectedRoute module="users"><ViewUser /></ProtectedRoute>,
  },
  {
    path: "users/:id/edit",
    element: <ProtectedRoute module="users"><EditUser /></ProtectedRoute>,
  },
  {
    path: "users/add",
    element: <ProtectedRoute module="users"><AddUser /></ProtectedRoute>,
  },
  {
    path: "discounts",
    element: <ProtectedRoute module="discount"><Discounts /></ProtectedRoute>,
  },
  {
    path: "add-discount",
    element: <ProtectedRoute module="discount"><AddDiscount /></ProtectedRoute>,
  },
  {
    path: "coupons/:id/edit",
    element: <ProtectedRoute module="discount"><EditDiscount /></ProtectedRoute>,
  },
  {
    path: "orders",
    element: <ProtectedRoute module="order"><OrdersList /></ProtectedRoute>,
  },
  {
    path: "orders/:id",
    element: <ProtectedRoute module="order"><ViewOrders /></ProtectedRoute>,
  },
  {
    path: "re-orders",
    element: <ProtectedRoute module="order"><ReOrdersList /></ProtectedRoute>,
  },
  {
    path: "ticket-history",
    element: <TicketHistory />,
  },
  {
    path: "roles",
    element: <ProtectedRoute module="roles"><Roles /></ProtectedRoute>,
  },
  {
    path: "add-role",
    element: <ProtectedRoute module="roles"><AddRole /></ProtectedRoute>,
  },
  {
    path: "roles/:id",
    element: <ProtectedRoute module="roles"><ViewUserRoles /></ProtectedRoute>,
  },
  {
    path: "roles/:id/edit",
    element: <ProtectedRoute module="roles"><EditRole /></ProtectedRoute>,
  },
  {
    path: "product-list",
    element: <ProtectedRoute module="product"><ProductsList /></ProtectedRoute>,
  },
  {
    path: "list-a-product",
    element: <ProtectedRoute module="product"><ListProduct /></ProtectedRoute>,
  },
  {
    path: "products/:id",
    element: <ProtectedRoute module="product"><ViewProduct /></ProtectedRoute>,
  },
  {
    path: "products/:id/edit",
    element: <ProtectedRoute module="product"><EditProduct /></ProtectedRoute>,
  },
  {
    path: "content-management",
    element: <ProtectedRoute module="content"><ContentList /></ProtectedRoute>,
  },
  {
    path: "content-management/add",
    element: <ProtectedRoute module="content"><AddEditContentForm /></ProtectedRoute>,
  },
  {
    path: "content-management/:id/edit",
    element: <ProtectedRoute module="content"><EditContent /></ProtectedRoute>,
  },
  {
    path: "faq",
    element: <ProtectedRoute module="faq"><FaqManagement /></ProtectedRoute>,
  },
  {
    path: "faq/add",
    element: <ProtectedRoute module="faq"><AddEditFaqForm /></ProtectedRoute>,
  },
  {
    path: "faq/:id/edit",
    element: <ProtectedRoute module="faq"><EditFaq /></ProtectedRoute>,
  },
  {
    path: "reports",
    element: <ProtectedRoute module="report"><Reports /></ProtectedRoute>,
  },
  {
    path: "notifications",
    element: <ProtectedRoute module="notification"><Notifications /></ProtectedRoute>,
  },
  {
    path: "query-management",
    element: <ProtectedRoute module="support"><QueryManagementList /></ProtectedRoute>,
  },
  {
    path: "query-management/:id",
    element: <ProtectedRoute module="support"><ViewQuery /></ProtectedRoute>,
  },
  {
    path: "categories",
    element: <ProtectedRoute module="product"><CategoryList /></ProtectedRoute>,
  },
  {
    path: "categories/add",
    element: <ProtectedRoute module="product"><AddCategory /></ProtectedRoute>,
  },
  {
    path: "categories/:id/edit",
    element: <ProtectedRoute module="product"><EditCategory /></ProtectedRoute>,
  },
  {
    path: "brands",
    element: <ProtectedRoute module="product"><BrandsList /></ProtectedRoute>,
  },
  {
    path: "brands/add",
    element: <ProtectedRoute module="product"><AddBrand /></ProtectedRoute>,
  },
  {
    path: "brands/:id/edit",
    element: <ProtectedRoute module="product"><EditBrand /></ProtectedRoute>,
  },
  {
    path: "occasions",
    element: <ProtectedRoute module="product"><OccasionList /></ProtectedRoute>,
  },
  {
    path: "occasions/add",
    element: <ProtectedRoute module="product"><AddOccasion /></ProtectedRoute>,
  },
  {
    path: "occasions/:id/edit",
    element: <ProtectedRoute module="product"><EditOccasion /></ProtectedRoute>,
  },
  {
    path: "settings",
    element: <ProtectedRoute module="settings"><PlatformSettings /></ProtectedRoute>,
  },
];
