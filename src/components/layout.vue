<template>
	<div class="layout">
		<el-container style="height:100%">
			<el-header height="80px" style="background-color: rgb(76, 174, 218);text-align:left;">
				<div class="head_title">
					<img src="../assets/images/logo1.png" alt="" class="logo" /><span class="logoTitle">云总后台系统</span>
					<div class="userName">
						<el-dropdown trigger="click">
							<span class="el-dropdown-link">
					    {{username}}<i class="el-icon-caret-bottom el-icon--right"></i>
					  </span>
							<el-dropdown-menu slot="dropdown">
								<div @click="loginOut" class="loginOut">
									<el-dropdown-item class="clearfix">
										登出
									</el-dropdown-item>
								</div>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>
			</el-header>
			<el-container>
				<el-aside width="250px" height="100%" style="background-color: rgb(255, 255, 255)">
					<el-menu>
						<el-submenu v-for="(item,indexs) in $router.options.routes[1].children" :key="indexs.toString()" :index="indexs.toString()" v-if="item.meta.indentity.indexOf($store.state.indentity)>-1">
							<template slot="title" style="border-radius: 20px;"><i :class="item.meta.icon" v-if="item.meta.indentity.indexOf($store.state.indentity)>-1"></i> {{item.meta.title}}
							</template>
							<div v-for="items in item.children" :key = 'items.meta.index' :index='items.meta.index' v-if="items.meta.indentity.indexOf($store.state.indentity)>-1">
								<el-submenu  v-if="items.children && items.meta.indentity.indexOf($store.state.indentity)>-1" :index="items.meta.index" class="elSubmenu">
								  <template slot="title" style="border-radius: 20px;">
								  	{{items.meta.title}}
							      </template>
							      <el-menu-item v-for="part in items.children" :key = 'part.meta.index' :index='part.meta.index' v-if="!part.meta.hidden">
										<router-link :to="part.path" tag="h6">{{part.meta.title}}</router-link>
								  </el-menu-item>
							    </el-submenu>
								<router-link :to="items.path" tag="p" v-if="!items.children && items.meta.indentity.indexOf($store.state.indentity)>-1&& !items.meta.hidden">{{items.meta.title}}</router-link>
							</div>
						</el-submenu>
					</el-menu>
				</el-aside>
				<el-main>
					<!-- <div class="btn_list" ref="btnList" v-if="indentity=='ROLE_ADMIN'">
						<el-button plain @click="codeLogin">扫码登录</el-button>
						<el-button plain @click="addBuddy">添加好友</el-button>
						<el-button plain @click="friendsChar">好友聊天</el-button>
					</div> -->
					<div class="main">
						<router-view/>
					</div>
					<!-- 悬浮框 -->
					<!-- <span class="show" v-if="show && indentity=='ROLE_ADMIN'" @click="controlShow">
				 		<img src="../assets/images/show.png"/>
					</span>
					<div class="suspension_wrapper" ref="wrapper" v-if="indentity=='ROLE_ADMIN'">
						<div class="head"  ref="head" @mousedown="mouseDown($event)">
							拖拽区
							<span class="close" v-if="close" @mousedown.stop="controlHide"><img src="../assets/images/close.png"/></span>
						</div>
						<div v-show="content_page==1" style="height: 610px;width:300px;overflow-x: hidden;overflow-y:auto ;">
							<div class="task_wrapper">
								<div class="qrCode" v-if="qrCode">
									<img :src='"data:image/gif;base64,"+img' alt=""/>
									<el-button type="text">刷新二维码</el-button>
								</div>
								<div class="task" ref="task" id="task">
									<ul>
										<li v-for="(item,index) in ExecutingList" :key="index">
											<span class="left">{{item.task_template_name}}</span>
											<el-progress :percentage="item.progress"></el-progress>
										</li>
									</ul>
								</div>
							</div>

						</div>
						<div v-show="content_page==2">
							<div class="chat">
								<el-tree :props="props1" :load="loadNode1" :data="accountList" lazy  @node-expand='getSignalList' @node-click="handleChat">
								</el-tree>
							</div>
						</div>
						<div v-show="content_page==3">
							<div class="chat">
								<el-tree :props="props1" :load="loadNode1" :data="accountList" lazy  @node-expand='getSignalList' @node-click="handleChat">
									 <span class="custom-tree-node" slot-scope="{ node, data }">
										<span>
											<img v-if="node.icon" style="width:22px;height:22px" :src="node.icon">{{ node.label }}</span>
									</span>
								</el-tree>
							</div>
						</div>
						<el-pagination
						  small
						  @current-change="handleCurrentChange"
						  layout="prev, pager, next"
						  :total="50">
						</el-pagination>
					</div> -->
				</el-main>
			</el-container>
		</el-container>
		<!--弹窗-->
		<transition-group name="fade">
			<div class="bounced" v-show="friendShow" :key="1">
				<div class="mask"></div>
				<div class="message">
					<div class="modal-header">
						<h2>添加好友<span @click="closeRecord"><img src="../assets/images/close.png" alt="" /></span></h2>
					</div>
					<div class="modal-body">
						<template>
							<el-tabs :tab-position="tabPosition" align="center">
								<el-tab-pane label="手动添加" align="center">
									<el-form ref="form" :model="form" label-width="100px">
										<el-form-item label="选择微信号">
											<el-select v-model="form.region" placeholder="请选择活动区域" style="width:350px">
												<el-option label="区域一" value="shanghai"></el-option>
												<el-option label="区域二" value="beijing"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="输入微信号">
											<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="若输入多个微信号，请用逗号隔开" v-model="form.name" resize=none>
											</el-input>
										</el-form-item>
										<el-form-item>
											<el-button type="primary" @click="handleAdd">立即添加</el-button>
										</el-form-item>
									</el-form>
								</el-tab-pane>
								<el-tab-pane label="系统添加" align="center">
									<el-form ref="form" :model="form" label-width="100px">
										<el-form-item label="选择微信号">
											<el-select v-model="form.region" placeholder="请选择活动区域" style="width:350px">
												<el-option label="区域一" value="shanghai"></el-option>
												<el-option label="区域二" value="beijing"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="添加数量" prop='number' :rules="[
												      { required: true, message: '数量不能为空'},
												      { type: 'number', message: '数量必须为数字'}
												    ]">
											<el-input v-model.number="form.number" prop="name"></el-input>
										</el-form-item>
										<el-form-item>
											<el-button type="primary" @click="handleAdd">立即添加</el-button>
										</el-form-item>
									</el-form>
								</el-tab-pane>
							</el-tabs>
						</template>
					</div>
				</div>
			</div>
			<!--聊天-->
			<div class="bounced" v-show="chatShow" :key="3">
				<div class="chat" ref="chat" @mousedown="mouseDown($event)">
					<div class="modal-header">
						<h2 class="chat_title">聊天<span @click="chatShow=false"><img src="../assets/images/close.png" alt="" /></span></h2>
					</div>
					<div class="chat-body">
						<div class="chat_left left">

						</div>
						<div class="chat_middle left">
							<div class="chat_info">

							</div>
							<div class="chat_editor">

							</div>
						</div>
						<div class="chat_right left">

						</div>
					</div>
				</div>
			</div>
		</transition-group>
	</div>
