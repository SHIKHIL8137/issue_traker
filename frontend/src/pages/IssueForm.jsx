import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import api from '../services/api.js';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import ErrorDisplay from '../components/ui/ErrorDisplay.jsx';
import { validateField } from '../utils/validation.js';
import { motion } from 'framer-motion';

export default function IssueForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [touched, setTouched] = useState({});

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const inputBg = theme === 'dark' 
    ? 'bg-slate-800/50 text-white border-slate-700/50' 
    : 'bg-white text-slate-900 border-slate-200';

  useEffect(() => {
    async function load() {
      if (mode === 'edit' && id) {
        const data = await api.getIssue(id);
        const i = data.issue || data;
        setForm({ title: i.title, description: i.description, priority: i.priority });
      }
    }
    load();
  }, [id, mode]);

  const handleFieldBlur = (fieldName, value) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleFieldFocus = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setForm(prev => ({ ...prev, [fieldName]: value }));
  };

  const validate = () => {
    const newErrors = {};
    
    Object.keys(form).forEach(field => {
      const error = validateField(field, form[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({
      title: true,
      description: true,
      priority: true
    });
    
    setServerError('');
    
    if (!validate()) {
      return;
    }
    
    try {
      if (mode === 'edit') await api.updateIssue(id, form);
      else await api.createIssue(form);
      navigate('/issues');
    } catch (err) {
      setServerError(err.message || 'Failed to save issue');
    }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${textClass}`}>
          {mode === 'edit' ? 'Edit Issue' : 'Create New Issue'}
        </h1>
        <p className={`mt-2 ${textSecondary}`}>
          {mode === 'edit' ? 'Update your issue details' : 'Report a new issue to the team'}
        </p>
      </div>
      
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <ErrorDisplay error={serverError} />
        </motion.div>
      )}
      
      <Card className="p-6 rounded-2xl shadow-lg border">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-semibold ${textClass} mb-2`}>
              Title
            </label>
            <Input 
              value={form.title} 
              onChange={(e) => handleFieldChange('title', e.target.value)} 
              onBlur={(e) => handleFieldBlur('title', e.target.value)}
              onFocus={() => handleFieldFocus('title')}
              placeholder="Enter issue title" 
              className={`w-full ${(touched.title && errors.title) ? 'border-red-500' : ''}`}
            />
            {touched.title && errors.title && <div className="mt-2"><ErrorDisplay error={errors.title} /></div>}
          </div>
          
          <div>
            <label className={`block text-sm font-semibold ${textClass} mb-2`}>
              Description
            </label>
            <textarea 
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all min-h-[160px] ${inputBg} ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'} ${
                (touched.description && errors.description) ? 'border-red-500' : ''
              }`}
              value={form.description} 
              onChange={(e) => handleFieldChange('description', e.target.value)} 
              onBlur={(e) => handleFieldBlur('description', e.target.value)}
              onFocus={() => handleFieldFocus('description')}
              placeholder="Describe the issue in detail" 
            />
            {touched.description && errors.description && <div className="mt-2"><ErrorDisplay error={errors.description} /></div>}
          </div>
          
          <div>
            <label className={`block text-sm font-semibold ${textClass} mb-2`}>
              Priority
            </label>
            <Select 
              value={form.priority} 
              onChange={(e) => handleFieldChange('priority', e.target.value)}
              onBlur={(e) => handleFieldBlur('priority', e.target.value)}
              onFocus={() => handleFieldFocus('priority')}
              className={`w-full ${(touched.priority && errors.priority) ? 'border-red-500' : ''}`}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </Select>
            {touched.priority && errors.priority && <div className="mt-2"><ErrorDisplay error={errors.priority} /></div>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="px-6 py-2">
              Save Issue
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="px-6 py-2"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}