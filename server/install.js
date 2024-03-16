module.exports = async function installDB() {
  const yapi = require('./yapi.js');
  const mongoose = require('mongoose');
  const userModel = require('./models/user.js');

  await new Promise(resolve => yapi.connect.then(resolve));

  let userInst = yapi.getInst(userModel);
  let user = await userInst.findByEmail(yapi.WEBCONFIG.adminAccount).then();
  if (user) {
    yapi.commons.log(`系统已经初始化管理员，账号："${yapi.WEBCONFIG.adminAccount}"`);
  } else {
    let userCol = mongoose.connection.db.collection('user');
    userCol.createIndex({ username: 1 });
    userCol.createIndex({ email: 1 }, { unique: true });

    let projectCol = mongoose.connection.db.collection('project');
    projectCol.createIndex({ uid: 1 });
    projectCol.createIndex({ name: 1 });
    projectCol.createIndex({ group_id: 1 });

    let logCol = mongoose.connection.db.collection('log');
    logCol.createIndex({ uid: 1 });

    logCol.createIndex({ typeid: 1, type: 1 });

    let interfaceColCol = mongoose.connection.db.collection('interface_col');
    interfaceColCol.createIndex({ uid: 1 });
    interfaceColCol.createIndex({ project_id: 1 });

    let interfaceCatCol = mongoose.connection.db.collection('interface_cat');
    interfaceCatCol.createIndex({ uid: 1 });
    interfaceCatCol.createIndex({ project_id: 1 });

    let interfaceCaseCol = mongoose.connection.db.collection('interface_case');
    interfaceCaseCol.createIndex({ uid: 1 });
    interfaceCaseCol.createIndex({ col_id: 1 });
    interfaceCaseCol.createIndex({ project_id: 1 });

    let interfaceCol = mongoose.connection.db.collection('interface');
    interfaceCol.createIndex({ uid: 1 });
    interfaceCol.createIndex({ path: 1, method: 1 });
    interfaceCol.createIndex({ project_id: 1 });

    let groupCol = mongoose.connection.db.collection('group');
    groupCol.createIndex({ uid: 1 });
    groupCol.createIndex({ group_name: 1 });

    let avatarCol = mongoose.connection.db.collection('avatar');
    avatarCol.createIndex({ uid: 1 });

    let tokenCol = mongoose.connection.db.collection('token');
    tokenCol.createIndex({ project_id: 1 });

    let followCol = mongoose.connection.db.collection('follow');
    followCol.createIndex({ uid: 1 });
    followCol.createIndex({ project_id: 1 });

    let passsalt = yapi.commons.randStr();
    await userInst.save({
      username: yapi.WEBCONFIG.adminAccount.split('@')[0],
      email: yapi.WEBCONFIG.adminAccount,
      password: yapi.commons.generatePassword('eframework.cn', passsalt),
      passsalt: passsalt,
      role: 'admin',
      add_time: yapi.commons.time(),
      up_time: yapi.commons.time()
    });
    yapi.commons.log(`初始化管理员账号成功，账号："${yapi.WEBCONFIG.adminAccount}"，密码："eframework.cn"，请及时修改`);
  }
}