</template>

<script>
	export default {
		created() {
			this.$store.commit("indentity");
		},
		data() {
			return {
				indentity:"",
				username: "",
				img: "",
				hint: "正在获取二维码，请稍后...",
				ExecutingList: [],
				show: false,
				close: true,
				task_id: "",
				timer: "",
				count: 0,
				listTimer: '',
				qrCode: false,
				accountList: [],
				groupList: [],
				signalList: [],
				currentId: '',
				parentId: '',
				friendShow: false,
				chatShow:false,
				content_page:1,
				taskTemplateName:'',
				taskTemplateId:'',
				props1: {
					label: 'name',
					children: 'zones',
					isLeaf: 'leaf'
				},
				tabPosition: 'top',
				form: {
					number: '',
					region: ''
				},
			};
		},
		mounted() {
			this.username = sessionStorage.getItem("username");
			this.indentity=sessionStorage.getItem('indentity');
			//轮询任务进度
			if(this.indentity=="ROLE_ADMIN"){
				// this.getTaskList();
				// this.listTimer = setInterval(() => {
				// 	this.getTaskList();
				// 	this.$refs.task.style.height = 610 + 'px';
				// }, 30000);
			}
			this.getAccountList();
			this.getGroupList();
//			this.getQrCode();
		},
		beforeDestroy() {
			clearTimeout(this.timer);
			clearTimeout(this.listTimer);
		},
		methods: {
			/*左侧导航栏点击更换背景颜色*/
			clickActive(index){
				this.activeIndex=index;
			},
			//最里层用于id
			handleChat(data,node){
				// if(node.data.signalId){
				// 	console.log("当前账号id:"+node.id)
				// 	console.log("所属微信id:"+node.parent.parent.data.account);
				// }else{
				// 	return
				// }
			},
			//分页
			handleCurrentChange(val) {
				if(val!==1){
					clearTimeout(this.timer);
					clearTimeout(this.listTimer);
				}
				this.content_page = val;
		      },
			friendsChar(){
				window.open("/#/char", '_blank');
			},
			//拖动
			mouseDown(ev) {
				// var ev = ev || event;
				// if(ev.toElement.className=="head"){
				// 	var oDiv = this.$refs.wrapper;
				// }else if(ev.toElement.className=="chat_title"){
				// 	var  oDiv = this.$refs.chat;
				// }
				// let x = ev.offsetX;
				// let y = ev.offsetY;
				// let Swidth = window.innerWidth;
				// let Sheight = window.innerHeight;
				// let width = oDiv.clientWidth;
				// let height = oDiv.clientHeight;
				// document.onmousemove = function(ev) {
				// 	var l = ev.clientX - x;
				// 	var t = ev.clientY - y;
				// 	if(l < 0) {
				// 		l = 0;
				// 	}else if(l>Swidth-width){
				// 		l = Swidth-width;
				// 	}
				// 	if(t < 0) {
				// 		t = 0;
				// 	}else if(t>Sheight-height){
				// 		t = Sheight-height
				// 	}
				// 	oDiv.style.top = t + 'px';
				// 	oDiv.style.left = l + 'px';
				// };
				// document.onmouseup = function() {
				// 	document.onmousemove = null;
				// 	document.onmouseup = null;
				// };
			},
			//手动添加好友
			handleAdd() {
				console.log('手动添加');
				this.friendShow = false;
			},
			//关闭弹窗
			closeRecord() {
				this.friendShow = false;
			},
			//添加好友
			addBuddy() {
				this.controlHide();
				this.friendShow = true;
			},
			//扫码登录
			codeLogin() {
				this.$http("task_template?page="+1+"&per_page="+99999,"GET")
				.then(
			   		res=>{
			   			if(res.data.error_code==0){
			   				res.data.data.forEach(item=>{
			   					if(item.task_template_name=="扫码登录"){
			   						this.taskTemplateName="扫码登录",
			   						this.taskTemplateId = item.task_template_id;
			   					}
			   				})
			   				this.createTask();
			   			}else{
			   				this.$message({
					           message: '执行扫码任务失败',
					           type: 'error'
					       });
			   			}
			   		}
			   		).catch(
			   		err=>{
			   			this.$message({
				           message: '执行扫码任务失败',
				           type: 'error'
				        });
			   		});
				//this.controlHide();
			},
			//创建扫码登录任务
			createTask(){
					this.$http("task/create_task","POST",{
						task_template_name:this.taskTemplateName,
			   			account_list:[],
			   			task_template_id:this.taskTemplateId,
			   			remark:"扫码登录",
			   			start_time:"",
					   	end_time:"",
					   	enum_wxaccount_source:1,
					   	wx_group_id:[],
					   	param:'',
					   	expect_count:0
					}).then(
				   		res=>{
				   			if(res.data.error_code==0){
						   	    this.$message({
						           message: '执行成功',
						           type: 'success'
						        });
				   			}else{
				   				this.$message({
						           message: '执行扫码任务失败',
						           type: 'error'
						        });
				   			}
			   		}).catch(
				   		err=>{
				   			this.$message({
					           message: '执行扫码任务失败',
					           type: 'error'
					        });
				   		}
			   		)
			},
			//悬浮框树状图
			loadNode1(node, resolve) {
				// if(node.level === 0) {
				// 	let arr = this.accountList
				// 	setTimeout(() => {
				// 		return resolve(arr);
				// 	}, 500)

				// } else if(node.level === 1) {
				// 	setTimeout(() => {
				// 		return resolve(this.groupList);
				// 	}, 500)
				// } else if(node.level === 2) {
				// 	setTimeout(() => {
				// 		return resolve(this.signalList);
				// 	}, 500)
				// }
			},
			//点击获取id
			getSignalList(data, node) {
//				if(data.account) {
//					this.parentId = data.account;
//				} else {
//					this.currentId = data.groupId;
//				}
//				if(node.childNodes.length > 0) {
//					return
//				}


				// if(data.groupId){
				// 	this.currentId = data.groupId;
				// 	this.parentId = node.parent.data.account
				// }else{
				// 	return
				// }
				// if(node.childNodes.length > 0) {
				// 	return
				// }
				// if(this.currentId) {
				// 	this.$http('wx_contact/list', 'GET', {
				// 		wx_contact_group_id: this.currentId,
				// 		wxuser_id: this.parentId
				// 	}).then(res => {
				// 		if(res.data.error_code == 0) {
				// 			this.signalList=[];
				// 			res.data.data.forEach((item, index) => {
				// 				this.signalList[index] = {};
				// 				if(item.wx_contact_nickname){
				// 					this.signalList[index].name = item.wx_contact_nickname;
				// 				}else{
				// 					this.signalList[index].name = item.wx_contact_name;
				// 				}
				// 				this.signalList[index].signalId = item.wx_contact_id;
				// 				this.signalList[index].icon = "https://www.baidu.com/img/baidu_jgylogo3.gif";
				// 				this.signalList[index].leaf = true;
				// 			})
				// 		} else {
				// 			this.$message({
				// 				message: "获取联系人失败",
				// 				type: "error"
				// 			});
				// 		}
				// 	}).catch(err => {
				// 		this.$message({
				// 			message: "获取联系人失败",
				// 			type: "error"
				// 		});
				// 	})
				// }
			},
			//获取第一层微信号
			getAccountList() {
				// let $this = this;
				// this.$http("wx_user/list", "GET")
				// 	.then(res => {
				// 		if(res.data.error_code == 0) {
				// 			let data = res.data.data;
				// 			data.forEach((item, index) => {
				// 				this.accountList[index] = {};
				// 				if(item.wx_nickname){
				// 					this.accountList[index].name = item.wx_nickname;
				// 				}else{
				// 					this.accountList[index].name = item.wx_username;
				// 				}

				// 				this.accountList[index].account = item.wxuser_id;
				// 				this.accountList[index].icon = "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3510006133,2153353159&fm=27&gp=0.jpg";
				// 			})
				// 		} else {
				// 			this.$message({
				// 				message: "获取微信号分组失败",
				// 				type: "error"
				// 			});
				// 		}

				// 	}).catch(err => {
				// 		this.$message({
				// 			message: "获取微信号分组失败",
				// 			type: "error"
				// 		});
				// 	})
			},
			//获取第二层微信号
			getGroupList() {
				// let $this = this;
				// this.$http("wx_contact_group/list", "GET")
				// 	.then(res => {
				// 		if(res.data.error_code == 0) {
				// 			let data = res.data.data;
				// 			data.forEach((item, index) => {
				// 				this.groupList[index] = {};
				// 				this.groupList[index].name = item.wx_contact_group_name;
				// 				this.groupList[index].groupId = item.wx_contact_group_id;
				// 			})
				// 		} else {
				// 			this.$message({
				// 				message: "获取微信号分组失败",
				// 				type: "error"
				// 			});
				// 		}

				// 	}).catch(err => {
				// 		this.$message({
				// 			message: "获取微信号分组失败",
				// 			type: "error"
				// 		});
				// 	})
			},
			// 悬浮框隐藏
			controlHide(ev) {
				// this.close = false;
				// let timerW = setInterval(() => {
				// 	this.$refs.wrapper.style.width = this.$refs.wrapper.clientWidth - 8 + "px";
				// 	if(this.$refs.wrapper.clientWidth < 10) {
				// 		clearInterval(timerW);
				// 		this.$refs.wrapper.style.width = 0 + "px";
				// 		this.show = true;
				// 		clearTimeout(this.timer);
				// 		clearTimeout(this.listTimer);
				// 	}
				// }, 15);
				// window.event.cancelBubble = true;
			},
			// 悬浮框显示
			controlShow() {
				// this.show = false;
				// let timerW = setInterval(() => {
				// 	this.$refs.wrapper.style.width = this.$refs.wrapper.clientWidth + 8 + "px";
				// 	if(this.$refs.wrapper.clientWidth >= 290) {
				// 		clearInterval(timerW);
				// 		this.$refs.wrapper.style.width = 290 + "px";
				// 		this.close = true;
				// 		this.getTaskList();
				// 		this.listTimer = setInterval(() => {
				// 			this.getTaskList();
				// 		}, 30000);
				// 	}
				// }, 15);
			},
			// 获取悬浮框数据列表
			getTaskList() {
// 				clearTimeout(this.timer);
// 				this.ExecutingList = [];
// 				this.$http("/task/process", "GET", {
// 						task_template_name: "",
// 						user_name: "",
// 						page: 1,
// 						limit: 99999
// 					})
// 					.then(res => {
// 						if(res.data.error_code == 0) {
// 							let data = res.data;
// 							let list = data.data;
// 							if(this.qrCode) {
// 								list.map(item => {
// //									if(sessionStorage.getItem('username') == item.user_name) {
// 										if(item.task_template_name != "扫码登录") {
// 											item.progress=Number(item.progress.replace(/\%/,''));

// 											this.ExecutingList.push(item);
// 										}
// 										console.log(this.ExecutingList)
// //									}
// 								});
// 								if(!this.img) {
// 									this.getQrCode()
// 								} else {
// 									return;
// 								}
// 							} else {
// 								list.map(item => {
// //									if(sessionStorage.getItem('username') == item.user_name) {
// 										if(item.task_template_name != "扫码登录") {
// 											item.progress=Number(item.progress.replace(/\%/,''));
// 											this.ExecutingList.push(item);
// 										} else {
// 											this.task_id = item.task_id;
// 										}
// //									}
// 								});
// 								this.getQrCode();
// 							}
// 							this.allAccount = data.count;
// 							//          if (this.allAccount == 0) {
// 							//            this.$message({
// 							//              message: "未查询到！",
// 							//              type: "error"
// 							//            });
// 							//          }
// 						} else {
// 							this.$message({
// 								message: res.data.error_message,
// 								type: "error"
// 							});
// 						}
// 					})
// 					.catch(err => {
// 						this.$message({
// 							message: "获取任务失败！",
// 							type: "error"
// 						});
// 					});
			},
			//获取二维码
			getQrCode() {

				let $this = this;
				this.$http("get_qr_code", "GET", {
					task_id: this.task_id
				}).then(res => {
					if(res.data.error_code == 0&&res.data.data.status==3) {
						let data = res.data;
						this.img = data.error_message;
						this.qrCode = true;
						this.hint = "请扫描二维码";
					} else if(res.data.error_code == 400) {
						this.timer = setTimeout(() => {
							this.count++;
							if(this.count <= 5) {
								$this.getQrCode();
							} else {
								if(!this.img) {
									this.hint = '二维码有点小问题，努力加载中'
								}
							}
						}, 2000);
					} else if(res.data.error_code == 403) {
						this.$message({
							message: res.data.error_message,
							type: "error"
						});
					}else{
						this.timer = setTimeout(() => {
							$this.getQrCode();
						}, 2000);
					}
				});
			},
			//登出
			loginOut() {
				// this.$http("user/logout", "POST")
				// 	.then(res => {
				// 		if(res.data.error_code == 0) {
				// 			this.$router.push("/login");
				// 			sessionStorage.removeItem("indentity");
				// 			sessionStorage.removeItem("token");
				// 			sessionStorage.removeItem("username");
				// 		} else {
				// 			this.$message.error("登出失败");
				// 		}
				// 	})
				// 	.catch(err => {
				// 		this.$message.error("登出失败");
				// 	});
				sessionStorage.removeItem("indentity");
				sessionStorage.removeItem("token");
				sessionStorage.removeItem("username");
				sessionStorage.removeItem("user_id");
				this.$router.push('/login')
			}
		},
		//监听是否存在二维码
		watch:{
			// qrCode(newValue,oldValue){
			// 	if(this.indentity=="ROLE_ADMIN"){
			// 		if(newValue){
			// 			this.$refs.task.style.height = 400 + 'px';
			// 		}
			// 	}
			// }
		}
	};
