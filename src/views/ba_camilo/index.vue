<template>
  <div class="camilo">
    <div class="generate">
      <div class="title">生成卡密</div>
      <div class="marginBottom40">
        <span class="inline_span">选择面值</span>
        <el-radio-group v-model="cloudPoint" fill="#409eff">
          <el-radio-button v-for="item in cloudValue" :label="item.voucher_type_value" border :key="item.voucher_type_value">{{item.voucher_type_value}}云点</el-radio-button>
        </el-radio-group>
      </div>
      <div class="marginBottom40">
        <span class="inline_span">购买数量</span>
        <div class="inline">
          <template>
            <el-input-number v-model="cloudAccount" controls-position="right" :min="1" :max="100" size="small"></el-input-number>
          </template>
        </div>
      </div>
      <div class="btn_wrapper">
        <el-button type="primary" plain @click="generateCamilo" :style="[button3]">生成</el-button>
      </div>
    </div>
    <div class=" generate">
      <div class="title">卡密记录</div>
      <div class="header">
        <div class="select_search">
          <el-select v-model="selectValue" placeholder="兑换状态" @change="selectChange">
            <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="record_serach">
          <el-input style="width:160px" v-model="search_code" placeholder="请输入卡密号" @keyup.enter.native="serarchCamilo" suffix-icon="el-icon-search"></el-input>
        </div>
        <div class="record_serach">
          <el-input style="width:160px" v-model="username" placeholder="请输入兑换账号" @keyup.enter.native="serarchAccount" suffix-icon="el-icon-search"></el-input>
        </div>
        <div class="camilo_account">
          <span>卡密数
            <i>{{camiloRecordAccount}}个</i>
          </span>
          <span>已使用
            <i>{{sum_point}}云点</i>
          </span>
        </div>
        <div class="record_date">
          <el-date-picker v-model="value13" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" range-separator=" 至 " @change="selectDate" value-format="yyyy-MM-dd HH:mm:ss" :unlink-panels=true :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </div>
      <div class="record_info">
        <el-table :data="camiloRecord" stripe style="width: 100%" :header-cell-style="getHeaderClass">
          <el-table-column prop="voucher_code" label="卡密号" align="center">
          </el-table-column>
          <el-table-column prop="create_time" label="生成时间" align="center">
          </el-table-column>
          <el-table-column label="兑换状态" align="center">
            <template slot-scope="scope">
              {{scope.row.exchange | capitalize}}
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="兑换账号" align="center">
          </el-table-column>
          <el-table-column prop="voucher_type_value" label="兑换云点" align="center">
          </el-table-column>
        </el-table>
      </div>
      <div class="paging">
        <div class="block">
          <el-pagination @current-change="recordCurrentChange" :current-page.sync="currentPage2" :page-size="10" layout="total, prev, pager, next" :total="camiloRecordAccount">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--生成卡密弹框-->
    <transition name="fade">
      <div class="bounced" v-show="recordShow" :key="1">
        <div class="mask"></div>
        <div class="message">
          <div class="modal-header">
            <h2>生成的卡密数
              <span @click="closeRecord"><img src="../../assets/images/close.png" alt="" /></span>
            </h2>
          </div>
          <div class="export">
            <a :href="downloadUrl">
              <el-button type="primary" plain>导出卡密</el-button>
            </a>
          </div>
          <div class="modal-body">
            <el-table :data="produceCamilo" stripe style="width: 100%;">
              <el-table-column prop="voucher_code" label="卡密号">
              </el-table-column>
              <el-table-column prop="created_time" label="生成时间">
              </el-table-column>
              <el-table-column prop="voucher_type_value" label="云点面值">
              </el-table-column>
            </el-table>
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
      cloudAccount: 1,
      camiloPage: 1,
      search_code: "",
      cloudPoint: 1,
      camiloRecordAccount: 0,
      start_time: "",
      end_time: "",
      exchange: "",
      value13: [],
      cloudValue: [],
      recordShow: false,
      camiloRecord: [],
      produceCamilo: [],
      currentPage2: 1,
      sum_point: "",
      options: [
        {
          label: "全部"
        },
        {
          label: "未兑换"
        },
        {
          label: "已兑换"
        }
      ],
      selectValue: "全部",
      downloadUrl: "",
      username: "",
      times: "",
      //button按钮样式
      button3: {
        width: "100px",
        height: "32px",
        color: "#ffffff",
        background: "#409eff",
        lineHeight: "1px"
      },
      // 表格头部背景颜色
      getHeaderClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px;";
        } else {
          return "";
        }
      }
    };
  },
  mounted() {
    // this.cardRecord();
    // this.cloudBalance();
    //下载Excel
    this.downloadUrl = "http://47.100.179.79:82/api/v1/voucher/export";
  },
  methods: {
    //关闭弹窗
    closeRecord() {
      this.recordShow = false;
      this.cardRecord();
    },
    //查询云点余额
    cloudBalance() {
      this.$http("voucher/type_value", "GET")
        .then(res => {
          let data = res.data;
          if (data.error_code === 0) {
            this.cloudValue = data.data;
            this.cloudPoint = data.data[0].voucher_type_value;
          } else {
            this.$message.error("错了哦，获取面值失败");
          }
        })
        .catch(err => {
          this.$message.error("错了哦，获取面值失败");
        });
    },
    //卡密记录
    cardRecord() {
      this.$http("voucher", "GET", {
        page: this.camiloPage,
        start_time: this.start_time,
        end_time: this.end_time,
        voucher_code: this.search_code,
        exchange: this.exchange,
        user_name: this.username
      })
        .then(res => {
          let data = res.data;
          if (data.error_code === 0) {
            this.camiloRecord = data.data;
            this.camiloRecordAccount = data.count;
            this.sum_point = data.sum_point;
          } else {
            this.$message.error("错了哦，获取记录失败");
          }
        })
        .catch(err => {
          this.$message.error("错了哦，获取记录失败");
        });
    },
    //搜索卡密
    serarchCamilo() {
      this.username = "";
      this.start_time = "";
      this.camiloPage = 1;
      this.end_time = "";
      this.value13 = [];
      this.cardRecord();
    },
    //搜索兑换账号
    serarchAccount() {
      this.value13 = [];
      this.search_code = "";
      this.start_time = "";
      this.camiloPage = 1;
      this.end_time = "";
      this.cardRecord();
    },
    //生成卡密
    generateCamilo() {
      let voucher_type_id;
      this.cloudValue.forEach(item => {
        if (item.voucher_type_value === this.cloudPoint) {
          voucher_type_id = item.voucher_type_id;
        }
      });
      this.$http("voucher", "POST", {
        number: this.cloudAccount,
        voucher_type_value: this.cloudPoint,
        voucher_type_id: voucher_type_id
      })
        .then(res => {
          if (res.data.error_code == 0) {
            let data = res.data;
            this.produceCamilo = data.data;
            this.produceCamiloAccount = data.count;
            this.recordShow = true;
            this.cardRecord();
          } else {
            this.$message({
              message: "错了哦，生成卡密失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "错了哦，生成卡密失败",
            type: "error"
          });
        });
    },
    //日期
    selectDate() {
      if (this.value13 === null) {
        this.start_time = "";
        this.end_time = "";
        this.selectValue = "";
        this.cardRecord();
      } else {
        (this.username = ""),
          (this.search_code = ""),
          (this.start_time = this.value13[0]);
        this.end_time = this.value13[1];
        this.selectValue = "全部";
        this.cardRecord();
      }
    },
    //分页
    recordCurrentChange(val) {
      this.camiloPage = val;
      this.cardRecord();
    },
    //下拉选择框
    selectChange() {
      if (this.selectValue === "全部") {
        this.exchange = "";
      } else if (this.selectValue === "已兑换") {
        this.exchange = 1;
      } else if (this.selectValue === "未兑换") {
        this.exchange = 0;
      }
      this.$nextTick(function() {
        this.username = "";
        (this.search_code = ""), (this.camiloPage = 1);
        this.currentPage2 = 1;
        this.cardRecord();
      });
    }
  },
  //过滤器
  filters: {
    capitalize: function(value) {
      if (value === 0) {
        return "未兑换";
      } else if (value === 1) {
        return "已兑换";
      }
    }
  }
};
</script>
<style scoped lang="scss">
.camilo {
  color: #555b6b;
  padding: 22px 88px;
  .generate {
    padding: 30px 30px 50px 30px;
    margin-bottom: 20px;
    position: relative;
    z-index: 0;
    background: #fff;
    border-radius: 5px;
    .title {
      line-height: 30px;
      margin-bottom: 15px;
      font-size: 18px;
      color: #333333;
    }
    .marginBottom40 {
      margin-top: 36px;
      margin-bottom: 20px;
    }
    .el-radio-button {
      width: 113px;
      height: 55px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-right: 20px;
    }
    .inline_span {
      margin-right: 50px;
      padding: 20px 0;
    }
    .inline {
      display: inline-block;
      span {
        display: inline-block;
        border-radius: 2px;
        width: 158px;
        height: 68px;
        color: #8c8c8c;
        border: 1px solid #ccc;
        line-height: 68px;
        text-align: center;
        margin-right: 20px;
        cursor: pointer;
      }
    }
    .btn_wrapper {
      padding-left: 120px;
      padding-top: 40px;
    }
    .record_info{padding:0 120px;
    .el-table{
				font-size: 12px;
				color: #888;
			}}
  }
  .header {
    padding: 16px 0px;
    .select_search,
    .record_serach,
    .record_date,
    .camilo_account {
      display: inline-block;
    }
    .select_search {
      width: 120px;
      margin-right: 20px;
    }
    .record_serach {
      margin-right: 20px;
    }
    .el-input__inner {
      width: 160px;
    }
    .el-date-editor {
      width: 260px;
    }
    .record_date {
      float: right;
      .block {
        display: inline-block;
        margin: 0 10px;
      }
    }
    .camilo_account {
      float: right;
      margin-left: 10px;
      span {
        height: 40px;
        line-height: 40px;
        i {
          color: #80beff;
          padding: 0 5px;
        }
      }
    }
  }
  .paging {
    text-align: center;
    .block {
      padding: 20px 0;
    }
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
      width: 690px;
      position: absolute;
      top: 30%;
      left: 50%;
      margin-left: -345px;
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
        h2 {
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
      .export {
        padding: 10px 20px 0px;
        overflow: hidden;
        /*div{
						float: right;
					}*/
        .el-button {
          float: right;
        }
      }
      .modal-body {
        max-height: 390px;
        padding: 0px 50px;
        overflow: auto;
      }
      .modal-footer {
        text-align: center;
        margin: 15px 0 30px;
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
 
 
</style>