<template>
	<div id="role">
		<!--<div class="search">
			<el-input 
	          placeholder="请输入角色代码(回车搜索)" 
	          v-model="rolecode" 
	          suffix-icon="el-icon-search" 
	          @change="searchByrole()"
	          class="ele-input"></el-input>
	          <el-input 
	          placeholder="请输入角色名称(回车搜索)" 
	          v-model="rolename" 
	          suffix-icon="el-icon-search" 
	          @change="searchByname()"
	          class="ele-input"></el-input>
		</div>-->
		<div class="role-btn">
			<!--<el-button>添加</el-button>-->
			<el-button @click="role_list()">刷新</el-button>
		</div>
		<div class="role-table">
			<el-table
			    :data="roledata"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="role"
			      label="角色代码"
			      width="240">
			    </el-table-column>
			    <el-table-column
			      prop="roleName"
			      label="角色名称"
			      width="240">
			    </el-table-column>
			    <el-table-column
			      prop="remark"
			      label="备注"
			      width="240">
			    </el-table-column>
			    <el-table-column
			      prop="createdTime"
			      label="创建时间"
			      width="240">
			    </el-table-column>
			    <el-table-column
			      prop="updatedTime"
			      label="修改时间"
			      width="240">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      >
			      <template slot-scope="scope">
			        <!--<el-button @click="editHandle(scope.row)" type="text" size="small">编辑</el-button>-->
			        <!--<el-button @click="deleteHandle(scope.row)" type="text" size="small">删除</el-button>-->
			        <el-button @click="bindHandle(scope.row)" type="text" size="small">用户绑定</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
		</div>
		<el-dialog title="编辑角色" :visible.sync="editShow">
		  <el-form :model="form" :rules="rules" ref="ruleForm" >
		    <el-form-item label="角色代码" prop="code" :label-width="formLabelWidth">
		      <el-input v-model="form.code" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="角色名称" prop="name" :label-width="formLabelWidth">
		       <el-input v-model="form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="备注" prop="descript" :label-width="formLabelWidth">
		      <el-input
				  type="textarea"
				  :rows="5"
				  v-model="form.descript" resize="none">
				</el-input>
		    </el-form-item>
		    <el-input
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle">取 消</el-button>
		    <el-button type="primary" @click="editConfirmHandle">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog title="删除" :visible.sync="deleteShow" class="delete-style">
		  <span>确定要删除该条角色？</span>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="cancleHandle">取 消</el-button>
		    <el-button type="primary" @click="delConfirmHandle">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog title="绑定用户列表" :visible.sync="bindShow" @closed="closedHandle">
		  <el-table :data="accountData"
		  	border
		  	>
		    <el-table-column type="index" width="200px" label="序号" ></el-table-column>
		    <el-table-column property="userName" label="用户名"></el-table-column>
		  </el-table>
		  <el-pagination
			  background
			  layout="prev, pager, next"
			  :page-size="pageSize"
			  :total="totalCount"
			  :current-page="currentPage"
			   @size-change="handleSizeChange"
      		   @current-change="handleCurrentChange">
			</el-pagination>
		</el-dialog>
	</div>
</template>

<script>
export default {
  data() {
    return {
      	rolecode: null,
      	rolename: null,
      	roledata: [],
      	accountData: [],
        editShow: false,
        deleteShow: false,
        bindShow: false,
        form: {
        	code: null,
        	name: null,
        	descript: null
        },
        rules: {
        	code: [{ required: true, message: '请输入角色代码', trigger: 'blur' }],
        	name: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
                   { min: 3, max: 5, message: '角色名称不能超过20', trigger: 'blur' }],
            descript:  [{ required: true, message: '请填写备注', trigger: 'blur' }]
        },
        formLabelWidth: '120px',
        roleId: null,
        pageSize: 10,
        totalCount: 0,
        currentPage: 1
    };
  },
  methods: {
  	role_list() {
  		this.$http('/role_module','GET')
  			 .then(res => {
  			 	if(res&&res.data.error_message == 'success') {
  			 		this.roledata = res.data.data
  			 	}
  			 })
  	},
    searchByrole() {
    	console.log('角色代码查询')
    }, // 角色代码查询
    searchByname() {   // 角色名称查询
    	
    },
    editHandle(item) {  // 编辑
    	console.log(item)
    	this.editShow = true
    },
    editConfirmHandle() {
    	
    },
    deleteHandle(item) {  // 删除
    	this.deleteShow = true
    },
    delConfirmHandle() {
    	
    },
    bindHandle(item) {  // 绑定
    	this.bindShow = true
    	this.roleId = item.role
		this.bindConfirmHandle()
    },
    bindConfirmHandle() {
    	this.$http('/role_module','POST', {
			role: this.roleId,
			length: this.pageSize,
			page: this.currentPage
		})
  			 .then(res => {
  			 	if(res&&res.data.error_message == 'success') {
  			 		this.accountData = res.data.data.result
  			 		this.totalCount = res.data.data.totalCount
  			 	}
  			 })
    },
    cancleHandle() {
    	this.editShow = false
    	this.deleteShow = false
    	this.bindShow = false
    },
    closedHandle() {
    	this.pageSize = 10
    	this.currentPage = 1
    },
    handleSizeChange(val) {
    	this.pageSize = val
    	this.bindConfirmHandle()
    },
    handleCurrentChange(val) {
    	this.currentPage = val
    	this.bindConfirmHandle()
    }
  },
  mounted() {
  	this.role_list()
  }
};
</script>

<style>
#role {
	background: #FFFFFF;
	padding: 10px 15px;
}
.role-btn {
	margin: 10px 0 0 0;
}
.role-table {
	margin: 20px 0 0 0;
}
</style>