# 开发日志写于beta0.12

在beta0.12我们给这个项目引入了翻天覆地的变化令人刮目相看.

我们重写了大部分的代码，重新组织了代码结构和文件目录结构，我们大量地应用stream，用以取代以前基于HTTP的内部通信方式，我们移除了caddy的自动配置代码，因为我们相信这个系统不应该和web server耦合，我们还使系统的各个子服务器的启动方式变得简洁，删去了许多不必要的检查，因为我们相信这些工作应当由一个专门的启动器来完成. 现在，可以说，这个系统面对它所被授予的任务正变得更加专注.

主要功能单元的实现被移到了analytics目录下或者servers目录下，意义也很明确，analytics主要负责存储、计算和分析，而servers主要负责接收和处理输入的请求. 

我们将这个项目重命名为online，因为它的主要应用就是统计网站的在线人数，同时这个新的名字也更加好记，且更加不容易拼错.

这一切的变动都是在ng分支下进行，ng的意思是Next Generation，象征着新的活力和无穷的动力.

### 往期开发日志回顾

- [开发日志写于beta0.11](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.11.md)
- [开发日志写于beta0.9](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.9.md)
- [开发日志写于beta0.8](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.8.md)
- [开发日志写于beta0.7](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.7.md)
- [开发日志写于beta0.4](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.4.md)