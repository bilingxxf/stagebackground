<template>
    <div class="footer main-body">
			<div class="main-wrapper">
				 <div class="title page-title"><span>脚本列表</span><el-button class="ele-btn" @click="updateHandle" type="primary" plain>上传脚本</el-button></div>
         <div class="group_wrapper">
        	<el-input class="ele-input" style="width: 200px;" suffix-icon="el-icon-search" v-model="scriptGroup" placeholder="请输入脚本名称/备注" @keyup.enter.native="searchScriptGroup"></el-input>
        </div>

        <div class="list_wrapper">
        	<div class="listScripts">
	        	<el-table
							:data="scriptGroupName1"
							style="width: 100%"
							class="ele-table-init"
							:header-cell-style="getHeaderStyle"
						>
						<el-table-column label="" width="30"></el-table-column>
				    <el-table-column
				      prop="name"
				      label="脚本名称"
				      align="left">
				    </el-table-column>
				    <el-table-column
				      prop="length"
				      label="长度"
				      align="left"
				     >
				    </el-table-column>
				    <el-table-column
				      prop="md5"
				      label="md5"
				      align="left">
				    </el-table-column>
				    <el-table-column
				      prop="scriptGroupName"
				      label="分组"
				      align="left">
				    </el-table-column>
				    <el-table-column
				      prop="updatedTime"
				      label="修改时间"
				      align="left">
				    </el-table-column>
				     <el-table-column
				      prop="describe"
				      label="备注"
				      align="left">
				    </el-table-column>
				    <el-table-column
				      label="操作"
				      align="right">
				      <template slot-scope="scope">
				      	 <el-button @click="watchContent(scope.row)" type="text" size="small">查看</el-button>
				        <el-button @click="editorClick(scope.row)" type="text" size="small">编辑</el-button>
				        <el-button @click="deleteClick(scope.row)" style="color:red" type="text" size="small">删除</el-button>
				      </template>
				    </el-table-column>
					  <el-table-column label="" width="30"></el-table-column>
				  </el-table>
	        </div>
	        <div class="page">
						<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="7" layout="total, prev, pager, next" :total="totalCount">
						</el-pagination>
					</div>
       </div>
			</div>
       

       	<!--弹框-->
       <transition-group name="fade">
			<div class="bounced" v-show="scriptShow" :key="2">
				<div class="mask"></div>
				<div class="message">
					<div class="modal-header">
						<h2>上传脚本</h2>
					</div>
					<div class="modal-body">
						<el-form ref="form" v-model="updateEditorValue" label-width="80px">
						  <el-form-item label="内容">
						   <el-upload
							  ref="upload"
							  :on-success="uploadSuccess"
							  :on-error="uploadError"
							  :before-upload="beforeUpload"
							  :show-file-list='true'
							  :auto-upload="false"
							  name="file"
							  action="123">
							  <el-button slot="trigger" plain type="primary plain" class="ele-btn" style="width:200px">脚本代码</el-button>
							</el-upload>
						  </el-form-item>
						  <el-form-item label="分组">
						    <el-select v-model="chooseGroupName1" placeholder="请选择分组"  class="ele-select">
						      <el-option v-for="(item, index) in updateEditorOptions"  :key="index" :label="item.label" :value="item.value"></el-option>
						    </el-select>
						  </el-form-item>
						  <el-form-item label="备注">
						    <el-input type="textarea" rows="3" resize="none" v-model="updateEditorValue.desc"></el-input>
						  </el-form-item>
						  <div style="text-align:center">
						    <el-button class="ele-btn" type="primary" @click="updateScriptHandle">添加</el-button>
						    <el-button class="ele-btn" @click="scriptShow = false">取消</el-button>
						  </div>
						</el-form>
					</div>
				</div>			
			</div>
			
			<div class="bounced" v-show="changeShow" :key="3">
				<div class="mask"></div>
				<div class="message">
					<div class="modal-header">
						<h2>编辑脚本</h2>
					</div>
					<div class="modal-body">
						<el-form ref="form" v-model="editorValue" label-width="80px">
						  <el-form-item label="内容">
						   <el-upload
							  ref="uploads"
							  :before-upload="beforeUploads"
							  :show-file-list='true'
							  :auto-upload="false"
							  :limit=1
							  :on-change="uploadFile"
							  name="file"
							  action="123">
							  <el-button slot="trigger" plain type="primary plain" >脚本代码</el-button>
							</el-upload>
						  </el-form-item>
						  <el-form-item label="分组">
						    <el-select v-model="chooseGroupName" placeholder="请选择分组" style="width:370px">
						      <el-option v-for="(item,index) in updateEditorOptions" :key="index" :label="item.label" :value="item.value"></el-option>
						    </el-select>
						  </el-form-item>
						  <el-form-item label="备注">
						    <el-input type="textarea" rows="3" resize="none" v-model="editorValue.desc"></el-input>
						  </el-form-item>
						  <el-form-item align="center">
						    <el-button type="primary" @click="submitEditorHandle">保存</el-button>
						    <el-button @click="cancelEditor">取消</el-button>
						  </el-form-item>
						</el-form>
					</div>
				</div>			
			</div>

			<!-- 脚本列表是否确定删除   -->
			<div class="bounced" v-show="deleteShow" :key="4">
				<div class="mask"></div>
				<div class="message delete-msg">
					<div class="modal-header">
						<h2>是否确定删除本条脚本</h2>
					</div>
					<div class="modal-body">
					  	<div class="group-btn">
					  		<el-button  type="primary" @click="delConfirmHandle">确定</el-button>
					    	<el-button @click="deleteShow = false">取消</el-button>
					  	</div>
					</div>
				</div>			
			</div>
			<!-- 查看备注  弹框   -->
			<div class="bounced" v-show="contentShow" :key="6">
				<div class="mask"></div>
				<div class="message delete-msg" style="width: 520px;padding: 0 5px;">
					<p class="border"><span>本条脚本的内容是：</span> 
						<el-input
						  type="textarea"
						  :rows="18"
						  resize=none
						  placeholder="请输入内容"
						  v-model="content_text">
						</el-input>
					</p>
					<el-button class="cancel_watch" @click="contentShow = false">取消</el-button>
				</div>			
			</div>
			</transition-group>
    </div>
