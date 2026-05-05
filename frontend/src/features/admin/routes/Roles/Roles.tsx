import { Button } from "@/components/Elements";
import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Link, useNavigate } from "react-router-dom";
import del from "@/assets/del.png";
import view from "@/assets/view.svg";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAdminUsers } from "../../apis/access-rights/getAdminUsers";

import { usePermission } from "@/hooks/usePermission";


export const Roles = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { hasPermission } = usePermission();

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (row: any) => row.name,
    },
    {
      id: "role",
      header: "Role",
      cell: (row: any) => row.role,
    },
    {
      id: "email",
      header: "Email",
      cell: (row: any) => row.email,
    },

    {
      id: "createdAt",
      header: "Date",
      cell: (row: any) => row.createdAt?.substring(0, 10),
    },
    {
      id: "action",
      header: "Action",
      cell: (row: any) => (
        <div className="table-actions d-flex gap-2 align-items-center">
          <Link to={`/admin/roles/${row?._id}`} className="border-0 bg-transparent p-0">
            <img src={view} className="table-view" />
          </Link>
          {hasPermission("roles", "update") && (
            <Link to={`/admin/roles/${row?._id}/edit`} className="border-0 bg-transparent p-0">
              <i className="fa-regular fa-pen-to-square text-dark"></i>
            </Link>
          )}
        </div>
      ),
    },
  ];

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async (search = "") => {
    try {
      setLoading(true);
      const response = await getAdminUsers(search);
      setUsers(response)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  return (
    <ContentWrapper title="Roles">
      <h3 className="pb-3 f-20">Roles</h3>

      <div className="user-tabs">
        <div className="recent-orders table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold">Roles List</h4>
            {hasPermission("roles", "create") && (
              <Button onClick={() => navigate("/admin/add-role")} className="light-btn">
                <i className="fa-regular fa-plus"></i> Add Role
              </Button>
            )}
          </div>
          <div className="table-admin">
            <Table
              columns={columns}
              data={users}
              pagination={true}
              itemsPerPage={10}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={loading}
            />
          </div>
        </div>
        <Dialog
          className="confirm-del"
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div className="text-center delete-modal">
              <img src={del} height={60} className="table-delete-icon mb-4 mx-auto" />
              <h4 className="f-20 semi-bold mb-4">Are you sure you want to delete ?</h4>
              <div className="delete-dialog d-flex justify-content-center gap-3">
                <Button className="border-btn">Cancel</Button>
                <Button className="pink-btn">Delete</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ContentWrapper>
  );
};
