## INSTALL
- Python3：https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe
  - System Env：PYTHON=C:/Program Files/Python312/python.exe
  - pip install setuptools
- MongoDB：https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.0-signed.msi
- Volta：https://github.com/volta-cli/volta/releases/download/v1.1.1/volta-1.1.1-windows-x86_64.msi
  - volta install node@12.22.8
- Dependency：yarn install
  - Registry: yarn config set registry https://registry.npmmirror.com

## USAGE
### CODING
- React简单教程：https://www.runoob.com/react/react-tutorial.html
  - state和props：state和props主要的区别在于props是不可变的，而state可以根据与用户交互来改变
  - props.match：路由信息
  - @connect：conncet是从react-redux中结构出来的一个装饰器，用来实现不同页面（或组件）的数据共享，避免组件间一层层的嵌套传值
  - react-autocomplete-input：https://www.npmjs.com/package/react-autocomplete-input
    - 输入符号'.'时会中断填充
- 经典MVC结构
  - server/controllers：后端控制
  - server/models：后端数据
  - client/containers：前端视图
  - client/reducer/modules：前端模块

### DEPLOY
- Client：
  - npm run build-client
- Server：
  - npm run start

## MODIFY
- client/constants/variable.js：新增CONN等HTTP_METHOD
- client/containers/Project/Interface/InterfaceList/AddInterfaceForm.js：新增CONN等字段交互支持
- client/containers/Project/Interface/InterfaceList/complete.css：输入自动提示样式文件
- client/containers/Project/Interface/InterfaceList/InterfaceEditForm.js：修改接口编辑交互
- client/containers/Project/Interface/InterfaceList/View.js：修改接口信息界面
- client/containers/Project/Setting/ProjectData/ProjectData.js：新增上传协议文件交互支持
- server/controllers/interface.js：新增前端相关接口，如：pushProto、listProto、delProto、pullProto、getID等
- server/models/interface.js：新增req_id、req_pb、resp_id、resp_pb等字段
- server/app.js：修改文件上传大小限制为10mb：app.use(koaBody({ strict: false, multipart: true, jsonLimit: '10mb', formLimit: '10mb', textLimit: '10mb' }));
- server/install.js：修改初始化密码，移除install-server和init.lock，合并至启动阶段
- server/yapi.js：修改配置文件及前端资源路径

## DIFF
- 新增CONN、CGI、PNET、RPC等协议支持
- 新增数据协议面板控制协议文件的同步等操作
- 新增管理员权限级别的个人密钥
- 新增/api/interface/sync_proto接口以提供Hook支持（当前支持腾讯工蜂）
- 新增项目动态日志采集（同步协议、更新协议、上传协议、删除协议等）
- 修改数据同步的默认方式为智能合并
- 修改默认的管理员密码及关闭邮件（config.json）

## FAQ
- 是否有同步源项目的必要？
  - 可不必同步，源项目已经停更，维护本分支更为合理

## TODO
- Docker镜像发布需要自动化（Action）
- 需支持管理员创建用户/接口创建用户