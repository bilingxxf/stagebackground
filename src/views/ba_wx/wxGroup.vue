<template>
    <div id="account" class="main-body">
      <div class="main-wrapper">
        <div class="addAccount">
            <div class="add">
                <h3 class="page-title">微信号分组</h3>
                <div class="left">
                    <span>添加分组</span>
                    <el-input size="small" class="ele-input" placeholder="请输入分组名称" v-model="accountGroup" @keyup.enter.native="addAccountGroup"></el-input>
                </div>
                <div class="right">
                    <el-button class="ele-btn" type="primary" @click="addAccountGroup">添加</el-button>
                </div>
            </div>
        </div>
        <div class="accountTable">
            <div class="tableTop">
                <!-- <el-input
              placeholder="请输入分组名称(回车搜索)"
              suffix-icon="el-icon-search"
              v-model="groupname"
              @keyup.enter.native="init()"
            >
          </el-input> -->
                <span>微信号分组记录</span>
                <el-button size="mini" class="ele-btn" type="primary" @click="performTask">执行任务</el-button>
                <el-button size="mini" class="ele-btn" type="primary" style="margin-right: 10px;" @click="changeGroup">批量移动</el-button>
            </div>
            <div class="table">
                <div class="tableContent">
                    <el-checkbox class="checkedAll" v-model="checkedAll" @change="checkedall">全选</el-checkbox>
                    <el-table :data="tableData" @expand-change="expandChange" style="width: 100%" class="ele-table-init" :header-cell-style="getHeaderClass">
                        <el-table-column type="expand">
                            <template slot-scope="props" style="width: 100%;">
                                <el-table :data="props.row.children" class="ele-table-init" style="width: 100%">
                                  <el-table-column label="" width="30"></el-table-column>
                                    <el-table-column width="30px">
                                        <template slot-scope="scope">
                                            <el-checkbox v-model="scope.row.checked" @change="cellclicks(scope.row)"></el-checkbox>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="wx_user_group" label="账号名称" align="left">
                                    </el-table-column>
                                    <el-table-column prop="wx_user_name" label="微信号" align="left">
                                    </el-table-column>
                                    <el-table-column prop="sex" label="性别" align="left">

                                    </el-table-column>
                                    <el-table-column label="二维码" align="left">
                                        <template slot-scope="scope">
                                            {{props.row.wx_qr_code}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="area" label="所属地区" align="left">
                                    </el-table-column>
                                    <el-table-column prop="signature" label="个性签名" align="left">
                                    </el-table-column>
                                    <el-table-column prop="online_time" label="登录时间" align="left">
                                    </el-table-column>
                                    <el-table-column prop="offline_time" label="下线时间" align="left">
                                    </el-table-column>
                                    <el-table-column prop="wx_status" label="状态" align="left">
                                    </el-table-column>
                                    <el-table-column label="操作" align="right">
                                        <template slot-scope="scope">
                                            <el-button type="text" v-if='scope.row.wx_status=="禁用"' @click="changeStatus(scope.row,scope.$index)">启用</el-button>
                                            <el-button type="text" v-if='scope.row.wx_status=="启用"' @click="changeStatus(scope.row,scope.$index)">禁用</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="" width="30"></el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column width="30px">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.checked" @change="cellclick(scope.row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="已选择/总数" align="left">
                            <template slot-scope="scope">
                                {{scope.row.selectNumber}}/{{scope.row.wx_sum_count}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="wx_user_group_name" label="分组名称" align="left">
                        </el-table-column>
                        <el-table-column prop="create_time" label="添加分组时间" align="left">
                        </el-table-column>
                        <el-table-column prop="wx_sum_count" label="已绑定账号" align="left">
                        </el-table-column>
                        <el-table-column label="操作" align="right">
                            <template slot-scope="scope">
                                <el-button type="text" @click="addGroup" disabled>添加微信账号</el-button>
                                <el-button type="text" @click="enditorGroup(scope.$index)">编辑</el-button>
                                <el-button type="text" style="color:red;" @click="confirmDelete(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                        	<el-table-column label="" width="30"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
      </div> 
        <!-- 编辑弹窗 -->
        <div class="editorPop" v-if="editorPop">
            <div class="content">
                <div class="header">编辑分组名称</div>
                <div class="text">
                    <div class="item">
                        <span>分组名称</span>
                        <el-input class="ele-input" v-model="editorInput"></el-input>
                    </div>
                    <div class="item">
                        <el-button class="ele-btn" type="primary" @click="confirmEditor">确认</el-button>
                        <el-button class="ele-btn" type="primary" @click="editorInput='',editorPop=false">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 移动弹窗 -->
        <div class="editorPop" v-if="movePop">
            <div class="content">
                <div class="header">移动分组</div>
                <div class="text">
                    <div class="item">
                        <span>分组名称</span>
                        <el-select v-model="deletegroup" placeholder="请选择账号移动的分组" class="ele-select">
                            <el-option v-for="item in deletegroups" :key="item.wx_user_group_id" :label="item.wx_user_group_name" :value="item.wx_user_group_id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item">
                        <el-button class="ele-btn" type="primary" @click="confirmMove">确认</el-button>
                        <el-button class="ele-btn" type="primary" @click="deletegroup='',movePop=false,deletegroup=''">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 执行任务弹窗 -->
        <div class="promps" v-show="performedShow">
            <div class="new-task-model">
                <h1>执行任务模板</h1>
                <div class="model-content">
                    <div class="fill" style="text-align: left;margin-bottom: 20px;">
                        <span style="text-align: left;display: inline-block;width: 100px;">任务模板</span>
                        <el-select v-model="taskTemplate" class="ele-select">
                            <el-option v-for="(item,index)  in taskTemplates" :key="index" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="fill" style="text-align: left;margin-bottom: 20px;">
                        <span style="text-align: left;display: inline-block;width: 100px;">账号获取方式</span>
                        <el-select v-model="accountGain" class="ele-select">
                            <el-option v-for="(item,index)  in accountGains" :key="index" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="fill" style="text-align: left;margin-bottom: 20px;">
                        <span style="text-align: left;display: inline-block;width: 100px;">备注</span>
                        <el-input class="ele-input" placeholder="输入内容" v-model="params">
                        </el-input>
                    </div>
                    <div class="btn-list">
                        <el-button class="ele-btn" type="primary" @click="confimExecute">确认执行</el-button>
                        <el-button class="cancel ele-btn" type="primary" @click="performedShow=false,taskTemplate='',accountGain='',params=''">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      movePop: false,
      params: "",
      accountGains: [
        {
          value: 1,
          label: "不从服务器获取"
        },
        {
          value: 2,
          label: "没有才从服务器获取"
        },
        {
          value: 3,
          label: "每次都从服务器获取"
        }
      ],
      accountGain: "",
      taskTemplate: "",
      taskTemplateName: {},
      taskTemplates: [],
      performedShow: false,
      deletegroup: "",
      newDeletegroup: [],
      deletegroups: [],
      deletePop: false,
      editorPop: false,
      editorInput: "",
      tableData: [],
      //groupname:"",
      accountGroup: "",
      groupId: null,
      groupchildrenId: [],
      index: 0,
      sexTostring: ["未知", "男", "女"],
      statusTostring: ["禁用", "启用"],
      username: "",
      arr: [],
      checkedAll: false,
      groupIndex: null,
      checkedTrue: false,
      limit:1000,
      page:1
    };
  },
  //监控输入框值得变化
  /*watch:{
    groupname(){
      if(this.groupname==""){
        this.pageNo=1;
        this.init();
      }
    }
  },*/
  methods: {
    performTask(){
      this.performedShow=true;
    },
     // 表格头部背景颜色
      getHeaderClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px";
        } else {
          return "";
        }
      },
    //请求微信组成员
    askWx(groupId, userid, row) {
      this.$http("wx_user", "GET", {
        limit:9999,
        page:1,
        wx_user_group_id: groupId
      })
        .then(res => {
          let that = this;
          if (res.data.error_code == 0) {
            row.children = res.data.data.map(function(item, index) {
              item["index"] = row.index;
              item.wx_status = that.statusTostring[item.wx_status];
              item.sex = that.sexTostring[item.sex];
              item["itemIndex"] = index;
              item["checked"] = false;
              if (row.checked == true) {
                item.checked = true;
              } else {
                item.checked = false;
              }
              return item;
            });
          } else {
            this.$message({
              message: "请求微信号失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "请求微信号失败:" + res.data.error_message,
            type: "error"
          });
        });
    },
    //外层table行展开后请求数据
    expandChange(row) {
      if (row.children.length <= 0) {
        this.askWx(row.wx_user_group_id, row.user_id, row);
      }
    },
    //确认移动
    confirmMove() {
      if (this.groupchildrenId.length <= 0) {
        this.$message({
          message: "请选择微信号",
          type: "warning"
        });
        return;
      }
      if (this.deletegroup.length == "") {
        this.$message({
          message: "请选择移动的分组",
          type: "warning"
        });
        return;
      }
      this.$http("wx_user_group/wx_user_change_group", "POST", {
        new_wx_user_group_id: this.deletegroup,
        wx_user_id: this.groupchildrenId,
        wx_user_group_id: this.newDeletegroup
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "移动分组成功",
              type: "success"
            });
            this.movePop = false;
            this.deletegroup = "";
            this.init();
          } else {
            this.$message({
              message: "移动分组失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "移动分组失败:" + res.data.error_message,
            type: "error"
          });
        });
    },
    //微信号移动分组
    changeGroup() {
      let groupId = [];
      let that = this;
      this.groupchildrenId = [];
      this.tableData.map(function(item) {
        if (item.checked == true) {
          groupId.push(item.wx_user_group_id);
        }
        item.children.map(function(items) {
          if (items.checked == true) {
            that.groupchildrenId.push(parseInt(items.wx_user_id));
          }
        });
        that.newDeletegroup = [];
        if (
          item.checked == true &&
          item.selectArr.length == item.children.length
        ) {
          that.newDeletegroup.push(item.wx_user_group_id);
        }
      });
      // console.log(groupId)
      // if(groupId.length==0){
      //   this.$message({
      //       message: "请选择需要移动账号",
      //       type: "error"
      //     });
      //   return false;
      // }
       this.movePop = true;
      // this.$http("wx_group/group_list", "GET", {
      this.$http("wx_group/list", "GET", {
        limit:9999,
        page:1,
        // wx_user_group_id: JSON.stringify(groupId)
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.deletegroups = res.data.data.result;
          } else {
            this.$message({
              message: "获取移动列表失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取移动列表失败:" + res.data.error_message,
            type: "error"
          });
        });
    },
    //外部表格的全选按钮
    checkedall() {
      if (this.checkedAll == true) {
        let that = this;
        this.tableData.map(function(item) {
          item.checked = true;
          item.selectNumber = item.wx_sum_count;
          if (that.checkedTrue == false) {
            that.askWx(item.wx_user_group_id, item.user_id, item);
          }
          setTimeout(function() {
            if (item.children.length > 0) {
              item.children.map(function(items) {
                items.checked = true;
                item.selectArr.push(items.wx_user_id);
              });
            }
          }, 100);
        });
        this.checkedTrue = true;
      } else {
        this.tableData.map(function(item) {
          item.checked = false;
          item.selectNumber = 0;
          item.selectArr = [];
          if (item.children.length > 0) {
            item.children.map(function(items) {
              items.checked = false;
            });
          }
        });
      }
    },
    //内部表格每行的选择框
    cellclicks(row) {
      this.index = row.index;
      let arr = 0;
      for (let i = 0; i < this.tableData[this.index].children.length; i++) {
        if (this.tableData[this.index].children[i].checked == true) {
          arr++;
        }
      }
      if (arr == 0) {
        this.tableData[this.index].checked = false;
      } else {
        this.tableData[this.index].checked = true;
      }
      let check = true;
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.tableData[i].children.length; j++) {
          if (this.tableData[i].children[j].checked == false) {
            check = false;
          }
        }
        if (this.tableData[i].checked == false) {
          check = false;
        }
      }
      if (check == true) {
        this.checkedAll = true;
      }
      if (row.checked == true) {
        this.tableData[this.index].selectArr.push(row.wx_user_id);
        this.tableData[this.index].selectNumber = this.tableData[
          this.index
        ].selectArr.length;
      } else {
        this.checkedAll = false;
        let that = this;
        this.tableData[this.index].selectArr.map(function(item, index) {
          if (row.wx_user_id == item) {
            that.tableData[that.index].selectArr.splice(index, 1);
          }
        });
        this.tableData[this.index].selectNumber = this.tableData[
          this.index
        ].selectArr.length;
      }
    },
    //外部表格每行的选择框
    cellclick(row) {
      if (row.children.length <= 0) {
        this.askWx(row.wx_user_group_id, row.user_id, row);
      }
      let that = this;
      setTimeout(function() {
        that.index = row.index;
        if (row.checked == true) {
          let arr = [];
          row.children.map(function(item) {
            item.checked = true;
            arr.push(item.wx_user_id);
          });
          that.tableData[that.index].selectArr = arr;
          that.tableData[that.index].selectNumber =
            that.tableData[that.index].wx_sum_count;
          let check = true;
          for (let i = 0; i < that.tableData.length; i++) {
            for (let j = 0; j < that.tableData[i].children.length; j++) {
              if (that.tableData[i].children[j].checked == false) {
                check = false;
              }
            }
            if (that.tableData[i].checked == false) {
              check = false;
            }
          }
          if (check == true) {
            that.checkedAll = true;
          }
        } else {
          that.checkedAll = false;
          row.children.map(function(item) {
            item.checked = false;
          });
          that.tableData[that.index].selectArr = [];
          that.tableData[that.index].selectNumber = 0;
        }
      }, 100);
    },
    //确认执行任务
    confimExecute() {
      this.arr = [];
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.tableData[i].selectArr.length; j++) {
          this.arr.push(this.tableData[i].selectArr[j]);
        }
      }
      if (this.arr.length <= 0 && this.accountGain != 1) {
        this.$message({
          message: "请选择微信号",
          type: "warning"
        });
        return;
      }
      if (this.taskTemplate == "") {
        this.$message({
          message: "请选择任务模板",
          type: "warning"
        });
        return;
      }
      if (this.accountGain == "") {
        this.$message({
          message: "请选择账号获取方式",
          type: "warning"
        });
        return;
      }
      this.$http("task/create_task", "POST", {
        task_template_name: this.taskTemplateName[this.taskTemplate],
        account_list: this.arr,
        task_template_id: this.taskTemplate,
        remark: this.params,
        username: this.username,
        enum_wxaccount_source: this.accountGain
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.performedShow = false;
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.taskTemplate = "";
            this.accountGain = "";
            this.params = "";
            this.performedShow = false;
          } else {
            this.$message({
              message: "执行失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败:" + res.data.error_message,
            type: "error"
          });
        });
    },
    //初始化任务模板
    initTask() {
      this.$http("task_template?page=1&per_page=100000", "GET")
        .then(res => {
          if (res.data.error_code == 0) {
            let data = res.data.data;
            this.taskTemplates = data.result.map(function(item) {
              return {
                value: item.task_template_id,
                label: item.task_template_name
              };
            });
            for (let i = 0; i < data.result.length; i++) {
              this.taskTemplateName[data.result[i].task_template_id] =
                data.result[i].task_template_name;
            }
          } else {
            this.$message({
              message: "获取任务模板失败:",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取任务模板失败:" + res.data.error_message,
            type: "error"
          });
        });
    },
    //禁用启用
    changeStatus(data, index) {
      let params = {};
      if (this.tableData[data.index].children[index].wx_status == "启用") {
        params = {
          wx_user_id: this.tableData[data.index].children[index].wx_user_id,
          wx_enable_status: 0
        };
      } else {
        params = {
          wx_user_id: this.tableData[data.index].children[index].wx_user_id,
          wx_enable_status: 1
        };
      }
      this.$http("wx_user_group/enable_status", "POST", params)
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            if (
              this.tableData[data.index].children[index].wx_status == "启用"
            ) {
              this.tableData[data.index].children[index].wx_status = "禁用";
            } else {
              this.tableData[data.index].children[index].wx_status = "启用";
            }
          } else {
            this.$message({
              message: "操作失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "操作失败:" + res.data.error_message,
            type: "error"
          });
        });
    },
    //确认删除
    confirmDelete(index) {
      this.groupId = this.tableData[index].wx_user_group_id;
      this.$http("wx_user_group/delete", "DELETE", {
        wx_user_group_id: this.groupId
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.init();
            this.deletegroup = "";
            this.checkedAll = false;
            this.groupId = "";
          } else {
            this.$message({
              message: "删除失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "删除失败:" + res.data.error_message,
            type: "error"
          });
        });
    },
    //确认编辑
    confirmEditor() {
      if (this.editorInput == "") {
        this.$message({
          message: "分组名称不能为空！",
          type: "warning"
        });
      } else {
        this.$http("wx_user_group/update", "POST", {
          wx_user_group_name: this.editorInput,
          wx_user_group_id: this.groupId
        })
          .then(res => {
            if (res.data.error_code == 0) {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.tableData[
                this.groupIndex
              ].wx_user_group_name = this.editorInput;
              this.editorPop = false;
              this.groupId = "";
            } else {
              this.$message({
                message: "编辑失败:" + res.data.error_message,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "编辑失败:" + res.data.error_message,
              type: "error"
            });
          });
      }
    },
    //添加账号
    addGroup() {},
    //编辑
    enditorGroup(index) {
      this.editorPop = true;
      this.editorInput = this.tableData[index].wx_user_group_name;
      this.groupId = this.tableData[index].wx_user_group_id;
      this.groupIndex = index;
    },
    //添加分组
    addAccountGroup() {
      if (this.$regExp(this.accountGroup, 64)) {
        return;
      } else {
        this.$http("wx_user_group/add?wx_user_group_name="+this.accountGroup, "POST")
          .then(res => {
            if (res.data.error_code == 0) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.init();
              this.checkedAll = false;
              this.accountGroup = "";
            } else {
              this.$message({
                message: "添加失败:" + res.data.error_message,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "添加失败:" + res.data.error_message,
              type: "error"
            });
          });
      }
    },
    //初始化列表
    init() {
      this.$http("wx_group/list", "GET",{
        limit:this.limit,
        page:this.page,
        group_name:""
      })
        .then(res => {
          if (res.data.error_code == 0) {
            let that = this;
            let data = res.data.data;
            this.tableData = data.result.map(function(item, index) {
              item["index"] = index;
              item["selectArr"] = [];
              item["selectNumber"] = 0;
              item["checked"] = false;
              item["children"] = [];
              return item;
            });
          } else {
            this.$message({
              message: "获取列表失败:",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取列表失败:" + res.data.error_message,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.init();
    this.initTask();
    this.username = sessionStorage.getItem("username");
  }
};
</script>
<style scoped lang="scss">
#account {
  width: 100%;
  height: 100%;
  // padding: 22px 88px;
  box-sizing: border-box;
  .childSelect {
    display: none;
  }
  h3 {
    font-size: 19px;
  }
  .addAccount {
    h3 {
      margin-bottom: 15px;
    }
    .add {
      box-sizing: border-box;
      // padding: 18px 36px;
      background-color: #fff;
      overflow: hidden;
      .left {
        float: left;
        padding-top: 15px;
        margin-right: 22px;
        span {
          line-height: 24px;
          font-size: 14px;
          color: #707070;
          margin-right: 22px;
        }
        .el-input__inner {
          height: 32px !important;
        }
        .el-input {
          width: 200px !important;
        }
      }
      .right {
        float: left;
        padding-top: 15px;
        .el-button {
          width: 100px;
          height: 32px;
          line-height: 8px;
        }
      }
    }
  }
  .accountTable {
    background: #fff;

    // padding: 18px 36px;
    .tableTop {
        margin-top: 10px;
        margin-bottom:20px;
        span {
          font-size: 14px;
          color: #707070;
        }
        overflow: hidden;
        .el-input {
          float: left;
        }
        .el-button {
          float:right;
        }
      }
    .table {
      background-color: #fff;
      // padding:0 50px;
      
      .tableContent {
        position: relative;
      }
      .checkedAll {
        position: absolute;
        top: 15px;
        left: 58px;
      }
      .tableBottom {
        text-align: center;
        padding: 35px 0;
        .el-pagination {
          display: inline-block;
        }
        span {
          color: #303133;
          font-size: 14px;
        }
      }
    }
  }
  .editorPop {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    .content {
      width: 550px;
      height: 280px;
      background-color: #fff;
      border-radius: 2px;
      position: absolute;
      top: 30%;
      left: 50%;
      margin-left: -275px;
      .header {
        font-size: 14px;
        line-height: 48px;
        text-align: center;
        background-color: #409EFF;
        color: #fff;
      }
      .text {
        padding: 10px 50px 50px;
      }
      .item {
        width: 100%;
        margin: 30px 0 35px;
        overflow: hidden;
        text-align: center;
        span {
          display: block;
          font-size: 14px;
          color: #707070;
          width: 80px;
          float: left;
          margin-left: 40px;
        }
        .el-input {
          float: left;
          width: 300px !important;
        }
        .el-select {
          // width: 300px;
          float: left;
          margin-bottom: 20px;
        }
      }
    }
  }
  .promps {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    z-index: 1000;
    .new-task-model {
      position: fixed;
      width: 550px;
      background: #ffffff;
      top: 30%;
      left: 50%;
      margin-left: -275px;
      h1 {
        text-align: center;
        line-height: 45px;
        font-size: 14px;
        border-bottom: 1px solid #e0e0e0;
        background-color: #409EFF;
        color: #fff;
      }
      .el-input {
        width: 160px;
      }
      .el-textarea {
        width: 160px;
      }
      .model-content {
        margin: 20px;
        padding: 15px 50px;
        .fill {
          span {
            padding-right: 10px;
            display: inline-block;
            width: 30%;
            text-align: right;
            font-size: 14px;
          }
          .radio-wrap {
            width: 70%;
            margin-bottom: 10px;
            float: left;
          }
          .el-input {
            width: 300px !important;
          }
          .el-select {
            // width: 300px;
          }
        }
        .margin {
          margin: 30px 0 20px 0;
        }
        .btn-list {
          margin: 25px auto 10px;
          text-align: center;
          .btn {
            display: inline-block;
            padding: 10px 18px;
            border-radius: 5px;
            background: #409EFF;
            border: none;
            color: #ffffff;
            margin: 0 6px;
            cursor: pointer;
          }
          .btn-add {
            padding: 5px 31px;
            margin: 0 10px 0 0;
          }
          .cancel {
            background: #409EFF;
            color:#fff;
          }
        }
        .input {
          width: 100%;
          padding: 20px 0;
          .el-input {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>