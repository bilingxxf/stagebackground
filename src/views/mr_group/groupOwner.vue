<template>
	<div id="groupOwner">
		<div class="manage-header">
	     下方仅针对群主账号生效，账号非群主的情况下设置无效。
	    </div>
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
				    suffix-icon="el-icon-search"
				    v-model="inputAccount">
				</el-input>
	    	</div>
	    </div>
	    <div class="p-top-nav">
	    	<div class="title">
	    		群主配置列表
	    	</div>
	    	<div class="nav-list">
	    		<div class="right">
	    			<el-button type="primary" size="small" @click="deleteTemplate">删除模板</el-button>
	    			<el-button type="primary" size="small" @click="addTemplate">添加模板</el-button>
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
			      label="模板名称"
			    >
			    </el-table-column>
			    <el-table-column
			      label="防广告"
			    >
			    </el-table-column>
			    <el-table-column
			      label="防骚扰"
			    >
			    </el-table-column>
			    <el-table-column
			      label="欢迎语"
			    >
			    </el-table-column>
			    <el-table-column
			      label="操作"
			    >
			      <template slot-scope="scope">
			      	<el-button type="text" style="color:green">详情/修改</el-button>
			      	<el-button type="text" style="color:red">删除</el-button>
			      </template>
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
	    <!-- 确认删除 -->
	    <div class="popup" v-if="deleteTem">
	        <span class="close" @click="mask=false,deleteTem=false">×</span>
	    	<div class="header">
	    		提示
	    	</div>
	    	<div class="content">
	    		请确认是否删除模板？
	    	</div>
	    	<div class="bottom">
	    	    <el-button size="small" type="success" @click="affimDelete">确认</el-button>
	    		<el-button size="small" @click="mask=false,deleteTem=false">取消</el-button>
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
    	/*删除模板*/
    	deleteTem:false
    }
  },
  methods:{
  	/*新增模板*/
  	addTemplate(){
  		this.$router.push("mr_addGroupowner");
  	},
  	/*删除模板*/
  	deleteTemplate(){
  		if(this.selection.length<=0){
  			this.$message({
	          message: '请选择操作对象',
	          type: 'warning'
	        });
  		}else{
  			this.deleteTem=true;
  			this.mask=true;
  		}
  	},
  	/*表格头部设置颜色*/
  	getRowClass({ row, column, rowIndex, columnIndex }) {
		if (rowIndex == 0) {
			return 'background:#e1ebf4'
		} else {
			return ''
		}
	},
  	/*确认删除*/
  	affimDelete(){
  		this.deleteTem=false;
  		this.mask=false;
  	},
  	/*清除遮罩*/
  	clear(){
  		this.mask=false;
  		this.deleteTem=false;
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
#groupOwner{
	padding: 0 15px 15px;
	background-color: #fff;
	.manage-header{
	    padding:15px 15px 15px 25px;
	    /*background:url("../../assets/img/notice.png") no-repeat  0 center;*/
	    background-size: 16px; 
	    color: #73879c;
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
		overflow:hidden;
		.form-group{
			float: left;
			span{
				font-size: 14px;
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
		    .right{
		    	float: right;
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