<template>
  <div id="accountManage">
    <div class="manage">
      <!--tabs标签页 first-->
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="所有账号" name="first">
            <div class="select">
              <ul class="ul">
                <li class="li1">
                  <el-select v-model="value" placeholder="所有状态">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </li>
                <li class="li2">
                  <!-- 复合输入框 -->
                  <el-input placeholder="请输入内容" v-model="input5" class="input-with-select" suffix-icon="el-icon-search">
                    <el-select v-model="select" slot="prepend" placeholder="全部分组">
                      <el-option label="餐厅名" value="1"></el-option>
                      <el-option label="订单号" value="2"></el-option>
                      <el-option label="用户电话" value="3"></el-option>
                    </el-select>
                  </el-input>
                </li>
              </ul>
            </div>
            <div class="table">
              <div class="batch">
                <span>批量操作(已选{{batchNamber}})</span>
                <el-button type="text">修改昵称</el-button>
                <el-button type="text">修改头像</el-button>
                <el-button type="text">修改签名</el-button>
                <el-button type="text">修改地区</el-button>
                <el-button type="text">修改分组</el-button>
                <el-button type="text">修改性别</el-button>
                <el-button type="text">修改密码</el-button>
                <el-button type="text">修改封面</el-button>
                <el-button type="text">修改密码</el-button>
                <el-button type="text">养号配置</el-button>
                <el-button type="text">朋友全权限</el-button>
                <el-button type="text">删除</el-button>
              </div>
              <!-- table表单 -->
              <!-- 设置sortable 通过 Table 的default-sort属性设置默认的排序列和排序顺序  -->
              <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;"
                :header-cell-style="getHeaderClass" @selection-change="handleSelectionChange"
                :default-sort="{prop: 'sex', order: 'descending'}">
                <el-table-column type="selection" width="30">
                </el-table-column>
                <el-table-column prop="name" label="账号昵称" align="center">
                </el-table-column>
                <el-table-column prop="member" label="计划成员数" align="center">
                </el-table-column>
                <el-table-column prop="sex" label="性别" align="center" sortable>
                </el-table-column>
                <el-table-column prop="packet" label="分组" align="center" sortable>
                </el-table-column>
                <el-table-column prop="keep" label="养号配置" align="center" sortable>
                </el-table-column>
                <el-table-column prop="friend" label="好友数" align="center" sortable>
                </el-table-column>
                <el-table-column prop="state" label="状态" align="center" sortable>
                </el-table-column>
                <el-table-column label="操作" width="280" align="center">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text">上线</el-button>
                    <el-button size="mini" type="text">发圈</el-button>
                    <el-button size="mini" type="text">改密</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="currentPage1" :page-size="100" layout="total, prev, pager, next" :total="500">
              </el-pagination>
            </div>
          </el-tab-pane>
          <!--tabs标签页 two -->
          <el-tab-pane label="添加账号" name="two">账号密码二维码批量操作</el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        //tabs标签页
        activeName: "first",
        value: "",
        options: [{
            value: "选项1",
            label: "在线"
          },
          {
            value: "选项2",
            label: "离线"
          },
          {
            value: "选项3",
            label: "异常"
          }
        ],

        input: "",
        batchNamber: "",
        //复合输入框
        input5: "",
        select: "",

        // table表单
        tableData: [{
            name: "王小虎",
            member: "12345",
            sex: "男",
            packet: "分组一",
            keep: "计划一",
            friend: "17",
            state: "上线"
          },
          {
            name: "王小虎",
            member: "12345",
            sex: "男",
            packet: "分组二",
            keep: "计划一",
            friend: "13",
            state: "异常"
          },
          {
            name: "王小虎",
            member: "12345",
            sex: "男",
            packet: "分组三",
            keep: "计划一",
            friend: "12",
            state: "异常"
          },
          {
            name: "王小虎",
            member: "12345",
            sex: "女",
            packet: "分组四",
            keep: "计划一",
            friend: "5",
            state: "下线"
          },
          {
            name: "王小虎",
            member: "12345",
            sex: "男",
            packet: "分组五",
            keep: "计划一",
            friend: "9",
            state: "上线"
          },
          {
            name: "王小虎",
            member: "12345",
            sex: "女",
            packet: "分组一",
            keep: "计划一",
            friend: "17",
            state: "下线"
          },
          {
            name: "王小虎",
            member: "12345",
            sex: "女",
            packet: "分组九",
            keep: "计划一",
            friend: "22",
            state: "上线"
          }
        ],
        // 表格头部背景颜色
        getHeaderClass({
          row,
          column,
          rowIndex,
          columnIndex
        }) {
          if (rowIndex == 0) {
            return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px";
          } else {
            return "";
          }
        },
        currentPage1: 5 //分页
      };
    },
    methods: {
      //tabs标签页
      handleClick(tab, event) {
        console.log(tab, event);
      },

      // table表单
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
  };

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #accountManage {
    color: #707070;
    padding: 22px 88px;

    h3 {
      font-size: 18px;
      color: #409eff;
    }

    .manage {
      background: #ffffff;
      padding: 50px 52px;

      .select {
        overflow: hidden;

        .ul {
          li {
            float: left;
          }

          .li1 {
            width: 150px;
            padding-right: 18px;
          }

          .li2 {
            width: 365px;
          }
        }
      }

      .table {
        img {
          width: 30px;
          height: 30px;
        }

        .batch {
          color: #409eff;
          height: 45px;
          padding-top: 5px;

          span {
            padding: px 10px;
          }
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
    }
  }

</style>
