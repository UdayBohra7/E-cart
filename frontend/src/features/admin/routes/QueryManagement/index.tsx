import { useState } from "react";
import Select from "react-select";
import Table from "@/components/Elements/Table/Table";
import { Inbox } from "@mui/icons-material";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Button, Spinner, TableLoader } from "@/components/Elements";
import view from "@/assets/view.svg";
import { Link } from "react-router-dom";
import { useQueryManagement } from "../../apis/query-management/contact-us";
import { QueryManagement } from "../../apis/types/query-management";
import moment from "moment";
import { axios } from "@/lib/axios";
import { toast } from "sonner";


export const QueryManagementList = () => {
    const [activeTab, setActiveTab] = useState<"contact" | "help">("help");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<{ label: string, value: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const { data, isLoading, refetch } = useQueryManagement({
        filters: {
            limit: 10,
            page: currentPage,
            sortBy: "createdAt",
            type: activeTab === "contact" ? "contact-us" : "help-&-support",
            status: statusFilter?.value
        }
    });

    const statusOptions = [
        { label: "All", value: "" },
        { label: "Active", value: "active" },
        { label: "Dismiss", value: "dismiss" },
        { label: "Acknowledged", value: "acknowledged" },
    ];

    const contactUsColumns = [
        {
            header: "Name",
            id: "name",
            cell: (row: QueryManagement) => row?.userId?.name,
        },
        {
            header: "Message",
            id: "message",
            cell: (row: QueryManagement) => row?.message,
        },
        {
            header: "Subject",
            id: "subject",
            cell: (row: QueryManagement) => row?.subject,
        },
        {
            header: "Action",
            id: "action",
            cell: (row: QueryManagement) => (
                <div className="table-actions d-flex gap-2 align-items-center">
                    <Link to={`${row?._id}`} className="border-0 bg-transparent p-0">
                        <img src={view} className="table-view" />
                    </Link>
                </div>
            ),
        },
    ];

    const handleUpdateStatus = async (queryId: string, status: string) => {
        setLoading(true);
        try {
            await axios.put(`/app/query-management/${queryId}`, { status });
            toast.success("Query status updated successfully");
            refetch();
        } finally {
            setLoading(false);
        }
    }

    return (
        <ContentWrapper title="Users">
            <h3 className="pb-3 f-20">Query Management</h3>

            <div className="user-tabs">
                <div className="user-tab-btns bg-white rounded-lg mb-4 d-flex">
                    {/* <Button
                            className={`user-tb-btn px-4 py-3 ${activeTab === "contact" ? "active" : ""}`}
                            onClick={() => setActiveTab("contact")}
                        >
                            Contact Us
                        </Button> */}
                    <Button
                        className={`user-tb-btn  px-4 py-3 ${activeTab === "help" ? "active" : ""}`}
                        onClick={() => setActiveTab("help")}
                    >
                        Help & Support
                    </Button>
                </div>
                <div className="recent-orders table-card bg-white rounded-lg">
                    <div className="table-header p-3 d-flex justify-content-between align-items-center">
                        <h4 className="f-16 semi-bold">Listing</h4>
                        <div className="w-100" style={{ maxWidth: '200px' }}>
                            <Select
                                placeholder="Filter by Status"
                                options={statusOptions}
                                value={statusOptions.find(opt => opt.value === (statusFilter?.value || ""))}
                                onChange={(val) => {
                                    setStatusFilter(val);
                                    setCurrentPage(1);
                                }}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '40px',
                                    })
                                }}
                            />
                        </div>
                    </div>
                    {activeTab === "contact" ?
                        <div className="table-admin">
                            <Table
                                columns={contactUsColumns}
                                data={data?.data?.results || []}
                                pagination={true}
                                itemsPerPage={10}
                                totalPages={data?.data?.totalPages || 1}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                enableSearch={false}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                loading={isLoading}
                            />
                        </div>
                        :
                        <div className="p-4">
                            {isLoading ? <TableLoader /> : (
                                data?.data?.results?.length === 0 ? (
                                    <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                                        <Inbox style={{ fontSize: '48px', color: '#ccc' }} />
                                        <p className="text-gray-500 f-16 mt-2">No data found</p>
                                    </div>
                                ) : (
                                    data?.data?.results.map((query: QueryManagement) => (
                                        <div key={query._id} className="relative bg-white p-4 rounded-lg shadow-md flex justify-between items-center border">
                                            <div>
                                                {query.status === 'active' && <span className={`absolute top-[calc(50%-0.375rem)] left-3 w-3 h-3 rounded-full bg-red-500`} />}
                                                <div className="ml-2 flex items-center space-x-4">
                                                    <span className={`rounded-full text-sm text-white py-2 px-3 capitalize ${query.status === 'active' ? 'bg-green-500' : query.status === 'dismiss' ? 'bg-red-500' : 'bg-blue-500'}`} >
                                                        {query.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 ml-2 mt-2">{query?.subject}</p>
                                                <div className="ml-2 mt-2 text-sm text-gray-500">
                                                    <span>{query?.userId?.name}</span>
                                                    <span className="mx-2">|</span>
                                                    <span>{query?.userId?.email}</span>
                                                    <span className="mx-2">|</span>
                                                    <span>{moment(query?.createdAt || "").fromNow()}</span>
                                                </div>
                                            </div>
                                            {query.status === 'active' &&
                                                <div className="flex gap-4">
                                                    {loading ?
                                                        <Spinner /> :
                                                        <>
                                                            <Button variant="outline" onClick={() => handleUpdateStatus(query._id, 'acknowledged')}>
                                                                Acknowledge
                                                            </Button>
                                                            <Button variant="outline" onClick={() => handleUpdateStatus(query._id, 'dismiss')}>
                                                                Dismiss
                                                            </Button>
                                                        </>}
                                                </div>
                                            }
                                        </div>
                                    ))
                                )
                            )
                            }
                        </div>
                    }
                </div>
            </div>
        </ContentWrapper>
    );
};