</template>

<script>
export default{
	data() {
		return {
			scriptGroup:'',
			chooseGroupName1:'',
			chooseGroupName: null,
			scriptShow: false,
			changeShow: false,
			deleteShow: false,  // 脚本列表山否删除弹框
			describeShow: false, // 备注弹框
			contentShow: false,  //  内容查看弹框
			describe_text: null,  // 备注
			content_text: null, // 内容
			isSwitch:false,//开关
			flag:false,//文件是否上传,
			sentData:null,
			updateEditorValue:{  // 上传脚本
		        region: [],
		        delivery: false,
		        resource: '',
		        desc: '',
		        appid: '',
		        type: []
			},
			updateEditorOptions: [],
			editorValue: {
				name: '',
		        region: [],
		        delivery: false,
		        resource: '',
		        desc: '',
		        content: '',
		        appid: '',
		        scriptId:'',
		        type: [],
		        scriptGroupsId: ''
			},
		    currentPage: 1,
		    totalCount: 0,  // 脚本列表总数目
	        scriptGroupName1: [],  // 脚本列表
	        form: {
	            name: '',
	            region: '',
	            delivery: false,
	            resource: '',
	            desc: '',
	            content: '',
	            appid: '',
	            groupId: ''
	        },
	        deleteScriptId: null
		}
	},
	mounted() {
		this.groupList();
		this.scriptList();
	},
	methods:{
		aaaa(){
			console.log(this.updateEditorOptions)
		},
		searchScriptGroup(){
			this.scriptList()
		},
		//表格头部样式
    	getHeaderStyle({row, rowIndex}){
			if(rowIndex == 0){
				return 'background:#ecf5ff;color:#57aaff;font-size:14px';
			}else{
				return ''
			}
		},
		//  脚本分组列表
		groupList() {
			var $this = this;
			$this.$http('group/list', 'GET', {
				page:1,
				limit:999999,
			})
			.then(function(res) {
				if(res) {
					if(res.data.error_code == 0) {
						$this.scriptGroupName = res.data.data.result;
						console.log($this.updateEditorOptions)
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
		//  脚本列表
		scriptList() {
			var $this = this
			this.$http('script/list', 'GET', {
				page: $this.currentPage,
				limit: 7,
				script_search: this.scriptGroup
			}).then((res)=> {
				if(res) {
					if(res.data.error_code === 0) {
						let data = res.data.data;
						if(data.result.length==0){
					 	 	if(this.currentPage>1){
								this.currentPage=this.currentPage-1
								this.scriptList();
								return
							}
					 	 }
						$this.scriptGroupName1 = data.result;
						$this.totalCount =data.total_count;
					}else {
						$this.$message.error(res.data.data);
					}
				}
			})
		},
		//添加脚本分组
		addScriptGroup(){
			if(this.scriptGroup===''){
				this.$message.error('错了哦，分组名称不能为空');
			}else{
				if(this.scriptGroup!=''){
					let $this = this;
					let account = 0
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
											$this.$message.success(res.data.error_message)
											$this.scriptGroup = ''
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
		//分页
	    handleCurrentChange(val) {
	    	this.currentPage=val;
	    	this.scriptList(); 	
	    },
	    //  上传脚本
	    updateHandle() {
	    	this.scriptShow = !this.scriptShow
	    },
	    //  点击添加上传脚本
	    updateScriptHandle() {
	    	var $this = this
	    	
	    	if($this.chooseGroupName1=='') {
	    		$this.$message.error('请选择分组')
	    		return
	    	}
	    	if($this.updateEditorValue.desc=='') {
	    		$this.$message.error('备注不能为空')
	    		return
	    	}
            let id=$this.chooseGroupName1.split("_")[0],
	    	    name=$this.chooseGroupName1.split("_")[1];
			var $this = this
			$this.$refs.upload.submit();
	    	if(!$this.flag){
	    		$this.$message.error('请选择要上传的脚本')
	    		$this.flag=false
	    		return
	    	}
	    	this.updateEditorValue.region=[],
	    	this.updateEditorValue.delivery=false,
	    	this.updateEditorValue.resource='',
	    	this.updateEditorValue.desc='',
	    	this.updateEditorValue.appid='',
	    	this.updateEditorValue.type=[]
	    },
	    //  编辑脚本列表中保存的数据
	    editorClick(row){
	      	this.changeShow = true
	      	var $this = this;
	      	sessionStorage.setItem('script_id',row.id)
	      	$this.$http('script/'+row.id, 'GET')
	      	.then(function(res) {
	      		if(res) {
	      			if(res.data.error_code == 0) {
				      	$this.editorValue.name = res.data.data.scriptName;
				      	$this.editorValue.content = res.data.data.content;
						$this.chooseGroupName1 = res.data.data.scriptGroupId+"_"+res.data.data.scriptGroupName;
						$this.chooseGroupName = res.data.data.scriptGroupId+"_"+res.data.data.scriptGroupName;
						// $this.chooseGroupName = res.data.data.scriptGroupName;	
						$this.editorValue.type = res.data.data.scriptGroupName;
						$this.editorValue.desc = res.data.data.describe;
						$this.editorValue.scriptId = res.data.data.scriptId;  // 脚本id
						$this.editorValue.scriptGroupsId = res.data.data.scriptGroupId;  // 脚本分组id
	      			}else {
	      				$this.$message.error(res.data.error_message)
	      			}
	      		}else{
	      			alert('获取接口数据失败')
	      		}
	      	})
	    },
	    //上传脚本
	    //上传模板检测
			beforeUpload(file){
				var $this = this;
				  var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
	                const extension = testmsg === 'lua'
	                const isLt2M = file.size / 1024 / 1024 < 10
	                if(!extension) {  
	                    this.$message({  
	                        message: '上传文件只能是 lua脚本!',  
	                        type: 'warning'  
	                    });  
	                }  
	                if(!isLt2M) {  
	                    this.$message({  
	                        message: '上传文件大小不能超过 10MB!',  
	                        type: 'warning'  
	                    });  
	                } 
	                if(extension&&isLt2M){
	                	let id =$this.chooseGroupName1.split("_")[0];
		    	    	let name=$this.chooseGroupName1.split("_")[1];
	
		                let fdd = new FormData();
		                fdd.append('file',file)
		                fdd.append('describe',$this.updateEditorValue.desc)
		                fdd.append('script_group_id',id)
		                fdd.append('script_group_name',name)
		                $this.$http('script/add', 'POST',fdd).then(res => {
		                	if(res.data.error_code==0){
		                		let data = res.data;
			                	this.$message({
						           message: data.error_message+'---------',
						           type: 'success'
						        });
						        this.scriptShow=false;
						        this.scriptList();
		                	}
		                	
		                })
					
	                	this.flag=true;
	                }	
			},
	    //上传成功
			uploadSuccess(){
//				alert('成功')
//				this.$message({
//		           message: '模板上传成功！',
//		           type: 'success'
//		        });
//				 this.uploadResult = true;
			},
			//上传失败
			uploadError(){
//				this.$message({
//		           message: '模板上传失败！',
//		           type: 'error'
//		        });
			},
		//编辑脚本
		uploadEditor(){
			var $this = this;
			console.log(this.chooseGroupName)
			 let id =this.chooseGroupName.split("_")[0];
			 let name=this.chooseGroupName.split("_")[1];
			  let fdd = new FormData();
				fdd.append('name',$this.editorValue.name)
				fdd.append('describe',$this.editorValue.desc)
				fdd.append('script_group_id',id)
				fdd.append('script_group_name',name)
				fdd.append('id',sessionStorage.getItem('script_id'))
				$this.$http('script/update', 'POST',fdd)
				.then((res) =>{
					if(res.data.error_code==0){
						let data = res.data;
						$this.$message({
						message: data.error_message,
						type: 'success'
					});
					this.changeShow=false;
					sessionStorage.removeItem('script_id')
					this.scriptList()
					} 		
				})
		},
		uploadFile(){
//			this.uploadEditor=null
		},
		beforeUploads(file){
				var $this = this;
				  var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
	                const extension = testmsg === 'lua'
	                const isLt2M = file.size / 1024 / 1024 < 16
	                if(!extension) {  
	                    this.$message({  
	                        message: '上传文件只能是 lua脚本!',  
	                        type: 'warning'  
	                    });  
	                }  
	                if(!isLt2M) {  
	                    this.$message({  
	                        message: '上传文件大小不能超过 10MB!',  
	                        type: 'warning'  
	                    });  
	                }
	                if(extension&&isLt2M){
	                	let id =$this.chooseGroupName1.split("_")[0];
		    	    	let name=$this.chooseGroupName1.split("_")[1];
		                let fdd = new FormData();
		                fdd.append('file',file)
		                fdd.append('name',$this.editorValue.name)
		                fdd.append('describe',$this.editorValue.desc)
		                fdd.append('script_group_id',id)
		                fdd.append('script_group_name',name)
		                fdd.append('id',sessionStorage.getItem('script_id'))
		                $this.$http('script/update', 'POST',fdd).then(res => {
		                	if(res.data.error_code==0){
		                		let data = res.data;
			                	this.$message({
						           message: data.error_message,
						           type: 'success'
						        });
						        this.changeShow = false;
						        this.scriptList();
		                	}
		                	
		                })
				
		                this.flag=true;
						return false;
	                }
			},
		//取消编辑
		cancelEditor(){
			this.changeShow=false;
			sessionStorage.removeItem('script_id');
		},
	    //  提交编辑脚本列表
	    submitEditorHandle() {
	    	if(typeof(this.uploadEditor)=='function'){
	    		this.uploadEditor();
	    	}
	    	this.$refs.uploads.submit();
	    	// this.chooseGroupName1='';
	    },
	    //  点击查看内容
	    watchContent(row) {
	    	this.contentShow = !this.contentShow;
	    	var $this = this;
	    	$this.$http('script/download/'+ row.id,'GET')
	    	.then(function(res) {
				$this.content_text = res.data.data;
				// $this.content_text = res.data.error_message;
	    	})
	    },
	    //点击删除
	    deleteClick(row) {
	    	this.deleteShow = !this.deleteShow;
	    	this.deleteScriptId = row.id;
	    },
	    //  确定删除按钮
	    delConfirmHandle() {
	    	var $this = this;
	    	$this.deleteShow = false;
	    	$this.$http('script/del/'+ $this.deleteScriptId, 'DELETE')
	    	.then(function(res) {
	    		if(res) {
	    			if(res.data.error_code === 0) {
	    				$this.$message.success(res.data.error_message);
	    				$this.scriptList();
	    			}else {
	    				$this.$message.error(res.data.error_message);
	    			}
	    		}else {
	    			$this.$message.error('获取数据接口失败');
	    		}
	    	})
	    }
	}
}
</script>
<style scoped lang="scss">
	.footer{
		// background: #fff;
		// margin: 50px 5%;
		.title{
			// padding: 52px 30px 0 30px;
			font-size: 19px;
			color: #333;
			.el-button{
				float: right;
			}
		}
		.group_wrapper{
			background: #fff;
			margin-bottom: 30px;
    	// padding: 0 50px;
		}
		.list_wrapper{
			background: #fff;
			// padding:0 50px;
			.el-table{
				font-size: 12px;
				color: #888;
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
				position: absolute;
				top: 30%;
				left: 50%;
				margin-left: -275px;
				background: #fff;
				border-radius: 5px;
				z-index: 15;
				.modal-header {
					height: 50px;
					line-height: 50px;
					padding: 0 15px 0 40px;
					border-top-right-radius: 5px;
					border-top-left-radius: 5px;
					font-size: 12px;
					text-align: center;
					font-weight: normal;
					position:relative;
					// background-color: rgb(76, 174, 218);
					background-color: #409EFF;
					color: #fff;
					border-bottom: 1px solid #ccc;
					h2 {
						font-size: 14px;
					}
				}
				.modal-body{
					padding: 20px 50px;
					.group-btn {
						margin: 30px 0 10px 30px;
					}
				}
			}
			.delete-msg {
				top: 35%;
				margin-top: -90px;
				border-radius: 5px;
				text-align: center;
				font-size: 16px;
				.cancel_watch {
					padding: 10px 30px;
					margin: 25px 0;
				}
				.border {
					border-bottom: 1px solid #CCCCCC;
					line-height: 60px;
					.blue {
						color: #4CAEDA;
					}
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
