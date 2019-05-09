<template>
  <div id="groupManage">
    <div class="manage">
      <div class="title">
        <div class="all">
          <h4 style="color:#333333">所有分组</h4>
          <ul class="ul">
            <li class="left">
              <el-input placeholder="请输入组名称" suffix-icon="el-icon-search" v-model="searchgroup">
              </el-input>
            </li>
            <li class="right">
              <el-button type="primary" @click="addAccountGroup">
                添加分组
              </el-button>
            </li>
          </ul>

        </div>
      </div>
 
      <div class="table">
        <el-table :data="tableData" tooltip-effect="dark" @expand-change="expandChange" style="width: 100%;" :header-cell-style="getHeaderClass">
          <el-table-column type="expand">
            <template slot-scope="props" style="width: 100%;">
              <el-table :data="props.row.children" style="width: 100%">
                <el-table-column width="30px">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked" @change="cellclicks(scope.row)"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column prop="wx_user_group" label="账号名称" align="center">
                </el-table-column>
                <el-table-column prop="wx_user_name" label="微信号" align="center">
                </el-table-column>
                <el-table-column prop="sex" label="性别" align="center">

                </el-table-column>
                <el-table-column label="二维码" align="center">
                  <template slot-scope="scope">
                    {{props.row.wx_qr_code}}
                  </template>
                </el-table-column>
                <el-table-column prop="area" label="所属地区" align="center">
                </el-table-column>
                <el-table-column prop="signature" label="个性签名" align="center">
                </el-table-column>
                <el-table-column prop="online_time" label="登录时间" align="center">
                </el-table-column>
                <el-table-column prop="offline_time" label="下线时间" align="center">
                </el-table-column>
                <el-table-column prop="wx_status" label="状态" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" v-if='scope.row.wx_status=="禁用"' @click="changeStatus(scope.row,scope.$index)">启用</el-button>
                    <el-button type="text" v-if='scope.row.wx_status=="启用"' @click="changeStatus(scope.row,scope.$index)">禁用</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="wx_user_group_name" label="组名称" align="center">
          </el-table-column>
          <el-table-column prop="wx_sum_count" label="账号数" align="center">
          </el-table-column>
          <el-table-column prop="packet" label="养号配置" align="center" width="360">
            <template slot-scope="scope">
              <el-select v-model="scope.row.wx_haveno" placeholder="请选择">
                <el-option v-for="(item,index) in havenos" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-button type="primary" size="medium" @click="affirmDeploy(scope.row)" style="float: none;">确认</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="360" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text">一键下线</el-button>
              <el-button size="mini" type="text">一键拉群</el-button>
              <el-button size="mini" type="text">入群OR</el-button>
              <el-button size="mini" type="text" @click="confirmDelete(scope.row)">删除组</el-button>
              <el-button size="mini" type="text" @click="affirmOperation(scope.row)">配置运行</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <!-- 分页 -->
      <!-- <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="100" layout="total, prev, pager, next" :total="500">
            </el-pagination>
        </div> -->
      <!-- 蒙板 -->
      <div class="mask" v-show="mask"></div>
      <!-- //添加分组弹框 -->
      <div class="add public" v-show="add">
        <div class="header">
          <h5>养号配置</h5>
          <span @click="mask=false,add=false">×</span>
        </div>
        <div class="content">
          <div class="contentItem">
            <el-time-select placeholder="起始时间" v-model="startTime" value-format="timestamp" :picker-options="{
                      start: '01:00',
                      step: '01:00',
                      end: '24:00'
                    }">
            </el-time-select>
            <el-time-select placeholder="结束时间" v-model="endTime" value-format="timestamp" :picker-options="{
                      start: '01:00',
                      step: '01:00',
                      end: '24:00',
                      minTime: startTime
                    }">
            </el-time-select>
          </div>
        </div>
        <div class="footer">

          <el-button type="primary" @click="askWx">确定</el-button>
          <el-button @click="mask=false,add=false">取消</el-button>

        </div>
      </div>
    </div>
  </div>

