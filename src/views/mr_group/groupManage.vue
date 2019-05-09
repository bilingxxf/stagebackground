<template>
	<div id="groupManage">
		<div class="main_wrapper">
			<div class="manage-header">下方仅展示登录在后台的在线账号，账号下线的情况下不能设置。</div>
	    <div class="navbar-form">
	    	<div class="form-group">
	    	  <span>账号</span>
	    	  <el-select v-model="account" filterable placeholder="请选择">
			    <el-option
			      v-for="item in accounts"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
	    	</div>
	    	<div class="input-group">
	    		<el-input
				    placeholder="请输入账号名称"
				    v-model="inputAccount">
				    <el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
	    	</div>
	    </div>
	    <div class="p-top-nav">
	    	<div class="title">
	    		群列表
	    		<el-button style="float: right;" type="primary" size="small" @click="$router.push('mr_jobLog')">任务日志</el-button>
	    	</div>
	    	<div class="nav-list">
	    		<div class="left">
	    			<el-button type="text">批量操作</el-button>
	    			<el-button type="text" size="small" @click="shieldMessage">屏蔽群消息</el-button>
	    			<el-button type="text" size="small" @click="groupOwner">群主配置</el-button>
	    			<el-button type="text" size="small" @click="quitGroup">退群</el-button>
	    		</div>
	    		<div class="right">
	    			
	    		</div>
	    	</div>
	    </div>
	    <div class="table">
	    	<el-table
			    :data="tableData"
			    style="width: 100%"
			    :header-cell-style="getRowClass"
			    @selection-change="handleSelectionChange">
			    <el-table-column
			      type="selection"
			      width="55"
			       align="center">
			    </el-table-column>
			    <el-table-column
			      label="群名称"
			      align="center"
			      prop="room_name"
			    >
			    </el-table-column>
			    <el-table-column
			      label="群主"
			      align="center"
			      prop="roomUserName">
			    </el-table-column>
			    <el-table-column
			     prop="room_qrcode"
			      label="群二维码"
			      align="center"
			    >
			      <template slot-scope="scope">
			      	<img src=""/>
			      	<span></span>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="memberCount"
			      label="成员数"
			      align="center">
			    </el-table-column>
			    <el-table-column
			    	prop=""
			      label="所属账号"
			      align="center"
			    >
			      <template slot-scope="scope">
			      	<img src=""/>
			      	<span></span>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="number"
			      label="群主配置"
			      align="center"
			    >
			    </el-table-column>
			    <el-table-column
			      label="是否屏蔽群消息"
			      align="center"
			    >
			      <template slot-scope="scope">
			      	<el-button type="text">开启</el-button>
			      	<el-button type="text">关闭</el-button>
			      </template>
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      align="center">
			      <template slot-scope="scope">
			      	<el-button type="text" @click="$router.push('mr_groupDetails')">详情</el-button>
			      	<el-button type="text"  @click="gainCode">退群</el-button>
			      </template>
			    </el-table-column>
			</el-table>
			<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="limit" layout="total, prev, pager, next" :total="total">
			</el-pagination>
	    </div>
	    <!-- 阴影 -->
	    <div class="mask" v-if="mask" @click="clear">
	    </div>
	    <!-- 二维码 -->
	    <div class="code" v-if="code">
	    	<img src=""/>
	    </div>
	    <!-- 提示框 -->
	    <div class="popup" v-if="warning">
	        <span class="close" @click="mask=false,warning=false">×</span>
	    	<div class="header">
	    		提示
	    	</div>
	    	<div class="content">
	    		请选择操作对象
	    	</div>
	    	<div class="bottom">
	    		<el-button type="primary" @click="mask=false,warning=false">关闭</el-button>
	    	</div>
	    </div>
	    <!-- 屏蔽群消息 -->
	    <div class="popup" v-if="shieldGroup">
	        <span class="close" @click="mask=false,shieldGroup=false">×</span>
	    	<div class="header">
	    		批量操作群消息是否屏蔽
	    	</div>
	    	<div class="content">
	    		<span>选择模板:</span>
	    		<el-radio v-model="radio" label="1">开启</el-radio>
                <el-radio v-model="radio" label="2">关闭</el-radio>
	    	</div>
	    	<div class="bottom">
	    	    <el-button size="small"  @click="affimShield">确认</el-button>
	    		<el-button size="small" @click="mask=false,shieldGroup=false">取消</el-button>
	    	</div>
	    </div>
	    <!-- 群主配置 -->
	    <div class="popup" v-if="groupownerDeploy">
	        <span class="close" @click="mask=false,groupownerDeploy=false">×</span>
	    	<div class="header">
	    		机器人模板设置
	    	</div>
	    	<div class="content">
		    	<div class="item">
		    		<span>提示：此选项仅针对群主生效，非群主设置无效。</span>
		    	</div>
		    	<div class="item">
		    		<span>选择模板:</span>
		    		<div class="radios">
		    			<el-radio v-for="(item,index) in radios" :key="index" v-model="deployRadio" :label="item.label" style="display: block;">{{item.name}}</el-radio>
		    		</div>
		    	</div>
	    	</div>
	    	<div class="bottom">
	    	    <el-button size="small" @click="affimDeploy">确认</el-button>
	    		<el-button size="small" @click="mask=false,groupownerDeploy=false">取消</el-button>
	    	</div>
	    </div>
	    <!-- 退群 -->
	    <div class="popup" v-if="exitGroup">
	        <span class="close" @click="mask=false,exitGroup=false">×</span>
	    	<div class="header">
	    		提示
	    	</div>
	    	<div class="content">
	    		请确认是否执行批量退群？
	    	</div>
	    	<div class="bottom">
	    	    <el-button size="small" @click="affimExit">确认</el-button>
	    		<el-button size="small" @click="mask=false,exitGroup=false">取消</el-button>
	    	</div>
	    </div>
		</div>
		
	</div>
