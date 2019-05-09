<template>
  <div id="task" class="main-body">
    <div class="main-wrapper">
    <div class="task-header">
      <h3 class="page-title">执行任务</h3>
    </div>
    <div class="main">
      <div class="model-content">
        <div class="wxGroup">
          <el-tree node-key="wx_user_id" show-checkbox :data="data" :props="countGroup" accordion ref="countTree">
          </el-tree>
        </div>
        <div class="wxInfo">
          <div class="fill" style="text-align: left;margin-bottom: 20px;">
            <span style="text-align: left;margin-right: 10px;">选择任务模板</span>
            <el-select v-model="defaultTaskId">
              <el-option v-for="(item,index)  in taskGroup" :key="index" :label="item.task_template_name" :value="item.task_template_id">
              </el-option>
            </el-select>
          </div>
          <div class="fill" style="text-align: left;margin-bottom: 20px;">
            <span style="text-align: left;margin-right: 10px;">账号获取方式</span>
            <el-select v-model="accountGain" @change="accountGainChange">
              <el-option v-for="(item,index)  in accountGains" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="fill" style="text-align: left;margin-bottom: 20px;">
            <span style="text-align: left;display: inline;margin-right: 65px;">备注</span>
            <el-input placeholder="输入内容" v-model="params">
            </el-input>
          </div>
          <div class="fill">
           <div class="switch"> <el-switch v-model="value1" inactive-text="定时" active-color="#409eff" inactive-color="#a5cbf3">
            </el-switch></div>
            <el-date-picker :unlink-panels=true :disabled="!value1" :picker-options="pickerOptions" v-model="timings" type="datetimerange" range-separator="至" start-placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" end-placeholder="结束日期">
                        </el-date-picker>
                        <span class="tip">(若您选择日期，则此任务变为定时任务)</span>
          </div>
          <div class="btn-list">
            <el-button type="primary" class="ele-btn" @click="confirmPerModel">确认执行</el-button>
            <el-button type="primary" @click="cancelPerHandle" class="ele-btn">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--弹窗-->
    <transition-group name="fade">
      <div class="bounced" v-show="taskShow" :key="1">
        <div class="mask"></div>
        <div class="message">
          <div class="modal-header">
            <h2>微信号</h2>
          </div>
          <div class="modal-body">
            <el-input v-model="specifyInput"></el-input>
            <div class="btn">
              <el-button type="success" @click="taskShow=false,mask=false">确定</el-button>
              <el-button @click="taskShow=false,mask=false,specifyInput=''">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    	specifyInput:'',
      taskShow: false,
      mask: false,
      accountGain: 2,
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
        },
        {
          value: 4,
          label: "强制指定微信号"
        },
        {
          value: 5,
          label: "强制指定终端"
        }
      ],
      params: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      timings: [],
      tasks: [],
      tasksNickname: [],
      taskTemplateName: "",
      accountGroup: [],
      countGroup: {
        children: "children",
        label: "wx_user_name"
      },
      defaultTaskId: "",
      taskGroup: [],
      pageNo: 1,
      pageSize: 999999,
      start_time: "",
      end_time: "",
      wx_userId: [],
      ableSelect: [],
      disableSelect: [],
      data: [],
      expect_count: 0,
      wxGroupId: [],
      value1: false, //定时
      value2: true,
      value3: "", //日历时间
      value4: "" //日历时间
    };
  },
  mounted() {
    this.init();
    this.getAccountGroup();
  },
  created() {
    this.getDate();
  },
  methods: {
    //获取当前日期
    getDate() {
      Date.prototype.Format = function(fmt, type) {
        // author: meizz
        if (type == 1) {
          var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "h+": this.getHours(), // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            S: this.getMilliseconds() // 毫秒
          };
        } else {
          var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "h+": this.getHours() + 1, // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            S: this.getMilliseconds() // 毫秒
          };
        }

        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
      var time1 = new Date().Format("yyyy-MM-dd hh:mm:ss", 1);
      var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss", 2);
      (this.timings[0] = time1), (this.timings[1] = time2);
    },
    //初始化任务列表
    init() {
      this.$http(
        "task_template?page=" + this.pageNo + "&per_page=" + this.pageSize,
        "GET"
      )
        .then(res => {
          if (res.data.error_code == 0) {
            let data = res.data.data;
            this.taskGroup = data.result;
            this.defaultTaskId = data.result[0].task_template_id;
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
    },
    //判断时间是否小于当前时间
    testingTime() {
      let currentTime = Date.parse(new Date()),
        selectTime = Date.parse(new Date(this.timings[0]));
      if (selectTime < currentTime) {
        return false;
      } else {
        return true;
      }
    },
    //选择不从服务器获取，清空
    accountGainChange() {
      this.$refs.countTree.setCheckedKeys([]);
      if (this.accountGain == 1) {
        this.data = this.disableSelect;
      } else {
        this.data = this.ableSelect;
      }
      this.accountGains.forEach(item => {
        if (this.accountGain === item.value) {
          if (item.value == 5 || item.value == 4) {
            this.taskShow = true;
            this.mask = true;
          }
        }
      });
    },
    //获取所有微信分组
    getAccountGroup() {
      this.$http("wx_user_group/list", "GET")
        .then(res => {
          if (res.data.error_code == 0) {
            let data = res.data;
            if (data.data.length > 0) {
              data.data.forEach(item => {
                item["wx_user_id"] = item.wx_user_group_id + "--";
                item["wx_user_name"] = item.wx_user_group_name;
              });
              let accountGroup = data.data;
              function deepClone(obj) {
                var newObj = obj instanceof Array ? [] : {};
                //obj属于基本数据类型,直接返回obj
                if (typeof obj !== "object") {
                  return obj;
                } else {
                  //obj属于数组或对象，遍历它们
                  for (var i in obj) {
                    newObj[i] =
                      typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
                  }
                }
                return newObj;
              }
              this.ableSelect = deepClone(res.data.data);
              this.disableSelect = deepClone(res.data.data);

              this.disableSelect.forEach(item => {
                item["disabled"] = true;
                item.children.forEach(items => {
                  items["disabled"] = true;
                });
              });
              this.ableSelect.forEach(item => {
                item["disabled"] = false;
                item.children.forEach(items => {
                  items["disabled"] = false;
                });
              });
              this.data = accountGroup;
            } else {
              this.$message({
                message: res.data.error_message,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取失败",
            type: "error"
          });
        });
    },
    //取消任务执行
    cancelPerHandle() {
      this.tasksNickname = [];
      this.params = "";
      this.timings = null;
      (this.accountGain = 2), this.$refs.countTree.setCheckedKeys([]);
      if (this.accountGain == 1) {
        this.data = this.disableSelect;
      } else {
        this.data = this.disableSelect;
        this.$nextTick(function() {
          //修复重置bug
          this.data = this.ableSelect;
        });
      }
    },
    //确定执行任务
    confirmPerModel() {
    	
      if (this.timings != null) {
        this.start_time = this.timings[0];
        this.end_time = this.timings[1];
      } else {
        this.start_time = "";
        this.end_time = "";
      }
      this.taskGroup.forEach(item => {
        if (item.task_template_id == this.defaultTaskId) {
          this.taskTemplateName = item.task_template_name;
        }
      });
      let selectAccountGroup = this.$refs.countTree.getCheckedKeys(true);
      if(this.specifyInput!=''){
      	selectAccountGroup = [];
    		selectAccountGroup.push(this.specifyInput)
    	}else{
    		if (
	        (this.accountGain == 3 && selectAccountGroup.length == 0) ||
	        (this.accountGain == 4 && selectAccountGroup.length == 0) ||
	        (this.accountGain == 5 && selectAccountGroup.length == 0)
	      ) {
	        this.$message({
	          message: "请选择微信号",
	          type: "error"
	        });
	        return;
	      }
    	}
      
      if (this.accountGain == 1) {
        selectAccountGroup = [];
      } 
      this.$refs.countTree.data.forEach(item => {
        item.children.forEach(items => {
          if (selectAccountGroup.indexOf(items.wx_user_id) > -1) {
            this.wxGroupId.push(item.wx_user_group_id);
          }
        });
      });
      let groupId = new Set(this.wxGroupId);
      this.expect_count = selectAccountGroup.length;
      if(!this.value1){
        this.start_time="";
        this.end_time="";
      }
      if(this.accountGain==5){
        selectAccountGroup=[];
      }
      this.$http("task/create_task", "POST", {
        task_template_name: this.taskTemplateName,
        account_list: selectAccountGroup,
        task_template_id: this.defaultTaskId,
        remark: this.params,
        start_time: this.start_time,
        end_time: this.end_time,
        enum_wxaccount_source: this.accountGain,
        wx_group_id: groupId,
        param: "",
        expect_count: this.expect_count
      })
        .then(res => {
          if (res.data.error_code == 0) {
          	this.specifyInput = '';
            this.$message({
              message: "执行成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#task {
  height: 100%;
  h3 {
    font-size: 19px;
    color: #333333;
  }
  .main {
    background: #ffffff;
    height: 650px;
    .wxGroup {
      padding: 20px;
      float: left;
      height: 600px;
      max-height: 600px;
      width: 27%;
      max-width: 320px;
      overflow: auto;
      margin: 30px 95px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 3px #c0c4cc;
    }
    .wxInfo {
      padding: 19px 50px 50px 0;
      float: left;
      width: 45%;
      height: 700px;
      box-sizing: border-box;
      .switch{padding-bottom: 20px;}
      .el-input__inner {
        width: 100%;
      }
      .btn-list {
        text-align: center;
        margin-top: 50px;
      }
      .tip {
        display: block;
        color: #b4bccc;
      }
    }
  }
}
//弹窗
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
    width: 550px;
    position: absolute;
    top: 30%;
    left: 50%;
    margin-left: -200px;
    padding-bottom: 50px;
    background: #fff;
    border-radius: 5px;
    z-index: 15;
    .modal-header {
      height: 50px;
      line-height: 50px;
      font-size: 12px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      color: #fff;
      background-color: rgb(76, 174, 218);
      font-weight: normal;
      position: relative;
      text-align: center;
      border-bottom: 1px solid #bbb;
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
      .el-button {
        float: right;
      }
    }
    .modal-body {
      text-align: center;
      margin-top: 60px;
      .el-input {
        width: 80%;
      }
      .btn {
        margin-top: 50px;
        width: 100%;
        text-align: center;
      }

      //    padding: 10px 50px;
      overflow: auto;
    }
    .modal-footer {
      text-align: center;
      margin: 15px 0 30px;
    }
  }
}
</style>
