<template>
    <div class="footer main-body">
			<div class="main-wrapper">
					<div class="title page-title">脚本分组</div>
					<div class="group_wrapper">
						<el-input style="width: 200px;" class="ele-input" suffix-icon="el-icon-search" v-model="scriptGroup" placeholder="请输入脚本组名称" @keyup.enter.native="addScriptGroup"></el-input>
					</div>
					<!-- 脚本组名  -->
					<div class="groupName">
						<el-table
							:data="scriptGroupName"
							style="width: 100%"
							class="ele-table-init"
							:header-cell-style="getHeaderStyle">
								<el-table-column label="" width="30"></el-table-column>
						<el-table-column
							label="脚本组名"
							align="left">
							<template slot-scope="scope">
								<span style="margin-left: 10px">{{ scope.row.group_name }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="right">
							<template slot-scope="scope">
									<el-button type="text" @click="handleGroupEdit(scope.$index, scope.row)">编辑</el-button>
									<el-button type="text" style="color: red;" @click="handleGroupDelete(scope.$index, scope.row)">删除</el-button>		          
							</template>
						</el-table-column>
						<el-table-column label="" width="30"></el-table-column>
					</el-table>
					</div>
						<!--分页-->
					<div class="page">
				<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="8" layout="total, prev, pager, next" :total="totalCount">
				</el-pagination>
			</div>
		</div>

       	<!--弹框-->
       <transition-group name="fade">
			<div class="bounced" v-show="editorShow" :key="1">
				<div class="mask"></div>
				<div class="message">
					<div class="modal-header">
						<h2>编辑脚本名称</h2>
					</div>
					<div class="modal-body">
						<el-form ref="groupForm" v-model="groupForm" label-width="80px">
						  	<el-form-item label="脚本名称">
						    	<el-input class="ele-input" v-model="groupForm.name" placeholder="自定义编辑"></el-input>
						  	</el-form-item>
						  	<div class="group-btn">
						  		<el-button  class="ele-btn" type="primary" @click="groupEditHandle">保存</el-button>
						    	<el-button class="ele-btn" @click="editorShow = !editorShow">取消</el-button>
						  	</div>
						</el-form>
					</div>
				</div>			
			</div>
		</transition-group>
    </div>
</template>
<script>
export default{
	data(){
		return{
			totalCount:0,
			currentPage:1,
			limit:8,
			scriptGroup:'',
			editorShow: false,  // 脚本组名编辑弹框
			scriptGroupName: [],   // 脚本分组列表
	        groupForm: {  // 编辑脚本组名弹框
	        	name: '',
	            region: '',
	            delivery: false,
	            resource: '',
	            desc: '',
	            content: '',
	            appid: '',
	            groupId: ''
	        }
		}
	},
	mounted() {
		this.groupList();
	},
	methods:{
		//表格头部样式
    	getHeaderStyle({row, rowIndex}){
			if(rowIndex == 0){
				return 'background:#ecf5ff;color:#57aaff;font-size:14px';
			}else{
				return '';
			}
		},
		//  脚本分组列表
		groupList() {
			var $this = this;
			$this.$http('script_group/task/script_group', 'GET', {
				page:this.currentPage,
				limit:this.limit
			})
			.then(function(res) {
				console.log(res)
				if(res) {
					if(res.data.error_code == 0) {
						//分页删除问题
						if(res.data.data.length==0){
							if($this.currentPage>1){
								$this.currentPage=$this.currentPage-1
								$this.groupList();
								
							}
						}
						$this.scriptGroupName = res.data.data.result;
						$this.totalCount = res.data.data.total_count;
						$this.updateEditorOptions = res.data.data.result.map(function(item){
							return {
								value:item.id+"_"+item.group_name,
								label:item.group_name
							}
						})
					}
				}
			})
		},
		//添加脚本分组
		addScriptGroup(){
			if(this.$regExp(this.scriptGroup,64,)){
				return
			}else{
				if(this.scriptGroup!=''){
					let $this = this;
					let account = 0;
					$this.$http('group/add', 'POST',{script_group_name: $this.scriptGroup, user_id: ''})
						.then(function(res) {
						if(res) {
							if(res.data.error_code === 0) {
								$this.scriptGroupName.forEach(function(item){
									if($this.scriptGroup === item.group_name){
										$this.$message.error('错了哦，分组名称不能重复');
									}else{
										account++
										if(account==$this.scriptGroupName.length){
											$this.$message.success(res.data.error_message);
											$this.scriptGroup = '';
										}
									}
								})	
								$this.groupList()
							}else {
								alert(res.data.error_message)
							}
						}else {
							alert('获取接口数据失败')
						}
					})
					
				}
			}
		},
		// 编辑脚本组名
		handleGroupEdit(index, row) {
		 	this.editorShow = true;
		 	let $this = this;
		 	$this.groupForm.groupId = row.id;
		 	$this.groupForm.name = row.group_name;
	    },
	    //  保存编辑的脚本组名名称
	    groupEditHandle() {
	    	var $this = this;
	    	$this.$http('script_group/group/update', 'PUT', {groupname: $this.groupForm.name, id: $this.groupForm.groupId})
	    	.then(function(res) {
	    		if(res) {
	    			if(res.data.error_code === 0) {
	    				$this.editorShow = !$this.editorShow;
	    				$this.$message.success(res.data.error_message);
	    				$this.groupList();
	    			}else {
	    				$this.$message.error(res.data.error_message);
	    			}
	    		}else {
	    			alert('获取接口数据失败');
	    		}
	    	})
	    },
	    // 删除脚本分组id
	    handleGroupDelete(index, row) {
			var $this = this;
			
	        this.$http('script_group/group/del/'+row.id, 'DELETE')
	        .then(function(res) {
	        	if(res) {
	        		if(res.data.error_code === 0) {
	        			$this.groupList();
	        			$this.$message.success(res.data.error_message);
	        		}else {
	        			$this.$message.error(res.data.error_message);
	        		}
	        	}else {
	        		$this.$message.error('获取接口数据失败');
	        	}
	        })
	    },
	    //分页
	    handleCurrentChange(val) {
	    	this.currentPage=val;
	    	this.groupList(); 	
	    },
	}
}
</script>
<style scoped lang="scss">
	.footer{
		// background: #fff;
		// margin: 22px 3%;
		.title{
			// padding: 52px 0 0 30px;
			font-size: 19px;
			color: #333;
			.el-button{
				float: right;
			}
		}
		.group_wrapper{
			margin-bottom: 30px;
			// padding: 0 50px;
			background: #fff;
			span{
				margin-right: 40px;
			}
			.el-button{
				margin-left: 20px;
			}
		}
		.groupName{
			background: #fff;
			// padding:0 50px;
			.el-table{
				font-size: 12px;
				color: #888;
				.el-button--text{
					font-size: 12px;
				}
			}
		}
		.page{
			margin: 20px auto;
			text-align: center;
			height: 175px;
		}
		.bounced{
			position: absolute;
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
				width: 550px;
				border-radius: 5px;
				position: absolute;
				top: 30%;
				left: 50%;
				margin-left: -250px;
				background: #fff;
				z-index: 15;
				.modal-header {
					height: 50px;
					line-height: 55px;
					padding: 0 15px 0 40px;
					border-top-left-radius: 5px;
					border-top-right-radius: 5px;
					font-size: 12px;
					text-align: center;
					font-weight: normal;
					position:relative;
					background-color: rgb(76, 174, 218);
					color: #fff;
					border-bottom: 1px solid #ccc;
					h2 {
						font-size: 14px;
					}
				}
				.modal-body{
					padding: 40px 50px;
					.group-btn {
						text-align: center;
						margin: 30px 0 10px 30px;
					}
				}
			}
			.delete-msg {
				top: 50%;
				margin-left: -150px;
				margin-top: -90px;
				border-radius: 5px;
				text-align: center;
				font-size: 16px;
				.cancel_watch {
					padding: 10px 30px;
					margin: 25px 0 0 0;
				}
				.border {
					border-bottom: 1px solid #CCCCCC;
					padding: 0 0 20px 0;
					.blue {
						color: #4CAEDA;
					}
				}
			}
		}
	}
</style>
