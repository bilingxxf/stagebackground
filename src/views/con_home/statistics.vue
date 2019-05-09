<template>
  <div class="home">
    <div class="account">
      <div class="title">
        <h3 style="color:#333333;">今日异常账号</h3>
        <span>今日新增异常：{{abnormalAccount}}</span>
      </div>
      <div class="sel-date">
        <!-- 下拉框 -->
        <div class="select">
          <el-select size="medium" v-model="value" placeholder="最近三天">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 日历 -->
        <div class="date">
          <el-date-picker size="medium" v-model="value13" :style="dateStyle" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </div>

      <div class="accountTable">
        <template>
          <el-table :data="tableData1" style="width: 100%" :header-cell-style="getHeaderClass">
            <el-table-column prop="userid" label="账号名称" align="center">
            </el-table-column>
            <el-table-column prop="name" label="ID" align="center">
            </el-table-column>
            <el-table-column prop="password" label="密码" align="center">
            </el-table-column>
            <el-table-column prop="grouping" label="分组" align="center">
            </el-table-column>
            <el-table-column prop="plan" label="养号计划" align="center">
            </el-table-column>
          </el-table>
        </template>
        <el-button type="text">
          <i class="el-icon-caret-bottom"></i>
        </el-button>
      </div>
    </div>
    <div class="plan">
      <div class="title">
        <h3 style="color:#333333;">养号计划异常率</h3>
      </div>
      <div class="playTable">
        <!-- 设置sortable 通过 Table 的default-sort属性设置默认的排序列和排序顺序  -->
        <el-table :data="tableData2" style="width: 100%" :header-cell-style="getHeaderClass" :default-sort="{prop: 'anomaly', order: 'descending'}">
          <el-table-column prop="planid" label="计划名称" align="center">
          </el-table-column>
          <el-table-column prop="member" label="计划成员数" align="center">
          </el-table-column>
          <el-table-column prop="anomaly" label="异常数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="rate" label="异常率" align="center" sortable>
          </el-table-column>
          <el-table-column prop="eration" label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text">查看配置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="text">
          <i class="el-icon-caret-bottom"></i>
        </el-button>
      </div>
    </div>
    <div class="group">
      <div class="title">
        <h3 style="color:#333333;">组异常率</h3>
      </div>
      <div class="groupTable">
        <!-- 设置sortable 通过 Table 的default-sort属性设置默认的排序列和排序顺序  -->
        <el-table :data="tableData3" style="width: 100%" :header-cell-style="getHeaderClass" :default-sort="{prop: 'unusual', order: 'descending'}">
          <el-table-column prop="group" label="组名称" align="center">
          </el-table-column>
          <el-table-column prop="name" label="组成员数" align="center">
          </el-table-column>
          <el-table-column prop="unusual" label="异常数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="rate" label="异常率" align="center" sortable>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text">查看组</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="text">
          <i class="el-icon-caret-bottom"></i>
        </el-button>
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="100" layout="total, prev, pager, next" :total="500">
        </el-pagination>
      </div>
    </div>
    <!--弹窗-->
    <transition name="fade">
      <div class="bounced" v-show="recordShow" :key="1">
        <div class="mask"></div>
        <div class="message">
          <div class="modal-header">
            <h3>组详情
              <span @click="closeRecord"><img src="../../assets/images/close.png" alt="" /></span>
            </h3>
          </div>
          <div class="modal-body">
            <el-table :data="tableData1" height="360" border style="width: 100%">
              <el-table-column prop="date" label="头像" width="180" align="center">
                <template slot-scope="scope">
                  <img class="headImg" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2222087985,2716392623&fm=27&gp=0.jpg" alt="" />
                </template>
              </el-table-column>
              <el-table-column prop="name" label="微信昵称" width="180" align="center">
              </el-table-column>
              <el-table-column prop="name" label="异常原因" align="center">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Bus from "../eventBus/event.js";
