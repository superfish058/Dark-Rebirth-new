const db = require('../models/db');

// 获取用户的所有日记分类
const getJournalCategories = (req, res) => {
  const userId = req.user.userId;
  
  db.all('SELECT * FROM journal_categories WHERE user_id = ? ORDER BY sort_order ASC, created_at ASC', [userId], (err, categories) => {
    if (err) {
      console.error('获取日记分类失败:', err);
      return res.status(500).json({ error: '获取日记分类失败' });
    }
    res.json(categories);
  });
};

// 创建新日记分类
const createJournalCategory = (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;
  
  if (!name) {
    return res.status(400).json({ error: '分类名称不能为空' });
  }
  
  db.run('INSERT INTO journal_categories (user_id, name) VALUES (?, ?)', [userId, name], function(err) {
    if (err) {
      console.error('创建日记分类失败:', err);
      return res.status(500).json({ error: '创建日记分类失败' });
    }
    res.json({ id: this.lastID, name });
  });
};

// 更新日记分类
const updateJournalCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  const userId = req.user.userId;
  
  if (!name) {
    return res.status(400).json({ error: '分类名称不能为空' });
  }
  
  // 验证分类是否属于当前用户
  db.get('SELECT * FROM journal_categories WHERE id = ? AND user_id = ?', [categoryId, userId], (err, category) => {
    if (err) {
      console.error('查询日记分类失败:', err);
      return res.status(500).json({ error: '查询日记分类失败' });
    }
    
    if (!category) {
      return res.status(404).json({ error: '日记分类不存在' });
    }
    
    db.run('UPDATE journal_categories SET name = ? WHERE id = ?', [name, categoryId], function(err) {
      if (err) {
        console.error('更新日记分类失败:', err);
        return res.status(500).json({ error: '更新日记分类失败' });
      }
      res.json({ id: categoryId, name });
    });
  });
};

// 删除日记分类
const deleteJournalCategory = (req, res) => {
  const categoryId = req.params.id;
  const userId = req.user.userId;
  
  // 验证分类是否属于当前用户
  db.get('SELECT * FROM journal_categories WHERE id = ? AND user_id = ?', [categoryId, userId], (err, category) => {
    if (err || !category) {
      return res.status(404).json({ error: '日记分类不存在' });
    }
    
    // 先将该分类下的笔记的category_id设置为null
    db.run('UPDATE journal_notes SET category_id = NULL WHERE category_id = ? AND user_id = ?', [categoryId, userId], (err) => {
      if (err) {
        console.error('更新笔记分类失败:', err);
        return res.status(500).json({ error: '更新笔记分类失败' });
      }
      
      // 再删除分类
      db.run('DELETE FROM journal_categories WHERE id = ?', [categoryId], function(err) {
        if (err) {
          console.error('删除日记分类失败:', err);
          return res.status(500).json({ error: '删除日记分类失败' });
        }
        res.sendStatus(204);
      });
    });
  });
};

// 获取用户的所有笔记
const getJournalNotes = (req, res) => {
  const userId = req.user.userId;
  
  db.all(`
    SELECT jn.*, jc.name as category_name 
    FROM journal_notes jn 
    LEFT JOIN journal_categories jc ON jn.category_id = jc.id 
    WHERE jn.user_id = ? 
    ORDER BY jn.updated_at DESC
  `, [userId], (err, notes) => {
    if (err) {
      console.error('获取日记笔记失败:', err);
      return res.status(500).json({ error: '获取日记笔记失败' });
    }
    res.json(notes);
  });
};

// 获取单个笔记
const getJournalNote = (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;
  
  db.get(`
    SELECT jn.*, jc.name as category_name 
    FROM journal_notes jn 
    LEFT JOIN journal_categories jc ON jn.category_id = jc.id 
    WHERE jn.id = ? AND jn.user_id = ?
  `, [noteId, userId], (err, note) => {
    if (err) {
      console.error('获取日记笔记失败:', err);
      return res.status(500).json({ error: '获取日记笔记失败' });
    }
    
    if (!note) {
      return res.status(404).json({ error: '日记笔记不存在' });
    }
    
    res.json(note);
  });
};

