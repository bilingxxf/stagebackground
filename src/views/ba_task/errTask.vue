<template>
	<div id="historyTask" class="main-body">
		<div class="main-wrapper">
		<div class="page-title">执行失败的任务</div>
		<div class="task-header">
			<div class="input">
				<el-input 
					placeholder="请输入执行账号" 
					suffix-icon="el-icon-search" 
					v-model="performAccount" 
					class="ele-input" 
					@change="searchAccount()">
				</el-input>
				<el-input 
					placeholder="请输入任务名称" 
					suffix-icon="el-icon-search" 
					v-model="performTask" 
					class="ele-input" 
					@change="searchTask()">
				</el-input>
			</div>
		</div>
		
        <div class="main">
        	<el-table
			    :data="tableData"
			    style="width: 100%"
				class="ele-table-init">
				<el-table-column
			     width="30">
			    </el-table-column>
			    <el-table-column
			      prop="remark"
			      label="备注"
				  	align="left">
			    </el-table-column>
			    <el-table-column
			      prop="task_template_name"
			      label="任务名称"
				  	align="left">
			      	<template slot-scope="scope">			
						{{scope.row.task_template_name}}				
					</template>
			    </el-table-column>
			    
			    <el-table-column
			      prop="user_name"
			      label="执行帐号"
				  	align="left">
			    </el-table-column>
			    <el-table-column
			      prop="created_time"
			      label="创建时间"
				  	align="left">
			    </el-table-column>
			    <el-table-column
			      prop="start_time"
			      label="开始时间"
				  	align="left">
			    </el-table-column>
			    <el-table-column
			      prop="end_time"
			      label="结束时间"
				  	align="left">
			    </el-table-column>
			    <el-table-column label="账号获取方式"
					align="left">
					<template slot-scope="scope">
						{{scope.row.enum_wxaccount_source | capitalize}}
					</template>
				</el-table-column>
				 <el-table-column
			      prop="progress"
			      label="完成度"
				  align="left">
			   </el-table-column>
			   <el-table-column label="操作"
			   	align="right">
					<template slot-scope="scope">
						<el-button @click="handleView(scope.row,scope.$index, scope)" type="text" size="small">查看</el-button>
						<el-button v-if="scope.row.end_time==''||scope.row.end_time==null" @click="restartTask(scope.row,scope.$index, scope)" type="text" size="small">重启</el-button>
					</template>
				</el-table-column>
				<el-table-column
			     width="30">
			    </el-table-column>
			</el-table>
			<div class="page">
				<el-pagination
				  @current-change="handleCurrentChange"
				  layout="total,prev, pager, next"
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
							<h2>使用的微信号<span @click="taskShow = false"><img src="../../assets/images/close.png" alt="" /></span></h2>
						</div>
						<div class="modal-body">
							<ul>
								<li v-for="(item,index) in accountList" :key="index">{{item.wx_username}}</li>
							</ul>
						</div>
						
					</div>
				</div>
			</transition>
			<v-qrCode :taskId="taskId" :passType="passType" v-on:modifyType="modifyType"></v-qrCode>
		</div>
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
	        total: 0,
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
		//表格头部样式
    	getHeaderStyle({row, rowIndex}){
			if(rowIndex == 0){
				return 'background:#ecf5ff;color:#57aaff;font-size:14px';
			}else{
				return '';
			}
		},
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
			this.passType='close';
		},
		//搜索账号
		searchAccount(){
			this.performTask='';
			this.pageNo=1;
			this.init()
		},
		//搜索任务名称
		searchTask(){
			this.performAccount='';
			this.pageNo=1;
			this.init()
		},
		//分页
		handleCurrentChange(val){
			this.pageNo=val;
			this.init();
		},
		//查看
		handleView(row){
			// this.accountList=row.wx_nickname;
			// this.taskShow=true;
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
		//获取历史任务列表
	   init(){
	   	this.$http("task/record","GET",{
	   		task_template_name:this.performTask,
	   		user_name:this.performAccount,
	   		page: this.pageNo,
			per_page: this.pageSize,
			task_status:2,
			user_id:sessionStorage.getItem('user_id')
	   	}).then(
	   	res=>{
	   		if(res.data.error_code==0){
	   			let data = res.data.data;
	   			if(data.result===null){
	   				this.$message.error('数据为空');
	   				return
	   			}
	   			 if(data.result.length==0){
			 	 	if(this.pageNo>1){
						this.pageNo=this.pageNo-1
						this.init();
						return
					}
			 	 }
	   			this.tableData = data.result;
	   			this.total = data.total_count;
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
					return '不从服务器获取';
				}else if(value===2){
					return '没有才从服务器获取';
				}else if(value===3){
					return '每次都从服务器获取';
				}else if(value===4){
					return '强制指定微信号';
				}else if(value===5){
					return '强制指定终端';
				}
			}
		}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#historyTask {
	height: 100%;
	.title{
		padding: 52px 0 0 30px;
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
		background: #FFFFFF;
		.el-table{
			font-size: 12px;
			color: #888;
		}
		.page {
			text-align: center;
			margin-top: 10px;
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
					color: #fff;
					border-top-left-radius: 5px;
					border-top-right-radius: 5px;
					font-weight: normal;
					position:relative;
					text-align:center;
					background-color: rgb(76, 174, 218);
					border-bottom:1px solid #bbb;
					h2{
						font-size: 14px;
					}
					span{
						position: absolute;
						right: 5px;
						line-height: 23px;
						margin-top: 4px;
						padding: 0 5px;
						display: inline-block;
						cursor: pointer;
						img{
							width: 30px;
							height: 30px;
							margin-top: 6px;
						}
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
