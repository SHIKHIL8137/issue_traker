import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

const handle = async (promise) => {
  try {
    const { data } = await promise;
    return data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Request failed';
    throw new Error(message);
  }
};

const api = {
  get: (url, params) => {
    const processedParams = { ...params };
    if (params?.assignee === 'exists') {
      processedParams.assigneeExists = true;
      delete processedParams.assignee;
    } else if (params?.assignee === 'null') {
      processedParams.unassigned = true;
      delete processedParams.assignee;
    }
    return handle(apiClient.get(url, { params: processedParams }));
  },
  post: (url, body) => handle(apiClient.post(url, body)),
  put: (url, body) => handle(apiClient.put(url, body)),
  patch: (url, body) => handle(apiClient.patch(url, body)),
  delete: (url) => handle(apiClient.delete(url)),

  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),

  listIssues: (query) => api.get('/issue', query),
  getIssue: (id) => api.get(`/issue/${id}`),
  createIssue: (payload) => api.post('/issue', payload),
  updateIssue: (id, payload) => api.patch(`/issue/${id}`, payload),
  deleteIssue: (id) => api.delete(`/issue/${id}`),
  assignIssue: (id, userId) => api.patch(`/issue/${id}`, { assignee: userId }),
  updateStatus: (id, status) => api.patch(`/issue/${id}`, { status }),
  acceptAssignment: (id) => api.patch(`/issue/${id}/accept`),
  rejectAssignment: (id) => api.patch(`/issue/${id}/reject`),

  listComments: (issueId) => api.get(`/comment/issue/${issueId}`),
  addComment: (issueId, content, parentId) => api.post('/comment', { issueId, text: content, parentCommentId: parentId }),

  getIssueAuditLogs: (issueId) => api.get(`/audit/issue/${issueId}`),

  listUsers: () => api.get('/users'),
  updateUserRole: (userId, role) => api.patch(`/users/${userId}/role`, { role })
};

export default api;