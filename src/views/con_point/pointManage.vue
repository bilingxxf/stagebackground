<template>
	<div id="pointManage">
		<div class="table">
			<div class="top">
				<div class="left" style="color:#333333">养号计划</div>
				<div class="right">
					<el-button type="primary" size="small" @click="addPlan">新建计划</el-button>
				</div>
			</div>
			<div class="content">
				<el-table :data="tableData" style="width: 100%" :header-cell-style="getHeaderClass">
					<el-table-column prop="pointName" label="计划名称" align="center">
					</el-table-column>
					<el-table-column label="好友互加" align="center">
						<template slot-scope="scope">
							<el-checkbox @change="checkedChange(scope.row)" v-model="scope.row.friends_add.friendsAdd">
							</el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="好友互聊" align="center">
						<template slot-scope="scope">
							<el-checkbox @change="checkedChange(scope.row)" v-model="scope.row.friends_chat.friendsChat">
							</el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="群" align="center">
						<template slot-scope="scope">
							<el-checkbox @change="checkedChange(scope.row)" v-model="scope.row.group_chat.groupChat">
							</el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="订阅号" align="center">
						<template slot-scope="scope">
							<el-checkbox @change="checkedChange(scope.row)" v-model="scope.row.Subscription.subscription">
							</el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="漂流瓶" align="center">
						<template slot-scope="scope">
							<el-checkbox @change="checkedChange(scope.row)" v-model="scope.row.Bottle.bottle">
							</el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="朋友圈" align="center">
						<template slot-scope="scope">
							<el-checkbox @change="checkedChange(scope.row)" v-model="scope.row.Circle.circle">
							</el-checkbox>
						</template>
					</el-table-column>

           <el-table-column label="步数" align="center">
            <template slot-scope="scope">
              <el-checkbox @change="checkedChange(scope.row)"  v-model="scope.row.Walk.walk">
              </el-checkbox>
            </template>
          </el-table-column>  

					<el-table-column label="操作" width="240" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click="copyPoint(scope.$index)">复制</el-button>
							<el-button type="text" size="mini" @click="examine(scope.$index)">查看</el-button>
							<el-button type="text" size="mini" @click="deletePoint(scope.$index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<script>
import Bus from "../eventBus/event.js";
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      tableDataKey: [],
			 // 表格头部背景颜色
      getHeaderClass({ row, column, rowIndex, columnIndex }) {
        // console.log(row)
        // console.log(column)
        // console.log(rowIndex)
        // console.log(columnIndex)
        if (rowIndex == 0) {
          return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px";
        } else {
          return "";
        }
      }
    };
  },
  created() {
    this.$on("checkConfiguration", val => {
      console.log(val);
    });
  },
  methods: {
    /*获取key*/
    findKey() {
      axios
        .get(
          "http://106.14.222.244:8000/api/v1/usekey?type=havenoKey&key=" +
            sessionStorage.getItem("user_id"),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.code == 0) {
            let that = this;
            let data = JSON.parse(res.data.data).key;
            this.tableDataKey = data.split(",").map(function(item) {
              return item;
            });
            this.tableData = [];
            for (let i = 0; i < this.tableDataKey.length; i++) {
              this.findDetails(this.tableDataKey[i], i);
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
          "http://106.14.222.244:8000/api/v1/usekey?type=haveNo&key=" + item,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.code == 0) {
            let data = JSON.parse(res.data.data);
            data.key = item;
            this.tableData.push(data);
          } else {
            this.$message({
              message: "查询失败",
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    /*新建计划*/
    addPlan() {
      this.$router.push("con_addPoint");
      sessionStorage.removeItem("pointData");
    },
    /*初始化列表*/
    init() {
      this.findKey();
    },
    /*删除数据*/
    deletePoint(index) {
      this.tableDataKey.splice(index, 1);
      let id = this.tableDataKey.indexOf(this.tableData[index].key);
      this.tableDataKey.map(function(item, index) {
        if (item == id) {
          this.tableDataKey.splice(index, 1);
        }
      });
      console.log(this.tableDataKey.join(","), "删除");
      axios
        .post(
          "http://106.14.222.244:8000/api/v1/text?type=havenoKey&key=" +
            sessionStorage.getItem("user_id"),
          { key: this.tableDataKey.join(",") },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.init();
          } else {
            this.$message({
              message: "删除失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    },
    /*更新数据*/
    checkedChange(row) {
      axios
        .post(
          "http://106.14.222.244:8000/api/v1/text?type=haveNo&key=" + row.key,
          row,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "修改失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "修改失败",
            type: "error"
          });
        });
    },
    /*复制数据*/
    copyPoint(index) {
      let data = "";
      axios
        .get(
          "http://106.14.222.244:8000/api/v1/usekey?type=haveNo&key=" +
            this.tableData[index].key,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.code == 0) {
            data = JSON.parse(res.data.data);
            data.key = "";

            axios
              .post(
                "http://106.14.222.244:8000/api/v1/text?type=haveNo",
                data,
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                }
              )
              .then(res => {
                if (res.data.code == 0) {
                  this.tableDataKey.push(res.data.data);
                  let datas = this.tableDataKey.join(",");
                  axios
                    .post(
                      "http://106.14.222.244:8000/api/v1/text?type=havenoKey&key=" +
                        sessionStorage.getItem("user_id"),
                      { key: datas },
                      {
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        }
                      }
                    )
                    .then(res => {this.init();})
                    .catch(err => {});
                }
              })
              .catch(err => {});
          } else {
            this.$message({
              message: "查询失败",
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    /*查看*/
    examine(index) {
      sessionStorage.setItem(
        "pointData",
        JSON.stringify(this.tableData[index])
      );
      this.$router.push("con_addPoint");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#pointManage {
  color: #707070;
  padding: 22px 88px;
  .table {
    background-color: #fff;
    padding: 50px 52px;
    .top {
      overflow: hidden;
      .left {
        float: left;
        font-size: 19px;
        padding-bottom: 30px;
      }
      .right {
        float: right;
        padding-bottom: 30px;
      }
    }
    .content {
      border-bottom: 0;
      margin: 10px 0;
    }
    .bottom {
      text-align: center;
    }
  }
}
</style>