<template>
	<div id="addGroupowner">
	    <div class="notice">
		    <span class="left">下方仅针对群主账号生效，账号非群主的情况下设置无效。</span>
		    <div class="right">
		    	<el-button type="success" size="small">保存</el-button>
		    </div>
	    </div>
	    <div class="deployContent">
	    	<div class="part-2">
	    		<span>第一步:模板名称</span>
	    		<el-input v-model="deployInput" style="width: 240px;"></el-input>
	    	</div>
	    	<div class="part-3">
	    			<div class="top">
	    				<el-checkbox v-model="kick" @change="kickChange">第二步:踢人设置</el-checkbox>
	    			</div>
	    			<div class="bottom" v-show="kickBottom">
	    				<h3>防广告：请设置你要踢得消息类型</h3>
	    				<div class="item">
	    					<el-checkbox v-model="kickMessage"></el-checkbox>
	    					踢消息中包含以下关键词
	    					<el-button type="text" style="color: green;" @click="setMessage=true,mask=true">设置</el-button>
	    				</div>
	    				<div class="item">
	    					<el-checkbox v-model="kickNickname"></el-checkbox>
	    					踢昵称中包含以下关键词
	    					<el-button type="text" style="color: green;" @click="setNickname=true,mask=true">设置</el-button>
	    				</div>
	    				<div class="item">
	    					<el-checkbox v-model="kickCode"></el-checkbox>
	    					踢发二维码（耗CPU）
	    				</div>
	    				<div class="item">
	    					<el-checkbox v-model="kickCard"></el-checkbox>
	    					踢发名片
	    				</div>
	    				<div class="item">
	    					<el-checkbox v-model="kickURL"></el-checkbox>
	    					踢发网址分享
	    				</div>
	    				<div class="item">
	    					<el-checkbox v-model="kickVideo"></el-checkbox>
	    					踢发小视频
	    				</div>
	    				<h3>防骚扰：请设置你要踢的消息长度</h3>
	    				<div class="item">
	    					<el-checkbox v-model="harassMessage"></el-checkbox>
	    					信息大于
	    					<el-input-number style="width: 100px;" v-model="messageNum" controls-position="right" :min="1" :max="1000" ></el-input-number>
	    					行
	    				</div>
	    				<div class="item">
	    					<el-checkbox v-model="harassString"></el-checkbox>
	    					字符大于
	    					<el-input-number style="width: 100px;" v-model="stringNum" controls-position="right" :min="1" :max="1000" ></el-input-number>
	    					字
	    				</div>
	    				<div class="item">
	    					<el-checkbox v-model="harassTime"></el-checkbox>
	    					连续
	    					<el-input-number style="width: 100px;" v-model="timeNum" controls-position="right" :min="1" :max="1000" ></el-input-number>
	    					秒发送
	    					<el-input-number style="width: 100px;" v-model="branchesNum" controls-position="right" :min="1" :max="1000" ></el-input-number>
	    					条信息的用户将被踢出
	    				</div>
	    				<div class="item">
	    					<el-button type="text" style="color: green;" @click="setword(0)">设置踢人公告</el-button>
	    				</div>
	    			</div>
	    	</div>
	    	<div class="part-6">
	    		<div class="top">
				    <el-checkbox v-model="welcome" @change="welcomeChange">第三步:新人进群发欢迎语</el-checkbox>
    			</div>
    			<div class="bottom" v-show="welcomeBottom">
    				<div class="item" v-for="(item,index) in addWelcome">
    					<div class="itemLeft" v-html="item">
    					</div>
    					<div class="itemRight">
    						<el-button type="text" style="color: red;" @click="deleteWelcome(index)">删除</el-button>
    					</div>
    				</div>
    			</div>
    			<div class="buttons" v-show="welcomeBottom">
					<el-button type="success" @click="setword(1)">新增</el-button>
				</div>
	    	</div>
	    	<div class="part-4">
	    		<div class="top">
	    			<div class="left">
	    				<span>第四步:黑名单</span>
	    				<el-button type="info" size="small" @click="mask=true,addBlacelist=true">添加</el-button>
	    			</div>
	    			<span class="right">黑名单成员将自动从所有群主群内退出，并禁止其进群</span>
	    		</div>
	    	</div>
	    	<div class="part-5">
	    		<div class="top">
	    			<div class="left">
	    				<span>第五步:白名单</span>
	    				<el-button type="info" size="small" @click="mask=true,addWhitelist=true">添加</el-button>
	    			</div>
	    			<span class="right">白名单成员拥有特殊权限，将不会被自动踢出</span>
	    		</div>
	    	</div>
	    </div>
	    <!-- 设置消息关键词 -->
	    <div class="popup" v-show="setMessage">
	    	<span class="close" @click="mask=false,setMessage=false">×</span>
	    	<div class="header">
	    		查看消息关键词
	    	</div>
	    	<div class="content">
	    		<span>一行一个关键词</span>
	    		<el-input
				  type="textarea"
				  :rows="10"
				  placeholder="请输入内容"
				  v-model="setmessageTextarea">
				</el-input>
	    	</div>
	    	<div class="button">
	    	    <el-button type="success" size="small" @click="clear()">确定</el-button>
	    		<el-button size="small" @click="mask=false,setMessage=false">关闭</el-button>
	    	</div>
	    </div>
	    <!-- 设置昵称关键词 -->
	    <div class="popup" v-show="setNickname">
	    	<span class="close" @click="mask=false,setNickname=false">×</span>
	    	<div class="header">
	    		查看昵称关键词
	    	</div>
	    	<div class="content">
	    		<span>一行一个关键词</span>
	    		<el-input
				  type="textarea"
				  :rows="10"
				  placeholder="请输入内容"
				  v-model="setnicknameTextarea">
				</el-input>
	    	</div>
	    	<div class="button">
	    	    <el-button type="success" size="small" @click="clear()">确定</el-button>
	    		<el-button size="small" @click="mask=false,setNickname=false">关闭</el-button>
	    	</div>
	    </div>
	    <!-- 添加白名单 -->
	    <div class="popup" v-show="addWhitelist">
	    	<span class="close" @click="mask=false,addWhitelist=false">×</span>
	    	<div class="header">
	    		成员搜索
	    	</div>
	    	<div class="content">
	    		<el-input
				  placeholder="请输入内容"
				  v-model="searchWhitelist"
				  style="width: 240px;"
				  >
				</el-input>
				<el-button type="success">搜索</el-button>
				<div class="list">
					<el-table
					    ref="whiteTable"
					    :data="whiteTableData"
					    style="width: 100%"
					    @selection-change="whiteSelectionChange">
					    <el-table-column
					      type="selection"
					      width="30">
					    </el-table-column>
					    <el-table-column
					      prop="name"
					      label="好友名称"
					    >
					    </el-table-column>
					</el-table>
				</div>
	    	</div>
	    </div>
	    <!-- 添加黑名单 -->
	    <div class="popup" v-show="addBlacelist">
	    	<span class="close" @click="mask=false,addBlacelist=false">×</span>
	    	<div class="header">
	    		成员搜索
	    	</div>
	    	<div class="content">
	    		<el-input
				  placeholder="请输入内容"
				  v-model="searchBlacelist"
				  style="width: 240px;"
				  >
				</el-input>
				<el-button type="success">搜索</el-button>
				<div class="list">
					<el-table
					    ref="blaceTable"
					    :data="blaceTableData"
					    style="width: 100%"
					    @selection-change="blaceSelectionChange">
					    <el-table-column
					      type="selection"
					      width="30">
					    </el-table-column>
					    <el-table-column
					      prop="name"
					      label="好友名称"
					    >
					    </el-table-column>
					</el-table>
				</div>
	    	</div>
	    </div>
	    <!-- 添加文字 -->
	    <div class="popup" v-show="addWord">
	    	<span class="close" @click="mask=false,addWord=false">×</span>
	    	<div class="header">
	    		添加文字
	    	</div>
	    	<div class="content">
	    		<div id="editorHead" style="margin-top:10px;height: 30px;line-height:20px;background-color: #eee;"></div>
	    		<div id="editorText" style="height: 200px;border:1px solid #eee;"></div>
	    	</div>
	    	<div class="button">
	    	    <el-button type="success" size="small" @click="affirmAddword">确定</el-button>
	    		<el-button size="small" @click="mask=false,addWord=false">关闭</el-button>
	    	</div>
	    </div>
	    <!-- 阴影 -->
	    <div class="mask" v-if="mask" @click="clear">
	    </div>
	</div>
