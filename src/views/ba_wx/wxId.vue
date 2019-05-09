<template>
    <div id="wid" class="main-body">
      <div class="main-wrapper">
      	<span class="export" @click="exportHandle">导出数据</span>
      	<div class="wid-title"> 查询微信ID </div>
          <div class="wid-content">
          	<div class="wid-left">
          		<span>手机号码：</span>
				<el-input type="textarea" onkeyup="value=value.replace(/[^\d\s]/g,'')"  v-model="phone" placeholder="请输入手机号,系统自动按换行分割"></el-input>
          	</div>
          	<div class="wid-center"><el-button type="primary" @click="getList" icon="el-icon-d-arrow-right" size="mini"></el-button></div>
          	<div class="wid-right">
          		<template>
				  <el-table
				    :data="data"
				    style="100%"
				    tooltip-effect="dark"
				    height="460px"
				    >
				    <el-table-column
				      type="index"
				      label="序号"
				      width="70">
				    </el-table-column>
				    <el-table-column
				      label="手机号码"
				     >
				      <template slot-scope="scope">{{ scope.row.phone }}</template>
				    </el-table-column>
				    <el-table-column
				      label="微信ID"
				      >
				      <template slot-scope="scope">{{ scope.row.wxUsername }}</template>
				    </el-table-column>
				    <el-table-column
				      label="微信号"
				     >
				      <template slot-scope="scope">{{ scope.row.alias }}</template>
				    </el-table-column>
				  </el-table>
				</template>
				<div class="total-line" v-if="data.length>0">共<span class="special">{{ data.length }}</span>条记录</div>
          	</div>
          </div>
      </div> 
    </div>
</template>
<script>
import { downloadXLS } from '../../utils/down'
import outputXlsxInArray from '@/assets/js/excel'
const validatePhone = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入手机号码'));
    } else {
      callback();
    }
};
const regphone=/^\d{11}$/;
export default {
  data() {
    return {
        phone: '',
        data:  [],
    };
  },
  methods: {
  	exportHandle() {
		let arrayArr = this.data
  		arrayArr = arrayArr.map((v, i) => {
  			const obj = {}
  			obj.phone = v.phone
  			obj.wxUsername = v.wxUsername
  			obj.alias = v.alias
  			return obj
  		})
		var newdata = [];
		for(var i in arrayArr) {
	        newdata[i] = [];
	        for(var j in arrayArr[i]) {
	            newdata[i].push(arrayArr[i][j]);
	        }
	   }
		if(!!newdata.length) {
			outputXlsxInArray({
		       xslx: '微信报表',
		       SheetNames: ['报表'],
		       Sheets: [{
		         headers: ['手机号码', '微信ID', '微信号'],
		         data: newdata,
		         config: {'!cols': [{wch: 20}, {wch: 25},{wch: 25}]} 
		       }]
		    })
		}else {
			this.$message.error('无数据，不支持下载报表')
		}
		
  	},
  	getList() {
  		if(!this.phone) {
  			this.$message.error('请输入手机号码')
		}
  		let arrph = this.phone.trim().split(/[(\r\n)\r\n]+/)
  		let quarr = [] 
  		arrph = arrph.forEach((v ,i) => {
  			if(!regphone.test(v)) {
//				this.$message.error('电话号码有误')
  			}else {
  				quarr.push(v)
  			}
  		})
  		if(quarr.length>200){
  			this.$message.error('系统限制一次性最多查询200，请重新修改')
  			return
  		}
  		if(!!quarr) {
  			this.$http('query_wxuser_phone', 'POST', new Set(quarr) )
  			.then(res => {
  				if(res.data.error_message == '成功') {
  					this.data = res.data.data
  				}
  			})
  		}else{
  			this.$message.error('电话号码有误，请检查')
  		}
   }
  },
  mounted() { 
    	 
  }
};
</script>
<style scoped lang="scss" scoped>
.main-body {
	padding: 100px 18% !important;
	.main-wrapper {
		padding: 40px !important;
		.export {
			float: right;
			display: inline-block;
	        width: 96px;
	        height: 32px;
	        background: #409EFF;
	        color: #FFFFFF;
	        border-radius: 4px;
	        text-align: center;
	        line-height: 32px;
	        cursor: pointer;
	        margin: 20px 0px 0 0;
			}
		.wid-title {
			padding-bottom: 22px;
			font-size: 20px;
			color: #1e2630;
		}
		.wid-content {
			height: 500px;
			color: #1e2630;
			display: flex;
			flex-direction: row;
			.wid-left {
				width: 23%;
			}
			.wid-center {
				width: 8%;
				text-align: center;
				height: 460px;
				line-height: 460px;
				margin-top: 28px;
				.el-button--primary {
					color: #409EFF;
					background: #FFFFFF;
					border: none;
					font-size: 24px;
				}
			}
			.wid-right {
				width: 71%;
				.total-line {
				    font-size: 12px;
				    .special {
				    	color: #409EEF;
				    	padding: 0 3px;
				    	font-weight: 700;
				    }
				}
			}
		}
	}
}

</style>