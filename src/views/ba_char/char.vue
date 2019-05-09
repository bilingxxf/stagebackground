<template>
<div class="char">
	<div class="chat">
		<div class="modal-header">
			<h2 class="chat_title">{{name}}</h2>
		</div>
		<div class="chat-body">
			<div class="chat_left">
				<div class="friendsList">
					<el-tree :props="props" :load="loadNode" :data="accountList" lazy  @node-expand='getSignalList' @node-click="handleChat">
					</el-tree>
				</div>
				<div class="charFriends">
					<p v-for="(item,index) in charFriends" ref="charP" :key="index" :class="selectPId==item.id?'selectP':''" @click="targetFriend(item.id,item.groupId,item.wxId,item.name)">{{item.name}}
					</p>
				</div>
			</div>
			<div class="chat_middle">
				<div class="chat_info">
					<p v-for="(item,index) in detail" :class="item.position" :key="index">
					    <img :class="item.position" src="http://img3.imgtn.bdimg.com/it/u=415281566,3236920219&fm=27&gp=0.jpg" style="width: 40px;height: 40px;margin:0 10px;" />
					    <img v-if="item.img" :class="item.position" :src="item.img" style="width: 200px;height: 200px;" />
					    <img v-if="item.emoji" :class="item.position" :src="item.emoji" style="width: 24px;height:24px;" />
						<span :class="item.textAlign">
						{{item.name}}
						</span>
					</p>
				</div>
				<div class="chat_editor">
					 <div id="editorTitle" class="toolbar"></div>
					 <div id="editorContent" class="text" style="height: 230px;overflow-y:auto;"></div>
					 <el-button type="info" size="mini" @click="affirmSend">确认发送</el-button>
				</div>
			</div>
			<div class="chat_right">
			</div>
		</div>
	</div>
</div>
</template>