</template>
<script>
export default {
  data() {
    return {
    	/*分页*/
    	total:0,
    	pageSize:6,
    	currentPage:1,
    	/*搜索条件*/
    	account:"",
    	accounts:[],
    	inputAccount:"",
    	/*列表*/
    	tableData:[],
    	selection:[],
    	/*阴影*/
    	mask:false,
    	/*二维码*/
    	code:false,
    	/*提示框*/
    	warning:false,
    	/*屏蔽群消息弹窗*/
    	shieldGroup:false,
    	/*单选框*/
    	radio:"1",
    	/*群主配置弹窗*/
    	groupownerDeploy:false,
    	radios:[
    	{
    		label:1,
    		name:"不设置任何模板"
    	},
    	{
    		label:2,
    		name:"模板一"
    	}
    	,
    	{
    		label:3,
    		name:"模板二"
    	}
    	,
    	{
    		label:4,
    		name:"模板三"
    	}
    	,
    	{
    		label:5,
    		name:"模板四"
    	}
    	],
    	deployRadio:1,
    	/*退群*/
    	exitGroup:false,
    	page:1,
    	limit:10
    }
  },
  mounted(){
  	this.init();
  },
  methods:{
  	/*表格头部设置颜色*/
  	getRowClass({ row, column, rowIndex, columnIndex }) {
		if (rowIndex == 0) {
			return 'background:#ecf5ff;color:#57aaff;font-size:14px';
		} else {
			return ''
		}
	},
  	/*确认退群*/
  	affimExit(){

  	},
  	/*退群弹窗*/
  	quitGroup(){
  		if(this.selection.length<=0){
  			this.mask=true;
  			this.warning=true;
  		}else{
  			this.mask=true;
  			this.exitGroup=true;
  		}
  	},
  	/*确认群主配置*/
  	affimDeploy(){

  	},
  	/*群主配置弹窗*/
  	groupOwner(){
  		if(this.selection.length<=0){
  			this.mask=true;
  			this.warning=true;
  		}else{
  			this.mask=true;
  			this.groupownerDeploy=true;
  		}
  	},
  	/*确认屏蔽消息*/
  	affimShield(){

  	},
  	/*屏蔽群消息弹窗*/
  	shieldMessage(){
  		if(this.selection.length<=0){
  			this.mask=true;
  			this.warning=true;
  		}else{
  			this.mask=true;
  			this.shieldGroup=true;
  		}
  	},
  	/*清除遮罩*/
  	clear(){
  		this.mask=false;
  		this.code=false;
  		this.warning=false;
  		this.shieldGroup=false;
  		this.groupownerDeploy=false;
  	},
  	/*获取二维码*/
  	gainCode(){
  		this.mask=true;
  		this.code=true;
  	},
  	/*表格多选事件*/
  	handleSelectionChange(selection){
  		this.selection=selection;
  	},
  	/*分页*/
  	handleCurrentChange(val){
  		this.currentPage=val;
  		this.init();
  	},
  	/*初始化表格*/
  	init(){
		this.$http('chat_room','POST',{
			page:this.currentPage,
			limit:this.limit
		}).then(res=>{
			if(res.data.error_code==0){
				this.tableData = res.data.data;
				this.total = res.data.count;
			}
		}).catch(err=>{
			this.$message({
                message: '获取数据失败',
                type: "error"
          	});
		})
  	}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#groupManage{
	background: #e8eff6;
	padding: 20px 5%;
	.main_wrapper{
		background: #fff;
		padding: 50px 30px;
	}
	.manage-header{
		margin-bottom: 20px;
	   font-size: 14px; 
	    color: #e0e0e0;
	}
	.close{
		position: absolute;
		right: 15px;
		top: 8px;
		color: #fff;
		font-size: 24px;
		cursor: pointer;
	}
	.header{
		line-height: 48px;
		font-size: 16px;
		color: #fff;
		background-color: #409eff;
	}
	.content{
		color: #707070;
		padding: 30px 0 20px;
		line-height: 48px;
		font-size: 12px;
		.item{
			text-align: left;
			padding:10px 0 10px 5px;
			overflow: hidden;
			span{
				display: block;
				float: left;
				line-height: 12px;
			}
			.radios{
				float: left;
				margin-left: 10px;
				.el-radios{
					display: block;
				}
			}

		}
	}
	.bottom{
		.el-button{
			width: 90px;
			height: 30px;
			margin-bottom: 20px;
			font-size: 12px;
			line-height: 0px;
		}
	}
	.navbar-form{
		overflow:hidden;
		.form-group{
			float: left;
			margin-bottom:50px;
			.el-select{
				width: 100px;
				margin-right: 20px;
			}
			span{
				font-size: 14px;
				margin-right: 20px;
			}
		}
		.input-group{
			float: left;
			width: 240px;
			margin-left: 5px;
		}
	}
	.p-top-nav{
		.title{
			margin-bottom: 40px;;
		    font-size: 18px;
		    color: #2a3f54;
		}
		.nav-list{
			overflow:hidden;
		    .left{
		    	float: left;
		    }
		    .right{
		    	float: right;
		    }
		}
	}
	.table{
		margin: 30px 140px 0;
		text-align: center;
		.el-pagination{
			padding: 20px 0 0;
			margin-bottom: 240px;
		}
	}
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.4);
		z-index: 100;
	}
	.code{
		z-index: 101;
		position: fixed;
		top: 20%;
		left: 40%;
		width: 400px;
		height: 400px;
		img{
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	.popup{
		z-index: 101;
		position: fixed;
		top: 40%;
		left: 40%;
		width: 600px;
		text-align: center;
		background-color: #fff;
		padding-bottom:10px; 
	}
}
</style>