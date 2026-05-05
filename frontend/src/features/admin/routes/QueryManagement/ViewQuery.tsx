import ContentWrapper from "@/components/Layout/ContentWrapper";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner } from "@/components/Elements";
import { useQueryManagementById } from "../../apis/query-management/contact-us";
import moment from "moment";
import { useState } from "react";
import { axios } from "@/lib/axios";
import { toast } from "sonner";

export const ViewQuery = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useQueryManagementById({ queryId: id || "" });
    const query = data?.data;
    const [actionLoading, setActionLoading] = useState(false);

    const handleUpdateStatus = async (status: string) => {
        if (!id) return;
        setActionLoading(true);
        try {
            await axios.put(`/app/query-management/${id}`, { status });
            toast.success("Query status updated successfully");
            refetch();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setActionLoading(false);
        }
    }

    return (
        <ContentWrapper title="Query Management">
            <div className="flex justify-between items-center pb-3">
                <h3 className="f-20">View Query</h3>
                <Button
                    className="light-btn"
                    onClick={() => navigate('/admin/query-management')}
                >
                    Back
                </Button>
            </div>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="detail-card view-card bg-white p-4 rounded-lg shadow-sm">
                    <div className="add-box">
                        <div className="row">
                            <div className="col-12 flex justify-between items-start pb-4 border-bottom mb-4">
                                <h4 className="f-18 semi-bold">Query Details</h4>
                                {query?.status === 'active' && (
                                    <div className="flex gap-4">
                                        <Button
                                            variant="success"
                                            onClick={() => handleUpdateStatus('acknowledged')}
                                            isLoading={actionLoading}
                                            disabled={actionLoading}
                                        >
                                            Acknowledge
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleUpdateStatus('dismiss')}
                                            isLoading={actionLoading}
                                            disabled={actionLoading}
                                        >
                                            Dismiss
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="col-12 col-lg-6 mb-4">
                                <div className="row">
                                    <div className="col-12 col-md-4">
                                        <p className="info-txt grey mb-0">Subject</p>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="info-txt bold grey mb-0">{query?.subject || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6 mb-4">
                                <div className="row">
                                    <div className="col-12 col-md-4">
                                        <p className="info-txt grey mb-0">Type</p>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="info-txt bold grey mb-0 capitalize">{query?.type?.replace(/-/g, ' ') || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6 mb-4">
                                <div className="row">
                                    <div className="col-12 col-md-4">
                                        <p className="info-txt grey mb-0">Status</p>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <span className={`px-2 py-1 rounded-full text-xs text-white ${(query?.status === 'active' || query?.status === 'acknowledged') ? 'bg-green-500' : 'bg-gray-500'}`}>
                                            {query?.status || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6 mb-4">
                                <div className="row">
                                    <div className="col-12 col-md-4">
                                        <p className="info-txt grey mb-0">Date</p>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="info-txt bold grey mb-0">
                                            {query?.createdAt ? moment(query.createdAt).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mb-4">
                                <div className="row">
                                    <div className="col-12 col-md-2">
                                        <p className="info-txt grey mb-0">Message</p>
                                    </div>
                                    <div className="col-12 col-md-10">
                                        <p className="info-txt bold grey mb-0 bg-gray-50 p-3 rounded">{query?.message || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-12">
                                <h4 className="f-18 semi-bold pb-4 border-bottom mb-4">User Information</h4>
                            </div>

                            <div className="col-12 col-lg-6 mb-4">
                                <div className="row">
                                    <div className="col-12 col-md-4">
                                        <p className="info-txt grey mb-0">Name</p>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="info-txt bold grey mb-0">{query?.userId?.name || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6 mb-4">
                                <div className="row">
                                    <div className="col-12 col-md-4">
                                        <p className="info-txt grey mb-0">Email</p>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="info-txt bold grey mb-0">{query?.userId?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6 mb-4">
                                <div className="row">
                                    <div className="col-12 col-md-4">
                                        <p className="info-txt grey mb-0">Phone</p>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="info-txt bold grey mb-0">{query?.userId?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ContentWrapper>
    );
};
