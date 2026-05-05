import React from "react";
import { SidebarComponent } from "@/components/Layout/Sidebar/SidebarComponent";
import TopBar from "./TopBar/TopBar";

const Layout = ({ children }: { children: React.ReactElement }) => {
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <SidebarComponent
        toggled={toggled}
        setToggled={setToggled}
        setBroken={setBroken}
      />
      <main className="w-100">
        <TopBar toggled={toggled} setToggled={setToggled} broken={broken} />
        <div style={{ height: "90vh", overflow: "auto" }}>
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
