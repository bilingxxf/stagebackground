<template>
	<div id="account" class="main-body">
		<div class="addAccount">
			<h3 class="page-title">账号消费详情</h3>
			<div class="add">
				<div class="left">
					<el-input 
              placeholder="请输入账号(回车搜索)" 
              v-model="username" 
              suffix-icon="el-icon-search" 
              @change="balanceNumber(),initconsumption(),initexchange()"
              class="ele-input"></el-input>
				</div>
				<div class="right">
				</div>
			</div>
		</div>
		<div class="accountTable">
			<h3 class="page-title">消费记录</h3>
			<span>云点余额
						<i>{{balance}}云点</i>
					</span>
			<div class="table">
				<div>
					<el-table :data="consumption" style="width: 100%" class="ele-table-init">
            <el-table-column width="30">
			      </el-table-column>
						<el-table-column prop="created_time" label="时间" align="left">
						</el-table-column>
						<el-table-column prop="user_name" label="功能名称/账号" align="left">
						</el-table-column>
						<el-table-column prop="flow_point" label="购买金额" align="left">
						</el-table-column>
						<el-table-column prop="due_time" label="到期时间" align="left">
						</el-table-column>
            <el-table-column width="30">
			    </el-table-column>
					</el-table>
				</div>
				<div class="tableBottom">
					<span>共{{consumptiontotal}}条</span>
					<el-pagination @current-change="consumptionCurrentChange" layout="prev, pager, next" :total="consumptiontotal">
					</el-pagination>
				</div>
			</div>
		</div>
		<div class="accountTable">
			<h3>卡密兑换记录</h3>
			<div class="table">
				<div class="tableContent">
					<el-table :data="exchange" style="width: 100%" class="ele-table-init">
            <el-table-column
			     width="30">
			    </el-table-column>
						<el-table-column prop="created_time" label="兑换时间" align="left">
						</el-table-column>
						<el-table-column prop="voucher_code" label="卡密号" align="left">
						</el-table-column>
						<el-table-column prop="voucher_type_value" label="兑换云点" align="left">
						</el-table-column>
            <el-table-column
			     width="30">
			    </el-table-column>
					</el-table>
				</div>
				<div class="tableBottom">
					<span>共{{exchangetotal}}条</span>
					<el-pagination @current-change="exchangeCurrentChange" layout="prev, pager, next" :total="exchangetotal">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
  data() {
    return {
      balance: 0,
      consumption: [],
      exchange: [],
      consumptiontotal: 0,
      consumptionPageno: 0,
      consumptionsize: 6,
      exchangetotal: 0,
      exchangePageno: 0,
      exchangesize: 6,
	  username: "",
    };
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
    //消费记录分页
    consumptionCurrentChange(val) {
      this.consumptionPageno = val;
      this.initconsumption();
    },
    //兑换卡密记录分页
    exchangeCurrentChange(val) {
      this.exchangePageno = val;
      this.initexchange();
    },
    //搜索云点余额，消费记录，卡密记录
    balanceNumber() {
      if (this.username == "") {
        this.$message({
          message: "请输入账号",
          type: "warning"
        });
      } else {
        this.$http("account/yun_credit", "GET", {
          user_name: this.username
        })
          .then(res => {
            this.balance = res.data.error_message;
          })
          .catch(err => {
            this.$message({
              message: "获取云点余额失败:" + res.data.error_message,
              type: "error"
            });
          });
      }
    },
    //获取消费记录
    initconsumption() {
      if (this.username == "") {
        this.$message({
          message: "请输入账号",
          type: "warning"
        });
      } else {
        this.$http("account/point_flow", "GET", {
          user_name: this.username,
          page_no: this.consumptionPageno,
          length: this.consumptionsize
        })
          .then(res => {
            if (res.data.error_code == 0) {
              this.consumption = res.data.data;
              this.consumptiontotal = res.data.count;
            } else {
              this.$message({
                message: "获取消费记录失败:" + res.data.error_message,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "获取消费记录失败:" + res.data.error_message,
              type: "error"
            });
          });
      }
    },
    //获取卡密记录
    initexchange() {
      if (this.username == "") {
        this.$message({
          message: "请输入账号",
          type: "warning"
        });
      } else {
        this.$http("account/exchange/history", "GET", {
          user_name: this.username,
          page_no: this.exchangePageno,
          length: this.exchangesize
        })
          .then(res => {
            if (res.data.error_code == 0) {
              this.exchange = res.data.data;
              this.exchangetotal = res.data.count;
            } else {
              this.$message({
                message: "获取卡密兑换记录失败:" + res.data.error_message,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "获取卡密兑换记录失败:" + res.data.error_message,
              type: "error"
            });
          });
      }
    }
  },
  //监控输入框变化
  watch: {
    username() {
      if (this.username == "") {
        this.balance = 0;
        this.consumption = [];
        this.exchange = [];
      }
    }
  }
};
</script>
<style scoped lang="scss">
#role {
	
}
</style>
