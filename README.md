## 开发日志写于beta0.7

到了`beta0.7`这个版本，可以说啊，已经似乎是那么回事儿啦！基本的功能呢，也有了，也就说可有查看访客人数了，包括，可有查看过去1分钟的，过去5分钟的，过去1小时的，过去1天的访客人数等等，这就是基本的功能了. 另外呢，我们还改了好些bug，比如说现在系统在启动的时候会自己去创建sockets文件夹，这样就不用手动创建了，以及呢，可以通过jsDelivr访问咱们这个系统在前端的bundle.js了，部署起来更加方便，还有就是，开始支持通过环境变量来设置一些东西，比如说，通过`ONLINE_SERVICES_SERVER_NAME`来设置域名，进而可以让Caddy自动帮咱们申请证书，就不用再手动申请证书了，比如说呢，你设置

```
export ONLINE_SERVICES_SERVER_NAME="services.yoursite.com"
```

之后，Caddy就会帮你申请services.yoursite.com这个域名的证书，当然啦，前提是你得已经正确配置好了这个域名的A记录对吧. 还有就是，你设置

```
export ONLINE_SERVICES_SERVER_WEBROOT="/path/to/webroot/"
```

可以配置services.yoursite.com这个网站的根目录，或者如果是默认的话，就是项目文件夹下的frontend目录，这个比之前好些啦. 其实还有好多东西呢，我们都可以通过环境变量来设置，让我们拭目以待吧！