export default {
  data() {
    return {
      abnormalAccount: 250,

      // select
      options: [
        {
          value: "选项1",
          label: "最近3天"
        },
        {
          value: "选项2",
          label: "最近7天"
        },
        {
          value: "选项3",
          label: "最近30天"
        }
      ],
      value: "",

      value13: "", //日期
      dateStyle:{border:0,width:"200px"},

      //table
      tableData1: [
        {
          userid: "123",
          name: "王小虎",
          password: "12345",
          grouping: "分组一",
          plan: "计划一"
        },
        {
          userid: "123",
          name: "王小虎",
          password: "12345",
          grouping: "分组一",
          plan: "计划一"
        },
        {
          userid: "123",
          name: "王小虎",
          password: "12345",
          grouping: "分组一",
          plan: "计划一"
        },
        {
          userid: "123",
          name: "王小虎",
          password: "12345",
          grouping: "分组一",
          plan: "计划一"
        }
      ],
      tableData2: [
        {
          planid: "名单一",
          member: "1人",
          anomaly: "1",
          rate: "50%"
        },
        {
          planid: "名单二",
          member: "2人",
          anomaly: "2",
          rate: "40%"
        },
        {
          planid: "名单三",
          member: "3人",
          anomaly: "3",
          rate: "30%"
        },
        {
          planid: "名单四",
          member: "4人",
          anomaly: "4",
          rate: "20%"
        }
      ],
      tableData3: [
        {
          group: "ouyun",
          name: "王小虎",
          unusual: "1条",
          rate: "10%"
        },
        {
          group: "ouyun",
          name: "王小虎",
          unusual: "2条",
          rate: "50%"
        },
        {
          group: "ouyun",
          name: "王小虎",
          unusual: "3条",
          rate: "30%"
        },
        {
          group: "ouyun",
          name: "王小虎",
          unusual: "4条",
          rate: "40%"
        }
      ],
      // 表格头部背景颜色
      getHeaderClass({ row, column, rowIndex, columnIndex }) {
        // console.log(row)
        // console.log(column)
        // console.log(rowIndex)
        // console.log(columnIndex)
        if (rowIndex == 0) {
          return "background:#ecf5ff;font-size:16px;color:#409eff;height:40px";
        } else {
          return "";
        }
      },
      currentPage1: 5, //分页
      recordShow: false
    };
  },
  methods: {
    //查看配置
    checkConfiguration(row) {
      console.log(row);
      this.$emit("checkConfiguration", row.plan_id);
      this.$router.push("/con_pointManage");
    },
    //查看组
    checkGroup() {
      this.recordShow = true;
    },
    //关闭弹窗
    closeRecord() {
      this.recordShow = false;
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
.home {
  padding: 22px 88px;
  h3 {
    font-size: 19px;
    margin-bottom: 22px;
  }
  .account,
  .plan,
  .group {
    position: relative;
    background: #fff;
    padding: 50px 52px;
    margin-bottom: 25px;
    .title {
      h3 {
        display: inline-block;
        font-weight: 400;
        color: #8c8686;
        margin-right: 30px;
      }
    }
    .sel-date {
      overflow: hidden;
      width: 480px;
      margin: 20px 0;
      .select {
        float: left;
        width: 120px;
      }
      .date {
        float: left;
        padding-left: 10px;
        width: 200px;
      }
    }
  }
  .accountTable,
  .playTable,
  .groupTable {
    text-align: center;
    .el-button {
      margin-top: 15px;
    }
  }
  .account {
    padding: 50px 52px;
    .title {
      span {
        margin-right: 100px;
        color: #8cc5ff;
      }
    }
  }
  .plan {
    padding: 50px 52px;
  }
  .headImg {
    width: 50px;
    height: 50px;
  }
  .bounced {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    .mask {
      background: #000;
      opacity: 0.4;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
    }
    .message {
      width: 590px;
      position: absolute;
      top: 30%;
      left: 50%;
      margin-left: -280px;
      padding-bottom: 50px;
      background: #fff;
      border-radius: 5px;
      z-index: 15;
      .modal-header {
        height: 50px;
        line-height: 50px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-size: 12px;
        color: #fff;
        font-weight: normal;
        background: #4caeda;
        position: relative;
        text-align: center;
        h3 {
          font-size: 14px;
        }
        span {
          position: absolute;
          right: 5px;
          line-height: 23px;
          margin-top: 4px;
          padding: 0 5px;
          display: inline-block;
          cursor: pointer;
          img {
            width: 30px;
            height: 30px;
            margin-top: 6px;
          }
        }
      }
      .modal-body {
        min-height: 400px;
        max-height: 400px;
        padding: 20px 50px;
        overflow: auto;
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
  //.分页
  .block {
    padding: 15px 0 50px;
    text-align: center;
    .el-pagination {
      display: inline-block;
    }
  }
}
</style>