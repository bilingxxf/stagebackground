<template>
	<div id="groupDetails">
	    <div class="navbar-form">
	    	<p>群成员数</p>
	    	<h1>1</h1>
	    </div>
	    <div class="p-top-nav">
	    	<div class="title">
	    		任务明细
	    	</div>
	    	<div class="nav-list">
	    		<div class="left">
	    			<el-button type="primary" size="small" @click="addFriends">添加好友</el-button>
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
			      width="55">
			    </el-table-column>
			    <el-table-column
			      label="微信号"
			    >
			    </el-table-column>
			    <el-table-column
			      label="微信昵称"
			    >
			    </el-table-column>
			</el-table>
			<el-pagination
			  background
			  layout="prev, pager, next"
			  @current-change="handleCurrentChange"
			  :page-size="pageSize"
			  :total="total">
			</el-pagination>
	    </div>
	    <!-- 阴影 -->
	    <div class="mask" v-if="mask" @click="clear">
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
	    		<el-button size="small" @click="mask=false,warning=false">关闭</el-button>
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
    	/*列表*/
    	tableData:[],
    	selection:[],
    	/*阴影*/
    	mask:false,
    	/*提示框*/
    	warning:false
    }
  },
  methods:{
  	/*表格头部设置颜色*/
  	getRowClass({ row, column, rowIndex, columnIndex }) {
		if (rowIndex == 0) {
			return 'background:#e1ebf4'
		} else {
			return ''
		}
	},
  	/*添加好友*/
  	addFriends(){
  		if(this.selection.length<=0){
  			this.mask=true;
  			this.warning=true;
  		}else{
  			
  		}
  	},
  	/*清除遮罩*/
  	clear(){
  		this.mask=false;
  		this.warning=false;
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

  	}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#groupDetails{
	padding: 0 15px 15px;
	background-color: #fff;
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
	}
	.content{
		line-height: 48px;
		font-size: 12px;
		border-bottom: 1px #ccc solid;
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
			margin-top: 12px;
		}
	}
	.navbar-form{
		margin: 8px 0;
		padding: 20px 0 20px 15px;
		p{
			text-align: center;
		}
		h1{
			text-align: center;
		}
	}
	.p-top-nav{
		.title{
			padding: 0 20px;
		    height: 45px;
		    line-height: 45px;
		    font-size: 18px;
		    background: #e1ebf4;
		    color: #2a3f54;
		}
		.nav-list{
			overflow:hidden;
			margin: 8px 0;
			padding: 20px 0 20px 15px;
		    .left{
		    	float: left;
		    }
		}
	}
	.table{
		text-align: center;
		border: 1px solid #eee;
		.el-pagination{
			padding: 5px 0;
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
		top: 30%;
		left: 40%;
		width: 400px;
		text-align: center;
		background-color: #fff;
		padding-bottom:10px; 
	}
}
</style>