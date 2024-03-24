import React, { PureComponent as Component } from 'react';
import { formatTime } from '../../common.js';
import { Link } from 'react-router-dom';
import { setBreadcrumb } from '../../reducer/modules/user';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Row, Col, Popconfirm, message, Input, Modal, Button } from 'antd';
import axios from 'axios';
import { autobind } from 'core-decorators';

const Search = Input.Search;
const limit = 20;
@connect(
  state => {
    return {
      curUserRole: state.user.role
    };
  },
  {
    setBreadcrumb
  }
)
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      total: null,
      current: 1,
      backups: [],
      isSearch: false,
      addUserModalVisible: false,
      newUserName: '',
      newUserEMail: '',
      newUserPassword: '',
      newUserPassword2: '',
    };
  }
  static propTypes = {
    setBreadcrumb: PropTypes.func,
    curUserRole: PropTypes.string
  };
  changePage = current => {
    this.setState(
      {
        current: current
      },
      this.getUserList
    );
  };

  getUserList() {
    axios.get('/api/user/list?page=' + this.state.current + '&limit=' + limit).then(res => {
      let result = res.data;

      if (result.errcode === 0) {
        let list = result.data.list;
        let total = result.data.count;
        list.map((item, index) => {
          item.key = index;
          item.up_time = formatTime(item.up_time);
        });
        this.setState({
          data: list,
          total: total,
          backups: list
        });
      }
    });
  }

  componentDidMount() {
    this.getUserList();
  }

  confirm = uid => {
    axios
      .post('/api/user/del', {
        id: uid
      })
      .then(
        res => {
          if (res.data.errcode === 0) {
            message.success('已删除此用户');
            let userlist = this.state.data;
            userlist = userlist.filter(item => {
              return item._id != uid;
            });
            this.setState({
              data: userlist
            });
          } else {
            message.error(res.data.errmsg);
          }
        },
        err => {
          message.error(err.message);
        }
      );
  };

  async componentWillMount() {
    this.props.setBreadcrumb([{ name: '用户管理' }]);
  }

  handleSearch = value => {
    let params = { q: value };
    if (params.q !== '') {
      axios.get('/api/user/search', { params }).then(data => {
        let userList = [];

        data = data.data.data;
        if (data) {
          data.forEach(v =>
            userList.push({
              ...v,
              _id: v.uid
            })
          );
        }

        this.setState({
          data: userList,
          isSearch: true
        });
      });
    } else {
      this.setState({
        data: this.state.backups,
        isSearch: false
      });
    }
  };

  @autobind
  showAddUserModal() {
    this.setState({
      addUserModalVisible: true
    });
  }

  @autobind
  hideAddUserModal() {
    this.setState({
      newGroupName: '',
      group_name: '',
      addUserModalVisible: false,
      newUserName: '',
      newUserEMail: '',
      newUserPassword: '',
      newUserPassword2: '',
    });
  }

  @autobind
  inputUserName(e) { this.setState({ newUserName: e.target.value }); }

  @autobind
  inputUserEMail(e) { this.setState({ newUserEMail: e.target.value }); }

  @autobind
  inputUserPassword(e) { this.setState({ newUserPassword: e.target.value }); }

  @autobind
  inputUserPassword2(e) { this.setState({ newUserPassword2: e.target.value }); }

  @autobind
  async addUser() {
    const { newUserName, newUserEMail, newUserPassword, newUserPassword2 } = this.state;
    if (newUserName == null || newUserName == "") {
      message.error("用户名称不可为空")
      return;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,})+$/.test(newUserEMail) == false) {
      message.error("用户邮箱格式错误")
      return;
    }
    if (newUserPassword == null || newUserPassword == "") {
      message.error("用户密码不可为空")
      return;
    }
    if (newUserPassword != newUserPassword2) {
      message.error("两次输入的密码不一致")
      return;
    }
    const res = await axios.post('/api/user/add', { username: newUserName, email: newUserEMail, password: newUserPassword });
    if (!res.data.errcode) {
      this.hideAddUserModal();
      this.getUserList();
      message.success(`用户：${newUserName} 添加成功`);
    } else {
      message.error(res.data.errmsg);
    }
  }

  render() {
    const role = this.props.curUserRole;
    let data = [];
    if (role === 'admin') {
      data = this.state.data;
    }
    let columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 180,
        render: (username, item) => {
          return <Link to={'/user/profile/' + item._id}>{item.username}</Link>;
        }
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '用户角色',
        dataIndex: 'role',
        key: 'role',
        width: 150
      },
      {
        title: '更新日期',
        dataIndex: 'up_time',
        key: 'up_time',
        width: 160
      },
      {
        title: '功能',
        key: 'action',
        width: '90px',
        render: item => {
          return (
            <span>
              {/* <span className="ant-divider" /> */}
              <Popconfirm
                title="确认删除此用户?"
                onConfirm={() => {
                  this.confirm(item._id);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a style={{ display: 'block', textAlign: 'center' }} href="#">
                  删除
                </a>
              </Popconfirm>
            </span>
          );
        }
      }
    ];

    columns = columns.filter(item => {
      if (item.key === 'action' && role !== 'admin') {
        return false;
      }
      return true;
    });

    const pageConfig = {
      total: this.state.total,
      pageSize: limit,
      current: this.state.current,
      onChange: this.changePage
    };

    const defaultPageConfig = {
      total: this.state.data.length,
      pageSize: limit,
      current: 1
    };

    return (
      <section className="user-table">
        <div className="user-search-wrapper">
          <h2 style={{ marginBottom: '10px' }}>用户总数：{this.state.total}位</h2>

          {role == "admin" &&
            <Button
              type="primary"
              style={{ position: "absolute", "right": "270px", top: 0 }}
              onClick={this.showAddUserModal}>
              添加用户
            </Button>
          }

          <Search
            onChange={e => this.handleSearch(e.target.value)}
            onSearch={this.handleSearch}
            placeholder="请输入用户名"
          />
        </div>
        <Table
          bordered={true}
          rowKey={record => record._id}
          columns={columns}
          pagination={this.state.isSearch ? defaultPageConfig : pageConfig}
          dataSource={data}
        />
        {this.state.addUserModalVisible && (
          <Modal
            title="添加用户"
            visible={this.state.addUserModalVisible}
            onOk={this.addUser}
            onCancel={this.hideAddUserModal}
            className="add-user-modal"
          >
            <Row gutter={6} className="modal-input">
              <Col span="5">
                <div className="label">用户名称：</div>
              </Col>
              <Col span="15">
                <Input placeholder="请输入用户名称" onChange={this.inputUserName} />
              </Col>
            </Row>
            <Row gutter={6} className="modal-input">
              <Col span="5">
                <div className="label">用户邮箱：</div>
              </Col>
              <Col span="15">
                <Input placeholder="请输入用户邮箱" onChange={this.inputUserEMail} />
              </Col>
            </Row>
            <Row gutter={6} className="modal-input">
              <Col span="5">
                <div className="label">用户密码：</div>
              </Col>
              <Col span="15">
                <Input placeholder="请输入用户密码" type="password" onChange={this.inputUserPassword} />
              </Col>
            </Row>
            <Row gutter={6} className="modal-input">
              <Col span="5">
                <div className="label">确认密码：</div>
              </Col>
              <Col span="15">
                <Input placeholder="请确认用户密码" type="password" onChange={this.inputUserPassword2} />
              </Col>
            </Row>
          </Modal>
        )}
      </section>
    );
  }
}

export default List;
