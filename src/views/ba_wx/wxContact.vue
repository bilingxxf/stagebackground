<template>
	<div id="account" class="main-body">
    <div class="main-wrapper">
      <div class="addAccount">
        <div class="add">
          <h3 class="page-title">联系人分组</h3>
          <div class="left">
            <span>添加分组</span>
            <el-input class="ele-input" size="small" placeholder="请输入英文和数字组合" v-model="accountGroup" @keyup.enter.native="addAccountGroup"></el-input>
          </div>
          <div class="right">
            <el-button type="primary" class="ele-btn" @click="addAccountGroup">添加</el-button>
          </div>
        </div>
      </div>
      <div class="accountTable">
          <div class="tableTop">
            <span>微信号分组记录</span>
            <!-- <el-button size="mini" class="ele-btn" type="primary" @click="performTask">执行任务</el-button> -->
            <el-button size="mini" class="ele-btn" type="primary" style="margin-right: 10px;" @click="changeGroup">批量移动</el-button>
          </div>
          <!-- <ul class="tableTop">
          <li style="margin-top:10px;"> <span >联系人分组记录</span></li>
          <li>	<el-button size="mini" class="ele-btn" type="primary" @click="changeGroup">批量移动</el-button></li>
          </ul> -->
        <div class="table">
          <div class="tableContent">
            <el-checkbox class="checkedAll" v-model="checkedAll" @change="checkedall">全选</el-checkbox>
            <el-table :data="tableData" @expand-change="expandChange" style="width: 100%" :header-cell-style="getHeaderClass" class="ele-table-init">
              <el-table-column type="expand">
                <template slot-scope="props" style="width: 100%;">
                  <el-table :data="props.row.children" style="width: 100%" class="childTable ele-table-init">
                    <el-table-column label="" width="80">
                      <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked" @change="cellclicks(scope.row)"></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column label="头像" width="200" align="left">
                      <template slot-scope="scope" align="center">
                        <img class="header" :src="scope.row.small_head" alt="" align="left">
                      </template>
                    </el-table-column>
                    <el-table-column label="备注名/联系人昵称" align="left">
                      <template slot-scope="scope">
                        <span v-if="scope.row.contact_nickname!=''">{{scope.row.contact_nickname}}</span>
                        <span v-else>{{scope.row.wcaccount_username}}</span>

                      </template>
                    </el-table-column>
                    <el-table-column prop="contact_wx_username" label="微信号" align="left">
                    </el-table-column>
                    <el-table-column prop="wcaccount_username" label="所属微信号" align="left">
                    </el-table-column>
                    <el-table-column prop="sex" label="性别" align="left" width="50">
                    </el-table-column>

                    <el-table-column prop="label" label="标签" align="left">
                    </el-table-column>
                  </el-table>
                  <div class="more">
                    <!--<div class="more" v-if="props.row.contact_number>20">-->
                    <el-button type="primary" @click="addMore(props.row)" plain>加载更多</el-button>
                  </div>

                </template>
              </el-table-column>
              <el-table-column width="30px">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.checked" @change="cellclick(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="已选择/总数" align="left">
                <template slot-scope="scope">
                  {{scope.row.selectNumber}}/{{scope.row.contact_number}}
                </template>
              </el-table-column>
              <el-table-column prop="wx_contact_group_name" label="联系人分组" align="left">
              </el-table-column>
              <el-table-column prop="create_time" label="添加分组时间" align="left">
              </el-table-column>
              <el-table-column label="操作" align="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="addGroup" disabled>添加微信账号</el-button>
                  <el-button type="text" @click="enditorGroup(scope.$index)">编辑</el-button>
                  <el-button type="text" style="color:red;" @click="deleteGroup(scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column label="" width="30"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
		<!-- 编辑弹窗 -->
		<transition name="fade">
			<div class="editorPop" v-if="editorPop" :key="1">
				<div class="content">
					<div class="header">编辑分组名称</div>
					<div class="text">
						<div class="item">
							<span>分组名称</span>
							<el-input class="ele-input" v-model="editorInput"></el-input>
						</div>
						<div class="item_btn">
							<el-button class="ele-btn" type="primary" @click="confirmEditor">确认</el-button>
							<el-button class="ele-btn" type="primary" @click="editorInput='',editorPop=false">取消</el-button>
						</div>
					</div>
				</div>
			</div>
			<!-- 移动弹窗 -->
			<div class="editorPop" v-if="movePop" :key="2">
				<div class="content">
					<div class="header">移动分组</div>
					<div class="text">
						<div class="item">
							<span>分组名称</span>
							<el-select v-model="deletegroup" class="ele-select" placeholder="请选择账号移动的分组">
								<el-option v-for="item in deletegroups" :key="item.wx_contact_group_id" :label="item.wx_contact_group_name" :value="item.wx_contact_group_id">
								</el-option>
							</el-select>
						</div>
						<div class="item_btn">
							<el-button type="primary" class="ele-btn" @click="confirmMove">确认</el-button>
							<el-button type="primary" class="ele-btn" @click="deletegroup='',deletegroups=[],movePop=false,deletegroup=''">取消</el-button>
						</div>
					</div>
				</div>
			</div>

		</transition>

	</div>
</template>
<script>
export default {
  data() {
    return {
      movePop: false,
      deletegroup: "",
      deletegroups: [],
      deletePop: false,
      editorPop: false,
      editorInput: "",
      tableData: [],
      accountGroup: "",
      groupId: null,
      groupchildrenId: [],
      index: 0,
      sexTostring: ["未知", "男", "女"],
      statusTostring: ["禁用", "启用"],
      arr: [],
      checkedAll: false,
      groupIndex: null,
      checkedTrue: false,
	  selectGroupId: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
     // 表格头部背景颜色
      getHeaderClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px";
        } else {
          return "";
        }
      },
    //请求联系人成员
    askWx(groupId, userid, row, page) {
      this.$http("contact", "POST", {
        wx_contact_group_id: groupId,
        user_id: userid,
        length: 10,
        pageNo: page
      })
        .then(res => {
          let that = this;
          if (res.data.error_code == 0) {
            let data = res.data.data;
            if (row.children.length == 0) {
              row.children = data.result.map(function(item, index) {
                item["index"] = row.index;
                item.wx_enable_status =
                  that.statusTostring[item.wx_enable_status];
                item.sex = that.sexTostring[item.sex];
                item["itemIndex"] = index;
                item["checked"] = false;
                if (row.checked == true) {
                  item.checked = true;
                  row.selectArr.push(item.wx_contact_id);
                } else {
                  item.checked = false;
                }
                return item;
              });
            } else {
              data.result.forEach((item, index) => {
                item["index"] = row.index;
                item.wx_enable_status =
                  that.statusTostring[item.wx_enable_status];
                item.sex = that.sexTostring[item.sex];
                item["itemIndex"] = index;
                item["checked"] = false;
                if (row.checked == true) {
                  item.checked = true;
                } else {
                  item.checked = false;
                }
                row.children.push(item);
              });
            }
          } else {
            this.$message({
              message: "请求微信号失败:",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "请求微信号失败",
            type: "error"
          });
        });
    },
    //外层table行展开后请求数据
    expandChange(row) {
      if (row.children.length == 0) {
        this.askWx(row.wx_contact_group_id, row.user_id, row, row.page);
      }
    },
    //确认移动
    confirmMove() {
      this.$http("contact/to_divide_group", "POST", {
        wx_contact_group_id: this.selectGroupId,
        wx_contact_id: this.groupchildrenId,
        new_wx_contact_group_id: this.deletegroup
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "移动分组成功",
              type: "success"
            });
            this.movePop = false;
            this.deletegroup = "";
            this.deletegroups = [];
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
    //移动微信号
    changeGroup() {
      let that = this;
      this.selectGroupId = [];
      this.groupchildrenId = [];
      this.tableData.map(item => {
        if (item.checked == true) {
          this.selectGroupId.push(item.wx_contact_group_id);
        } else {
          item.selectArr.forEach(items => {
            this.groupchildrenId.push(items);
          });
        }
      });
      this.movePop = true;
      this.tableData.forEach(item => {
        this.deletegroups.push(item);
      });
      this.deletegroup = this.deletegroups[0].wx_contact_group_id;
    },
    //外部表格的全选按钮
    checkedall() {
      if (this.checkedAll == true) {
        let that = this;
        this.tableData.map(function(item) {
          item.checked = true;
          item.selectNumber = item.contact_number;
          if (item.children !== undefined) {
            item.children.map(function(items) {
              items.checked = true;
              item.selectArr.push(items.wx_contact_id);
            });
          }
        });
      } else {
        this.tableData.map(function(item) {
          item.checked = false;
          item.selectNumber = 0;
          item.selectArr = [];
          if (item.children != undefined) {
            item.children.map(function(items) {
              items.checked = false;
            });
          }
        });
      }
    },
    //内部表格每行的选择框
    cellclicks(row) {
      console.log(this.tableData[this.index]);
      this.index = row.index;
      let arr = 0;
      for (let i = 0; i < this.tableData[this.index].children.length; i++) {
        if (this.tableData[this.index].children[i].checked == true) {
          arr++;
        }
      }
      if (arr < this.tableData[this.index].children.length) {
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
        this.tableData[this.index].selectArr.push(row.wx_contact_id);
        this.tableData[this.index].selectNumber = this.tableData[
          this.index
        ].selectArr.length;
      } else {
        this.checkedAll = false;
        let that = this;
        this.tableData[this.index].selectArr.forEach((item, index) => {
          if (row.wx_contact_id == item) {
            this.tableData[this.index].selectArr.splice(index, 1);
          }
        });
        this.tableData[this.index].selectNumber = this.tableData[
          this.index
        ].selectArr.length;
      }
    },
    //外部表格每行的选择框
    cellclick(row) {
      let that = this;
      that.index = row.index;
      if (row.checked == true) {
        let arr = [];
        row.children.map(function(item) {
          item.checked = true;
          arr.push(item.wx_contact_id);
        });
        that.tableData[that.index].selectArr = arr;
        that.tableData[that.index].selectNumber =
          that.tableData[that.index].contact_number;
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
    },
    //确认删除
    confirmDelete() {
      let currentRow, newGroupId;
      this.tableData.map(item => {
        if (this.groupId == item.wx_contact_group_id) {
          currentRow = item;
        }
      });
      if (currentRow.contact_number == 0) {
        newGroupId = 0;
      } else {
        newGroupId = this.deletegroup;
      }
      this.$http("contact/group", "DELETE", {
        wx_contact_group_id: this.groupId,
        new_wx_contact_group_id: newGroupId
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
            this.deletePop = false;
            this.deletegroups = [];
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
        this.$http("contact/group", "PUT", {
          group_name: this.editorInput,
          wx_contact_group_id: this.groupId
        })
          .then(res => {
            if (res.data.error_code == 0) {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.tableData[
                this.groupIndex
              ].wx_contact_group_name = this.editorInput;
              this.editorPop = false;
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
    //加载更多
    addMore(row) {
      row.page = row.page + 1;
      this.askWx(row.wx_contact_group_id, row.user_id, row, row.page);
    },
    //获取删除初始数据
    deleteGroup(row) {
      console.log(row);
      this.$http("contact/group", "DELETE", {
        wx_contact_group_id: row.wx_contact_group_id
      })
        .then(res => {
          console.log(res.data);
          if (res.data.error_code == 0) {
            this.$message({
              message: res.data.error_message,
              type: "success"
            });
            this.init();
          } else {
            this.$message({
              message: res.data.error_message,
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
    },
    //获取编辑初始数据
    enditorGroup(index) {
      this.editorPop = true;
      this.editorInput = this.tableData[index].wx_contact_group_name;
      this.groupId = this.tableData[index].wx_contact_group_id;
      this.groupIndex = index;
    },
    //添加分组
    addAccountGroup() {
      if (this.accountGroup == "") {
        this.$message({
          message: "分组名称不能为空！",
          type: "warning"
        });
      } else {
        this.$http("contact/group", "POST", {
          group_name: this.accountGroup
        })
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
                message: res.data.message,
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
      this.checkedAll = false;
      this.$http("contact/group", "GET")
        .then(res => {
          if (res.data.error_code == 0) {
            let that = this;
            this.tableData = res.data.data.map(function(item, index) {
              item["index"] = index;
              item["selectArr"] = [];
              item["selectNumber"] = 0;
              item["checked"] = false;
              item["children"] = [];
              item["page"] = 1;
              return item;
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
    }
  }
};
</script>
<style scoped lang="scss">
#account {
  width: 100%;
  height: 100%;
  // padding:50px 5%;
  box-sizing: border-box;
  .childSelect {
    display: none;
  }
  h3 {
	font-size: 19px;
	margin-bottom: 15px;
  }
  .addAccount {
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
          margin-right: 20px;
		  color: #707070;
		   margin-right: 22px;
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
    span {
      line-height: 24px;
      font-size: 14px;
      margin-right: 40px;
      color: #707070;
    }
  .tableTop {
        margin-bottom: 20px;
        overflow: hidden;
        li{
          float: left;
          width:415px;
        }
        li:nth-child(2){
          float: right;
        }
        .el-input {
          width: 240px !important;
          float: left;
        }
        .el-button {
          float: right;
        }
      }
    .table {
      // padding:0 50px;
      background-color: #fff;
      .more {
        margin-top: 20px;
        text-align: center;
      }
      .tableContent {
        position: relative;
      
        .header {
          width: 45px;
          height: 45px;
          display: inline-block;
          border: 1px solid #ccc;
        }
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

    
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
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
				border-radius: 5px;
				position:absolute;
				top:30%;
				left:50%;
				margin-left:-275px;
				.header {
					font-size: 14px;
					line-height: 48px;
					text-align: center;
					border-top-left-radius: 5px;
					border-top-right-radius: 5px;
					background-color:#409EFF;
					color: #fff;
				}
				.text{
					padding: 10px 50px 50px;
				}
				.item {
					width: 100%;
					margin: 30px 0 ;
					overflow: hidden;
					text-align: center;
					span {
						display: block;
						font-size: 14px;
						width: 80px;
						float: left;
						margin-left: 40px;
					}
					.el-input {
						float: left;
						// width: 300px !important;
					}
					.el-select {
						// width: 300px;
						float: left;
					}
				}
				.item_btn{
					margin-top: 40px;
					text-align: center;
				}
			}
		}
</style>