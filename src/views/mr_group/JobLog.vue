<template>
	<div id="jobLog">
	    <div class="navbar-form">
	    	<p>次数</p>
	    	<h1>1</h1>
	    </div>
	    <div class="table">
	    	<el-table
			    :data="tableData"
			    style="width: 100%"
			    :header-cell-style="getRowClass"
			>
			    <el-table-column
			      prop="number"
			      label="发言账号"
			    >
			    </el-table-column>
			    <el-table-column
			      prop="number"
			      label="发言群"
			    >
			    </el-table-column>
			    <el-table-column
			      prop="number"
			      label="发言内容"
			    >
			    </el-table-column>
			    <el-table-column
			      prop="number"
			      label="状态"
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
	</div>
</template>
<script>
export default {
  data() {
    return {
    	/*分页*/
    	total:1,
    	pageSize:6,
    	currentPage:1,
    	/*列表*/
    	tableData:[{
    		number:1
    	}],
    	selection:[]
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
#jobLog{
	padding: 0 15px 15px;
	background-color: #fff;
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
	.table{
		text-align: center;
		border: 1px solid #eee;
		.el-pagination{
			padding: 5px 0;
		}
	}
}
</style>