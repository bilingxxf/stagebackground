<template>
	<div id="groupScene">
	    <div class="sceneTop">
	    	<div class="left">
	    		场景使用方法：
	    	</div>
	    	<div class="right">
	    		提前设好聊天场景，制定每个角色的发言内容，群内启用场景后，可以让群内账号按照设定的内容在群内自动聊天，活跃群内气氛。【群内的账号需开启群才能参与角色分配】
	    	</div>
	    </div>
	    <div class="sceneBottom">
	    	<el-input
	    	    style="width: 240px"
			    placeholder="请输入场景名称"
			    suffix-icon="el-icon-search"
			    v-model="sceneName">
			</el-input>
			<el-button type="success" size="small" @click="addScene">新增场景</el-button>
			<el-button type="success" size="small" @click="$router.push('recordScene')" style="background-color:#fff;color: green;">场景发送记录</el-button>
	    </div>
	    <div class="table">
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
	   <!--  新增场景 -->
	    <div class="popup" v-if="addScenePopup">
	        <span class="close" @click="mask=false,addScenePopup=false">×</span>
	    	<div class="header">
	    		新增场景
	    	</div>
	    	<div class="content">
	    		<div class="item">
	    			<span>场景名称:</span>
	    			<el-input style="width: 240px;" v-model="sceneInput" placeholder="请输入场景名称"></el-input>
	    		</div>
	    		<div class="item">
	    			<span>发言人数:</span>
	    			<el-input style="width: 240px;" v-model="peopleNumber" placeholder="请输入发言人数"></el-input>
	    		</div>
	    	</div>
	    	<div class="bottom">
	    	    <el-button size="small" type="success" @click="addContent">新增后添加内容</el-button>
	    		<el-button size="small" @click="mask=false,addScenePopup=false">取消</el-button>
	    	</div>
	    </div>
	    <!-- 阴影 -->
	    <div class="mask" v-if="mask" @click="clear">
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
    	/*搜索*/
    	sceneName:"",
    	/*表格*/
    	tableData:[],
    	/*阴影*/
    	mask:false,
    	/*新增场景*/
    	addScenePopup:false,
    	sceneInput:"",
    	peopleNumber:0
    }
  },
  methods:{
  	//新增后添加内容
  	addContent(){
  		if(this.sceneInput==""){
  			this.$message({
	          message: '场景名称不能为空',
	          type: 'warning'
	        });
  		}else if(this.peopleNumber<=0){
  			this.$message({
	          message: '发言人数不能小于零',
	          type: 'warning'
	        });
  		}else{
  		this.$router.push({
          path: 'addScene'
        });
        this.$store.commit('sayPeople',{
        	name:this.sceneInput,
        	number:this.peopleNumber
        })
  		}
  	},
  	// 新增场景弹窗
  	addScene(){
  		this.mask=true;
  		this.addScenePopup=true;
  	},
  	/*清除遮罩*/
  	clear(){
  		this.mask=false;
  		this.addScenePopup=false;
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
#groupScene{
	padding: 0 15px 50px;
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
				width: 80px;
			}
			.el-input{
				float: left;
			}

		}
	}
	.bottom{
		.el-button{
			margin-top: 12px;
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
		border-radius: 8px; 
	}
	.sceneTop{
		overflow: hidden;
		padding:20px;
		.left{
			color: #2a3f54;
            font-size: 16px;
            float: left;
		}
		.right{
			color:#bbb;
			font-size: 14px;
			float: left;
		}
	}
	.sceneBottom{
		padding:20px;
		.el-button{
			margin-left: 10px;
		}
	}
	.table{
		text-align: center;
		.el-pagination{
			padding: 5px 0;
		}
	}
}
</style>