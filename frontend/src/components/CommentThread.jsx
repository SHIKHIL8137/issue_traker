import { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Input from './ui/Input.jsx';
import Button from './ui/Button.jsx';

function CommentItem({ node, onReply }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const textTertiary = theme === 'dark' ? 'text-slate-500' : 'text-slate-500';

  // Use the canReply property passed from the parent, default to false if not present
  const isAllowedToReply = node.canReply === true;

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
        <div className="mt-4 flex gap-2">
          <Input 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Write a reply..." 
            className="flex-1"
          />
          <Button 
            onClick={() => { onReply(node._id, text); setText(''); setShow(false); }}
            className="px-4 py-2"
          >
            Send
          </Button>
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
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  
  const handleSubmit = () => {
    if (text.trim()) {
      onReply(null, text);
      setText('');
    }
  };
  
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Add a comment..." 
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button 
          onClick={handleSubmit}
          className="px-4 py-2"
        >
          Post
        </Button>
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