// 创建新笔记
const createJournalNote = (req, res) => {
  const { title, content, category_id } = req.body;
  const userId = req.user.userId;
  
  if (!content) {
    return res.status(400).json({ error: '笔记内容不能为空' });
  }
  
  // 验证分类是否属于当前用户（如果提供了分类）
  if (category_id) {
    db.get('SELECT * FROM journal_categories WHERE id = ? AND user_id = ?', [category_id, userId], (err, category) => {
      if (err) {
        console.error('查询日记分类失败:', err);
        return res.status(500).json({ error: '查询日记分类失败' });
      }
      
      if (!category) {
        return res.status(404).json({ error: '日记分类不存在' });
      }
      
      insertNote();
    });
  } else {
    insertNote();
  }
  
  function insertNote() {
    const now = new Date().toISOString();
    db.run(
      'INSERT INTO journal_notes (user_id, title, content, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', 
      [userId, title || '', content, category_id || null, now, now], 
      function(err) {
        if (err) {
          console.error('创建日记笔记失败:', err);
          return res.status(500).json({ error: '创建日记笔记失败' });
        }
        
        // 返回创建的笔记
        db.get(`
          SELECT jn.*, jc.name as category_name 
          FROM journal_notes jn 
          LEFT JOIN journal_categories jc ON jn.category_id = jc.id 
          WHERE jn.id = ?
        `, [this.lastID], (err, note) => {
          if (err) {
            console.error('获取创建的笔记失败:', err);
            return res.status(500).json({ error: '获取创建的笔记失败' });
          }
          res.json(note);
        });
      }
    );
  }
};

// 更新笔记
const updateJournalNote = (req, res) => {
  const noteId = req.params.id;
  const { title, content, category_id } = req.body;
  const userId = req.user.userId;
  
  if (!content) {
    return res.status(400).json({ error: '笔记内容不能为空' });
  }
  
  // 验证笔记是否属于当前用户
  db.get('SELECT * FROM journal_notes WHERE id = ? AND user_id = ?', [noteId, userId], (err, note) => {
    if (err) {
      console.error('查询日记笔记失败:', err);
      return res.status(500).json({ error: '查询日记笔记失败' });
    }
    
    if (!note) {
      return res.status(404).json({ error: '日记笔记不存在' });
    }
    
    // 验证分类是否属于当前用户（如果提供了分类）
    if (category_id) {
      db.get('SELECT * FROM journal_categories WHERE id = ? AND user_id = ?', [category_id, userId], (err, category) => {
        if (err) {
          console.error('查询日记分类失败:', err);
          return res.status(500).json({ error: '查询日记分类失败' });
        }
        
        if (!category) {
          return res.status(404).json({ error: '日记分类不存在' });
        }
        
        updateNote();
      });
    } else {
      updateNote();
    }
    
    function updateNote() {
      const now = new Date().toISOString();
      db.run(
        'UPDATE journal_notes SET title = ?, content = ?, category_id = ?, updated_at = ? WHERE id = ?', 
        [title || '', content, category_id || null, now, noteId], 
        function(err) {
          if (err) {
            console.error('更新日记笔记失败:', err);
            return res.status(500).json({ error: '更新日记笔记失败' });
          }
          
          // 返回更新后的笔记
          db.get(`
            SELECT jn.*, jc.name as category_name 
            FROM journal_notes jn 
            LEFT JOIN journal_categories jc ON jn.category_id = jc.id 
            WHERE jn.id = ?
          `, [noteId], (err, note) => {
            if (err) {
              console.error('获取更新后的笔记失败:', err);
              return res.status(500).json({ error: '获取更新后的笔记失败' });
            }
            res.json(note);
          });
        }
      );
    }
  });
};

// 删除笔记
const deleteJournalNote = (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;
  
  // 验证笔记是否属于当前用户
  db.get('SELECT * FROM journal_notes WHERE id = ? AND user_id = ?', [noteId, userId], (err, note) => {
    if (err || !note) {
      return res.status(404).json({ error: '日记笔记不存在' });
    }
    
    db.run('DELETE FROM journal_notes WHERE id = ?', [noteId], function(err) {
      if (err) {
        console.error('删除日记笔记失败:', err);
        return res.status(500).json({ error: '删除日记笔记失败' });
      }
      res.sendStatus(204);
    });
  });
};

// 更新分类排序
const updateCategoryOrder = (req, res) => {
  const { categoryOrders } = req.body;
  const userId = req.user.userId;
  
  if (!categoryOrders || !Array.isArray(categoryOrders)) {
    return res.status(400).json({ error: '排序数据无效' });
  }
  
  // 批量更新排序
  const updates = categoryOrders.map((order, index) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE journal_categories SET sort_order = ? WHERE id = ? AND user_id = ?', 
        [index, order.id, userId], 
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });
  
  Promise.all(updates)
    .then(() => {
      res.json({ success: true });
    })
    .catch(err => {
      console.error('更新分类排序失败:', err);
      res.status(500).json({ error: '更新分类排序失败' });
    });
};

module.exports = {
  getJournalCategories,
  createJournalCategory,
  updateJournalCategory,
  deleteJournalCategory,
  updateCategoryOrder,
  getJournalNotes,
  getJournalNote,
  createJournalNote,
  updateJournalNote,
  deleteJournalNote
};