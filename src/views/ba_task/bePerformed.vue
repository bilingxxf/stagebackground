<template>
	<div id="historyTask" class="main-body">
        <div class="main-wrapper">
		<div  class="page-title">未完成的任务</div>
		<div class="task-header">
			<div class="input">
                <el-input
                    class="ele-input"
                    placeholder="请输入执行账号"
                    v-model="performAccount"
                    suffix-icon="el-icon-search"
                    @change="searchAccount()">
                </el-input>
                 <el-input
                    class="ele-input"
                    placeholder="请输入任务名称"
                    suffix-icon="el-icon-search"
                    v-model="performTask"
                    @change="searchTask()">
                </el-input>
			</div>
		</div>
		<div class="main">
			<el-table :data="ExecutingList" style="width: 100%" class="ele-table-init">
                <el-table-column
			     width="30">
			    </el-table-column>
				<el-table-column prop="remark" label="备注" align="left">
				</el-table-column>
				<el-table-column label="任务名称" align="left">
					<template slot-scope="scope">
						{{scope.row.task_template_name}}
					</template>
				</el-table-column>
				<el-table-column prop="user_name" label="执行账号" align="left">
				</el-table-column>
				<el-table-column prop="created_time" label="创建时间" align="left">
				</el-table-column>
				<el-table-column prop="start_time" label="开始时间" align="left">
				</el-table-column>
				<el-table-column prop="end_time" label="结束时间" align="left">
				</el-table-column>
				<el-table-column label="获取账户方式" align="left">
					<template slot-scope="scope">
						{{scope.row.enum_wxaccount_source | typeCapitalize}}
					</template>
				</el-table-column>
				<el-table-column label="状态/进度" align="left">
					<template slot-scope="scope">
                        {{scope.row.progress}}
						<!-- <span v-if="scope.row.task_status==1">{{scope.row.task_status | capitalize}}</span>
						<span v-if="scope.row.task_status==0">{{scope.row.progress}}</span> -->
					</template>
				</el-table-column>
				<el-table-column label="操作" align="right">
					<template slot-scope="scope">
						<el-button @click="handleView(scope.row,scope.$index, scope)" type="text" size="small">查看</el-button>
						<el-button v-if="scope.row.task_status==1" @click="deleteView(scope.row,scope.$index, scope)" type="text" size="small">删除</el-button>
					</template>
				</el-table-column>
                <el-table-column
			     width="30">
			    </el-table-column>
			</el-table>
			<div class="page">
				<el-pagination @current-change="recordCurrentChange" :current-page.sync="currentPage" :page-size="limit" layout="total, prev, pager, next" :total="allAccount">
				</el-pagination>
			</div>
		</div>
		<!--弹窗-->
		<transition-group name="fade">
			<div class="bounced" v-show="taskShow" :key="1">
				<div class="mask"></div>
				<div class="message">
					<div class="modal-header">
						<h2>使用的微信号
							<span @click="taskShow = false"><img src="../../assets/images/close.png" alt="" /></span>
						</h2>
					</div>
					<div class="modal-body">
						<ul>
							<li v-for="(item,index) in accountList" :key="index">{{item.wx_username}}</li>
						</ul>
					</div>
				</div>
			</div>
		</transition-group>
		<v-qrCode :taskId="taskId" :passType="passType" v-on:modifyType="modifyType"></v-qrCode>
        </div>
	</div>
</template>

