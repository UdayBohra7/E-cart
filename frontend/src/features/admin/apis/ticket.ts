import { axios } from '@/lib/axios';

export const createTicket = async (ticketData) => {
  const response = await axios.post('/tickets', ticketData);
  return response.data;
};

export const getTickets = async (params = {}) => {
  const response = await axios.get('/tickets', { params });
  return response.data;
};

export const getTicketById = async (ticketId) => {
  const response = await axios.get(`/tickets/${ticketId}`);
  return response.data;
};

export const updateTicket = async (ticketId, updateData) => {
  const response = await axios.patch(`/tickets/${ticketId}`, updateData);
  return response.data;
};

export const deleteTicket = async (ticketId) => {
  await axios.delete(`/tickets/${ticketId}`);
};