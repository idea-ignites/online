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

依赖项安装齐全之后就可以编译了，首先编译基本组成

```
tsc main.ts
```

然后，可选地，去编译前端页面，这个是用作测试用的页面

```
cd frontend
gulp
```

这样子就编译好整个项目了.

### 运行项目

首先将两个测试域名指向本机

```
echo "127.0.0.1 yoursite.com" >> /etc/hosts
echo "127.0.0.1 services.yoursite.com" >> /etc/hosts
```

然后启动项目

```
cd ..
node main.js
```

然后本地浏览器访问`yoursite.com`，然后

```
curl -s http://services.yoursite.com/onlinesInfo | jq
```

多试几次，应该可以看到输出

```
{
  "onlinesStats": {
    "last24HoursOnlines": 5,
    "last12HoursOnlines": 5,
    "last1HourOnlines": 1,
    "last30MinutesOnlines": 1,
    "last10MinutesOnlines": 1,
    "last5MinutesOnlines": 1
  }
}
```

这就完成了一次对整个项目的测试部署和测试运行.