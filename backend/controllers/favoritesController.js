const db = require('../models/db');

// 获取所有收藏分类和网站
const getFavorites = (req, res) => {
  const userId = req.user.userId;
  
  // 添加缓存控制头，确保数据的新鲜度
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  // 获取用户的所有分类
  db.all('SELECT * FROM categories WHERE user_id = ? ORDER BY created_at ASC', [userId], (err, categories) => {
    if (err) {
      console.error('获取分类失败:', err);
      return res.status(500).json({ error: '获取分类失败' });
    }

    // 为每个分类获取对应的网站
    const categoriesWithWebsites = categories.map(category => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM websites WHERE category_id = ? AND user_id = ? ORDER BY created_at ASC', [category.id, userId], (err, websites) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...category,
              websites: websites.map(website => ({
                ...website,
                customIcon: website.custom_icon === 1,
                iconColor: website.icon_color
              }))
            });
          }
        });
      });
    });
    
    // 获取未分类的网站（category_id 为 999）
    const defaultCategoryPromise = new Promise((resolve, reject) => {
      db.all('SELECT * FROM websites WHERE category_id = 999 AND user_id = ? ORDER BY created_at ASC', [userId], (err, websites) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: '999',
            name: '默认分类',
            websites: websites.map(website => ({
              ...website,
              customIcon: website.custom_icon === 1,
              iconColor: website.icon_color
            }))
          });
        }
      });
    });
    
    Promise.all([...categoriesWithWebsites, defaultCategoryPromise])
      .then(result => {
        if (result.length === 0) {
          // 没有任何结果，只返回默认分类
          return res.json([{
            id: '999',
            name: '默认分类',
            websites: []
          }]);
        }
        
        const categoriesList = result.slice(0, -1);
        const defaultCategory = result[result.length - 1];
        
        // 检查是否已经存在默认分类
        const hasDefaultCategory = categoriesList.some(category => category.id === '999');

        // 如果不存在默认分类，就添加它
        if (!hasDefaultCategory) {
          categoriesList.unshift(defaultCategory);
        }

        res.json(categoriesList);
      })
      .catch(err => {
        console.error('获取网站失败:', err);
        res.status(500).json({ error: '获取网站失败' });
      });
  });
};

// 创建分类
const createCategory = (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;
  
  if (!name) {
    return res.status(400).json({ error: '分类名称不能为空' });
  }
  
  db.run('INSERT INTO categories (user_id, name) VALUES (?, ?)', [userId, name], function(err) {
    if (err) {
      return res.status(500).json({ error: '创建分类失败' });
    }
    res.json({ id: this.lastID, name, websites: [] });
  });
};

// 创建网站
const createWebsite = (req, res) => {
  let { categoryId, name, url, description, icon, customIcon, iconColor } = req.body;

  if (!name || !url) {
    return res.status(400).json({ error: '名称和 URL 不能为空' });
  }
  
  // 处理 categoryId 为空字符串或 '0' 或 null 的情况，使用默认值 999
  if (categoryId === '' || categoryId === '0' || categoryId === null) {
    categoryId = 999;
  } else {
    // 将 categoryId 转换为数字，以便比较
    categoryId = parseInt(categoryId);
  }

  // 如果 categoryId 不为 999，验证分类是否属于当前用户
  if (categoryId !== 999) {
    db.get('SELECT * FROM categories WHERE id = ? AND user_id = ?', [categoryId, req.user.userId], (err, category) => {
      if (err || !category) {
        return res.status(404).json({ error: '分类不存在' });
      }
      
      // 如果没有传递 icon 且不是自定义图标，生成网站图标
      if (!icon && !customIcon) {
        try {
          const domain = new URL(url).hostname;
          // 使用多种图标源，提高图标获取成功率
          icon = `https://api.faviconkit.com/${domain}/64`;
        } catch (error) {
          icon = null;
        }
      }
      
      db.run('INSERT INTO websites (user_id, category_id, name, url, description, icon, custom_icon, icon_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.userId, categoryId, name, url, description || '', icon, customIcon ? 1 : 0, iconColor],
        function(err) {
          if (err) {
            console.error('创建网站失败:', err);
            return res.status(500).json({ error: '创建网站失败' });
          }
          res.json({
            id: this.lastID,
            name,
            url,
            description: description || '',
            icon,
            customIcon,
            iconColor
          });
        }
      );
    });
  } else {
    // categoryId 为 999，创建默认分类的网站
    // 如果没有传递 icon 且不是自定义图标，生成网站图标
    if (!icon && !customIcon) {
      try {
        const domain = new URL(url).hostname;
        // 使用多种图标源，提高图标获取成功率
        icon = `https://api.faviconkit.com/${domain}/64`;
      } catch (error) {
        icon = null;
      }
    }
    
    db.run('INSERT INTO websites (user_id, category_id, name, url, description, icon, custom_icon, icon_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.userId, 999, name, url, description || '', icon, customIcon ? 1 : 0, iconColor],
      function(err) {
        if (err) {
          console.error('创建网站失败:', err);
          return res.status(500).json({ error: '创建网站失败' });
        }
        res.json({
          id: this.lastID,
          name,
          url,
          description: description || '',
          icon,
          customIcon,
          iconColor
        });
      }
    );
  }
};

