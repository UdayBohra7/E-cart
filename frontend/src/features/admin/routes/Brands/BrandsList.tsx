
import { Button } from "@/components/Elements";
import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Link, useNavigate } from "react-router-dom";
import { getBrands, Brand } from "@/features/admin/apis/brands";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";


export const BrandsList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const { data: brands, isLoading } = useQuery({
        queryKey: ["brands"],
        queryFn: () => getBrands(),
    });

    // Simple debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const columns = [
        {
            id: "logo",
            header: "Logo",
            cell: (row: Brand) => (
                row.logo ? <img src={row.logo} alt={row.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} /> : <span>No Logo</span>
            ),
        },
        {
            id: "name",
            header: "Name",
            cell: (row: Brand) => row.name,
        },
        {
            id: "description",
            header: "Description",
            cell: (row: Brand) => (
                <span title={row.description}>
                    {row.description ? (row.description.length > 50 ? `${row.description.slice(0, 50)}...` : row.description) : "-"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Action",
            cell: (row: Brand) => (
                <div className="table-actions d-flex gap-2 align-items-center">
                    <Link to={`/admin/brands/${row._id}/edit`} className="border-0 bg-transparent p-0">
                        <i className="fa-regular fa-pen-to-square text-dark"></i>
                    </Link>
                </div>
            ),
        },
    ];

    const filteredData = brands?.data?.filter((entry) =>
        entry?.name?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase()) ||
        entry?.description?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase())
    ) || [];

    return (
        <ContentWrapper title="Brands">
            <div className="user-tabs">
                <div className="recent-orders table-card bg-white rounded-lg">
                    <div className="table-header p-3 d-flex justify-content-between align-items-center">
                        <h4 className="f-16 semi-bold">Brands List</h4>
                        <Button onClick={() => navigate("add")} className="light-btn">
                            <i className="fa-regular fa-plus"></i> Add Brand
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
