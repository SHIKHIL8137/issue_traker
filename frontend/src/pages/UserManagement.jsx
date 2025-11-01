import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import api from '../services/api.js';
import Card from '../components/ui/Card.jsx';
import Select from '../components/ui/Select.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Loader from '../components/ui/Loader.jsx';
import { motion } from 'framer-motion';

export default function UserManagement() {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  const load = async () => {
    setInitialLoading(true);
    try {
      const data = await api.listUsers();
      setUsers(data.users || data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateRole = async (userId, role) => {
    setLoading(true);
    try {
      await api.updateUserRole(userId, role);
      await load();
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
      <SectionHeader title="User Management" />
      
      <Card className="p-5 rounded-2xl shadow-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-slate-700">
                <th className="p-3 font-semibold text-left">Name</th>
                <th className="p-3 font-semibold text-left">Email</th>
                <th className="p-3 font-semibold text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <motion.tr 
                  key={u._id} 
                  className="border-b dark:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <td className={`p-3 ${textClass}`}>{u.name}</td>
                  <td className={`p-3 ${textSecondary}`}>{u.email}</td>
                  <td className="p-3">
                    <Select 
                      value={u.role} 
                      disabled={loading} 
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="w-32"
                    >
                      <option value="User">User</option>
                      <option value="Developer">Developer</option>
                    </Select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className={`text-center py-8 ${textSecondary}`}>
            No users found
          </div>
        )}
      </Card>
    </motion.div>
  );
}