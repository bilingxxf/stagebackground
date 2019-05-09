<template>
  <div id="task" class="main-body">
    <div class="main-wrapper">
    <div class="task-header">
      <div class="page-title"> 任务模板 </div>
      <div class="right">
        <el-button type="primary" size="mini" @click="showNewHandle" class="ele-btn">
          新建任务模板
        </el-button>
        <div style="height:30px"></div>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" @cell-mouse-enter="hovers" style="width: 100%" class="ele-table-init">
        <el-table-column
			     width="30">
			    </el-table-column>
        <el-table-column prop="task_template_name" label="任务名称" align="left">
        </el-table-column>
        <el-table-column prop="script_group_name" label="脚本组名称" align="left">
        </el-table-column>
        <el-table-column prop="extra_script_name" label="额外脚本名称" align="left" tooltip-effect="light">
        </el-table-column>
        <el-table-column prop="entry_script_name" label="入口脚本名称" align="left">
        </el-table-column>
        <el-table-column prop="description" label="描述内容" align="left">
        </el-table-column>
        <el-table-column label="操作任务" align="right">
          <template slot-scope="scope">
            <el-button style="color:#409eff;" @click="handleRedact(scope.row)" type="text" size="medium">编辑</el-button>
            <el-button style="color:#409eff;" @click="handleDel(scope.$index, scope.row)" type="text" size="medium">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
			     width="30">
			    </el-table-column>
      </el-table>
      <div class="page">
        <span>共{{total}}条</span>
        <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 新建任务   -->
    <div class="promp" v-show="showNewModel">
      <div class="new-task-model">
        <h1>{{name}}</h1>
        <div class="model-content">
          <div class="left">
            <div class="fill">
              <span>任务名称</span>
              <el-input v-model="taskName" placeholder="输入文字"></el-input>
            </div>
            <div class="fill">
              <span>描述内容</span>
              <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="describeTextarea">
              </el-input>
            </div>
            <div class="fill">
              <span>执行时间</span>
              <el-input placeholder="请输入数字(秒)" v-model="timing">
              </el-input>
            </div>
            <div class="fill">
              <span>选脚本组</span>
              <el-select v-model="taskId" multiple @change="taskScriptList" value-key="index" style="width: 180px;">
                <el-option v-for="(item,index)  in options" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="fill">
              <span>额外脚本</span>
              <el-select v-model="extraTask" multiple disabled value-key="index" style="width: 180px;">
                <el-option v-for="(item,index)  in extratasks" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
              <el-button type="primary" @click="rightShow=!rightShow">选择额外脚本</el-button>
            </div>
            <div class="fill">
              <span>入口脚本</span>
              <el-select v-model="enterTask" style="width: 180px;" value-key="index">
                <el-option v-for="(item,index)  in enterTasks" :key="index"  :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>

          <!-- 任务类型 0账号任务，1终端任务 -->
            <div class="fill">
              <span>任务类型</span>
              <el-select v-model="taskType" style="width: 180px;" value-key="index">
                <el-option v-for="(item,index)  in taskTypeArr" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>


          </div>
          <div class="right" v-show="rightShow">
            <el-tree node-key="script_id" show-checkbox :data="extraTasks" :props="defaultProps" accordion ref="tree">
            </el-tree>
            <div class="buttonList">
              <el-button type="primary" class="el-icon-d-arrow-right" size="mini" style="margin-bottom: 20px;width: 80px;font-size: 18px;" @click="removeLeft"></el-button>
              <el-button type="primary" class="el-icon-d-arrow-left" size="mini" style="margin-left: 0;width: 80px;font-size: 18px;" @click="removeRight"></el-button>
              <el-button type="primary" size="mini" style="margin-left: 0; margin-top: 180px;" @click="affirmSelect">确认选择</el-button>
            </div>
            <div class="selectChecked">
              <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="(item,index) in selectchecked" :key="index" :label="item.script_id" @change="item.checked=!item.checked">{{item.script_name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="btn-list">
          <button class="btn btn-add" @click="confirmNewModel">确定</button>
          <button @click="cancelNewHandle" class="btn cancel">取消</button>
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
      defaultProps: {
        children: "children",
        label: "script_name"
      },
      entryNames: {},
      timing: "",
      enterTask: "",
      enterTasks: [],
      extratasks: [],
      extraTask: [],
      extraTasks: [],
      CopyExtraTasks: {},
      describeTextarea: "",
      tasksNickname: [],
      tableData: [],
      options: [],
      taskId: [],
      showNewModel: false,
      taskName: "",
      total: 0,
      pageNo: 1,
      pageSize: 6,
      taskIndex: null,
      taskTemplateName: "",
      username: "",
      optionname: {},
      copyExtra: [],
      rightShow: false,
      checkList: [],
      selectchecked: [],
      name: "",
      taskType:"",
      taskTypeArr:[{
        value:0,
        label:'账号任务'
      },{
        value:1,
        label:'终端任务'
      }
      ]
    };
  },
  mounted() {
    this.init();
    this.taskScriptGroupList();
    this.taskScriptList();
    this.username = sessionStorage.getItem("username");
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
    /*编辑按钮划过*/
    hovers(row) {
      if (row.hoverTrue == false) {
        this.CopyhandleRedact(row);
        row.hoverTrue = true;
      }
    },
    //确认选择
    affirmSelect() {
      this.enterTask = "";
      this.enterTasks = this.selectchecked.map(function(item) {
        return {
          value: item.script_id,
          label: item.script_name
        };
      });
      this.extratasks = this.selectchecked.map(function(item) {
        
        return {
          id: item.script_id,
          name: item.script_name
        };
      });
      this.extraTask = this.selectchecked.map(function(item) {
        return item.script_id;
      });
      for (let i = 0; i < this.extraTask.length; i++) {
        this.entryNames[this.extraTask[i]] = this.CopyExtraTasks[
          this.extraTask[i]
        ];
      }
    },
    //选中额外脚本移动到右侧选择栏
    removeLeft() {
      let that = this;
      this.$refs.tree.getCheckedNodes(true).map(function(item) {
        that.selectchecked.push({
          script_group_name: item.script_group_name,
          group_id: item.group_id,
          script_name: item.script_name,
          script_id: item.script_id,
          checked: false,
          index: item.index
        });
      });
      this.$refs.tree.getCheckedNodes(true).map(function(item) {
        that.$refs.tree.remove(item.script_id);
      });
      let arr = this.$refs.tree.getCheckedNodes();
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children.length <= 0) {
          this.$refs.tree.remove(arr[i].script_id);
        }
      }
    },
    //右侧选择栏取消移动到左侧
    removeRight() {
      let that = this;
      let arr = {};
      this.selectchecked.map(function(item) {
        let openKey = false;
        let id = "";
        if (item.checked == true) {
          that.extraTasks.map(function(items) {
            if (items.script_id == item.group_id) {
              items.children.push({
                group_id: items.script_id,
                index: item.index,
                script_group_name: item.script_group_name,
                script_id: item.script_id,
                script_name: item.script_name
              });
              openKey = true;
            }
          });
        }
        if (openKey == false && item.checked == true) {
          let id = "group_" + item.index;
          let index = item.index;
          arr = {
            script_id: id,
            script_name: item.script_group_name,
            children: []
          };
          arr.children.push({
            group_id: id,
            index: index,
            script_group_name: item.script_group_name,
            script_id: item.script_id,
            script_name: item.script_name
          });
          that.extraTasks.push(arr);
        }
      });
      let arrs = [];
      for (let i = 0; i < this.selectchecked.length; i++) {
        if (this.selectchecked[i].checked != true) {
          arrs.push(this.selectchecked[i]);
        }
      }
      this.selectchecked = [];
      this.selectchecked = arrs.map(function(item, index) {
        item.checked = false;
        return item;
      });
      this.checkList = [];
    },
    //删除任务模板
    handleDel(index, row) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http("task/delete", "DELETE", {
            template_id: this.tableData[index].task_template_id
          })
            .then(res => {
              if (res.data.error_code == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.init();
              } else {
                this.$message({
                  type: "warning",
                  message: "删除失败:" + res.data.error_message
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: "删除失败:" + res.data.error_message
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //清空
    clear() {
      // console.log(this.$refs.tree.setCheckedKeys([]))
      this.taskName = "";
      this.taskId = [];
      this.extraTask = [];
      this.enterTask = "";
      this.describeTextarea = "";
      this.timing = "";
      this.entryNames = {};
      this.enterTasks = [];
      this.enterTask = "";
      this.$refs.tree.setCheckedKeys([]);
      // this.$refs.tree.setCheckedKeys([]);
      this.rightShow = false;
      this.selectchecked = [];
      this.taskType="";
    },
    //分页
    handleCurrentChange(val) {
      this.pageNo = val;
      this.init();
    },
    //编辑任务弹窗(划过加载避免第一次点击编辑遇到的BUG)
    CopyhandleRedact(row) {
      this.taskIndex = row.task_template_id;
      this.name = "编辑任务模板";
      this.$http("task_template_detail", "GET", {
        template_id: this.taskIndex
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.assignmentCopyExtra();
            let data = res.data.data;
            let arr = [];
            this.taskName = data.name;
            let that = this;
            this.taskId = data.script_group.split(',').map(function(item) {
                 return "group_" + parseInt(item);
            });
            this.enterTasks = data.script.split(',').map(function(item) {
             
              return {
                value: parseInt(item),
                label: that.CopyExtraTasks[item]
              };
            });
            this.extratasks =  data.script.split(',').map(function(item) {
              
              return {
                name: that.CopyExtraTasks[item],
                script_id: item
              };
            });
            this.extraTask = data.script.split(',').map(function(item) {
              return parseInt(item);
            });
            /*判断树形结构中存在的值*/
            for (let i = 0; i < this.copyExtra.length; i++) {
              for (let j = 0; j < this.taskId.length; j++) {
                if (
                  this.copyExtra[i].script_name ==
                  this.optionname[this.taskId[j]]
                ) {
                  arr.push(i);
                }
              }
            }
            let arrs = [];
            let openKey = false;
            for (let i = 0; i < this.copyExtra.length; i++) {
              openKey = false;
              for (let j = 0; j < arr.length; j++) {
                if (i == arr[j]) {
                  openKey = true;
                }
              }
              if (openKey == false) {
                arrs.push(this.copyExtra[i]);
              }
            }
            this.extraTasks = arrs;
            this.$nextTick(function() {
                  that.$refs.tree.setCheckedKeys(that.extraTask);
                  that.selectchecked = [];
                  that.$refs.tree.getCheckedNodes(true).map(function(item) {
                    that.selectchecked.push({
                      script_group_name: item.script_group_name,
                      group_id: item.group_id,
                      script_name: item.script_name,
                      script_id: item.script_id,
                      checked: false,
                      index: item.index
                    });
                  });
                  for (let i = 0; i < that.extraTask.length; i++) {
                    that.$refs.tree.remove(that.extraTask[i]);
                  }
                  let arr = [];
                  for (let i = 0; i < that.extraTasks.length; i++) {
                    if (that.extraTasks[i].children.length > 0) {
                      arr.push(that.extraTasks[i]);
                    }
                  }
                  that.extraTasks = arr;
                  that.$refs.tree.setCheckedKeys([]);
            });
            this.enterTask = parseInt(res.data.data.entry);
            this.describeTextarea = res.data.data.description;
            this.timing = res.data.data.timeout;
            this.taskType = res.data.data.taskType;
          } else {
            this.$message({
              message: res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "未知错误",
            type: "error"
          });
        });
    },
    //编辑任务弹窗
    handleRedact(row) {
      // console.log(row)
      this.taskIndex = row.task_template_id;
      this.name = "编辑任务模板";
      //  this.showNewModel = true;
      this.$http("task_template_detail", "GET", {
        template_id: this.taskIndex
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.assignmentCopyExtra();
            let arr = [];
            this.taskName = res.data.data.name;
            let that = this;

            this.taskId = res.data.data.script_group.split(',').map(function(item) {
              return "group_" + parseInt(item);
            });
            this.enterTasks = res.data.data.script.split(',').map(function(item) {
              return {
                value: parseInt(item),
                label: that.CopyExtraTasks[item]
              };
            });
            this.extratasks = res.data.data.script.split(',').map(function(item) {
              return {
                name: that.CopyExtraTasks[item],
                id: item
              };
            });
            this.extraTask = res.data.data.script.split(',').map(function(item) {
              return parseInt(item);
            });
            
            /*判断树形结构中存在的值*/
            for (let i = 0; i < this.copyExtra.length; i++) {
              for (let j = 0; j < this.taskId.length; j++) {
                if (
                  this.copyExtra[i].script_name ==
                  this.optionname[this.taskId[j]]
                ) {
                  arr.push(i);
                }
              }
            }
            let arrs = [];
            let openKey = false;
            for (let i = 0; i < this.copyExtra.length; i++) {
              openKey = false;
              for (let j = 0; j < arr.length; j++) {
                if (i == arr[j]) {
                  openKey = true;
                }
              }
              if (openKey == false) {
                arrs.push(this.copyExtra[i]);
              }
            }
            this.showNewModel = true;
            this.extraTasks = arrs;
            this.$nextTick(function() {
                // console.log(that.$refs.tree)
                that.$refs.tree.setCheckedKeys(that.extraTask);
                // console.log(that.$refs.tree.setCheckedKeys)
                that.selectchecked = [];
                that.$refs.tree.getCheckedNodes(true).map(function(item) {
                  that.selectchecked.push({
                    script_group_name: item.script_group_name,
                    group_id: item.group_id,
                    script_name: item.script_name,
                    script_id: item.script_id,
                    checked: false,
                    index: item.index
                  });
              });
              // console.log(this.selectchecked)
              for (let i = 0; i < that.extraTask.length; i++) {
                that.$refs.tree.remove(that.extraTask[i]);
              }
              let arr = [];
              for (let i = 0; i < that.extraTasks.length; i++) {
                if (that.extraTasks[i].children.length > 0) {
                  arr.push(that.extraTasks[i]);
                }
              }
              that.extraTasks = arr;
              that.$refs.tree.setCheckedKeys([]);
            });
            this.enterTask = parseInt(res.data.data.entry);
            this.describeTextarea = res.data.data.description;
            this.timing = res.data.data.timeout;
            this.rightShow = true;
            this.taskType = res.data.data.taskType;
          } else {
            this.$message({
              message: res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: res.data.error_message,
            type: "error"
          });
        });
    },
    //新建任务弹窗
    showNewHandle() {
      this.showNewModel = !this.showNewModel;
      this.extraTasks = this.copyExtra;
      this.name = "新建任务模板";
      this.assignmentCopyExtra();
      this.clear();
    },
    //取消新建和编辑任务
    cancelNewHandle() {
      this.showNewModel = !this.showNewModel;
      this.clear();
      // console.log(this.extraTask)
    },
    /* 赋值this.copyExtra*/
    assignmentCopyExtra() {
      this.$http("task/script_group/list?page=1&limit=1000000", "GET")
        .then(res => {
          let that = this;
          // 深复制以便之后的重新赋值
          let data = res.data;
          var testArr=[];
          data.data.map(function(item, index) {
            if(item.children[0].script_id!==null){
            testArr.push(item)
            item.script_id = "group_" + item.script_id;
                item.children.map(function(items) {
                  (items["group_id"] = item.script_id),
                    (items["script_group_name"] = item.script_name),
                    (items["index"] = item.script_id.split("_")[1]);
                });
            }
            });
          this.copyExtra = testArr;
          // this.copyExtra = data.data;
          // console.log(this.copyExtra)
        })
        .catch(err => {
          this.$message({
            message: '出错222',
            type: "error"
          });
        });
    },
    // 新建任务脚本列表
    taskScriptList() {
      this.selectchecked = [];
      this.extraTask = [];
      this.enterTask = "";
      this.enterTasks = [];
      this.$refs.tree.setCheckedKeys([]);
      this.$http("task/script_group/list?page=1&limit=1000000", "GET")
        .then(res => {
          let that = this;
          // res.data.data.map(function(item, index) {
          //   item.script_id = "group_" + item.script_id;
          //   item.children.map(function(items) {
          //     (items["group_id"] = item.script_id),
          //       (items["script_group_name"] = item.script_name),
          //       (items["index"] = item.script_id.split("_")[1]);
          //   });
          // });
          // this.copyExtra = res.data.data;
          let data = res.data;
          var testArr=[];
         data.data.map(function(item, index) {
          if(item.children[0].script_id!==null){
           testArr.push(item)
             item.script_id = "group_" + item.script_id;
              item.children.map(function(items) {
                (items["group_id"] = item.script_id),
                  (items["script_group_name"] = item.script_name),
                  (items["index"] = item.script_id.split("_")[1]);
              });
          }
          });
          this.copyExtra = testArr;
        //   console.log(this.copyExtra)


          let arr = [];
          if (res.data.error_code == 0) {
            if (this.taskId.length > 0) {
              for (let i = 0; i < res.data.data.length; i++) {
                let num = 0;
                for (let j = 0; j < this.taskId.length; j++) {
                  if (
                    res.data.data[i].script_name ==
                    this.optionname[this.taskId[j]]
                  ) {
                    num--;
                  } else {
                    num++;
                  }
                }
                if (num >= this.taskId.length) {
                  arr.push(res.data.data[i]);
                }
              }
              this.extraTasks = arr;
              this.enterTask = null;
              this.selectTree = [];
            } else {
              this.extraTasks = res.data.data;
              // console.log(this.extraTasks, "this.extraTasks");
            }
            for (let a = 0; a < this.extraTasks.length; a++) {
              for (let b = 0; b < this.extraTasks[a].children.length; b++) {
                this.CopyExtraTasks[
                  this.extraTasks[a].children[b].script_id
                ] = this.extraTasks[a].children[b].script_name;
              }
            }
          }
        })
        .catch(err => {
          this.$message({
            message: err,
            type: "error"
          });
        });
    },
    // 新建任务脚本列表
    taskScriptGroupList() {
      this.$http("task/script_group/list?page=1&limit=1000000", "GET")
        .then(res => {
         if (res.data.error_code == 0) {
            this.options = res.data.data.map(function(item) {
              return {
                label: item.script_name,
                value: "group_" + item.script_id
              };
            });
            for (let i = 0; i < this.options.length; i++) {
              this.optionname[this.options[i].value] = this.options[i].label;
            }
          }
        })
        .catch(err => {
          this.$message({
            message: '获取出错',
            type: "error"
          });
        });
    },
    //确定新建任务
    confirmNewModel() {
      if (this.$regExp(this.taskName, 64)) {
        return;
      }
      if (this.$regExp(this.timing, 64, 0)) {
        return;
      }
      if (this.taskId == "") {
        this.$message({
          message: "请选择脚本组",
          type: "warning"
        });

        return;
      }
      if (this.extraTask == []) {
        this.$message({
          message: "请选择额外脚本",
          type: "warning"
        });

        return;
      }
      if (this.enterTask == ""||this.enterTask==null) {
        this.$message({
          message: "请选择入口脚本",
          type: "warning"
        });

        return;
      }
      if (this.taskType === "") {
        this.$message({
          message: "请选择任务类型",
          type: "warning"
        });

        return;
      }
      let url = "";
      let content = "";
      let param = {};
      let taskId = this.taskId.map(function(item) {
        return parseInt(item.split("_")[1]);
      });
      if (this.name == "新建任务模板") {
        url = "task";
        content = "新建任务模板";
        param = {
         task_template_name: this.taskName,
          script: taskId,
          script_ids: this.extraTask,
          timeout: this.timing,
          description: this.describeTextarea,
          entry: this.enterTask,
          entry_name: this.entryNames[this.enterTask],
          timeout: this.timing,
          execute_count:1,
          taskType:this.taskType
        };
      } else {
        url = "task/update";
        content = "编辑任务模板";
        param = {
           execute_count:1,
          script: taskId,
          script_ids: this.extraTask,
          
          timeout: this.timing,
          description: this.describeTextarea,
          entry: this.enterTask,
          entry_name: this.entryNames[this.enterTask],
          timeout: this.timing,
          task_template_id: this.taskIndex,
           taskType:this.taskType
        };
      }
      // console.log(param)
      this.$http(url, "POST", param)
        .then(res => {
          // console.log(res);
          if (res.data.error_code == 0) {
            this.$message({
              message: content + "成功",
              type: "success"
            });
            this.showNewModel = false;

            this.init();
            this.clear();
          } else {
            this.$message({
              message: res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          // console.log(err);
          this.$message({
            message: res.data.error_message,
            type: "error"
          });
        });
    },
    //初始化任务列表
    init() {
      this.$http("task_template?page=" + this.pageNo + "&per_page=" + this.pageSize,
        "GET"
      )
        .then(res => {
          if (res.data.error_code == 0) {
            let data = res.data.data;
            this.total = data.total_count;
            this.tableData = data.result.map(function(item) {
              item["hoverTrue"] = false;
              return item;
            },
            );
          } else {
            this.$message({
              message: "获取任务列表失败",
              type: "error"
            });
            this.tableData = [];
          }
        })
        .catch(err => {
          this.$message({
            message: "获取任务列表失败",
            type: "error"
          });
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#task {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  position: relative;
  .task-header {
    width: 100%;
    background: #fff;
    overflow: hidden;
    .left {
      float: left;
      font-size: 19px;
      color: #333333;
    }
    .right {
      float: right;
    }
    .new-task {
      padding: 0 14px;
      border: 1px solid #95a1bd;
      border-radius: 4px;
      color: #95a1bd;
      cursor: pointer;
    }
  }
  .main {
    flex: 1;
    background: #fff;

    .el-table__row {
      border-bottom: 1px solid #e8e8e8 !important;
    }

    .page {
      margin-top: 10px;
      text-align: center;
      background-color: #fff;
      .el-pagination {
        display: inline-block;
      }
      span {
        color: #303133;
        font-size: 14px;
      }
    }
  }
  .promp {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    z-index: 1000;
    .new-task-model {
      position: fixed;
      min-width: 600px;
      overflow-y: auto;
      background: #ffffff;
      top: 30%;
      left: 40%;
      margin-top: -185px;
      margin-left: -160px;
      h1 {
        text-align: center;
        line-height: 45px;
        font-size: 14px;
        border-bottom: 1px solid #e0e0e0;
        background-color:#409EFF;
        color: #fff;
      }
      .el-input {
        width: 180px;
      }
      .el-textarea {
        width: 180px;
      }
      .el-tree {
        width: 180px;
        float: left;
      }
      .model-content {
        overflow-y: auto;
        max-height: 480px;
        width: 100%;
        padding: 35px 50px;
        box-sizing: border-box;
        .left {
          float: left;
        }
        .right {
          float: right;
          height: 100%;
          overflow: hidden;
          margin-left: 20px;
          width: 500px;
          .el-tree {
            float: left;
            width: 200px;
            height: 300px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px #c0c4cc;
            border-radius: 4px;
            overflow-y: auto;
            overflow-x: hidden;
          }
          .buttonList {
            display: block;
            width: 100px;
            float: left;
            text-align: center;
          }
          .selectChecked {
            float: left;
            height: 300px;
            width: 200px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px #c0c4cc;
            border-radius: 4px;
            overflow-y: auto;
            overflow-x: hidden;
            .el-checkbox {
              display: block;
              margin-left: 5px !important;
            }
          }
        }
        .fill {
          margin-top: 10px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          span {
            padding-right: 10px;
            display: inline-block;
            text-align: right;
          }
          .radio-wrap {
            width: 60%;
            margin-bottom: 10px;
            float: left;
          }
          .tespan {
            float: left;
            width: 20px;
            height: 20px;
            margin-top: 40px;
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
      .btn-list {
        margin: 20px auto 10px;
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
          padding: 10px 31px;
          margin: 0 10px 0 0;
        }
        .cancel {
          background: #95a1bd;
          padding: 10px 30px;
        }
      }
    }
  }
}
</style>