<script>
// import wangEditor from "wangEditor"
import face from "../../assets/face.json"
export default {
	data() {
		return {
			name:"聊天",
			props: {
				label: 'name',
				children: 'zones',
				isLeaf: 'leaf'
			},
			accountList: [],
			groupList:[],
			signalList:[],
			charFriends:[],
			charFriendsId:[],
			editor:{},
			messageIds:[],
			message:{
			},
			face:face,
			detail:[],
			selectPId:""
	    }
	},
	mounted(){
		this.getAccountList();
		this.getGroupList();
		/*富文本编辑器创建*/
		// this.editor = new wangEditor('#editorTitle','#editorContent');
		// this.editor.customConfig.zIndex = 1;
		// this.editor.customConfig.menus = [
	    //     'emoticon',
	    //     'image'
	    // ];
	    // this.editor.customConfig.showLinkImg = false;
	    // this.editor.customConfig.uploadImgShowBase64 = true;
	    // this.editor.customConfig.emotions = [
	    //     {
	    //         title: '默认',
	    //         type: 'image',
	    //         content:face
	    //     }
	    // ]
        // this.editor.create();
	},
	methods: {
		/*确认发送消息*/
		affirmSend(){
			if(this.selectPId){
				let saveMessage={
				position:"right",
				img:"",
				textAlign:"textRight",
				name:"",
				emoji:""
			};
			let editorTxt=this.editor.txt.getJSON();
			for(let i=0;i<editorTxt.length;i++){
				for(let j=0;j<editorTxt[i].children.length;j++){
					if(editorTxt[i].children[j].tag=="img" && editorTxt[i].children[j].attrs.length<=2){
						this.message[this.selectPId].push({
							position:"right",
							name:"",
							textAlign:"textRight",
							img:editorTxt[i].children[j].attrs[0].value,
							emoji:""
						})
					}
					if(editorTxt[i].children[j].tag=="img" && editorTxt[i].children[j].attrs.length>2){
						this.message[this.selectPId].push({
							position:"right",
							name:"",
							textAlign:"textRight",
							img:"",
							emoji:editorTxt[i].children[j].attrs[0].value
						})
					}
					if(editorTxt[i].children[j].tag!="img" && editorTxt[i].children[j].tag!="br"){
						saveMessage.name+=editorTxt[i].children[j];
					}
				}
			}
			if(saveMessage.name){
				this.message[this.selectPId].push(saveMessage);
			}
			this.editor.txt.html('');
			}
			else{
				this.$message({
					message: "请选择聊天好友",
					type: "warning"
				});
			}
		},
		//点击正在聊天的好友切换聊天窗
		targetFriend(id,groupId,wxId,name){
			this.selectPId=id;
			this.detail=this.message[this.selectPId];
			this.name=name;
		},
		/*树形结构点击事件*/
		handleChat(data,node){
			if(data.signalId){
				if(this.charFriendsId.indexOf(data.signalId)==-1){
					this.charFriends.push({
						"id":data.signalId,
						"name":data.name,
						"groupId":node.parent.id,
						"wxId":node.parent.parent.id
					});
					this.charFriendsId.push(data.signalId);
					this.name=data.name;
				}
				this.selectPId=data.signalId;
				if(this.messageIds.indexOf(this.selectPId)==-1){
					this.messageIds.push(this.selectPId);
					this.message[this.selectPId]=[];
					this.detail=this.message[this.selectPId];
				}
			}else{
				return
			}
		},
		/*树形结构懒加载*/
		loadNode(node, resolve) {
			if(node.level === 0) {
				let arr = this.accountList
				setTimeout(() => {
					return resolve(arr);
				}, 300)

			} else if(node.level === 1) {
				setTimeout(() => {
					return resolve(this.groupList);
				}, 300)
			} else if(node.level === 2) {
				setTimeout(() => {
					return resolve(this.signalList);
				}, 300)

			}
		},
		//点击获取id
		getSignalList(data, node) {
			if(data.groupId){
				this.currentId = data.groupId;
				this.parentId = node.parent.data.account
			}else{
				return
			}
			if(node.childNodes.length > 0) {
				return
			}
			if(this.currentId) {
				this.$http('wx_contact/list', 'GET', {
					wx_contact_group_id: this.currentId,
					wxuser_id: this.parentId
				}).then(res => {
					if(res.data.error_code == 0) {
						this.signalList=[];
						res.data.data.map((item, index) => {
							this.signalList[index] = {};
							if(item.wx_contact_nickname){
								this.signalList[index].name = item.wx_contact_nickname;
							}else{
								this.signalList[index].name = item.wx_contact_name;
							}
							this.signalList[index].signalId = item.wx_contact_id;
							this.signalList[index].leaf = true;
						})
					} else {
						this.$message({
							message: "获取联系人失败",
							type: "error"
						});
					}
				}).catch(err => {
					this.$message({
						message: "获取联系人失败",
						type: "error"
					});
				})
			}
		},
		//获取第一层微信号
		getAccountList() {
			let $this = this;
			this.$http("wx_user/list", "GET")
				.then(res => {
					if(res.data.error_code == 0) {
						let data = res.data.data;
						data.map((item, index) => {
							this.accountList[index] = {};
							if(item.wx_nickname){
								this.accountList[index].name = item.wx_nickname;
							}else{
								this.accountList[index].name = item.wx_username;
							}
							this.accountList[index].account = item.wxuser_id;
						})
					} else {
						this.$message({
							message: "获取微信号分组失败",
							type: "error"
						});
					}

				}).catch(err => {
					this.$message({
						message: "获取微信号分组失败",
						type: "error"
					});
				})
		},
		//获取第二层微信号
		getGroupList() {
			let $this = this;
			this.$http("wx_contact_group/list", "GET")
				.then(res => {
					if(res.data.error_code == 0) {
						let data = res.data.data;
						data.map((item, index) => {
							$this.groupList[index] = {};
							$this.groupList[index].name = item.wx_contact_group_name;
							$this.groupList[index].groupId = item.wx_contact_group_id;
						})
					} else {
						this.$message({
							message: "获取微信号分组失败",
							type: "error"
						});
					}

				}).catch(err => {
					console.log(err);
					this.$message({
						message: "获取微信号分组失败",
						type: "error"
					});
				})
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.char{
	width: 70%;
	height: 50%;
	box-sizing: border-box;
	padding-top: 100px;
	margin: 0 auto;
	.chat{
		background: #fff;
		border-radius: 5px;
		z-index: 15;
		.left{
			float:left;
			line-height: 40px;
		}
		.textLeft{
			text-align:left;
			float: left; 
		}
		.textRight{
			text-align:right;
			float: right;
		}
		.right{
			float:right;
			line-height: 40px;
		}
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
		}
		.chat-body{
			display: flex;
			border:1px solid #ccc;
			overflow: hidden;
			.chat_left{
				flex: 1;
				height: 748px;
				display: flex;
				border-right: 1px solid #ccc;
				.friendsList{
					flex: 2;
					border-right: 1px solid #ccc;
					height: 100%;
					overflow-y: auto;
					box-sizing: border-box;
					float: left;
				}
				.charFriends{
					flex: 1;
					height: 100%;
					overflow-y: auto;
					box-sizing: border-box;
					float: left;
					font-size: 14px;
					color:#606266;
					p{
						text-align: center;
						padding: 10px 0;
						cursor: pointer;
					}
					.selectP{
						background-color: #f5f7fa;
					}
				}
			}
			.chat_middle{
				flex: 3;
				height: 748px;
				border-right: 1px solid #ccc;
				.chat_info{
					height: 450px;
					border-bottom: 1px solid #ccc;
					overflow-y: auto;
					p{
						width: 60%;
						padding:5px;
						span{
							display: inline-block;
							width: 200px;
							word-wrap:break-word;
						}
					}
				}
				.chat_editor{
					height: 295px;
					.el-button{
						float: right;
						margin-right: 20px;
					}
				}
			}
			.chat_right{
				height: 748px;
				flex: 1;
			}
		}
	}
}

</style>
