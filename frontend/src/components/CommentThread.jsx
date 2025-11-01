import { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Input from './ui/Input.jsx';
import Button from './ui/Button.jsx';
import ErrorDisplay from './ui/ErrorDisplay.jsx';
import { validateField } from '../utils/validation.js';

function CommentItem({ node, onReply }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const textTertiary = theme === 'dark' ? 'text-slate-500' : 'text-slate-500';

  const isAllowedToReply = node.canReply === true;

  const handleBlur = () => {
    setTouched(true);
    const validationError = validateField('comment', text);
    setError(validationError);
  };

  const handleFocus = () => {
    if (error) {
      setError('');
    }
  };

  const handleChange = (value) => {
    setText(value);
  };

  const handleSubmit = () => {
    setTouched(true);
    const validationError = validateField('comment', text);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    onReply(node._id, text);
    setText('');
    setShow(false);
    setTouched(false);
  };

  return (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-3 my-3">
      <div className={`text-sm ${textClass}`}>
        <span className="font-semibold">{node.user?.name || 'User'}</span> 
        <span className={`mx-2 ${textTertiary}`}>•</span> 
        <span className={`text-xs ${textTertiary}`}>{new Date(node.createdAt).toLocaleString()}</span>
        {node.user?.role && (
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            {node.user.role}
          </span>
        )}
      </div>
      <div className={`text-sm mt-2 ${textSecondary}`}>{node.content}</div>
      {isAllowedToReply && (
        <button 
          className={`text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mt-2`}
          onClick={() => setShow((v) => !v)}
        >
          Reply
        </button>
      )}
      {show && isAllowedToReply && (
        <div className="mt-4 flex flex-col gap-2">
          <Input 
            value={text} 
            onChange={(e) => handleChange(e.target.value)} 
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="Write a reply..." 
            className="flex-1"
          />
          {touched && error && <ErrorDisplay error={error} />}
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              className="px-4 py-2"
            >
              Send
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { setShow(false); setText(''); setError(''); setTouched(false); }}
              className="px-4 py-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {Array.isArray(node.children) && node.children.length > 0 && (
        <div className="ml-4 mt-3">
          {node.children.map((child) => (
            <CommentItem key={child._id} node={child} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentThread({ tree, onReply }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  
  const handleBlur = () => {
    setTouched(true);
    const validationError = validateField('comment', text);
    setError(validationError);
  };

  const handleFocus = () => {
    if (error) {
      setError('');
    }
  };

  const handleChange = (value) => {
    setText(value);
  };

  const handleSubmit = () => {
    setTouched(true);
    const validationError = validateField('comment', text);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    onReply(null, text);
    setText('');
    setTouched(false);
  };
  
  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <Input 
          value={text} 
          onChange={(e) => handleChange(e.target.value)} 
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder="Add a comment..." 
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        {touched && error && <ErrorDisplay error={error} />}
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit}
            className="px-4 py-2"
          >
            Post
          </Button>
        </div>
      </div>
      
      {(!tree || tree.length === 0) ? (
        <div className={`text-sm ${textSecondary} text-center py-6`}>
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div>
          {tree.map((n) => (
            <CommentItem 
              key={n._id} 
              node={n} 
              onReply={onReply} 
            />
          ))}
        </div>
      )}
    </div>
  );
}