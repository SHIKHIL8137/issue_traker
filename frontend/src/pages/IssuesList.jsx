import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import api from '../services/api.js';
import IssueCard from '../components/IssueCard.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Loader from '../components/ui/Loader.jsx';
import { motion } from 'framer-motion';

export default function IssuesList() {
  const { theme } = useTheme();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listIssues({ q, status, priority });
      setIssues(data.issues || data);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader title="Issues" />
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[240px] flex-1">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title/description" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option>Open</option>
          <option>In-Progress</option>
          <option>Resolved</option>
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </Select>
        <Button onClick={load}>Filter</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {issues.map((i) => (
          <IssueCard key={i._id} issue={i} />
        ))}
      </div>
      {issues.length === 0 && (
        <div className={`text-center py-12 ${textSecondary}`}>
          <p>No issues found matching your criteria</p>
        </div>
      )}
    </motion.div>
  );
}