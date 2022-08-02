import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button } from 'antd';
import axios from 'axios';
import constants from '../../../../constants/variable.js'
import { handleApiPath, nameLengthLimit } from '../../../../common.js'
const HTTP_METHOD = constants.HTTP_METHOD;
const HTTP_METHOD_KEYS = Object.keys(HTTP_METHOD);
import TextInput from 'react-autocomplete-input';
import './complete.css'

const FormItem = Form.Item;
const Option = Select.Option;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class AddInterfaceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curMethod: "CONN",
      curIDOptions: [],
      curPBOptions: [],
    };
  }


  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    catid: PropTypes.number,
    catdata: PropTypes.array
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.method == "CONN") {
          values.path = "/" + (values.req_id ? values.req_id : "NONE") + "/" + (values.resp_id ? values.resp_id : "NONE")
        } else if (values.method == "CGI") {
          values.path = "/" + (values.req_id ? values.req_id : "NONE")
        }
        this.props.onSubmit(values, () => {
          this.props.form.resetFields();
        });
      }
    });
  }

  handlePath = (e) => {
    let val = e.target.value
    this.props.form.setFieldsValue({
      path: handleApiPath(val)
    })
  }
  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="接口分类"
        >
          {getFieldDecorator('catid', {
            initialValue: this.props.catid ? this.props.catid + '' : this.props.catdata[0]._id + ''
          })(
            <Select>
              {this.props.catdata.map(item => {
                return <Option key={item._id} value={item._id + ""}>{item.name}</Option>
              })}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="接口名称"
        >
          {getFieldDecorator('title', {
            rules: nameLengthLimit('接口')
          })(
            <Input placeholder="接口名称" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="接口类型"
        >
          {getFieldDecorator('method', {
            initialValue: 'CONN'
          })(
            <Select onChange={e => this.setState({ curMethod: e })}>
              {HTTP_METHOD_KEYS.map(item => {
                return <Option key={item} value={item}>{item}</Option>
              })}
            </Select>
          )}
        </FormItem>

        {this.state.curMethod == "CONN" || this.state.curMethod == "CGI" ? (
          <div>
            <FormItem
              {...formItemLayout}
              label="请求接口"
            >
              {getFieldDecorator('req_id')(
                <TextInput placeholder="接口枚举"
                  className='react-autocomplete' Component={'input'} style={{ width: "305px", height: "33px" }}
                  autoComplete='off' trigger={["", " "]} spacer={''}
                  matchAny={true} maxOptions={0} requestOnlyIfNoOptions={false}
                  options={this.state.curIDOptions} onRequestOptions={part => {
                    axios.post(`/api/interface/filter_id`, { project: this.props.catdata[0].project_id, cgi: this.state.curMethod == "CGI", str: part }).then(data => {
                      this.setState({ curIDOptions: data.data.data })
                    })
                  }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="请求数据"
            >
              {getFieldDecorator('req_pb')(<TextInput placeholder="接口数据"
                className='react-autocomplete' Component={'input'} style={{ width: "305px", height: "33px" }}
                autoComplete='off' trigger={["", " "]} spacer={''}
                matchAny={true} maxOptions={0} requestOnlyIfNoOptions={false}
                options={this.state.curPBOptions} onRequestOptions={part => {
                  axios.post(`/api/interface/filter_pb`, { project: this.props.catdata[0].project_id, cgi: this.state.curMethod == "CGI", str: part }).then(data => {
                    this.setState({ curPBOptions: data.data.data })
                  })
                }} />)}
            </FormItem>
            {this.state.curMethod == "CONN" ? (
              <FormItem
                {...formItemLayout}
                label="返回接口"
              >
                {getFieldDecorator('resp_id')(
                  <TextInput placeholder="接口枚举"
                    className='react-autocomplete' Component={'input'} style={{ width: "305px", height: "33px" }}
                    autoComplete='off' trigger={["", " "]} spacer={''}
                    matchAny={true} maxOptions={0} requestOnlyIfNoOptions={false}
                    options={this.state.curIDOptions} onRequestOptions={part => {
                      axios.post(`/api/interface/filter_id`, { project: this.props.catdata[0].project_id, cgi: this.state.curMethod == "CGI", str: part }).then(data => {
                        this.setState({ curIDOptions: data.data.data })
                      })
                    }} />
                )}
              </FormItem>
            ) : ('')}
            <FormItem
              {...formItemLayout}
              label="返回数据"
            >
              {getFieldDecorator('resp_pb')(<TextInput placeholder="接口数据"
                className='react-autocomplete' Component={'input'} style={{ width: "305px", height: "33px" }}
                autoComplete='off' trigger={["", " "]} spacer={''}
                matchAny={true} maxOptions={0} requestOnlyIfNoOptions={false}
                options={this.state.curPBOptions} onRequestOptions={part => {
                  axios.post(`/api/interface/filter_pb`, { project: this.props.catdata[0].project_id, cgi: this.state.curMethod == "CGI", str: part }).then(data => {
                    this.setState({ curPBOptions: data.data.data })
                  })
                }} />)}
            </FormItem>
          </div>
        ) : (
          <FormItem
            {...formItemLayout}
            label="接口路径"
          >
            {getFieldDecorator('path', {
              rules: [{
                required: true, message: '请输入接口路径!'
              }]
            })(
              <Input onBlur={this.handlePath} placeholder="/接口路径" />
            )}
          </FormItem>
        )}

        <FormItem
          {...formItemLayout}
          label="注"
        >
          <span style={{ color: "#929292" }}>详细的接口数据可以在编辑页面中添加</span>
        </FormItem>
        <FormItem className="catModalfoot" wrapperCol={{ span: 24, offset: 8 }} >
          <Button onClick={this.props.onCancel} style={{ marginRight: "10px" }}  >取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            提交
          </Button>
        </FormItem>

      </Form>

    );
  }
}

export default Form.create()(AddInterfaceForm);
