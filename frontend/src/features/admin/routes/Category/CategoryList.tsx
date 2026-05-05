
import { Button } from "@/components/Elements";
import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Link, useNavigate } from "react-router-dom";
import { getCategories, Category } from "@/features/admin/apis/category";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import moment from "moment";

export const CategoryList = () => {
    const navigate = useNavigate();
    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    // Simple debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Client-side filtering as per previous implementation (or we can move to server side later if API supports it)
    const filteredData = categories?.data?.filter((entry) =>
        entry?.name?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase()) ||
        entry?.description?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase())
    ) || [];

    const columns = [
        {
            id: "name",
            header: "Name",
            cell: (row: Category) => row.name,
        },
        {
            id: "description",
            header: "Description",
            cell: (row: Category) => (
                <span title={row.description}>
                    {row.description ? (row.description.length > 50 ? `${row.description.slice(0, 50)}...` : row.description) : "-"}
                </span>
            ),
        },
        {
            id: "createdAt",
            header: "Created At",
            cell: (row: Category) => moment(row.createdAt).format("YYYY-MM-DD"),
        },
        {
            id: "updatedAt",
            header: "Updated At",
            cell: (row: Category) => moment(row.updatedAt).format("YYYY-MM-DD"),
        },
        {
            id: "actions",
            header: "Action",
            cell: (row: Category) => (
                <div className="table-actions d-flex gap-2 align-items-center">
                    {/* View - assuming just edit for now, or if view is needed we can add it. 
                        Roles has both view and edit. Categories usually just edit. 
                        User asked for "make the table and edit ui same as other use icons".
                        I'll add the edit icon link.
                    */}
                    {/* <Link to={`/admin/categories/${row._id}`} className="border-0 bg-transparent p-0">
                        <img src={view} className="table-view" />
                    </Link> */}
                    <Link to={`/admin/categories/${row._id}/edit`} className="border-0 bg-transparent p-0">
                        <i className="fa-regular fa-pen-to-square text-dark"></i>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <ContentWrapper title="Categories">
            <div className="user-tabs">
                <div className="recent-orders table-card bg-white rounded-lg">
                    <div className="table-header p-3 d-flex justify-content-between align-items-center">
                        <h4 className="f-16 semi-bold">Category List</h4>
                        <Button onClick={() => navigate("add")} className="light-btn">
                            <i className="fa-regular fa-plus"></i> Add Category
                        </Button>
                    </div>

                    <div className="table-admin">
                        <Table
                            columns={columns}
                            data={filteredData}
                            pagination={true}
                            itemsPerPage={10}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};