// 更新网站
const updateWebsite = (req, res) => {
  const websiteId = req.params.id;
  let { name, url, description, icon, customIcon, iconColor, categoryId } = req.body;
  
  // 处理 categoryId 为空字符串或 '0' 或 null 的情况，使用默认值 999
  if (categoryId === '' || categoryId === '0' || categoryId === null) {
    categoryId = 999;
  } else {
    // 将 categoryId 转换为数字，以便比较
    categoryId = parseInt(categoryId);
  }
  
  // 验证网站是否属于当前用户
  db.get('SELECT * FROM websites WHERE id = ?', [websiteId], (err, website) => {
    if (err || !website) {
      return res.status(404).json({ error: '网站不存在' });
    }
    
    // 检查用户权限
    if (website.user_id !== req.user.userId) {
      return res.status(404).json({ error: '网站不存在' });
    }
    
    // 验证新分类是否属于当前用户（categoryId 不为 999 时）
  if (categoryId !== 999) {
    db.get('SELECT * FROM categories WHERE id = ? AND user_id = ?', [categoryId, req.user.userId], (err, category) => {
      if (err || !category) {
        return res.status(404).json({ error: '分类不存在' });
      }
      updateWebsiteData();
    });
  } else {
    updateWebsiteData();
  }
  
  function updateWebsiteData() {
    let finalIcon = icon;
    if (!finalIcon && !customIcon) {
      try {
        const domain = new URL(url).hostname;
        // 使用多种图标源，提高图标获取成功率
        finalIcon = `https://api.faviconkit.com/${domain}/64`;
      } catch (error) {
        finalIcon = null;
      }
    } else if (customIcon) {
      // 如果是自定义图标，将 icon 设置为 null
      finalIcon = null;
    }
    
    db.run('UPDATE websites SET name = ?, url = ?, description = ?, icon = ?, custom_icon = ?, icon_color = ?, category_id = ? WHERE id = ?',
      [name, url, description || '', finalIcon, customIcon ? 1 : 0, iconColor, categoryId, websiteId],
      function(err) {
        if (err) {
          console.error('更新网站失败:', err);
          return res.status(500).json({ error: '更新网站失败' });
        }
        res.json({
          id: websiteId,
          name,
          url,
          description: description || '',
          icon: finalIcon,
          customIcon,
          iconColor,
          categoryId
        });
      }
    );
  }
  });
};

// 删除网站
const deleteWebsite = (req, res) => {
  const websiteId = req.params.id;
  
  // 验证网站是否属于当前用户
  db.get('SELECT * FROM websites WHERE id = ?', [websiteId], (err, website) => {
    if (err || !website) {
      return res.status(404).json({ error: '网站不存在' });
    }
    
    // 检查用户权限
    if (website.user_id !== req.user.userId) {
      return res.status(404).json({ error: '网站不存在' });
    }
    
    db.run('DELETE FROM websites WHERE id = ?', [websiteId], function(err) {
      if (err) {
        return res.status(500).json({ error: '删除网站失败' });
      }
      res.sendStatus(204);
    });
  });
};

// 更新分类
const updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: '分类名称不能为空' });
  }

  // 验证分类是否属于当前用户
  db.get('SELECT * FROM categories WHERE id = ? AND user_id = ?', [categoryId, req.user.userId], (err, category) => {
    if (err) {
      console.error('查询分类失败:', err);
      return res.status(500).json({ error: '查询分类失败' });
    }

    if (!category) {
      return res.status(404).json({ error: '分类不存在' });
    }

    db.run('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId], function(err) {
      if (err) {
        console.error('更新分类失败:', err);
        return res.status(500).json({ error: '更新分类失败' });
      }

      res.json({ id: categoryId, name });
    });
  });
};

// 删除分类
const deleteCategory = (req, res) => {
  const categoryId = req.params.id;
  
  // 验证分类是否属于当前用户
  db.get('SELECT * FROM categories WHERE id = ? AND user_id = ?', [categoryId, req.user.userId], (err, category) => {
    if (err || !category) {
      return res.status(404).json({ error: '分类不存在' });
    }
    
    // 先删除分类下的所有网站
    db.run('DELETE FROM websites WHERE category_id = ?', [categoryId], (err) => {
      if (err) {
        return res.status(500).json({ error: '删除网站失败' });
      }
      
      // 再删除分类
      db.run('DELETE FROM categories WHERE id = ?', [categoryId], function(err) {
        if (err) {
          return res.status(500).json({ error: '删除分类失败' });
        }
        res.sendStatus(204);
      });
    });
  });
};

module.exports = {
  getFavorites,
  createCategory,
  updateCategory,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  deleteCategory
};