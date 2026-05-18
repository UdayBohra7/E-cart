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
import orders from "@/assets/order-icon.svg";
import product from "@/assets/product.svg";

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

  const menuItemStyles: MenuItemStyles = {
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
                onClick={to("/admin/product-list")}
                active={active === "product-list"}
                icon={<img src={product} className="menu-icon" />}
              >
                Products
              </MenuItem>
            </Menu>
            
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/categories")}
                active={active === "categories"}
                icon={<img src={orders} className="menu-icon" />}
              >
                Categories
              </MenuItem>
            </Menu>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/users")}
                active={active === "users"}
                icon={<img src={usr} className="menu-icon" />}
              >
                Manage Users
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Sidebar>
    </motion.div>
  );
};
