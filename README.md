# 番茄笔记同步服务

这是一个简单的Web应用，用于同步番茄钟历史记录和便签。

## 功能

- 查看番茄钟历史记录
- 添加和查看便签
- 基本身份验证保护
- 支持移动设备访问

## 部署到Vercel

1. 在GitHub上创建一个新仓库，将此项目代码上传

2. 登录到Vercel (https://vercel.com)

3. 点击"New Project"，然后导入你的GitHub仓库

4. 在项目设置中，添加以下环境变量:
   - `REQUIRE_AUTH`: 设置为 `true` 启用身份验证
   - `AUTH_USERNAME`: 你想要的用户名
   - `AUTH_PASSWORD`: 你想要的密码

5. 点击"Deploy"部署项目

## 本地开发

1. 安装依赖:
```
npm install
```

2. 启动开发服务器:
```
npm start
```

3. 访问 http://localhost:3000

## 在番茄钟应用中配置同步

1. 打开番茄钟应用中的同步配置

2. 设置服务器URL为你的Vercel应用URL

3. 设置用户名和密码

4. 启用自动同步

## 注意事项

- 此应用使用内存存储数据，重启后数据会丢失。在生产环境中，建议添加持久化存储。
- 为了安全，请确保设置强密码并启用身份验证。 