<script>
import popup from "@/components/popup.vue";
export default {
    data() {
        return {
            performAccount: "",
            performTask: "",
            taskShow: false,
            ExecutingList: [],
            task_id: [],
            page: 1,
            allAccount: 0,
            currentPage: 1,
            limit: 10,
            accountList: null,
            timer: "",
            taskId: 0,
            passType: ""
        };
    },
    //注册组件
    components: {
        "v-qrCode": popup
    },
    mounted() {
        this.getTaskList();
    },
    methods: {
    	//表格头部样式
    	getHeaderStyle({row, rowIndex}){
			if(rowIndex == 0){
				return 'background:#ecf5ff;color:#57aaff;font-size:14px';
			}else{
				return ''
			}
		},
        //搜索账号
        searchAccount() {
            this.performTask = "";
            this.page = 1;
            this.getTaskList();
        },
        //接受子组件事件，关闭弹窗
        modifyType() {
            //this.passType='close'
        },
        //搜索任务
        searchTask() {
            this.performAccount = "";
            this.page = 1;
            this.getTaskList();
        },
        //查看  获取列表
        handleView(row) {
        	if(row.wx_user_id==''){
        		this.$message({
                   message: '此任务无微信号',
                   type: "error"
               });
        	}else{
        		this.$http("specified_wx_info?wxids="+row.wx_user_id, "GET")
                   .then(res => {
                       if (res.data.error_code == 0) {
                           let data = res.data.data;
                           this.accountList = data;
                           this.taskShow = true;
                       }
                   })
                   .catch(err => {
                       this.$message({
                           message: res.data.error_message,
                           type: "error"
                       });
                   });
        	}  
        },
        //删除
        deleteView(row) {
            console.log(row);
            // this.task_id.push(row.task_id);
            this.$http("task/delete_task", "DELETE", {
                taskId: row.task_id,
            })
                .then(res => {
                    if (res.data.error_code == 0) {
                        let data = res.data;
                        if (data.error_message == "删除成功") {
                            this.$message({
                                message: data.error_message,
                                type: "success"
                            });
                            this.getTaskList();
                        } else {
                            this.$message({
                                message: data.error_message,
                                type: "error"
                            });
                        }
                    }
                })
                .catch(err => {
                    this.$message({
                        message: res.data.error_message,
                        type: "error"
                    });
                });
        },
        //获取任务列表
        getTaskList() {
            this.$http("task/process", "GET", {
                task_template_name: this.performTask,
                user_name: this.performAccount,
                page: this.page,
                limit: this.limit
            })
                .then(res => {
                    if (res.data.error_code == 0) {
                        let data = res.data.data;
                        if (data.result.length == 0) {
                            if (this.page > 1) {
                                this.page = this.page - 1;
                                this.getTaskList();
                                return;
                            }
                        }
                        this.ExecutingList = data.result;
                        this.allAccount = data.total_count;
                        if (this.allAccount == 0) {
                            this.$message({
                                message: "数据为空",
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
                        message: "获取任务失败！",
                        type: "error"
                    });
                });
        },
        //分页
        recordCurrentChange(val) {
            this.page = val;
            this.getTaskList();
        }
    },
    //状态过滤器
    filters: {
        capitalize: function(value) {
            if (value === 1001) {
                return "等待执行";
            } else if (value === 1002) {
                return "正在执行";
            } else {
                return "已完成";
            }
        },
        typeCapitalize: function(value) {
            if (value === 1) {
                return "不从服务器获取";
            } else if (value === 2) {
                return "没有才从服务器获取";
            } else if (value === 3) {
                return "每次都从服务器获取";
            }else if (value === 4) {
                return "强制指定微信号";
            }else if (value === 5) {
                return "强制指定终端";
            }
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#historyTask {
    .title {
        padding:52px 0 0 30px;
        font-size: 19px;
        color: #333;
        }
    .task-header {
        width: 100%;
        .left {
            line-height: 60px;
        }
        .input {
            padding-top: 11px;
            .el-input{
            	width: 200px;
            	margin-right: 18px;
            }
        }
    }
    .main {
        background: #ffffff;
        	.el-table{
				font-size: 12px;
				color: #888;
			}
        	.el-table__row{
        		border-bottom: 1px solid #e8e8e8 !important;
        	}
        .page {
            margin: 20px auto 0;
            text-align: center;
            height: 175px;
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
        text-align: center;
        .new-task-model {
            position: fixed;
            width: 320px;
            height: 204px;
            background: #ffffff;
            top: 50%;
            left: 50%;
            margin-top: -102px;
            margin-left: -160px;
            .hint {
                padding: 50px 0 0 0;
                color: #aaadba;
            }
            .btn-list {
                margin: 48px auto 0;
                text-align: center;
                font-size: 12px;
                .btn {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 15px;
                    background: #4caeda;
                    border: none;
                    color: #ffffff;
                    margin: 0 6px;
                    cursor: pointer;
                }
                .cancel {
                    background: #95a1bd;
                    padding: 5px 30px;
                }
            }
        }
        .new-task-success-model {
            position: fixed;
            width: 330px;
            height: 294px;
            top: 50%;
            left: 50%;
            margin-top: -147px;
            margin-left: -165px;
            background: #ffffff;
            text-align: center;
            img {
                display: inline-block;
                width: 80px;
                height: 80px;
                margin: 36px 0 32px 0;
            }
            .success-text {
                font-size: 16px;
                padding-bottom: 36px;
            }
            .btn {
                padding: 5px 23px;
                color: #ffffff;
                border-radius: 15px;
                background: #4caeda;
                border: none;
                cursor: pointer;
            }
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
                min-height: 300px;
                max-height: 390px;
                padding: 10px 50px;
                overflow: auto;
                ul {
                    margin: 20px 0 0 0;
                    li {
                        line-height: 45px;
                        height: 45px;
                        color: #666;
                        text-align: center;
                        border-bottom: 1px solid #e4e4e4;
                    }
                }
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