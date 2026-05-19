import { useEffect, useState } from "react";
import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { useUsers } from "../apis/user-query";
import { Button } from "@/components/Elements";
import view from "@/assets/view.svg";
import edit from "@/assets/edit.svg";
import block from "@/assets/block.svg";
import { User } from "@/features/admin/apis/types/user";
import { Link, useNavigate } from "react-router-dom";
import { updateUser } from "@/features/admin/apis/user";
import { Box, Modal, Typography } from "@mui/material";


export const Users = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data, isLoading, refetch } = useUsers({
    filters: {
      role: 'USER',
      search: debouncedSearchQuery,
      limit: 10,
      page: currentPage,
    },
    queryConfig: {
      keepPreviousData: true,
    }
  });

  const handleBlockUser = async () => {
    setLoading("block");
    try {
      await updateUser(selectedUser?._id || "", { isBlocked: !selectedUser?.isBlocked });
      await refetch();
      setOpen(false)
    } catch (error) {
    } finally {
      setLoading("");
    }
  }

  const userColumns = [
    {
      header: "Name",
      id: "name",
      cell: (row: User) => row?.name || "-",
    },
    {
      header: "Email ID",
      id: "email",
      cell: (row: User) => row.email,
    },
    {
      header: "Phone Number",
      id: "phone",
      cell: (row: User) => (row?.countryCode || "") + (row?.phone || "-"),
    },
    {
      header: "Role",
      id: "role",
      cell: (row: User) => row?.role || "-",
    },
    {
      header: "Business Location",
      id: "location",
      cell: (row: User) => row?.businessLocation || "-",
    },
    {
      header: "Status",
      id: "status",
      cell: (row: User) => (
        <span className={`badge ${row?.isBlocked ? 'bg-danger' : 'bg-success'}`}>
          {row?.isBlocked ? 'Blocked' : 'Active'}
        </span>
      ),
    },
    {
      header: "Action",
      id: "action",
      cell: (row: User) => (
        <div className="table-actions d-flex gap-2 align-items-center">
          <Link to={`${row?._id}`} className="border-0 bg-transparent p-0">
            <img src={view} className="table-view" />
          </Link>
          <Link to={`${row?._id}/edit`} className="border-0 bg-transparent p-0">
            <img src={edit} className="table-view" />
          </Link>
          <button
            onClick={() => {
              setSelectedUser(row);
              setOpen(true);
            }}
            className="border-0 bg-transparent p-0">
            <img src={block} className="table-view" />
          </button>
        </div>
      ),
    },
  ];


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <ContentWrapper title="Users">
      <h3 className="pb-3 f-20">Manage Users</h3>
      <div className="user-tabs">
        {/* <div className="user-tab-btns bg-white rounded-lg mb-4 d-flex">
            <Button
              className={`user-tb-btn px-4 py-3 ${activeTab === "renter" ? "active" : ""}`}
              onClick={() => setActiveTab("renter")}
            >
              Renter List
            </Button>
            <Button
              className={`user-tb-btn  px-4 py-3 ${activeTab === "lender" ? "active" : ""}`}
              onClick={() => setActiveTab("lender")}
            >
              Lender List
            </Button>
          </div> */}
        <div className="recent-orders table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold">Users List</h4>
              <Button
                onClick={() => navigate("add")}
                className="light-btn">
                <i className="fa-regular fa-plus"></i> Add User
              </Button>
          </div>
          <div className="table-admin">
            <Table
              columns={userColumns}
              data={data?.results}
              pagination={true}
              itemsPerPage={10}
              totalPages={data?.totalPages || 1}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={isLoading}
            />
          </div>
        </div>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="block-user-modal"
          aria-describedby="block-user-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              width: 380,
              borderRadius: 2,
              textAlign: "center"
            }}
          >
            {/* Modal Content */}
            <Typography id="block-user-description" variant="h6" component="h2" sx={{ mb: 2 }}>
              Are you sure you want to {!selectedUser?.isBlocked ? "block" : "unblock"}?
            </Typography>

            <Typography sx={{ mb: 4 }}>
              This action cannot be undone. Please confirm your decision.
            </Typography>

            {/* Buttons */}
            <div className="d-flex align-items-center justify-content-center gap-3">
              <Button onClick={() => setOpen(false)}>
                Not Now
              </Button>
              <Button disabled={loading === "block"} onClick={handleBlockUser}>
                {loading === "block" ? "Loading.." : !selectedUser?.isBlocked ? "Yes, Block" : "Yes, Unblock"}
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </ContentWrapper>
  );
};
