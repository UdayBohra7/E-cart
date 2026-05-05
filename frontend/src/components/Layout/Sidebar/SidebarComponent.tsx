import {
  Sidebar,
  Menu,
  MenuItem,
  menuClasses,
  MenuItemStyles,
} from "react-pro-sidebar";
import { SidebarHeader } from "./components/SidebarHeader";
import { colors } from "@/components/config";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dash from "@/assets/dashboard.svg";
import usr from "@/assets/users.svg";
import discount from "@/assets/discount.svg";
import orders from "@/assets/order-icon.svg";
import reorders from "@/assets/reorders.svg";
import role from "@/assets/role.svg";
import report from "@/assets/report.svg";
import content from "@/assets/content.svg";
import product from "@/assets/product.svg";
import support from "@/assets/support.svg";
import bell from "@/assets/belll.svg";
import order from "@/assets/orders.svg";
import occ from "@/assets/occ.svg";
import occasion from "@/assets/occasion.svg";
const themes = {
  light: {
    sidebar: {
      backgroundColor: "#262D34",
      color: "#9097A7",
      fontSize: "15px",
    },
    menu: {
      menuContent: "#9097A7",
      icon: colors.primary,
      hover: {
        backgroundColor: colors.secondary,
        color: "#000",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

import { usePermission } from "@/hooks/usePermission";

// ... existing imports

export const SidebarComponent = ({
  toggled,
  setToggled,
  setBroken,
}: {
  toggled: boolean;
  setToggled: (i: boolean) => void;
  setBroken: (i: boolean) => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const to = (url: string) => () => {
    navigate(url);
  };
  const { hasPermission } = usePermission();

  const menuItemStyles: MenuItemStyles = {
    // ... existing styles
    root: {
      fontSize: "13px",
      fontWeight: 400,
    },
    icon: {
      color: themes.light.menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes.light.menu.menuContent, 0.4)
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: "transparent",
        color: "#fff",
      },
      [`&.ps-active`]: {
        backgroundColor: "transparent",
        color: "#fff",
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  useEffect(() => {
    const pathName = location.pathname;
    const parts = pathName.split("/");
    if (parts.length > 2) {
      const part = parts[2];
      setActive(part);
    } else {
      setActive("");
    }
  }, [location]);

  // Removed local useUser and hasPermission logic


  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Sidebar
        toggled={toggled}
        className="admin-sidebar"
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint="md"
        backgroundColor={hexToRgba(themes.light.sidebar.backgroundColor, 1)}
        rootStyles={{
          color: themes.light.sidebar.color,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <SidebarHeader style={{ marginBottom: "24px", marginTop: "16px" }} />
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin")}
                active={active === ""}
                icon={<img src={dash} className="menu-icon" />}
              >
                Dashboard
              </MenuItem>
            </Menu>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("product") ? to("/admin/product-list") : undefined}
                active={active === "product-list"}
                icon={<img src={product} className="menu-icon" />}
                disabled={!hasPermission("product")}
              >
                Products {!hasPermission("product") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("product") ? to("/admin/categories") : undefined}
                active={active === "categories"}
                icon={<img src={orders} className="menu-icon" />}
                disabled={!hasPermission("product")}
              >
                Categories {!hasPermission("product") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("product") ? to("/admin/brands") : undefined}
                active={active === "brands"}
                icon={<img src={occasion} className="menu-icon" />}
                disabled={!hasPermission("product")}
              >
                Brands {!hasPermission("product") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("product") ? to("/admin/occasions") : undefined}
                active={active === "occasions"}
                icon={<img src={occ} className="menu-icon" />}
                disabled={!hasPermission("product")}
              >
                Occasions {!hasPermission("product") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("users") ? to("/admin/users") : undefined}
                active={active === "users"}
                icon={<img src={usr} className="menu-icon" />}
                disabled={!hasPermission("users")}
              >
                Manage Users {!hasPermission("users") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("order") ? to("/admin/orders") : undefined}
                active={active === "orders"}
                icon={<img src={order} className="menu-icon" />}
                disabled={!hasPermission("order")}
              >
                Orders {!hasPermission("order") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("order") ? to("/admin/re-orders") : undefined}
                active={active === "re-orders"}
                icon={<img src={reorders} className="menu-icon" />}
                disabled={!hasPermission("order")}
              >
                Reorder List {!hasPermission("order") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("discount") ? to("/admin/discounts") : undefined}
                active={active === "discounts"}
                icon={<img src={discount} className="menu-icon" />}
                disabled={!hasPermission("discount")}
              >
                Discount Code {!hasPermission("discount") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            {/* <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/ticket-history")}
                active={active === "ticket-history"}
                icon={<img src={discount} className="menu-icon" />}
              >
                Ticket
              </MenuItem>
            </Menu> */}
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("roles") ? to("/admin/roles") : undefined}
                active={active === "roles"}
                icon={<img src={role} className="menu-icon" />}
                disabled={!hasPermission("roles")}
              >
                Roles {!hasPermission("roles") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("notification") ? to("/admin/notifications") : undefined}
                active={active === "notifications"}
                icon={<img src={bell} className="menu-icon" />}
                disabled={!hasPermission("notification")}
              >
                Notification {!hasPermission("notification") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("report") ? to("/admin/reports") : undefined}
                active={active === "reports"}
                icon={<img src={report} className="menu-icon" />}
                disabled={!hasPermission("report")}
              >
                Report and Analytic {!hasPermission("report") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("content") ? to("/admin/content-management") : undefined}
                active={active === "content-management"}
                icon={<img src={content} className="menu-icon" />}
                disabled={!hasPermission("content")}
              >
                Content Management {!hasPermission("content") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("support") ? to("/admin/query-management") : undefined}
                active={active === "query-management"}
                icon={<img src={support} className="menu-icon" />}
                disabled={!hasPermission("support")}
              >
                Help & Support {!hasPermission("support") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={hasPermission("settings") ? to("/admin/settings") : undefined}
                active={active === "settings"}
                icon={<i className="fa-solid fa-gear"></i>}
                disabled={!hasPermission("settings")}
              >
                Platform Settings {!hasPermission("settings") && <i className="fa-solid fa-lock ms-2" />}
              </MenuItem>
            </Menu>
            {/* <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Settings"
                icon={<i className="fa-solid fa-gear"></i>}
              >
                <MenuItem> Pie charts</MenuItem>
                <MenuItem> Line charts</MenuItem>
                <MenuItem> Bar charts</MenuItem>
              </SubMenu>
            </Menu> */}
          </div>
        </div>
      </Sidebar>
    </motion.div>
  );
};
