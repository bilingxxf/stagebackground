<template>
	<div id="groupCode">
	    <div class="addfriendsButton">
	    	<el-button type="success" size="small" @click="mask=true,addAccount=true">添加加粉账号</el-button>
	    </div>
	    <div class="title">
	    	批量添加微信号
	    </div>
	    <div class="upCode">
	    	<span>上传群二维码</span>
	    	<el-upload
			  class="upload-demo"
			  action="https://jsonplaceholder.typicode.com/posts/"
			  :file-list="fileList"
			  >
			  <el-button size="small" type="primary">点击上传</el-button>
			</el-upload>
	    </div>
	    <div class="submit">
	    	<el-button type="success" size="small">确认提交</el-button>
	    </div>
	    <!-- 添加账号 -->
	    <div class="popup" v-if="addAccount">
	    	<span class="close" @click="mask=false,addAccount=false">×</span>
	    	<div class="header">
	    		添加账号
	    	</div>
	    	<div class="content">
	    		<div class="item">
	    			<el-input
	    			  style="width: 240px;"
					  placeholder="输入关键字进行过滤"
					  v-model="filterText">
					</el-input>
					<el-button type="success">搜索</el-button>
	    		</div>
	    		<div class="item">
	    			<table>
	    				<tr>
	    					<td class="td1">
		    					<el-checkbox v-model="checkedAll">全选</el-checkbox>
		    					<span>全部账号</span>
	    					</td>
	    					<td class="td2">
	    					    <span>全部账号</span>
	    					    <el-button type="text" style="color: #ccc;">清空</el-button>
	    					</td>
	    				</tr>
	    				<tr class="teTr">
	    					<td class="td3">
		    					
	    					</td>
	    					<td class="td4">
	    					    
	    					</td>
	    				</tr>
	    			</table>
	    		</div>
	    		<div class="item">
	    			<span>已选账号0个</span>
	    		</div>
	    	</div>
	    	<div class="button">
	    	    <el-button type="success" size="small">确定</el-button>
	    		<el-button size="small" @click="mask=false,addAccount=false">关闭</el-button>
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
    	fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
    	addAccount:false,
    	mask:false,
    	filterText:"",
    	checkedAll:false
      }
  },
  methods:{
  	/*清除遮罩*/
  	clear(){
  		this.mask=false;
  	}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#groupCode{
	padding: 0 15px 15px;
	background-color: #fff;
	.addfriendsButton{
		padding: 15px 20px 0 20px;
		font-size: 14px;
	}
	.popup{
		z-index: 101;
		position: fixed;
		top: 15%;
		left: 40%;
		width: 500px;
		background-color: #fff;
		padding-bottom:10px; 
		border-radius: 4px;
		.item{
			text-align: center;
			table{
				width: 100%;
		        border: solid 1px #ccc;
		        border-collapse:collapse;
		        td{
		        	padding: 5px;
		        	width: 50%;
		        	box-sizing: border-box;
		        	line-height: 30px;
		        	span{
		        		display: inline-block;
		        		padding: 5px;
		        		font-size: 14px;
		        	}
		        }
		        .td1{
		        	text-align: left;
		        	border-bottom:solid 1px #ccc;
		        	border-right:solid 1px #ccc;
		        }
		        .td2{
		        	text-align: right;
		        	border-bottom:solid 1px #ccc;
		        }
		        .td3{
		        	text-align: left;
		        	border-bottom:solid 1px #ccc;
		        	border-right:solid 1px #ccc;
		        	overflow-y: auto;
		        }
		        .td4{
		        	text-align: right;
		        	border-bottom:solid 1px #ccc;
		        }
		        .teTr{
		        	height: 320px;
		        }
			}
			span{
				color: green;
			}
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
	}
	.button{
		padding: 0 10px;
		text-align: center;
		border-top: 1px #ccc solid;
		.el-button{
			margin-top: 12px;
		}
	}
	.title{
		padding: 0 20px;
		height: 45px;
	    line-height: 45px;
	    font-size: 18px;
	    background: #e1ebf4;
	    color: #2a3f54;
	    margin-top: 20px;
	}
	.upCode{
		margin: 20px 0;
		overflow: hidden;
		border:1px solid #ccc;
		padding:10px 20px;
		span{
			font-size: 14px;
			color: #bbb;
			float: left;
			line-height: 28px;
			margin-right: 15px;
		}
		.upload-demo{
			float: left;
		}
	}
	.submit{
		text-align: center;
	}
}
</style>