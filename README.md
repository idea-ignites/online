## 开发日志写于beta0.11

经过我的一些努力，当前这个项目已经能够做在我从本地提交代码后自动重新编译并更新，不管这个顺序是怎样，至少这些功能已经是自动化的了，我觉得更好的顺序应该是：服务器在收到我提交的代码后，先进行编译和做一些设定好的检查，编译成功并且通过检查后，再重启服务进程，这应该可以做到，但是没关系啦，反正就当前阶段而言对软件短暂离线的时间并不是特别敏感，开发的初期快速迭代是没错的. 

这个功能我主要是用Gulp的watch功能和Git Hook实现的，当我在开发机向我自建的Git服务器提交代码后，Git服务器就会运行一个被称作是`post receive`的「触发器」(hook)脚本，这个触发器脚本会首先`unset`环境变量`GIT_DIR`，然后切换到项目在服务器上的工作目录，指向拉取操作，也就是拉取最新的提交，拉取了之后呢，如果拉取成功了，会使工作目录也就是worktree的内容发送改变，也就是工作目录下有些文件被改变，这就触发了Gulp的文件监控系统，Gulp察觉到文件变动之后首先编译新的代码，编译好后把现有的进程kill掉，kill掉之后再加载新编译好的程序，就是这么样的一个大概的过程.

说实话Git Hook这个功能之前我是用过的，只不过忘记unset环境变量，弄了好久，直到使用搜索引擎才找到问题所在，不过，也可以说是我文档每看仔细，不过谁喜欢看文档一大堆密密麻麻的字？看文档是被灌输的过程，是被填鸭的过程，而自己写代码才是创造不是么？

现在我觉得Gulp和Git Hook结合起来，也能实现我的另外一个项目links的自动化，也能实现我的博客的编译和发布过程的自动化，以前都是手动运行hugo，然后再rsync到服务器上，以后我配置好了Gulp和Git Hook的话，只需Git提交就好了，具体的工作都可以交由程序来自动化地完成，还是很不错的.

Git Hook的妙用可不止是在自动向CI服务器发送信号启动编译程序，Git Hook具体是分好多个，是在不同的阶段执行的，客户端有客户端的触发器，服务端也有服务端的触发器，Git确实还有好多功能值得我们去发掘，比如说，向是在Telegram频道/群组推送项目的提交信息啊，向是检查提交内容和提交评论啊，都可以用Git Hook很容易的做到，你可以用shell语言编写触发器脚本，也可以用JavaScript，Python或者Perl编写触发器脚本，也可以用其他语言编写触发器脚本，总之是很方便的.

以后提交代码就不再用登录服务器去手动重启服务查看效果了，开发进度应该可以变快.

### 往期开发日志回顾

- [开发日志写于beta0.9](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.9.md)
- [开发日志写于beta0.8](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.8.md)
- [开发日志写于beta0.7](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.7.md)
- [开发日志写于beta0.4](https://github.com/explorebeyondthestars/onlineServices/blob/testing/documentations/notes/beta0.4.md)