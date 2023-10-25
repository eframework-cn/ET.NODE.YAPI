## INSTALL
- Python3：https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe
  - System Env：PYTHON=C:/Program Files/Python312/python.exe
  - pip install setuptools
- MongoDB：https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.0-signed.msi
- Volta：https://github.com/volta-cli/volta/releases/download/v1.1.1/volta-1.1.1-windows-x86_64.msi
  - volta install node@12.22.8
- Dependency：yarn install
  - Registry: yarn config set registry https://registry.npm.taobao.org

## USAGE
### DEVELOP
- Client：
  - npm run build-client
- Server：
  - npm run install-server（first time）
  - npm run start

### DEPLOY

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
- server/install.js：修改初始化密码
- server/yapi.js：修改配置文件及前端资源路径

## FAQ
- 是否有同步源项目的必要？
  - 可不必同步，源项目接近停更，维护本分支更为合理