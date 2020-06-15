## 开发日志写于beta0.9

刚刚实现了获取各个时间区段在线访客数量的API，下一步可以考虑把links那个项目的前端迁移过来，结合d3.js，做一下数据可视化，使得使用起来更方便一些. 然而，目前有许多可选的选项，有很多事情可以做：

1. 开发前端界面，做数据可视化；
2. 引入持续集成(CI)，实现自动部署，在本地推送后，运行环境得到提示，进而自动拉取最新的提交，自动重新加载程序，方便进行快速迭代，同时改善开发体验；
3. 与Telegram API集成，通过Bot将消息发送到Telegram的频道/账户上，不过我觉得现在这个可以先不急着做，但是想想也是挺有意思的；
4. 优化内部结构，改善模块与模块直接的连接性，例如，将内部数据的同步从以HTTP请求的方式进行改为以共享全局变量的方式进行，因为这样子的话就不用区分来自外部的流量和来自内部的流量了，因为这样子的话所有的流量其实就都是来自外部的了；
5. 请求限流，防止滥用，也就是限制每个IP在固定长度的时间窗口内最多可发送的请求次数，这个其实更加基本一些，并且基本上每个API都有，所以我觉得咱们的也要有.

不过，既然从0到1的过程都完成了，说明从1到更多也其实并不难.

### 往期开发日志回顾

- [开发日志写于beta0.8](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.8.md)
- [开发日志写于beta0.7](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.7.md)
- [开发日志写于beta0.4](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.4.md)