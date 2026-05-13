import { useState, useEffect, useCallback } from 'react';
import { leadsApi } from '../utils/api';
import toast from 'react-hot-toast';

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', source: '' });

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      const { data } = await leadsApi.getAll(params);
      setLeads(data.leads);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await leadsApi.getStats();
      setStats(data);
    } catch {
      console.error('Failed to fetch stats');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('lf_token');
    if (token) fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    const token = localStorage.getItem('lf_token');
    if (token) fetchStats();
  }, [fetchStats, leads]);

  const addLead = async (formData) => {
    const toastId = toast.loading('Adding lead...');
    try {
      const { data } = await leadsApi.create(formData);
      setLeads(prev => [data, ...prev]);
      toast.success('Lead added successfully!', { id: toastId });
      return true;
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || 'Failed to add lead';
      toast.error(msg, { id: toastId });
      return false;
    }
  };

  const updateStatus = async (id, status, notes) => {
    const toastId = toast.loading('Updating...');
    try {
      const { data } = await leadsApi.updateStatus(id, { status, notes });
      setLeads(prev => prev.map(l => l.id === id ? data : l));
      toast.success('Status updated!', { id: toastId });
    } catch {
      toast.error('Failed to update status', { id: toastId });
    }
  };

  const deleteLead = async (id) => {
    const toastId = toast.loading('Deleting...');
    try {
      await leadsApi.delete(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      toast.success('Lead deleted', { id: toastId });
    } catch {
      toast.error('Failed to delete lead', { id: toastId });
    }
  };

  return { leads, stats, loading, filters, setFilters, addLead, updateStatus, deleteLead };
}
