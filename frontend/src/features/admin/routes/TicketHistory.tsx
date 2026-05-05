import Table from "@/components/Elements/Table/Table";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/Elements";
import { getTickets } from "../apis/ticket";

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending':
      return { background: "#FFEBCD", color: "#FF9701" };
    case 'in_progress':
      return { background: "#E3F2FD", color: "#1976D2" };
    case 'resolved':
      return { background: "#E8F5E8", color: "#4CAF50" };
    case 'closed':
      return { background: "#FFEBEE", color: "#F44336" };
    default:
      return { background: "#F5F5F5", color: "#757575" };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'billing_issue':
      return 'Billing Issue';
    case 'bug_report':
      return 'Bug Report';
    case 'feature_request':
      return 'Feature Request';
    default:
      return type;
  }
};

const columns = [
  {
    header: "Ticket No",
    cell: (row: any) => row.ticketNo,
  },
  {
    header: "Subject",
    cell: (row: any) => row.subject,
  },
  {
    header: "Type",
    cell: (row: any) => getTypeLabel(row.type),
  },
  {
    header: "Status",
    cell: (row: any) => (
      <div
        className="order-status py-2 text-center px-4 rounded-lg w-max"
        style={getStatusStyle(row.status)}
      >
        {row.status.replace('_', ' ').toUpperCase()}
      </div>
    ),
  },
  {
    header: "Submitted Date",
    cell: (row: any) => formatDate(row.createdAt),
  },
  {
    header: "Last Update",
    cell: (row: any) => formatDate(row.updatedAt),
  },
];

export const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getTickets();
      setTickets(response.results || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket: any) => {
    if (filter === 'all') return true;
    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(ticket.createdAt) >= weekAgo;
    }
    return true;
  });

  if (loading) return <Spinner />;

  return (
    <ContentWrapper title="Ticket History">
      <h3 className="pb-3 f-20">Tickets</h3>
    
      <div className="user-tabs">
        <div className="recent-orders table-card bg-white rounded-lg">
          <div className="table-header p-3 d-flex justify-content-between align-items-center">
            <h4 className="f-16 semi-bold">Ticket History</h4>
            <select 
              className="admin-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="week">This Week</option>
            </select>
          </div>
          <div className="table-admin">
            <Table
              columns={columns}
              data={filteredTickets}
              pagination={false}
              itemsPerPage={10}
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
