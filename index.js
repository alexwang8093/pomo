const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 数据存储
let pomodoroHistory = [];
let notes = [];

// 身份验证中间件
function authenticate(req, res, next) {
  if (process.env.REQUIRE_AUTH !== 'true') {
    return next();
  }

  // 检查基本认证
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="番茄笔记同步服务"');
    return res.status(401).json({ error: '需要身份验证' });
  }
  
  // 解析认证信息
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const username = auth[0];
  const password = auth[1];
  
  if (username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD) {
    return next();
  }
  
  res.setHeader('WWW-Authenticate', 'Basic realm="番茄笔记同步服务"');
  return res.status(401).json({ error: '身份验证失败' });
}

// 支持JSON请求体解析
app.use(bodyParser.json({ limit: '10mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 应用身份验证中间件到所有API路由
app.use('/api', authenticate);

// API路由
// 获取历史记录
app.get('/api/history', (req, res) => {
  res.json(pomodoroHistory);
});

// 同步历史记录
app.post('/api/history/sync', (req, res) => {
  try {
    const newHistory = req.body;
    
    if (!Array.isArray(newHistory)) {
      return res.status(400).json({ success: false, message: '无效的历史记录格式' });
    }
    
    pomodoroHistory = newHistory;
    
    res.json({ success: true, message: '历史记录同步成功', count: newHistory.length });
  } catch (error) {
    console.error('同步历史记录时出错:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取便签
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// 同步便签
app.post('/api/notes/sync', (req, res) => {
  try {
    const newNotes = req.body;
    
    if (!Array.isArray(newNotes)) {
      return res.status(400).json({ success: false, message: '无效的便签格式' });
    }
    
    notes = newNotes;
    
    res.json({ success: true, message: '便签同步成功', count: newNotes.length });
  } catch (error) {
    console.error('同步便签时出错:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加新便签
app.post('/api/notes/add', (req, res) => {
  try {
    const newNote = req.body;
    
    if (!newNote || !newNote.content) {
      return res.status(400).json({ success: false, message: '便签内容不能为空' });
    }
    
    // 确保便签有ID和日期
    if (!newNote.id) {
      newNote.id = Date.now().toString();
    }
    
    if (!newNote.date) {
      newNote.date = new Date().toISOString();
    }
    
    notes.unshift(newNote); // 将新便签添加到开头
    
    res.json({ success: true, message: '便签添加成功', note: newNote });
  } catch (error) {
    console.error('添加便签时出错:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 便签页面路由
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// 启动服务器（仅在本地开发时使用，Vercel会自动处理）
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`服务器已启动，端口: ${PORT}`);
  });
}

// 导出应用供Vercel使用
module.exports = app; 