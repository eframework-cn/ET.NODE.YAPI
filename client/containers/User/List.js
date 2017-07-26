import React, { Component } from 'react'
import { formatTime } from '../../common.js'
import { Link } from 'react-router-dom'
//import PropTypes from 'prop-types'
import {
  Table,
  Popconfirm,
  message
} from 'antd'
import axios from 'axios';

const limit = 10;

class List extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      total: null,
      current: 1
    }
  }

  changePage =(current)=>{
    this.setState({
      current: current
    }, this.getUserList)
  }

  getUserList() {
    axios.get('/user/list?page=' + this.state.current).then((res) => {
      let result = res.data;
      
      if (result.errcode === 0) {
        let list = result.data.list;
        let total = result.data.total * limit;
        list.map((item, index) => {
          item.key = index;
          item.up_time = formatTime(item.up_time)
        })
        this.setState({
          data: list,
          total: total
        });
      }
    })
  }

  componentDidMount() {
    this.getUserList()
  }

  confirm = (uid) =>{
    axios.post('/user/del', {
      id: uid
    }).then( (res)=>{
      if(res.data.errcode === 0){
        message.success('已删除此用户');
        let userlist = this.state.data;
        userlist = userlist.filter( (item)=>{
          return item._id != uid
        } )
        this.setState({
          data: userlist
        })
      }else{
        message.error(res.data.errmsg);
      }
    }, (err) => {
      message.error(err.message);
    } )
  }

  render() {
    const role = 'admin'
    const data = this.state.data;
    let columns = [{
      title: 'UID',
      dataIndex: '_id',
      key: '_id',
      width: 70
    }, {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    }, {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      width:110
    }, {
      title: '更新日期',
      dataIndex: 'up_time',
      key: 'up_time',
      width: 180
    }, {
      title: '功能',
      key: 'action',
      width:80,
      render: (item) => {
        return (
          <span>            
            <Link to={"/user/profile/" + item._id} >查看</Link>
            <span className="ant-divider" />
            <Popconfirm placement="leftTop" title="确认删除此用户?"  onConfirm={() => {this.confirm(item._id)}} okText="Yes" cancelText="No">
              <a href="#">删除</a>
            </Popconfirm>
          </span>
        )
      }
    }]

    columns = columns.filter( (item)=>{
      if(item.key === 'action' && role !== 'admin'){
        return false;
      }
      return true;
    } )

    const pageConfig = {
      total: this.state.total,
      pageSize: limit,
      current: this.state.current,
      onChange: this.changePage
    }

    return (
      <section className="user-table">

        <Table bordered={true} columns={columns} pagination={pageConfig} dataSource={data} />

      </section>
    )
  }
}

export default List