</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            havenos: [
                {
                    label: "不配置",
                    value: ""
                }
            ],
            startTime: "",
            endTime: "",
            searchgroup: "",
            mask: false,
            add: false,
            currentPage1: 5, //分页
            // table表单
            tableData: [],
            // 表格头部背景颜色
            getHeaderClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return "background:#ecf5ff;font-size:16px;color:#409eff;height:40px";
                } else {
                    return "";
                }
            },
            key: "",
            groupId: "",
            userId: "",
            wxAccount: [],
            wxId: [],
            taskId: "",
            taskName: ""
        };
    },
    methods: {
        /*微信昵称存储到资源服务期*/
        savewx(data, id) {
            axios
                .post(
                    "http://106.14.222.244:8000/api/v1/text?type=wxMessage&key=" +
                        id,
                    data,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )
                .then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            message: "存储微信号成功",
                            type: "success"
                        });
                    } else {
                        this.$message({
                            message: "存储微信号失败",
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "存储微信号失败",
                        type: "error"
                    });
                });
        },
        /*获取当前年月日*/
        gainDate() {
            return (
                new Date().getFullYear() +
                "/" +
                (new Date().getMonth() + 1) +
                "/" +
                new Date().getDate() +
                " "
            );
        },
        /*确认删除*/
        confirmDelete(row) {
            this.$http("wx_user_group/delete", "DELETE", {
                wx_user_group_id: row.wx_user_group_id
            })
                .then(res => {
                    if (res.data.error_code == 0) {
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.init();
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
        //添加分组
        addAccountGroup() {
            if (this.$regExp(this.searchgroup, 64)) {
                return;
            } else {
                this.$http("wx_user_group/add", "POST", {
                    wx_user_group_name: this.searchgroup
                })
                    .then(res => {
                        if (res.data.error_code == 0) {
                            this.$message({
                                message: "添加成功",
                                type: "success"
                            });
                            this.init();
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
        //请求微信组成员
        askWx() {
          console.log(888)
            let startTime = Date.parse(this.gainDate() + this.startTime);
            let endTime = Date.parse(this.gainDate() + this.endTime);
            this.$http("wx_user", "GET", {
                wx_user_group_id: this.groupId,
                user_id: this.userId
            })
                .then(res => {
                    if (res.data.error_code == 0) {
                        this.wxAccount = res.data.data.map(function(item) {
                            return item.wx_user_name;
                        });
                        this.wxId = res.data.data.map(function(item) {
                            return item.wx_user_id;
                        });
                        res.data.data.map(item => {
                            this.savewx(
                                {
                                    wxName: item.wx_user_name,
                                    key: this.key,
                                    friends: this.wxAccount
                                },
                                item.wx_user_id
                            );
                        });
                        let params = {
                            startTime: startTime,
                            endTime: endTime,
                            key: this.key
                        };

                        for (let i = 0; i < this.wxId.length; i++) {
                            this.operation(params, [this.wxId[i]]);
                        }
                    } else {
                        this.$message({
                            message: "请求微信号失败",
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    console.log(2);
                    this.$message({
                        message: "请求微信号失败",
                        type: "error"
                    });
                });
        },
        /*选取事件运行配置*/
        operation(params, id) {
            if (this.taskName == "") {
                this.$message({
                    message: "没有养号任务模板",
                    type: "error"
                });
                return;
            }
            //    param: JSON.stringify(params),
            this.$http("task/create_task", "POST", {
                task_template_name: "养号",
                account_list: id,
                task_template_id: this.taskId,
                param: "",
                username: sessionStorage.getItem("username"),
                enum_wxaccount_source: 2
            })
                .then(res => {
                    if (res.data.error_code == 0) {
                        this.$message({
                            message: "执行成功",
                            type: "success"
                        });
                        this.add = false;
                        this.mask = false;
                        this.startTime = "";
                        this.endTime = "";
                    } else {
                        this.$message({
                            message: "执行失败" + res.data.error_message,
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "执行失败" + res.data.error_message,
                        type: "error"
                    });
                });
        },
        /* 获取key*/
        findKey() {
            axios
                .get(
                    "http://106.14.222.244:8000/api/v1/usekey?type=havenoKey&key=" +
                        sessionStorage.getItem("user_id"),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )
                .then(res => {
                    if (res.data.code == 0) {
                        let dataKey = JSON.parse(res.data.data)
                            .key.split(",")
                            .map(function(item) {
                                return item;
                            });
                        for (let i = 0; i < dataKey.length; i++) {
                            this.findDetails(dataKey[i]);
                        }
                    } else {
                        this.$message({
                            message: "查询失败",
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "查询失败",
                        type: "error"
                    });
                });
        },
        /*获取详情*/
        findDetails(item) {
            axios
                .get(
                    "http://106.14.222.244:8000/api/v1/usekey?type=haveNo&key=" +
                        item,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )
                .then(res => {
                    let that = this;
                    if (res.data.code == 0) {
                        let data = JSON.parse(res.data.data);
                        data.key = item;
                        that.havenos.push({
                            label: data.pointName,
                            value: data.key
                        });
                    } else {
                        this.$message({
                            message: "查询失败",
                            type: "error"
                        });
                    }
                })
                .catch(err => {});
        },
          //请求微信组成员
        // askWx(groupId, userid, row) {

        //     this.$http("wx_user", "GET", {
        //         wx_user_group_id: groupId,
        //         user_id: userid
        //     })
        //         .then(res => {
        //             let that = this;
        //             if (res.data.error_code == 0) {
        //                 row.children = res.data.data.map(function(item, index) {
        //                     item["index"] = row.index;
        //                     item.wx_status =
        //                         that.statusTostring[item.wx_status];
        //                     item.sex = that.sexTostring[item.sex];
        //                     item["itemIndex"] = index;
        //                     item["checked"] = false;
        //                     if (row.checked == true) {
        //                         item.checked = true;
        //                     } else {
        //                         item.checked = false;
        //                     }
        //                     return item;
        //                 });
        //             } else {
        //                 this.$message({
        //                     message: "请求微信号失败:" + res.data.error_message,
        //                     type: "error"
        //                 });
        //             }
        //         })
        //         .catch(err => {
        //             this.$message({
        //                 message: "请求微信号失败:" + res.data.error_message,
        //                 type: "error"
        //             });
        //         });
        // },
        //外层table行展开后请求数据
        expandChange(row) {
            if (row.children.length <= 0) {
                this.askWx(row.wx_user_group_id, row.user_id, row);
            }
        },
      
        //内部表格每行的选择框
        cellclicks(row) {
            this.index = row.index;
            let arr = 0;
            for (
                let i = 0;
                i < this.tableData[this.index].children.length;
                i++
            ) {
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
                        for (
                            let j = 0;
                            j < that.tableData[i].children.length;
                            j++
                        ) {
                            if (
                                that.tableData[i].children[j].checked == false
                            ) {
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
        /*获取配置列表*/
        gainDeploylist() {
            this.findKey();
        },
        /*配置运行*/
        affirmOperation(item) {
            this.add = true;
            this.mask = true;
            this.key = item.wx_haveno;
            this.groupId = item.wx_user_group_id;
            this.userId = item.user_id;
        },
        /*确认配置*/
        affirmDeploy(item) {
          console.log(itme)
            let data = {
                groupId: item.wx_user_group_id,
                deploy: item.wx_haveno
            };
            axios
                .post(
                    "http://106.14.222.244:8000/api/v1/text?type=wxDeploy&key=" +
                        item.wx_user_group_id,
                    data,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )
                .then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            message: "确认配置成功",
                            type: "success"
                        });
                    } else {
                        this.$message({
                            message: "确认配置失败",
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "确认配置失败",
                        type: "error"
                    });
                });
        },
        //分页
        /*handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },*/
        /*获取组配置*/
        gainGroupdeploy(item, index) {
            axios
                .get(
                    "http://106.14.222.244:8000/api/v1/usekey?type=wxDeploy&key=" +
                        item,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )
                .then(res => {
                    if (res.data.code == 0) {
                        let show = false;
                        this.havenos.map(function(item) {
                            if (
                                JSON.parse(res.data.data).deploy == item.value
                            ) {
                                show = true;
                            }
                        });
                        if (JSON.parse(res.data.data).deploy && show) {
                            this.tableData[index].wx_haveno = JSON.parse(
                                res.data.data
                            ).deploy;
                        } else {
                            this.tableData[index].wx_haveno = "";
                        }
                    } else {
                        this.$message({
                            message: "查询失败",
                            type: "error"
                        });
                    }
                })
                .catch(err => {});
        },
        /*初始化列表*/
        // init() {
        //     this.$http("wx_group/list", "GET")
        //         .then(res => {
        //             let that = this;
        //             if (res.data.error_code == 0) {
        //                 this.tableData = res.data.data.map(function(item) {
        //                     item["wx_haveno"] = "";
        //                     return item;
        //                 });
        //                 this.tableData.map(function(item, index) {
        //                     that.gainGroupdeploy(item.wx_user_group_id, index);
        //                 });
        //             } else {
        //                 this.$message({
        //                     message: "获取列表失败:" + res.data.error_message,
        //                     type: "error"
        //                 });
        //             }
        //         })
        //         .catch(err => {
        //             this.$message({
        //                 message: "获取列表失败:" + res.data.error_message,
        //                 type: "error"
        //             });
        //         });
        // },

        //初始化列表
        init() {
            this.$http("wx_group/list", "GET")
                .then(res => {
                    if (res.data.error_code == 0) {
                        let that = this;
                        this.tableData = res.data.data.map(function(
                            item,
                            index
                        ) {
                            item["index"] = index;
                            item["selectArr"] = [];
                            item["selectNumber"] = 0;
                            item["checked"] = false;
                            item["children"] = [];
                            return item;
                        });
                        this.tableData.map(function(item, index) {
                            that.gainGroupdeploy(item.wx_user_group_id, index);
                        });
                    } else {
                        this.$message({
                            message: "获取列表失败:" + res.data.error_message,
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
        },

        initTask() {
            this.$http("task_template?page=1&per_page=999999", "GET")
                .then(res => {
                    if (res.data.error_code == 0) {
                        res.data.data.map(item => {
                            if (item.task_template_name == "养号") {
                                this.taskId = item.task_template_id;
                                this.taskName = item.task_template_name;
                            }
                        });
                    } else {
                        this.$message({
                            message: "获取任务列表失败",
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "获取任务列表失败",
                        type: "error"
                    });
                });
        }
    },
    mounted() {
        this.initTask();
        this.gainDeploylist();
        this.init();
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
//   头部文字
#groupManage {
    color: #707070;
    padding: 22px 88px;

    .manage {
        background: #fff;
        padding: 30px 52px;
        .title {
            .all {
                width: 100%;
                height: 70px;
                line-height: 70px;
                h4 {
                    font-size: 19px;
                }
                .ul {
                    overflow: hidden;
                    .left {
                        float: left;
                    }
                    .right {
                        float: right;
                    }
                }

                span {
                    font-size: 18px;
                    float: left;
                }
                .el-button {
                    float: right;
                    margin-top: 15px;
                }
                .el-input {
                    width: 300px;
                    display: block;
                    .el-input__icon {
                        height: 150%;
                    }
                }
            }
        }
        .el-table {
            width: 95%;
            margin: 0 auto;
            margin-top: 100px;
            .el-button {
                float: left;
            }
        }
        //.分页
        .block {
            padding: 15px 0 50px;
            text-align: center;
            .el-pagination {
                display: inline-block;
            }
        }
        // 弹窗样式
        .public {
            position: absolute;
            left: 30%;
            top: 30%;
            width: 500px;
            border-radius: 6px;
            background-color: #fff;
            z-index: 11;
            box-sizing: border-box;
            .header {
                padding: 10px 15px;
                overflow: hidden;
                font-size: 14px;
                background-color: #e1ebf4;
                border-radius: 6px 6px 0 0;
                h5 {
                    text-align: center;
                    float: left;
                    width: 95%;
                    font-size: 18px;
                    line-height: 20px;
                }
                span {
                    float: right;
                    color: #73879c;
                    cursor: pointer;
                    line-height: 20px;
                }
            }
            .content {
                padding: 15px;
                .specialSelect {
                    margin: 10px 0 0 25px;
                    width: 260px;
                }
                .contentItem {
                    padding: 5px 0;
                    overflow: hidden;
                    .el-date-editor {
                        margin-bottom: 10px;
                    }
                    span {
                        line-height: 40px;
                    }
                    .el-input {
                        float: left;
                        width: 80%;
                        margin-left: 20px;
                    }
                    .el-select {
                        float: left;
                        width: 80%;
                        margin-left: 20px;
                    }
                }
            }
            .footer {
                padding: 15px;
                border-top: 1px solid #e5e5e5;
                text-align: center;
            }
        }
        .el-input__prefix,
        .el-input__suffix {
            top: 360px;
        }
    }
}
</style>