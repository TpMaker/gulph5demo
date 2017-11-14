# 前端项目安装与使用

#### 工具准备：
 
1. git 
2. .sourceTree
3. node

安装好以上工具后，开始：

  首先将项目克隆到本地，如图所示：
![Alt text](http://aixuedaiimg.oss-cn-hangzhou.aliyuncs.com/null/201676/164823414/20160706164822.png)

然后进入该文件根目录，打开命令窗口：`npm install` 安装项目依赖包 ( 此过程漫长而漫长，慢慢等。。)
安装完之后会发现目录中多了一个文件夹，这个文件夹里面放的是我们项目依赖的库，该目录不需要提交。
![Alt text](http://aixuedaiimg.oss-cn-hangzhou.aliyuncs.com/null/201676/164942727/20160706164942.png)


接下来 随便打开一个文件夹 ，比如`cps-h5`
把`config`目录下的`gulpconfig.sample.js`复制一份改名为 `gulpconfig.js`,并将里面的`remote`值改为自己项目的静态目录
![Alt text](http://aixuedaiimg.oss-cn-hangzhou.aliyuncs.com/null/201676/16495532/20160706164955.png)


到这里基本的配置已经完成，可以开始运作了。
![Alt text](http://aixuedaiimg.oss-cn-hangzhou.aliyuncs.com/null/201676/165004291/20160706165004.png)

在**H5** 目录下 跑`gulp`命令 会把H5的静态压缩到对应`cps-project`下的`H5`静态目录下，
其他不同的命令 可以参看 gulpfile.js 。

### 其他介绍
活动页的静态文件基本都是在**APP**目录下，**H5**和**APP** 可共用一套静态，页面分开两份。

该文档后续后继续完善。如有问题，请指正。

#### 常用命令

usage:
        1) build one or multiple project(s) to local dist folder:
            >> node bin/task build app,cps-h5
        2) build and deploy to cps project static folder
            >> node bin/task all app,cps-h5
        3) copy dist files to cps project static folder
            >> node bin/task copy app,cps-h5
        4) config front project set gulpconfig.js
            >> node bin/task config app,cps-h5
        5) js hint check errors
            >> node bin/task lint app,cps-h5
