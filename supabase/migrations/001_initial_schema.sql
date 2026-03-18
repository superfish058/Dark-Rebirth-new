-- Dark Rebirth 数据库迁移脚本
-- 版本: 1.0.0
-- 说明: 创建所有必要的表、索引和RLS策略

-- ============================================
-- 0. 清理已存在的对象（确保可重复执行）
-- ============================================

-- 删除已存在的视图
DROP VIEW IF EXISTS web_collections_details;

-- 删除已存在的触发器（auth.users表）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 删除已存在的函数
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- ============================================
-- 1. 分类表 (categories)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- 插入默认分类数据
INSERT INTO categories (name, icon, sort_order) VALUES
  ('编程AI', '🤖', 1),
  ('生活技能', '🏠', 2),
  ('学习教育', '📚', 3),
  ('娱乐休闲', '🎮', 4),
  ('工作效率', '⚡', 5),
  ('其他', '📦', 6)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. 用户表 (profiles)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nickname VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- ============================================
-- 3. 网页收藏表 (web_collections)
-- ============================================
CREATE TABLE IF NOT EXISTS web_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  icon_url TEXT,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_web_collections_user_id ON web_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_web_collections_category_id ON web_collections(category_id);
CREATE INDEX IF NOT EXISTS idx_web_collections_created_at ON web_collections(created_at DESC);

-- ============================================
-- 4. 待办事项表 (todos)
-- ============================================
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

-- ============================================
-- 5. 轮播图表 (banners)
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_banners_sort_order ON banners(sort_order);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);

-- 插入默认轮播图数据
INSERT INTO banners (title, image_url, link_url, sort_order, is_active) VALUES
  ('欢迎使用 Dark Rebirth', 'https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Welcome+to+Dark+Rebirth', '/m/home', 1, true),
  ('探索更多功能', 'https://via.placeholder.com/800x400/6366F1/FFFFFF?text=Explore+Features', '/m/apps', 2, true),
  ('高效管理您的收藏', 'https://via.placeholder.com/800x400/7C3AED/FFFFFF?text=Manage+Your+Collections', '/web-collection', 3, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. Row Level Security (RLS) 策略
-- ============================================

-- 启用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- profiles 表策略
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- web_collections 表策略
CREATE POLICY "Users can view their own web collections"
  ON web_collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own web collections"
  ON web_collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own web collections"
  ON web_collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own web collections"
  ON web_collections FOR DELETE
  USING (auth.uid() = user_id);

-- todos 表策略
CREATE POLICY "Users can view their own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);

-- categories 和 banners 表公开读取（不需要认证）
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  USING (is_active = true);

-- ============================================
-- 7. 触发器
-- ============================================

-- 更新 updated_at 字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有表添加 updated_at 触发器
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_web_collections_updated_at
  BEFORE UPDATE ON web_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. 用户注册触发器
-- ============================================

-- 自动创建 profile 记录的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname)
  VALUES (NEW.id, SPLIT_PART(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 9. 视图
-- ============================================

-- 创建网页收藏详情视图（包含分类信息）
CREATE OR REPLACE VIEW web_collections_details AS
SELECT
  wc.*,
  c.name as category_name,
  c.icon as category_icon
FROM web_collections wc
LEFT JOIN categories c ON wc.category_id = c.id;

-- ============================================
-- 10. 完成信息
-- ============================================

-- 数据库迁移完成
-- 版本: 1.0.0
-- 日期: 2026-03-17
-- 说明: 所有表、索引、RLS策略和触发器已创建完成