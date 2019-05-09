<template>
	<div id="groupScene">
	    <div class="sceneTop">
	    	发送记录中，群名称表示正在发送或已发送成功，出现群名称标记则表示该群发送失败，可能某一个账号的内容未发送成功，该群场景播放已提前终止，请前往群内查看。
	    </div>
	    <div class="table">
	        <h5>场景发送详情</h5>
	    	<el-table
			    :data="tableData"
			    style="width: 100%"
			    :show-header="false"
		    >
			    <el-table-column
			      type="selection"
			      width="55">
			    </el-table-column>
			    <el-table-column
			      label="群名称"
			    >
			      <template slot-scope="scope">
			      	<p>
				      	<span>编号:</span>
				      	<span></span>
			      	</p>
			      	<p>
			      		<span>发言人数:</span>
			      	    <span></span>
			      	</p>
			      	<p>
			      		<span>时长:</span>
			      	    <span></span>
			      	</p>
			      	<p>
			      		<span>不参与随机账号:</span>
			      	    <span></span>
			      	</p>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="number"
			      label="成员数"
			    >
			    </el-table-column>
			    <el-table-column
			      label="操作"
			    >
			      <template slot-scope="scope">
			      	<el-button type="text" style="color:green">编辑内容</el-button>
			      	<el-button type="text" style="color:green">删除</el-button>
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
    	tableData:[]
    }
  },
  methods:{
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
#groupScene{
	padding: 0 15px 50px;
	.sceneTop{
		padding:15px 15px 15px 25px;
	    /*background:url("../../assets/img/notice.png") no-repeat  0 center;*/
	    background-size: 16px; 
	    color: #73879c;
	}
	.table{
		text-align: center;
		h5{
			text-align: left;
			font-size: 18px;
			line-height: 45px;
		}
		.el-pagination{
			padding: 5px 0;
		}
	}
}
</style>