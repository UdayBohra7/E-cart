
import { Button } from "@/components/Elements";
import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Link, useNavigate } from "react-router-dom";
import { getCategories, deleteCategory, Category } from "@/features/admin/apis/category";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "sonner";
import edit from "@/assets/edit.svg";
import dele from "@/assets/del.svg";

export const CategoryList = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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
    const filteredData = categories?.results?.filter((entry) =>
        entry?.name?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase()) ||
        entry?.description?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase())
    ) || [];

    const handleDeleteClick = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id);
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } catch (error: any) {
            console.error("Error deleting category:", error);
            toast.error(error?.response?.data?.message || "Failed to delete category");
        }
    };

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
            id: "actions",
            header: "Action",
            cell: (row: Category) => (
                <div className="table-actions d-flex gap-2 align-items-center">
                    <Link to={`/admin/categories/${row._id}/edit`} className="border-0 bg-transparent p-0">
                        <img src={edit} className="table-view" />
                    </Link>
                    <button
                        onClick={() => handleDeleteClick(row._id)}
                        className="border-0 bg-transparent p-0 cursor-pointer"
                        title="Delete Category"
                    >
                        <img src={dele} className="table-view" />
                    </button>
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
