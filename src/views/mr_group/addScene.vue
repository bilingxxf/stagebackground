<template>
	<div id="addScene">
	  <div class="part-1">
	  	<div class="top">
	  		场景信息
	  	</div>
	  	<div class="bottom">
	  		<div class="item">
	  			<p>场景名称:{{sceneName}}</p>
	  			<p>时 长:{{sceneTime}}</p>
	  		</div>
	  		<div class="item">
	  			<p>
	  			配置发言人数:{{deployNumber}}名
	  			<span>( {{deployBoy}}男，{{deployWoman}}女，{{deployLimit}}不限制 )</span>
	  			<el-button type="text" icon="el-icon-edit" style="color: green;" @click="changeSpokesman=true,mask=true">修改</el-button>
	  			</p>
	  			<p>不参与随机账号:
		  			<el-select v-model="randomAccount" multiple placeholder="请选择账号">
					  <el-option
					      v-for="item in randomAccounts"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
					<span>已选{{selectNamber}}名</span>
				</p>
	  		</div>
	  		<div class="item">
	  			<p>实际发言人数:{{realityNamber}}名</p>
	  		</div>
	  	</div>
	  </div>
	  <div class="part-2">
	  	<div class="top">
	  		发言内容
	  		<span>( 场景内容为空的情况下才能设置收藏内容 )</span>
	  	</div>
	  	<div class="bottom">
	  		<div class="addcontentButton">
	  			<el-button icon="el-icon-plus" @click="mask=true,addcontentPopup=true">添加发言内容</el-button>
	  		</div>
	  		<div class="content">
	  			<div class="item" v-for="(item,index) in sayContents" :key="index">
	  				<div class="left">
	  					<div class="number">
	  						{{index}}
	  					</div>
	  					<div class="head">
	  						<img :src="item.img"/>
	  					</div>
	  					<div class="matter">
	  						<div class="matterTop">
	  							<b class="teB">间隔时间:{{item.time}}</b>
	  							<b>{{item.people}}({{item.identity}})</b>
	  						</div>
	  						<div class="matterBottom">
	  							{{item.content}}
	  						</div>
	  					</div>
	  				</div>
	  				<div class="right">
	  					<el-button type="text" style="color: green;" @click="addcontentPopup=true,mask=true">编辑</el-button>
	  					<el-button type="text" style="color: green;">删除</el-button>
	  				</div>
	  			</div>
	  		</div>
	  		<div class="submitButton">
	  			<el-button type="success">提交</el-button>
	  		</div>
	  	</div>
	  </div>
	  <!-- 添加内容弹窗 -->
	  <div class="popup" v-show="addcontentPopup">
        <span class="close" @click="mask=false,addcontentPopup=false">×</span>
    	<div class="header">
    		添加发言内容
    	</div>
    	<div class="content">
    		<div class="item">
    			<span>发言人:</span>
    			<el-select v-model="sayPeople" placeholder="请选择发言人">
				    <el-option
				      v-for="item in sayPeoples"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
    		</div>
    		<div class="item">
    			<span>上条消息间隔时长:</span>
    			<el-input style="width: 200px;" v-model="messageTime" placeholder="请输入消息间隔时长"></el-input>
    		</div>
    		<div class="item">
    			<span>发送内容:</span>
    			<div class="editor">
    				<div class="top">
    					<el-button size="mini" @click="editorShow=true,uploadImage=false,uploadVoice=false" 
    					icon="el-icon-edit" type="text" :class="editorShow?active:''" style="color: #73879c;">文字</el-button>
    					<el-button size="mini" @click="editorShow=false,uploadImage=true,uploadVoice=false" 
    					icon="el-icon-picture-outline" :class="uploadImage?active:''" type="text" style="color: #73879c;">图片</el-button>
    					<el-button size="mini" @click="editorShow=false,uploadImage=false,uploadVoice=true" 
    					icon="el-icon-phone-outline" :class="uploadVoice?active:''" type="text" style="color: #73879c;">语音</el-button>
    				</div>
    				<div class="bottom">
    					<div class="wangEditor" v-show="editorShow">
    						<div id="editorHead" class="toolbar" style="height: 30px;line-height:20px;background-color: #eee;">
						    </div>
						    <div id="editorText" class="text" style="height: 200px;">
						    </div>
    					</div>
    					<div class="uploadImage" v-show="uploadImage">
    						<el-upload
							  class="upload-demo"
							  action="https://jsonplaceholder.typicode.com/posts/"
							>
							<el-button size="small" type="primary">点击上传</el-button>
							</el-upload>
    					</div>
    					<div class="uploadVoice" v-show="uploadVoice">
    						<el-upload
							  class="upload-demo"
							  action="https://jsonplaceholder.typicode.com/posts/"
							>
							<el-button size="small" type="primary">点击上传</el-button>
							</el-upload>
    					</div>
    				</div>
    			</div>
    		</div>
    	</div>
    	<div class="button">
    	    <el-button size="small" type="success">确定</el-button>
    		<el-button size="small" @click="mask=false,addcontentPopup=false">取消</el-button>
    	</div>
      </div>
      <!-- 修改发言人弹窗 -->
      <div class="popup" v-if="changeSpokesman">
      	<span class="close" @click="mask=false,changeSpokesman=false">×</span>
    	<div class="header">
    		修改发言人
    	</div>
    	<div class="content">
    	<div class="item">
    	 	<div v-for="(item,index) in spokesman" :key="index">
    	 		<span>{{item.name}}</span>
    	 		<el-select v-model="item.sex">
				    <el-option
				      v-for="item in changeMans"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
    	 	</div>
    	</div>
    	<div class="item">
    	 	<el-button icon="el-icon-plus" type="success">添加发言人</el-button>
    	</div>
    	</div>
    	<div class="button">
    	    <el-button size="small" type="success">确定</el-button>
    		<el-button size="small" @click="mask=false,changeSpokesman=false">取消</el-button>
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
    	sceneName:"",
    	sceneTime:"00:00:00",
    	deployNumber:0,
    	randomAccount:[],
    	randomAccounts:[],
    	realityNamber:0,
    	deployBoy:0,
    	deployWoman:0,
    	deployLimit:0,
    	selectNamber:0,
    	mask:false,
    	addcontentPopup:false,
    	sayPeople:"",
    	sayPeoples:[],
    	messageTime:"",
    	editorShow:true,
    	uploadVoice:false,
    	uploadImage:false,
    	wangEditor:{},
    	active:"active",
    	sayContents:[
    	{
    		img:"",
    		time:5,
    		people:"发言一号",
    		identity:"男",
    		content:"你好"
    	},
    	{
    		img:"",
    		time:5,
    		people:"发言二号",
    		identity:"男",
    		content:"你好啊"
    	}
    	],
    	changeSpokesman:false,
    	spokesman:[],
    	changeMans:[
    	{
    		label:"男",
    		value:0
    	},
    	{
    		label:"女",
    		value:1
    	},
    	{
    		label:"不限制",
    		value:2
    	}
    	]
    }
  },
  methods:{
  	/*清除遮罩*/
  	clear(){
  		this.mask=false;
  		this.addcontentPopup=false;
  		this.changeSpokesman=false;
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
  	this.sceneName=this.$store.state.sayPeople.name;
  	this.deployNumber=this.$store.state.sayPeople.number;
  	this.deployLimit=this.$store.state.sayPeople.number;
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#addScene{
	padding: 0 15px 50px;
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.4);
		z-index: 100;
	}
	.active{
		border-bottom: solid 3px #1ABB9C !important;
		border-radius: 0 !important;
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
		border-radius: 8px 8px 0 0; 
	}
	.content{
		line-height: 48px;
		font-size: 14px;
		border-bottom: 1px #ccc solid;
		padding:20px;
		.item{
			text-align: left;
			padding:10px 0 10px 5px;
			overflow: hidden;
			span{
				display: block;
				float: left;
				width: 120px;
			}
			.el-input{
				float: left;
			}
			.editor{
				float: left;
				border:1px solid #ccc;
				min-height: 100px;
				width: 320px;
				border-radius: 4px;
				.top{
					line-height: 30px;
					border-bottom: 1px solid #eee;
					box-sizing: border-box;
				}
				.bottom{
				}
			}

		}
	}
	.button{
		.el-button{
			margin-top: 12px;
		}
	}
	.popup{
		z-index: 101;
		position: fixed;
		top: 30%;
		left: 40%;
		width: 500px;
		text-align: center;
		background-color: #fff;
		padding-bottom:10px;
		border-radius: 8px; 
	}
	.part-1{
		.top{
			color: #2a3f54;
			padding: 0 20px;
		    line-height: 45px;
		    font-size: 18px;
		    background: #e1ebf4;
		}
	    .bottom{
	    	margin: 15px;
	    	.item{
	    		overflow: hidden;
	    		p{
	    			width: 50%;
	    			float: left;
	    			line-height: 30px;
	    			span{
	    				color: green;
	    			}
	    		}
	    	}
	    }
	}
	.part-2{
		.top{
			color: #2a3f54;
			padding: 0 20px;
		    line-height: 45px;
		    font-size: 18px;
		    background: #e1ebf4;
		    span{
		    	font-size: 14px;
		    }
		}
	    .bottom{
	    	padding: 25px 0;
            text-align: center;
            .content{
            	margin:10px 0;
            	min-height: 100px;
            	.item{
            		overflow: hidden;
            		.left{
            			float: left;
            			overflow: hidden;
            			.number{
            				float: left;
            				width: 20px;
            				height: 20px;
            				border-radius: 50%;
            				border:1px #000 solid;
            				line-height: 20px;
            				text-align: center;
            				margin-right: 10px;
            			}
            			.head{
            				float: left;
            				height: 40px;
            				width: 40px;
            				margin-right: 10px;
            				img{
            					display: block;
            					width: 100%;
            					height: 100%;
            				}
            			}
            			.matter{
            				float: left;
            				.matterTop{
            					margin-bottom:7px;
            					overflow: hidden;
            					line-height: 20px;
            					.teB{
            						color:green;
            					}
            					b{
            						font-weight: 100;
            					}
            				}
            				.matterBottom{
            					background-color: #eef1ef;
            					padding: 8px 10px;
            					line-height: 20px;
            					border-radius: 4px;
            				}
            			}
            		}
            		.right{
            			float: right;
            		}
            	}
            }
	    }
	}
}
</style>