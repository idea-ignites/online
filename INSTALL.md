## 如何部署这个项目

这个项目是一个依赖Node.js和Caddy环境的一个访客流量统计和分析系统，部署这个项目，大概分为下列几个步骤

### 安装依赖项

首先安装最新版的`npm`和`nodejs`:

```
apt install npm
```

然后全局安装`typescript`编译器：

```
npm install -g typescript
```

以及安装`gulp`自动化构建工具

```
npm install -g gulp
```

有了以上这些工具基本上足够编译整个项目了，只不过，要想让项目运行，还需安装`Caddy`网页服务器：

```
echo \ 
"deb [trusted=yes] https://apt.fury.io/caddy/ /" \
| sudo tee -a /etc/apt/sources.list.d/caddy-fury.list

sudo apt update
sudo apt install caddy
```

启动Caddy服务器

```
caddy start
```

Caddy需要能够监听80，443端口.

### 拉取并编译项目

首先拉取项目

```
git clone https://github.com/explorebeyondthestars/onlineServices.git
```

然后进入项目目录，并把`Node.js`软件包依赖项都安装齐全

```
cd onlineServices
npm install
```
