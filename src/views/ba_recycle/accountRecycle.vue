<template>
    <div id="accountRecycle">
	    <el-table
	      :data="tableData"
	      style="width: 100%">
	      <el-table-column
	        prop="userName"
	        label="账号"
	      >
	      </el-table-column>
	      <el-table-column
	        prop="createdTime"
	        label="删除时间"
	      >
	      </el-table-column>
	      <el-table-column
	        label="操作">
	        <template slot-scope="scope">
	        	<el-button type="text" @click="recover(scope.$index)">恢复</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
	    <div class="tableBottom">
	        <span>共{{total}}条</span>
			<el-pagination
			  :page-size="pageSize"
			  @current-change="handleCurrentChange"
			  layout="prev, pager, next"
			  :total="total">
			</el-pagination>
		</div>
    </div>
</template>
<script>
export default{
	data(){
		return{
			tableData:[],
			total:0,
			pageSize:6,
			pageNo:1
		}
	},
	methods:{
		handleCurrentChange(val){
			this.pageNo=val;
			this.init();
		},
		recover(index){
			this.$http("account/recover/user","POST",{
				user_name:this.tableData[index].userName
			}).then(
				res=>{
					if(res.data.error_code==0){
						this.$message({
				          message: '恢复成功',
				          type: 'success'
				        });
				        this.init();
					}else{
						this.$message({
				          message: '恢复失败'+res.data.error_message,
				          type: 'error'
				        });
					}
				}
				).catch(
				err=>{
					this.$message({
			          message: '恢复失败'+res.data.error_message,
			          type: 'error'
			        });
				}
				)
		},
		init(){
		  this.$http("account/del_list","GET",{
		  	length:this.pageSize,
			page_no:this.pageNo
		  }).then(
			res=>{
				if(res.data.error_code==0){
					this.tableData=res.data.data;
					this.total=res.data.count;
				}else{
					this.$message({
			          message: '获取列表失败'+res.data.error_message,
			          type: 'error'
			        });
				}
			}
			).catch(
			err=>{
				this.$message({
		          message: '获取列表失败'+res.data.error_message,
		          type: 'error'
		        });
			}
			)
		}
	},
	mounted(){
		this.init();
	}
}
</script>
<style scoped lang="scss">
#accountRecycle{
	width: 100%;
	height: 100%;
	margin-top: 10px;
	box-sizing: border-box;
	.tableBottom{
		background-color: #fff;
		text-align: center;
		padding: 20px 0;
		.el-pagination{
			display: inline-block;
		}
		span{
			color: #303133;
			font-size: 14px;
		}
	}
}
</style>
