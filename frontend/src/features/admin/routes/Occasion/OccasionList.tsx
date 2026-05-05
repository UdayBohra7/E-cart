
import { Button } from "@/components/Elements";
import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Link, useNavigate } from "react-router-dom";
import { getOccasions, Occasion } from "@/features/admin/apis/occasion";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/Elements";
import moment from "moment";

export const OccasionList = () => {
    const navigate = useNavigate();
    const { data: occasions, isLoading } = useQuery({
        queryKey: ["occasions"],
        queryFn: getOccasions,
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

    // Client-side filtering
    const filteredData = occasions?.data?.filter((entry) =>
        entry?.title?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase()) ||
        entry?.description?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase())
    ) || [];

    const columns = [
        {
            id: "image",
            header: "Image",
            cell: (row: Occasion) => (
                <div className="table-img">
                    <img src={row.image} className="img-fluid rounded-circle" alt="" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                </div>
            ),
        },
        {
            id: "title",
            header: "Title",
            cell: (row: Occasion) => row.title,
        },
        {
            id: "description",
            header: "Description",
            cell: (row: Occasion) => (
                <span title={row.description}>
                    {row.description ? (row.description.length > 50 ? `${row.description.slice(0, 50)}...` : row.description) : "-"}
                </span>
            ),
        },
        {
            id: "createdAt",
            header: "Created At",
            cell: (row: Occasion) => moment(row.createdAt).format("YYYY-MM-DD"),
        },
        {
            id: "updatedAt",
            header: "Updated At",
            cell: (row: Occasion) => moment(row.updatedAt).format("YYYY-MM-DD"),
        },
        {
            id: "actions",
            header: "Action",
            cell: (row: Occasion) => (
                <div className="table-actions d-flex gap-2 align-items-center">
                    <Link to={`/admin/occasions/${row._id}/edit`} className="border-0 bg-transparent p-0">
                        <i className="fa-regular fa-pen-to-square text-dark"></i>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <ContentWrapper title="Occasions">
            <div className="user-tabs">
                <div className="recent-orders table-card bg-white rounded-lg">
                    <div className="table-header p-3 d-flex justify-content-between align-items-center">
                        <h4 className="f-16 semi-bold">Occasion List</h4>
                        <Button onClick={() => navigate("add")} className="light-btn">
                            <i className="fa-regular fa-plus"></i> Add Occasion
                        </Button>
                    </div>

                    <div className="table-admin">
                        {isLoading ? <Spinner /> : (
                            <Table
                                columns={columns}
                                data={filteredData}
                                pagination={true}
                                itemsPerPage={10}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        )}
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};