</script>

<style scoped lang="scss">
	.layout {
		p{
			font-size: 14px;
			color: #303133;
			cursor:pointer;
			line-height:56px;
			text-align: center;
		}
		p:hover{
			background-color: #ecf5ff;
		}
		h6{
			font-size: 14px;
			color: #303133;
			cursor:pointer;
			line-height:56px;
			text-align:center;
		}
		h6:hover{
			background-color: #ecf5ff;
		}
		.elSubmenu{
			font-size: 14px !important;
			color: #303133 !important;
			cursor:pointer !important;
			width: 100% !important;
			line-height:40px !important;
			text-align: center !important;
			padding-right:0 !important;
		}
		height: 100%;
		user-select: none;
		.imgTree{
			img{
				width: 15px;
				height: 15px;
			}
		}


		.el-header {
			clear: both;
			.logo {
				margin: 0 17px 0 43px;
				float: left;
			}
			.logoTitle {
				display: inline-block;
				float: left;
				line-height: 80px;
				color: #fff;
				font-size: 18px;
			}
			.userName {
				color: #fff;
				position: absolute;
				right: 20px;
				top: 13px;
			}
			.el-dropdown-link {
				color: #fff;
			}
			.head_title {
				height: 80px;
				line-height: 60px;
			}
		}
		.el-aside {
			ul {
				border-right: 0;
			}
		}
		.el-main {
			text-align: left;
			line-height: 30px;
			background-color: #e8eff6;
			width: 100%;
			padding: 0;
			.btn_list {
				position: relative;
				padding-left: 20px;
				height: 50px;
				line-height: 50px;
				background: #fff;
				border-bottom:1px solid #ddd;
				border-left: 1px solid #ddd;
				.el-button {
					padding: 8px 10px;
					font-size: 12px;
				}
			}
			.main{
				padding: 15px 30px 20px;
			}
		}
		.suspension_wrapper {
			width: 280px;
			height: 700px;
			overflow: hidden;
			padding-top: 50px;
			position: fixed;
			border-radius: 5px;
			right: 20px;
			top: 190px;
			z-index: 111;
			background: #fff;
			box-shadow: 3px 3px 5px #D3D4D6,-3px -3px 5px #D3D4D6;
			/*background: rgba($color: #000000, $alpha: 0.35);*/
			.head{
				position: absolute;
				top: 0;
				width: 100%;
				height: 50px;
				line-height: 50px;
				text-align: center;
				color: #888;
				border-bottom: 1px solid #ccc;
				cursor: move;
				.close{
					width: 50px;
					height: 50px;
					position: absolute;
					right: 0;
					padding: 10px;
					cursor: pointer;
					img{
						width: 30px;
						height: 30px;
					}
				}
			}
			.qrCode {
				/*width: 180px;*/
				height: 210px;
				padding-top: 25px;
				text-align: center;
				background: #e9f3fa;
				img{
					width: 140px;
					height: 140px;
					margin:0 auto;
					display: block;
					background: #fff;
				}
				.el-button{
					margin: 5px 0;
				}
			}
			.chat{
				width: 307px;
				height: 610px !important;
				overflow-x: hidden;
				overflow-y: auto;
				padding: 10px 10px 20px 30px;
				color: #888;
			}
			.task{
				padding: 10px 10px 20px 30px;
				color: #888;
				li{
					height: 24px;
					line-height: 24px;
					font-size: 12px;
					.left{
						float: left;
						width: 80px;
						height: 24px;
					}
					.right{
						float: right;
					}
					.el-progress--line{
						display: inline-block;
						width: 150px;
					}
					.el-progress__text{
						margin-left: 15px !important;
					}
				}
			}
			.el-tree{
				background: rgba(255, 255, 255, .0);
			}
			.el-pagination{
				position: absolute;
				bottom: 2px;
				left: 50%;
				margin-left: -90px;
			}
		}
		.show{
			width: 60px;
			height: 40px;
			position: fixed;
			top: 85px;
			right: 20px;
			color: #fff;
			text-align: center;
			border-radius: 5px;
			cursor: pointer;
			background: rgba($color: #000000, $alpha: 0.35);
			img {
				margin-top: 4px;
				width: 30px;
				height: 30px;
			}
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
				height: 400px;
				position: absolute;
				top: 30%;
				left: 50%;
				margin-left: -300px;
				padding-bottom: 50px;
				background: #fff;
				border-radius: 5px;
				z-index: 15;
				.modal-header{
					height: 50px;
					line-height: 50px;
					border-top-left-radius: 5px;
					border-top-right-radius: 5px;
					font-size: 12px;
					color: #fff;
					background-color: rgb(76, 174, 218);
					font-weight: normal;
					position: relative;
					text-align: center;
					border-bottom: 1px solid #ddd;
					h2{
						font-size: 16px;
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
				.modal-body{
					padding: 0px 50px;
					overflow: auto;
					.qrCode{
						width: 202px;
						height: 202px;
						border: 1px solid #ccc;
						margin: 40px auto 0px;
						text-align: center;
						img{
							width: 200px;
							height: 200px;
							display: block;
							background: #fff;
						}
					}
					.tip{
						display: block;
						text-align: center;
						margin-top: 25px;
						font-size: 14px;
						color: #666;
					}
				}
			}
		}
		.fade-enter-active,
		.fade-leave-active {
			transition: opacity .5s;
		}
		.fade-enter,
		.fade-leave-to {
			opacity: 0;
		}
		/*聊天*/
		.bounced{
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
		.chat{
				width: 950px;
				height: 700px;
				position: absolute;
				top: 180px;
				left: 400px;
				padding-bottom: 50px;
				background: #fff;
				border-radius: 5px;
				z-index: 15;
				border:1px solid #ccc;
				.modal-header{
					height: 50px;
					line-height: 50px;
					border-top-left-radius: 5px;
					border-top-right-radius: 5px;
					font-size: 12px;
					color: #fff;
					background-color: rgb(76, 174, 218);
					font-weight: normal;
					position: relative;
					text-align: center;
					border-bottom: 1px solid #ddd;
					h2{
						font-size: 16px;
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
				.chat-body{
					height: 100%;
					.left{
						float: left;
					}
					.chat_left{
						width: 200px;
						height: 648px;
						border-right: 1px solid #ccc;
					}
					.chat_middle{
						width: 500px;
						height: 648px;
						border-right: 1px solid #ccc;
						.chat_info{
							height: 450px;
							border-bottom: 1px solid #ccc;
						}
					}
					.chat_right{
							height: 648px;
					}
				}
			}
		}
	}
</style>
