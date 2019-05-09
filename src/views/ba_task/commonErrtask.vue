<template>
	<div id="historyTask">
		<div class="title">执行失败的任务</div>
		<div class="task-header">
			<div class="input">
				<el-input placeholder="请输入任务名称" v-model="performTask" class="input-with-select">
					<el-button slot="append" icon="el-icon-search" @click="searchTask"></el-button>
				</el-input>
			</div>
		</div>
		
        <div class="main">
        	<el-table
			    :data="tableData"
			    style="width: 100%">
			     <el-table-column
			      prop="remark"
			      label="备注">
			    </el-table-column>
			    <el-table-column
			      label="任务名称">
			      <template slot-scope="scope">			
					<el-button @click="getQrCode(scope.row)" type="text" size="small">{{scope.row.task_template_name}}</el-button>					
				  </template>
			    </el-table-column>
			   
			    <el-table-column
			      prop="user_name"
			      label="执行帐号">
			    </el-table-column>
			    <el-table-column
			      prop="created_time"
			      label="创建时间">
			    </el-table-column>
			    <el-table-column
			      prop="start_time"
			      label="开始时间">
			    </el-table-column>
			    <el-table-column
			      prop="end_time"
			      label="结束时间">
			    </el-table-column>
			    <el-table-column label="账号获取方式">
					<template slot-scope="scope">
						{{scope.row.enum_wxaccount_source | capitalize}}
					</template>
				</el-table-column>
				 <el-table-column
			      prop="progress"
			      label="完成度">
			   </el-table-column>
			   <el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="handleView(scope.row,scope.$index, scope)" type="text" size="small">查看</el-button>
						<el-button v-if="scope.row.end_time==''||scope.row.end_time==null" @click="restartTask(scope.row,scope.$index, scope)" type="text" size="small">重启</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page">
			    <span>共{{total}}条</span>
				<el-pagination
				  @current-change="handleCurrentChange"
				  layout="prev, pager, next"
				  :page-size="pageSize"
				  :total="total">
				</el-pagination>
			</div>
        </div> 
            <!--弹窗-->
            <transition name="fade">
				<div class="bounced" v-show="taskShow" :key="1">
					<div class="mask"></div>
					<div class="message">
						<div class="modal-header">
							<h2>使用的微信号<span @click="taskShow = false">x</span></h2>
						</div>
						<div class="modal-body">
							<ul>
								<li v-for="(item,index) in accountList" :key="index">{{item}}</li>
							</ul>
						</div>
						
					</div>
				</div>
			</transition>
			<v-qrCode :taskId="taskId" :passType="passType" v-on:modifyType="modifyType"></v-qrCode>
	</div>
</template>

<script>
	import popup from '@/components/popup.vue'
export default {
	data() {
		return {
			performTask:'',
			performAccount:'',
			tableData: [],
	        startModel: false,
	        pageSize: 10,
	        pageNo: 1,
	        total: 1,
	        historyId: null,
	        taskShow:false,
	        accountList:[],
	        taskId:0,
	        passType:''
	    }
	},
	components:{
		'v-qrCode':popup
	},
	mounted() {
		this.init()
	},
	methods: {
		//重启任务
		restartTask(row){
			this.$http('task/reboot','POST',{
				task_id:row.task_id
			}).then(res=>{
				if(res.data.error_code==0){
					let data = res.data;
					console.log(data)
					this.$message.success('重启任务成功');
				}else{
					this.$message.error('重启任务失败');
				}
			}).catch(err=>{
				this.$message.error('重启任务失败');
			})
		},
		//向弹框传递的数据
		getQrCode(row){
			this.passType='qrCode';
			this.taskId=row.task_id;
		},
		//接受子组件事件，关闭弹窗
		modifyType(){
			console.log(11)
			this.passType='close'
		},
		//搜索任务名称
		searchTask(){
			this.init()
			// this.performTask=''
		},
		//分页
		handleCurrentChange(val){
			this.pageNo=val;
			this.init();
		},
		//查看
		handleView(row){
			this.accountList=row.wx_nickname
			console.log(this.accountList)
			this.taskShow=true;
		},
		//获取历史任务列表
	   init(){
	   	this.$http("task/record","GET",{
	   		task_template_name:this.performTask,
	   		user_name:this.performAccount,
	   		page: this.pageNo,
	   		per_page: this.pageSize
	   	}).then(
	   	res=>{
	   		console.log(res)
	   		if(res.data.error_code==0){
	   			this.tableData = res.data.data
	   			this.total = res.data.count
	   		}
	   		else{
	   			this.$message.error('获取历史任务失败');
		        this.tableData = [];
	   		}
	   	}
	   	).catch(
		   	err=>{
		   			this.$message.error('获取历史任务失败');
		   	}
	   	)
	   }
	},
		//状态过滤器
		filters:{
			capitalize:function (value) {
				if(value===1){
					return '不从服务器获取'
				}else if(value===2){
					return '没有才从服务器获取'
				}else if(value===3){
					return '每次都从服务器获取'
				}
			}
		}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#historyTask {
	height: 100%;
	.title{
		padding: 0 20px 0 0;
	}
	font-size: 14px;
	display: flex;
	flex-direction: column;
	.task-header {
		width: 100%;
		background: #FFFFFF;
		border-bottom: 1px solid #e9eaec;
		height: 60px;
		margin: 20px 0 0 0;
		.left {
			line-height: 60px;
		}
		.input {
			margin: 0 0 0 30px;
			padding-top: 14px;
			.el-input-group{
					width: 300px;
			}
		}
	}
	.main {
		background: #FFFFFF;
		.page {
			margin: 20px auto;
			text-align: center;
			.el-pagination{
				display: inline-block;
			}
			span{
				color: #303133;
				font-size: 14px;
			}
		}
	}
	.promp {
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .3);
		top: 0;
		left: 0;
		z-index: 1000;
		text-align: center;
		.new-task-model {
			position: fixed;
			width: 320px;
			height: 204px;
			background: #FFFFFF;
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
					color: #FFFFFF;
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
			background: #FFFFFF;
			text-align: center;
			img{
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
				color: #FFFFFF;
				border-radius: 15px;
				background: #4CAEDA;
				border: none;
				cursor: pointer;
			}
		}
	}
	.bounced{
			position:absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			.mask{
				background: #000;
				opacity: 0.4;
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				z-index: 10;
			}
			.message{
				width: 400px;
				position: absolute;
				top: 30%;
				left: 50%;
				margin-left: -200px;
				padding-bottom: 50px;
				background: #fff;
				border-radius: 5px;
				z-index: 15;
				.modal-header{
					height: 50px;
					line-height: 50px;
					font-size: 12px;
					color: #666;
					font-weight: normal;
					position:relative;
					text-align:center;
					border-bottom:1px solid #bbb;
					span{
						position: absolute;
						right: 15px;
						display: inline-block;
						padding: 0 20px;
						cursor: pointer;
					}
				}
				.export{
					padding: 10px 20px 0px;
					overflow: hidden;
					.el-button {
						float: right;
					}
				}
				.modal-body{
					min-height: 300px;
					max-height: 390px;
					padding: 0px 50px;
					overflow: auto;
					ul{
						margin: 20px 0 0 0;
						li{
							line-height: 45px;
							color: #666;
							text-align: center;
							border-bottom: 1px solid #E4E4E4;
						}
					}
				}
				.modal-footer{
					text-align:center;	
					margin: 15px 0 30px;
				}
			}
		}
		.fade-enter-active, .fade-leave-active {
		  transition: opacity .5s;
		}
		.fade-enter, .fade-leave-to {
		  opacity: 0;
		}
}
</style>
