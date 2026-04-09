const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// 确保data目录存在
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// 数据库连接
const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// 检查列是否存在
function checkColumnExists(tableName, columnName, callback) {
  db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
    if (err) {
      callback(err, false);
      return;
    }
    const columnExists = columns.some(col => col.name === columnName);
    callback(null, columnExists);
  });
}

// 安全添加列
function addColumnIfNotExists(tableName, columnDefinition, callback) {
  // 从columnDefinition中提取列名
  const columnNameMatch = columnDefinition.match(/^\s*(\w+)\s+/);
  if (!columnNameMatch) {
    if (callback) callback(new Error('Invalid column definition'), false);
    return;
  }
  const columnName = columnNameMatch[1];
  
  checkColumnExists(tableName, columnName, (err, exists) => {
    if (err) {
      if (callback) callback(err, false);
      return;
    }
    
    if (!exists) {
      const sql = `ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition};`;
      db.run(sql, (err) => {
        if (err) {
          console.error(`添加列 ${columnName} 到表 ${tableName} 失败:`, err);
          if (callback) callback(err, false);
        } else {
          console.log(`成功添加列 ${columnName} 到表 ${tableName}`);
          if (callback) callback(null, true);
        }
      });
    } else {
      console.log(`列 ${columnName} 在表 ${tableName} 中已存在`);
      if (callback) callback(null, false);
    }
  });
}

// 初始化数据库表
db.serialize(() => {
  // 用户表
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 计划表
  db.run(`CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // 分类表
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // 网站表
  db.run(`CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    custom_icon INTEGER DEFAULT 0,
    icon_color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  
  // 添加use_online_icon字段（如果不存在）
  addColumnIfNotExists('websites', 'use_online_icon INTEGER DEFAULT 0');
  
  // 日记分类表
  db.run(`CREATE TABLE IF NOT EXISTS journal_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  
  // 添加sort_order字段（如果不存在）
  addColumnIfNotExists('journal_categories', 'sort_order INTEGER DEFAULT 0');
  
  // 日记表
  db.run(`CREATE TABLE IF NOT EXISTS journal_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    category_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES journal_categories(id)
  )`);
  
  // 这里可以添加其他需要的列
  // addColumnIfNotExists('websites', 'new_column TEXT DEFAULT NULL');
});

module.exports = db;