</template>
<script>
import editor from "wangEditor"
import face from "../../assets/face.json"
export default {
  data() {
    return {
    	//白名单
    	whiteTableData:[
	    	{
	    		name:"小明",
	    		index:0
	    	},
	    	{
	    		name:"小黑",
	    		index:1
	    	}
    	],
    	whiteSelectdata:[],
    	//黑名单
    	blaceTableData:[
	    	{
	    		name:"小明",
	    		index:0
	    	},
	    	{
	    		name:"小黑",
	    		index:1
	    	}
    	],
    	balceSelectdata:[],
    	searchBlacelist:"",
    	searchWhitelist:"",
    	addWord:false,
    	// wangEditor:{},
    	addWhitelist:false,
    	addBlacelist:false,
    	setnicknameTextarea:"",
    	setNickname:false,
    	setmessageTextarea:"",
    	mask:false,
    	setMessage:false,
    	deployInput:"",
    	/*踢人设置*/
    	kickBottom:false,
    	kick:false,
    	kickMessage:false,
    	kickNickname:false,
    	kickCode:false,
    	kickCard:false,
    	kickURL:false,
    	kickVideo:false,
    	kickNotice:"",
    	harassMessage:false,
    	messageNum:1,
    	harassString:false,
    	stringNum:1,
    	harassTime:false,
    	timeNum:1,
    	branchesNum:1,
    	welcomeBottom:false,
    	welcome:false,/*欢迎语显示*/
    	addWelcome:[],/*欢迎语数据*/
    	wordType:null/*判断添加文字弹窗类型*/
    }
  },
  methods:{
  	/*踢人设置显示隐藏*/
  	kickChange(){
  		if(this.kick){
  			this.kickBottom=true;
  		}else{
  			this.kickBottom=false;
  		}
  	},
  	/*欢迎语显示隐藏*/
  	welcomeChange(){
  		if(this.welcome){
  			this.welcomeBottom=true;
  		}else{
  			this.welcomeBottom=false;
  		}
  	},
  	/*黑名单选择框事件*/
  	blaceSelectionChange(selection){
  		this.balceSelectdata=selection.map(function(item){
  			return item.index;
  		});
  	},
  	/*白名单选择框事件*/
  	whiteSelectionChange(selection){
  		this.whiteSelectdata=selection.map(function(item){
  			return item.index;
  		});
  	},
  	/*删除新人欢迎语*/
  	deleteWelcome(index){
  		this.addWelcome.splice(index,1);
  	},
  	/*确认新增文字*/
  	affirmAddword(){
  		let textarea=[];
  		let content="";
  		if(this.wordType==0){
  			this.kickNotice=this.wangEditor.txt.html();
  			this.clear();
  		}else{
  			textarea=this.wangEditor.txt.getJSON();
  			for(let i=0;i<textarea.length;i++){
  				for(let j=0;j<textarea[i].children.length;j++){
  					if(textarea[i].children[j].tag=="img"){
  					    content+='<img src="/src/assets/qqface/'+textarea[i].children[j].attrs[1].value+'.png"/>';
	  				}
	  				else if(!textarea[i].children[j].tag){
	  					content+=textarea[i].children[j];
	  				}
  				}
  			}
  			if(this.wangEditor.txt.html()!="<p><br></p>"){
  				this.addWelcome.push(content);
  			}
  			this.clear();
  			this.wangEditor.txt.html('');
  		}
  	},
  	/*新增文字*/
  	setword(item){
  	this.mask=true;
  	this.addWord=true;
  	this.wordType=item;
  	if(item==1){
  		this.wangEditor.txt.html('');
  	}else{
  		this.wangEditor.txt.html(this.kickNotice);
  	}
  	},
  	/*清空数据*/
  	clearData(){
		this.kick=false;
		this.kickMessage=false;
		this.kickNickname=false;
		this.kickCode=false;
		this.kickCard=false;
		this.kickURL=false;
		this.kickVideo=false;
		this.harassMessage=false;
		this.messageNum=0;
		this.harassString=false;
		this.stringNum=0;
		this.timeNum=0;
		this.branchesNum=0;
		this.kickNotice="";
		this.welcome=false;
		this.addWelcome=[];
		this.addWelcome=[];
		this.setmessageTextarea="";
		this.setnicknameTextarea="";
		this.whiteSelectdata=[];
		this.balceSelectdata=[];
		this.$refs.whiteTable.clearSelection();
		this.$refs.blaceTable.clearSelection();
  	},
  	//确认新增配置
  	affirmAdd(){
  		
  	},
  	/*清除遮罩*/
  	clear(){
  		this.mask=false;
  		this.setMessage=false;
  		this.addWhitelist=false;
  		this.setNickname=false;
  		this.addWord=false;
  		this.addBlacelist=false;
  	},
  	/*创建富文本编辑器*/
  	createEditor(){
  		this.wangEditor = new editor('#editorHead','#editorText');
  		this.wangEditor.customConfig.menus = [
	        'emoticon'
	    ];
	    this.wangEditor.customConfig.zIndex = 103;
	    this.wangEditor.customConfig.emotions=[
	        {
	            title: '默认',
	            type: 'image',
	            content:face
	        }
        ]
	    this.wangEditor.create();
  	}
  },
  mounted(){
  	this.createEditor();
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#addGroupowner{
	padding: 0 15px 15px;
	overflow-y: auto;
	background-color: #fff;
	height: 100%;
	.notice{
	    padding:15px 15px 15px 25px;
	    /*//background:url("../../assets/img/notice.png") no-repeat  0 center;*/
	    background-size: 16px; 
	    color: #73879c;
	    overflow: hidden;
	    .left{
	    	float: left;
	    	line-height: 32px;
	    }
	    .right{
	    	float: right;
	    }
	}
	.close{
		position: absolute;
		right: 5px;
		top: 5px;
		font-size: 24px;
		cursor: pointer;
	}
	.header{
		line-height: 48px;
		font-size: 14px;
		background-color: #e1ebf4;
		border-radius: 4px;
		padding: 0 10px;
		text-align: center;
	}
	.content{
		line-height: 48px;
		font-size: 12px;
		padding: 0 10px 10px;
		.item{
			text-align: left;
			padding:10px 0 10px 5px;
			span{
				display: block;
				line-height: 12px;
			}
		}
		.list{
		    max-height: 300px;
		    overflow-y: auto;
		    border: 1px solid #eee;

		}
	}
	.button{
		padding: 0 10px;
		text-align: center;
		border-top: 1px #ccc solid;
		.el-button{
			margin-top: 12px;
		}
	}
	.popup{
		z-index: 101;
		position: fixed;
		top: 30%;
		left: 40%;
		width: 400px;
		background-color: #fff;
		padding-bottom:10px; 
		border-radius: 4px;
	}
	.deployContent{
		.part-2{
			padding: 24px;
			border: 1px solid #e9e9e9;
			font-size: 14px;
			color: #606266;
			background: #e1ebf4;
			border-radius: 4px;
		}
		.part-3{
			padding: 10px 0;
			.top{
				height: 48px;
			    line-height: 48px;
			    border: 1px solid #e9e9e9;
			    border-radius: 4px;
			    padding: 0 24px;
			    background: #e1ebf4;
			}
			.bottom{
				padding: 24px;
				h3{
					font-size: 16px;
				}
				.item{
					font-size: 14px;
					padding: 4px 0 4px 55px;
					line-height: 36px;
				}
			}
		}
		.part-6{
			.top{
				height: 48px;
			    line-height: 48px;
			    border: 1px solid #e9e9e9;
			    border-radius: 4px;
			    padding: 0 24px;
			    background: #e1ebf4;
			}
			.bottom{
				max-height: 170px;
				min-height: 80px;
			    border: 1px solid #ccc;
			    box-sizing: content-box;
			    padding: 10px 10px 40px 10px;
			    overflow-y: auto;
			    width: 80%;
			    margin:24px auto;
				.item{
					overflow: hidden;
					line-height: 40px;
					font-size: 14px;
					.itemLeft{
						float: left;
					}
					.itemRight{
						float: right;
					}
				}
			}
			.buttons{
				text-align: right;
				margin-right: 110px;
			}
		}
		.part-4{
			margin: 10px 0;
			.top{
				height: 48px;
			    line-height: 48px;
			    border: 1px solid #e9e9e9;
			    background: #e1ebf4;
			    padding: 0 24px;
			    overflow: hidden;
			    border-radius: 4px;
			    .left{
			    	float: left;
			    	span{
			    		font-size: 14px;
			            color: #606266;
			    	}
			    }
			    .right{
			    	float: right;
			    	font-size: 12px;
                    color: #999;
			    }
			}
		}
		.part-5{
			.top{
				height: 48px;
			    line-height: 48px;
			    border: 1px solid #e9e9e9;
			    padding: 0 24px;
			    overflow: hidden;
			    border-radius: 4px;
			    background: #e1ebf4;
			    .left{
			    	float: left;
			    	span{
			    		font-size: 14px;
			            color: #606266;
			    	}
			    }
			    .right{
			    	float: right;
			    	font-size: 12px;
                    color: #999;
			    }
			}
		}
	}
}
</style>