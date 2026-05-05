import { useState } from 'react';
import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import edit from "@/assets/editnew.png";
import { Link, useNavigate } from "react-router-dom";

import { useContentManagementList } from '../../apis/content-management/contentMangement';
import { Button } from '@/components/Elements';
import { usePermission } from '@/hooks/usePermission';

export const ContentList = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useContentManagementList({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { hasPermission } = usePermission();

  const columns = [
    {
      id: "srNo",
      header: "Sr. No.",
      cell: (row: any) => {
        const index = (data?.data || []).findIndex((item: any) => item.id === row.id);
        return index + 1;
      },
    },
    {
      id: "title",
      header: "Title",
      cell: (row: any) => row.title,
    },
    {
      id: "action",
      header: "Action",
      cell: (row: any) => {
        if (row?.title === 'Faq') {
          return (
            <Link to="/admin/faq" className="border-0 bg-transparent p-0">
              <img src={edit} className="table-view" />
            </Link>
          );
        } else return (
          <>
            {hasPermission("content", "update") &&
              <Link to={`/admin/content-management/${row?.id}/edit`} className="border-0 bg-transparent p-0">
                <img src={edit} className="table-view" />
              </Link>
            }
          </>
        )

      },
    },
  ];

  return (
    <ContentWrapper title="Content Management">
      <h3 className="pb-3 f-20">Content Management</h3>

      <div className="user-tabs">
        <div className="recent-orders content-table table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold">Content List</h4>
            {hasPermission("content", "create") && (
              <Button
                onClick={() => navigate("add")}
                className="light-btn">
                <i className="fa-regular fa-plus"></i> Add
              </Button>
            )}
          </div>
          <div className="table-admin">
            <Table
              columns={columns}
              data={data?.data || []}
              pagination={false}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </ContentWrapper >
  );
};
