<template>
	<div id="task">
        <div class="task-header">
        	<span class="left">任务模板</span>
        </div>
        <div class="main">
			<el-table
			    :data="tableData"
			    style="width: 100%">
			    <el-table-column
			      prop="task_template_name"
			      label="任务名称"
			    >
			    </el-table-column>
			    <!-- <el-table-column
			      prop="script_group_name"
			      label="脚本组名称" >
			    </el-table-column>
			    <el-table-column
			      prop="extra_script_name"
			      label="额外脚本名称" >
			    </el-table-column>
			    <el-table-column
			      prop="entry_script_name"
			      label="入口脚本名称" >
			    </el-table-column>
			    <el-table-column
			      prop="description"
			      label="描述内容" >
			    </el-table-column> -->
			    <el-table-column
			      label="操作任务" >
			      <template slot-scope="scope">
			        <el-button @click="handleEdit(scope.$index, scope.row)"  type="text" size="small">执行</el-button>
			        <el-button @click="handleTime(scope.$index, scope.row)"  type="text" size="small">定时执行</el-button>
			      </template>
			    </el-table-column>
			</el-table>
			<div class="page">
			    <span>共{{total}}条</span>
				<el-pagination
				  @current-change="handleCurrentChange"
				  :page-size="pageSize"
				  layout="prev, pager, next"
				  :total="total">
				</el-pagination>
			</div>
        </div>
        
        <!-- 执行任务 -->
        <div class="promps" v-show="performedShow">
        	<div class="new-task-model">
        		<h1>{{name}}</h1>
        		<div class="model-content">
        				<span v-if="accountGain!==1">选择微信号</span>
					<el-tree
					  v-show="accountGain!==1"
					  node-key="wx_user_id"
					  show-checkbox
					  :data="accountGroup"
					  :props="countGroup"
					  accordion
					  ref="countTree"
					  >
					</el-tree>
        			<div class="fill" v-show="fillShow">
						<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
						<el-checkbox-group v-model="checkedtasks" @change="handleCheckedtasksChange">
						    <el-checkbox v-for="(item,index) in tasks" :label="item" :key="item">{{tasksNickname[index]}}</el-checkbox>
						</el-checkbox-group>        				
        			</div>
        			<div class="fill" style="text-align: left;margin-bottom: 20px;">
        			    <span style="text-align: left;display: inline;">账号获取方式</span>
	        			<el-select v-model="accountGain"  style="width: 240px;" @change="accountGainChange">
						    <el-option
						      v-for="(item,index)  in accountGains"
						      :key="index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
					</div>
        			<div class="fill" style="text-align: left;margin-bottom: 20px;">
        			    <span style="text-align: left;display: inline;margin-right: 55px;">备注</span>
        				<el-input placeholder="输入内容" v-model="params">
						 </el-input>
        			</div>
        			<div class="fill" v-show="name=='定时执行任务'">
        				<el-date-picker
        				  :unlink-panels=true
        				  :picker-options="pickerOptions"
					      v-model="timings"
					      type="datetimerange"
					      range-separator="至"
					      start-placeholder="开始日期"
					      value-format="yyyy-MM-dd HH:mm:ss"
					      end-placeholder="结束日期">
					    </el-date-picker>
        			</div>
        			<div class="btn-list">
        				<button class="btn" @click="confirmPerModel">确认执行</button>
        				<button @click="cancelPerHandle" class="btn cancel">取消</button>
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
			accountGain:2,
			accountGains:[{
				value:1,
				label:"不从服务器获取"
			},
			{
				value:2,
				label:"没有才从服务器获取"
			},
			{
				value:3,
				label:"每次都从服务器获取"
			}
			],
			params:"",
			entryNames:{},
			timings:null,
			pickerOptions: {
	          disabledDate(time) {
	            return time.getTime() < Date.now() - 8.64e7;
	          }
	      },
			executeTime:"",
			executeTimeId:0,
			executeTimeIds:[{
				value:0,
				label:"秒"
			},
			{
				value:1,
				label:"小时"
			},
			{
				value:2,
				label:"天"
			}],
			fillShow:false,
			tasks:[],
			tasksNickname:[],
			checkedtasks:[],
			checkAll:false,
			isIndeterminate:true,
			tableData: [],
	        performedShow: false,
	        input: '',
	        radio: 1,
	        total:0,
	        pageNo:1,
	        pageSize:6,
	        taskIndex:null,
	        taskTemplateName:"",
	        username:"",
	        optionname:{},
	        copyExtra:[],
	        accountGroup:[],
	        name:'',
	        countGroup:{
	          children: 'children',
	          label: 'wx_user_name'
	        }, 
	    }
	},
	mounted(){
		this.init();
		this.getAccountGroup()
		this.username=sessionStorage.getItem('username');
	},
	methods: {
		
		//判断时间是否小于当前时间
		testingTime(){
			let currentTime=Date.parse( new Date()),
			    selectTime=Date.parse( new Date(this.timings[0]));
			if(selectTime<currentTime){
				return false;
			}
			else{
				return true;
			}
		},
		//清空
		 clear(){
			this.timing="";
			this.params="";
			this.input="";
			this.checkedtasks=[];
		 },
		//搜索微信号
		searchWX(){
			let items={};
			if(this.input==""){
				this.$message({
		          message: '账号不能为空',
		          type: 'warning'
		        })
			}else{
				this.$http("wechat_user","GET",{
					nick_name:this.input
				}).then(
				res=>{
					
					if(res.data.error_code==0){
						if(res.data.data.length>0){
						   this.fillShow=true;
						   this.tasks=res.data.data.map(function(item){
								return item.wid
							})
							this.tasksNickname=res.data.data.map(function(item){
								return item.nick_name
							})
						}else{
							this.$message({
					          message: '此用户没有微信号',
					          type: 'warning'
					        })
					        this.fillShow=false;
							this.tasks=[];
							this.tasksNickname=[];
						}
					}
					else{
						this.$message({
				          message: '搜索微信号错误'+res.data.error_message,
				          type: 'error'
				        })
					}
				}
				).catch(
				err=>{
					this.$message({
			          message: '搜索微信号错误'+res.data.error_message,
			          type: 'error'
			        })
				}
				)
				}
		},
		//选择不从服务器获取，清空
		accountGainChange(){
			this.$refs.countTree.setCheckedKeys([])
		},
		//微信号全选
		handleCheckedtasksChange(value){
			let checkedCount = value.length;
            this.checkAll = checkedCount === this.tasks.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.tasks.length;
		},
		handleCheckAllChange(val){
			this.checkedtasks = val ? this.tasks : [];
            this.isIndeterminate = false;
		},
		//分页
		handleCurrentChange(val){
			this.pageNo=val;
			this.init();
		},
		//获取所有微信分组
		getAccountGroup(){
			this.$http('wx_user_group/list','GET')
			.then(res=>{

				if(res.data.error_code==0){
					this.accountGroup=res.data.data.map(function(item){
						item["wx_user_name"]=item.wx_user_group_name;
						return item;
					});
				}else{
					this.$message({
			           message: res.data.data,
			           type: 'error'
			        });
				}
				
			}).catch(err=>{
				this.$message({
		           message: err,
		           type: 'error'
		        });
			})
		},
		//执行任务弹窗
		handleEdit(index, row) {
			this.name="执行任务";
	        this.performedShow = !this.performedShow
	        this.taskIndex=this.tableData[index].task_template_id;
	        this.taskTemplateName=this.tableData[index].task_template_name;
	  	},
	  	//定时执行任务弹窗
	  	handleTime(index, row){
	  		this.name="定时执行任务";
	  		this.performedShow = !this.performedShow
	        this.taskIndex=this.tableData[index].task_template_id;
	        this.taskTemplateName=this.tableData[index].task_template_name;
	  	},
	    //取消任务执行
	    cancelPerHandle() {
	    	this.performedShow = !this.performedShow;
	    	this.tasks=[];
			this.tasksNickname=[];
			this.fillShow=false;
			this.clear();
	    },
	   	//执行任务和定时执行任务
	   	perModelRead(params){
	   		this.$http("task/create_task","POST",params).then(
		   		res=>{
	   			if(res.data.error_code==0){
	   				this.performedShow = false;
			   	    this.$message({
			           message: '执行成功',
			           type: 'success'
			        });
			        this.tasks=[];
			        this.tasksNickname=[];
			        this.fillShow=false;
			        this.clear();
	   			}else{
	   				this.$message({
			           message: '执行失败'+res.data.error_message,
			           type: 'error'
			        });
	   			}
	   		}
	   		).catch(
	   		err=>{
	   			this.$message({
		           message: '执行失败'+res.data.error_message,
		           type: 'error'
		        });
	   		}
	   		)
	   	},
	   	//确定执行任务
	   	confirmPerModel() {
/*	   		this.$router.push('qrCode')*/
	   		this.checkedtasks = this.$refs.countTree.getCheckedKeys(true)
	   		if(this.$refs.countTree.getCheckedKeys(true).length>0||this.accountGain==1){
	   			let that=this,
	   			    params={};
		   		if(this.name=="执行任务"){
		   			params={
			   			task_template_name:this.taskTemplateName,
			   			account_list:this.checkedtasks,
			   			task_template_id:this.taskIndex,
			   			remark:this.params,
			   			username:this.username,
			   			enum_wxaccount_source:this.accountGain
			   		}
			   		this.perModelRead(params);
		   		}
		   		else{
		   			params={
			   			task_template_name:this.taskTemplateName,
			   			account_list:this.checkedtasks,
			   			task_template_id:this.taskIndex,
			   			param:this.params,
			   			start_time:this.timings[0],
			   			end_time:this.timings[1],
			   			username:this.username,
			   			enum_wxaccount_source:this.accountGain
			   		}
			   		if(this.testingTime()){
			   			this.perModelRead(params);
			   		}else{
			   			this.$message({
				           message: '开始时间不能小于当前时间！',
				           type: 'error'
				        });
			   		}
		   		}
		   		
	   		}else{
	   			this.$message({
		           message: '请选择微信号',
		           type: 'error'
		        });
	   		}
	   	},
	   	//初始化任务列表
	   	init(){
	   		this.$http("task_template?page="+this.pageNo+"&per_page="+this.pageSize,"GET").then(
	   		res=>{
	   			if(res.data.error_code==0){
	   				this.total=res.data.count;
			        this.tableData=res.data.data;
	   			}
	   			else{
	   				this.$message({
			           message: '获取任务列表失败',
			           type: 'error'
			        });
			        this.tableData=[];
	   			}
	   		}
	   		).catch(
	   		err=>{
	   			this.$message({
		           message: '获取任务列表失败',
		           type: 'error'
		        });
	   		}
	   		)
	   	}
	},
	watch:{
		input(){
			if(this.input==""){
				this.tasks=[];
			    this.tasksNickname=[];
			    this.fillShow=false;
			}
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#task {
	font-size: 14px;
	display: flex;
	flex-direction: column;
	position: relative;
	.task-header {
		flex: 1;
		width: 100%;
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
		margin: 20px 0;
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
	.promps {
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .3);
		top: 0;
		left: 0;
		z-index: 1000;
		.new-task-model {
			position: fixed;
			width: 440px;
			background: #FFFFFF;
			top: 30%;
			left: 40%;
			margin-top: -185px;
			margin-left: -160px;
			h1 {
				text-align: center;
				line-height: 45px;
				font-size: 14px;
				border-bottom: 1px solid #e0e0e0;
				background-color: rgb(76, 174, 218);
				color: #fff;
			}
			.el-input{
				width: 160px;
			}
			.el-textarea{
				width: 160px;
			}
			.model-content {
				margin: 20px;
				.fill {
					span {
						padding-right: 10px;
						display: inline-block;
						width: 30%;
						text-align: right;
					}
					.radio-wrap {
						width: 70%;
						margin-bottom: 10px;
						float: left;
					}
				}
				.margin {
					margin: 30px 0 20px 0;
				}
				.btn-list {
					margin: 20px auto 10px;
					text-align: center;
					.btn {
						display: inline-block;
						padding: 5px 18px;
						border-radius: 15px;
						background: #4caeda;
						border: none;
						color: #FFFFFF;
						margin: 0 6px;
						cursor: pointer;
					}
					.btn-add {
						padding: 5px 31px;
						margin: 0 10px 0 0;
					}
					.cancel {
						background: #95a1bd;
						padding: 5px 30px;
					}
				}
				.input {
					width: 100%;
					padding: 20px 0;
					.el-input{
						width: 100%;
					}
				}
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
		.new-task-model {
			position: fixed;
			width: 840px;
			min-height: 300px;
			background: #FFFFFF;
			top: 30%;
			left: 40%;
			margin-top: -185px;
			margin-left: -160px;
			overflow-y: auto;
			h1 {
				text-align: center;
				line-height: 45px;
				font-size: 14px;
				border-bottom: 1px solid #e0e0e0;
				background-color: rgb(76, 174, 218);
				color: #fff;
			}
			.el-input{
				width: 180px;
			}
			.el-textarea{
				width: 180px;
			}
			.el-tree{
				width: 180px;
				float: left;
			}
			.model-content {
				overflow:hidden;
				.top{
					overflow:hidden;
					margin-top: 20px;
				}
				.bottom{
					overflow:hidden;
					margin-top: 20px;
				}
				.fills{
					margin-top: 10px;
					float: left;
					width: 33%;
					box-sizing: border-box;
					span {
						padding-right: 10px;
						display: inline-block;
						width: 30%;
						text-align: right;
						float: left;
					}
					.radio-wrap {
						width: 70%;
						margin-bottom: 10px;
						float: left;
					}
				}
				.fill {
					margin-top: 10px;
					float: left;
					width: 33%;
					box-sizing: border-box;
					span {
						padding-right: 10px;
						display: inline-block;
						width: 30%;
						text-align: right;
						float: left;
					}
					.radio-wrap {
						width: 70%;
						margin-bottom: 10px;
						float: left;
					}
				}
				.btn-list {
					margin: 20px auto 10px;
					text-align: center;
					.btn {
						display: inline-block;
						padding: 5px 18px;
						border-radius: 15px;
						background: #4caeda;
						border: none;
						color: #FFFFFF;
						margin: 0 6px;
						cursor: pointer;
					}
					.btn-add {
						padding: 5px 31px;
						margin: 0 10px 0 0;
					}
					.cancel {
						background: #95a1bd;
						padding: 5px 30px;
					}
				}
				.input {
					width: 100%;
					padding: 20px 0;
					.el-input{
						width: 100%;
					}
				}
			}
		}
	}
}
</style>
