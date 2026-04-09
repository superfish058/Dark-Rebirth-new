import axios from 'axios';

const API_BASE_URL = '/api/journal';

// 创建axios实例
const journalApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器，添加token
journalApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 分类相关API
export const categoryApi = {
  // 获取所有分类
  getCategories: async () => {
    try {
      const response = await journalApi.get('/categories');
      return response.data;
    } catch (error) {
      console.error('获取分类失败:', error);
      throw error;
    }
  },
  
  // 创建新分类
  createCategory: async (name) => {
    try {
      const response = await journalApi.post('/categories', { name });
      return response.data;
    } catch (error) {
      console.error('创建分类失败:', error);
      throw error;
    }
  },
  
  // 更新分类
  updateCategory: async (id, name) => {
    try {
      const response = await journalApi.put(`/categories/${id}`, { name });
      return response.data;
    } catch (error) {
      console.error('更新分类失败:', error);
      throw error;
    }
  },
  
  // 删除分类
  deleteCategory: async (id) => {
    try {
      const response = await journalApi.delete(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error('删除分类失败:', error);
      throw error;
    }
  },
  
  // 更新分类排序
  updateCategoryOrder: async (categoryOrders) => {
    try {
      const response = await journalApi.put('/categories/reorder', { categoryOrders });
      return response.data;
    } catch (error) {
      console.error('更新分类排序失败:', error);
      throw error;
    }
  }
};

// 笔记相关API
export const noteApi = {
  // 获取所有笔记
  getNotes: async () => {
    try {
      const response = await journalApi.get('/notes');
      return response.data;
    } catch (error) {
      console.error('获取笔记失败:', error);
      throw error;
    }
  },
  
  // 获取单个笔记
  getNote: async (id) => {
    try {
      const response = await journalApi.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取笔记失败:', error);
      throw error;
    }
  },
  
  // 创建新笔记
  createNote: async (note) => {
    try {
      const response = await journalApi.post('/notes', note);
      return response.data;
    } catch (error) {
      console.error('创建笔记失败:', error);
      throw error;
    }
  },
  
  // 更新笔记
  updateNote: async (id, note) => {
    try {
      const response = await journalApi.put(`/notes/${id}`, note);
      return response.data;
    } catch (error) {
      console.error('更新笔记失败:', error);
      throw error;
    }
  },
  
  // 删除笔记
  deleteNote: async (id) => {
    try {
      const response = await journalApi.delete(`/notes/${id}`);
      return response;
    } catch (error) {
      console.error('删除笔记失败:', error);
      throw error;
    }
  }
};

export default {
  category: categoryApi,
  note: noteApi
};