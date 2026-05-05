import { useEffect, useState } from "react";
import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import edit from "@/assets/editnew.png";
import del from "@/assets/del.svg";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/Elements";
import { useFaqList } from "../../apis/content-management/faqQuery";
import { Box, Modal, Typography } from "@mui/material";
import { axios } from "@/lib/axios";

export const FaqManagement = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { data, isLoading, refetch, isRefetching } = useFaqList({
    search: debouncedSearchQuery,
    page: currentPage,
    limit: 10,
  });
  const [ctaLoading, setCtaLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async () => {
    setCtaLoading(true);
    try {
      await axios.delete(`/content-management/faq/${selectedId}`);
      await refetch();
      setOpen(false);
    } catch (error) {
    } finally {
      setCtaLoading(false);
    }
  };

  const columns = [
    {
      id: "question",
      header: "Question",
      cell: (row: any) => row.question,
    },
    {
      id: "answer",
      header: "Answer",
      cell: (row: any) => row.answer,
    },
    {
      id: "action",
      header: "Action",
      cell: (row: any) => (
        <div className="table-actions d-flex gap-2 align-items-center">
          <Link
            to={`/admin/faq/${row?.id}/edit`}
            className="border-0 bg-transparent p-0"
          >
            <img src={edit} className="table-view" />
          </Link>
          <button
            onClick={() => {
              setOpen(true);
              setSelectedId(row?.id);
            }}
            className="border-0 bg-transparent p-0"
          >
            <img src={del} className="table-view" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ContentWrapper title="FAQ Management">
      <h3 className="pb-3 f-20">FAQ Management</h3>

      <div className="user-tabs">
        <div className="recent-orders content-table table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold">FAQ List</h4>
            <Button onClick={() => navigate("add")} className="light-btn">
              <i className="fa-regular fa-plus"></i> Add FAQ
            </Button>
          </div>
          <div className="table-admin">
            <Table
              columns={columns}
              data={data?.data?.results || []}
              pagination={true}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={isLoading}
            />
          </div>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="delete-faq-modal"
            aria-describedby="delete-faq-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                width: 300,
                borderRadius: 2,
              }}
            >
              <Typography
                id="delete-faq-description"
                variant="h6"
                component="h2"
                sx={{ mb: 2 }}
              >
                Are you sure you want to delete?
              </Typography>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button disabled={ctaLoading} onClick={handleDelete}>
                {ctaLoading ? "Deleting..." : "Delete"}
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
    </ContentWrapper>
  );
};
