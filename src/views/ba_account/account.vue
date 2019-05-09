<template>
  <div id="account" class="main-body role-bind">
    <div class="addAccount">
      <h3 class="page-title">用户管理</h3>
      <ul class="add">
        <li class="left">
          <el-select v-model="accountLimited" placeholder="请选择角色权限" class="ele-select">
            <el-option v-for="item in accountLimiteds" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li class="left">
          <el-input placeholder="请输入账号" v-model="account" @keyup.enter.native="addAccount" class="ele-input"></el-input>
          <span style="color:#a8a8a8">*账户由英文和数字组合而成</span>
        </li>
        <li class="left">
          <el-button type="primary" class="ele-btn" @click="addAccount">
            <i class="el-icon-plus">添加用户</i>
          </el-button>
        </li>
        <li class="right">
          <el-button type="primary" class="ele-btn" @click="getAaccessKey">获取Key</el-button>
        </li>
      </ul>
    </div>
    <div class="accountTable">
      <h3 class="page-title">用户列表</h3>
      <div class="table">
        <div class="tableTop">
            <el-input
					    placeholder="请输入账号名称(回车搜索)"
              suffix-icon="el-icon-search"
					    v-model="username"
					    @change="searchInit()"
              class="ele-input"
              style="font-size:12px"
              >
					</el-input>
          <el-date-picker
              :unlink-panels=true
              value-format="yyyy-MM-dd"
              v-model="time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              @change="getSelectInfo"
              end-placeholder="结束日期"
              class="ele-input">
          </el-date-picker>
        </div>
        <!-- 批量编辑 -->
        <div class="tableMid">
          <span> 批量操作：</span>
          <span @click="batchEditor" class="item">编辑</span>
          <span @click="batchBind" class="item">权限绑定</span>
        </div>
        <div class="tableContent">
          <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          class="ele-table-init">
            <el-table-column
            type="selection"
            width="30">
            </el-table-column>
            <el-table-column prop="user_name" label="账号" align="left">
            </el-table-column>
            <el-table-column prop="user_id" label="用户ID" width="100" align="left">
            </el-table-column>
            <el-table-column prop="parentUserId" label="所属主账号名称（ID）" align="left">
            </el-table-column>
            <el-table-column prop="created_time" label="生成时间" align="left">
            </el-table-column>
            <el-table-column prop="user_role" label="角色权限" width="100px" align="left">
            </el-table-column>
            <el-table-column label="操作" align="right" width="450">
              <template slot-scope="scope">
                <!-- <a :href='downPublicUrl+"api/v1/wx_contact/contact_list?userId="+scope.row.user_id+"&token=" + token'>
                  <el-button type="text" size="mini">联系人报表</el-button>
                </a>
                <a :href='downPublicUrl+"api/v1/chatroom/chatroom_friends?userId="+scope.row.user_id+"&token=" + token'>
                  <el-button type="text" size="mini">群报表</el-button>
                </a> -->
                <a v-if="scope.row.containModule" class="micro-marking" :href="loginUrl+'?' + scope.row.user_name+'&'+encodeURIComponent(encryptUserId)"   target="_blank">微营销</a>
                <el-button type="text" class="button1" @click="getInfo(scope.$index,scope.row)">编辑</el-button>
                <el-button type="text" class="button1" @click="resetpas(scope.$index)">重置密码</el-button>
                <el-button v-if="false" type="text" class="button1" @click="setSecondPwd(scope.row)">二级密码</el-button>
                <el-button type="text" class="button1" @click="recharge(scope.$index,scope.row)">充值</el-button>
                <el-button type="text" class="button1" @click="capitalRecord(scope.$index,scope.row)">资金记录</el-button>
                <el-button type="text" v-if="false" class="button1" @click="bindRole(scope.$index,scope.row)">绑定角色</el-button>
                <el-button type="text" class="button1" @click="premissionBind(scope.$index,scope.row)">权限绑定</el-button>
                <el-button type="text" class="button1" @click="delAccount(scope.$index,scope.row)">删除</el-button>
                <el-button v-if="scope.row.role.indexOf('ROLE_SUBUSER')==-1" type="text" class="button1" @click="showChildAccount(scope)">添加子账号</el-button>
                <!-- <el-button type="text" class="button2" v-if="scope.row.ban_state==1" @click="deblocking(scope.$index)">解封</el-button>
                <el-button type="text" @click="deleteAccount(scope.$index)">删除</el-button> -->
              </template>
            </el-table-column>
            <el-table-column
			     width="30">
			    </el-table-column>
          </el-table>
        </div>
        <!-- 分页管理 -->
        <div class="tableBottom">
          <el-pagination
            @size-change="handleSizeChange"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        title="用户充值"
        :visible.sync="rechargeDialogVisible"
        width="28%"
        :before-close="handlerclose">
        <div class="user_name_box">
            <em>用户名</em> <p>{{dialogName}}</p>
        </div>
        <div class="fee_box">
            <em>充值金额</em> <el-input v-model="fee" class="fee_input" placeholder="请输入充值金额" @keyup.native="proving"></el-input><span>元</span>
        </div>
        <div class="remark_box">
            <em>备注</em>
            <el-input
              type="textarea"
              :rows="3"
              resize="none"
              placeholder="备注信息"
              maxlength="50"
              class="textarea"
              v-model="remarks">
            </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rechargeDialogVisible = false,fee='', remarks=''">取 消</el-button>
          <el-button type="primary" @click="submitRecharge">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="key"
        :visible.sync="keyDialogVisible"
        width="30%"
        :before-close="handleClose">
        <span class="key_content">{{key}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button v-clipboard:success="copyKey" v-clipboard:copy="key" type="primary" v-clipboard:error="onError">复 制</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="编辑"
        :visible.sync="editDialog"
        width="600px">
        <div class="edit-form">
          <el-form :model="editInfo" label-width="100px">
            <el-form-item  label="模板名称">
            <el-select v-model="editorName" @change="selectedTemplate" placeholder="请选择模板名称">
              <el-option v-for="item in selectTemplateName" :label="item.hostTemplateName" :key="item.templateId" :value="item.templateId"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="HOST">
              <el-input v-model="editInfo.host" placeholder="请填写HOST地址"></el-input>
            </el-form-item>
            <el-form-item label="PORT">
              <el-input v-model="editInfo.port" placeholder="请填写端口号（2-5位整数）"></el-input>
            </el-form-item>
            <el-form-item label="账号">
              <el-input v-model="editInfo.hostUserName" placeholder="请填写账号"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="editInfo.hostPassword" placeholder="请填写密码" ></el-input>
            </el-form-item>
            <el-form-item label="心跳（秒）">
              <el-input v-model="editInfo.heartbeat" placeholder="请填写心跳（秒）"></el-input>
            </el-form-item>
            <el-form-item label="聊天转发服务"></el-form-item>
            <el-form-item label="HOST">
              <el-input v-model="editInfo.forwardHost" placeholder="请填写HOST地址"></el-input>
            </el-form-item>
            <el-form-item label="PORT">
              <el-input v-model="editInfo.forwardPort" placeholder="请填写端口号（2-5位整数）"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="checkUpForm">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <!-- 用户绑定 -->
      <el-dialog
        :close-on-click-modal="false"
        class="user-bind"
        title="角色绑定"
        width="690px"
        :visible.sync="roleBindVisiable">
          <el-table :data="gridDataList.data" v-loading="loading"  element-loading-text="拼命加载中">
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column property="role" label="角色代码" width="150"></el-table-column>
            <el-table-column property="roleName" label="角色名称" width="200"></el-table-column>
            <el-table-column property="" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small">/</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-dialog>
      <!-- 权限绑定 -->
      <el-dialog
        :close-on-click-modal="false"
        class="user-bind premiss-bind"
        title="角色绑定"
        width="690px"
        :visible.sync="premissBindVisibile">
          <div class="tree-list">
            <el-tree
              :data="dataList.data"
              show-checkbox
              default-expand-all
              node-key="moduleId"
              @check-change="selectNode"
              :default-checked-keys="defaultCheckKeys"
              :props="defaultProps">
            </el-tree>
          </div>
          <el-button @click="permissToSave">保存</el-button>
      </el-dialog>
      <!-- 添加子账号 -->
      <el-dialog title="添加子账号" :visible.sync="dialogFormVisible" :close-on-click-modal="false" class="create-accounr"   width="580px">
       	<el-form ref="form" class="account" :model="addForm" label-width="125px" style="padding:0 0px;">
          <el-form-item style="width: 100%;" label="账号: ">
            <el-input v-model="addForm.userName" class="ele-input" placeholder="请输入账号"></el-input>
            <span>+</span>
            <el-input v-model="addForm.startingValue" maxlength="6" class="ele-input start-value" @keyup.native="number('startingValue')" placeholder="请输入账号起始值"></el-input>
          </el-form-item>
          <el-form-item class="input-width" label="数量: ">
            <el-input v-model="addForm.count" class="ele-input" @keyup.native="number('count')" placeholder="请输入账号数量"></el-input>
          </el-form-item>
          <!-- <el-form-item label="序号长度: ">
            <el-input v-model="addForm.numberLength" class="ele-input" @keyup.native="number('numberLength')" placeholder="请输入序号长度"></el-input>
          </el-form-item>
          <el-form-item label="序号起始值: ">
            <el-input v-model="addForm.startingValue" class="ele-input" @keyup.native="number('startingValue')" placeholder="请输入账号起始值"></el-input>
          </el-form-item> -->
				<el-form-item class="input-width" label="新密码: ">
					<el-input auto-complete="new-password" v-model="addForm.password" type="password"  class="ele-input" placeholder="请输入新密码"></el-input>
				</el-form-item>
				<el-form-item class="input-width" label="确认密码: " style="margin-bottom:0!important">
					<el-input v-model="addForm.rptpassword" type="password" class="ele-input" placeholder="请再次输入新密码"></el-input>
				</el-form-item>
					<el-button type="text" style="margin-right:60px;font-size:15px;" >
					</el-button>
			  </el-form>
        <div slot="footer" class="dialog-footer dialog-submit">
          <el-button v-if="false" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" class="submit" @click="addChildAccount">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 二级密码 -->
      <el-dialog
      title="二级密码"
      width="30%"
      class="second-pwd"
      :close-on-click-modal="false"
      :before-close="secondPwdClose"
      :visible.sync="seconePwdVisibile">
        <el-form :model="secondPwdData">
          <el-form-item label="二级密码：">
            <el-input v-model="secondPwdData.pwd" placeholder="请输入二级密码" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitSetSecondPwd">确 定</el-button>
          <el-button @click="secondPwdClose">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import publicUrl from '../../utils/public.js'
export default {
  data() {
    return {
      currentPage:1,
      editInfo:{
        host:"",
        port:"",
        hostUserName:"",
        hostPassword:"",
        heartbeat:600,
        forwardHost:"",
        forwardPort:"",
        userId:"",
      },
      editorName: '',
      selectTemplateName: '',
      tableData: [],
      // 表格头部背景颜色
      username: "",
      pageNo: 1,
      pageSize: 10,
      time: [],
      account: "",
      total: 0,
      accountLimited: "ROLE_USER",
      accountLimiteds: [
        {
          label: "管理员",
          value: "ROLE_ADMIN"
        },
        {
          label: "普通用户",
          value: "ROLE_USER"
        },
        {
          label: "高级用户",
          value: "ROLE_PRIMARY"
        },
        {
          label: "养号平台用户",
          value: "ROLE_DAEMON"
        }
      ],
      rechargeDialogVisible:false,
      dialogName:'',
      fee:'',
      remarks:'',
      userId:'',
      searchParams:{},
      keyDialogVisible:false,
      key:'',
      editDialog:false,
      editId:0,
      downPublicUrl: publicUrl.info().linkUrl,
      loginUrl: publicUrl.info().loginUrl,
      token:"",
      roleBindVisiable: false,
      gridDataList: '',
      loading: true,
      premissBindVisibile: false,
      dataList: '',
      defaultProps: {
        id: 'moduleGroupId',
        label: 'moduleGroupName'
      },
      defaultCheckKeys: [],
      moduleIds: [],
      roleId: '',
      addForm: {
          userName:"",
          password:"",
          rptpassword:"",
          count:"",
          numberLength:"",
          startingValue:""
      },
      dialogFormVisible:false,
      accountUserId:"",
      encryptUserId:encodeURI(sessionStorage.getItem('token')),
      batchOperOptions: [],
      isOrBatch: false,
      isBatchBind: false,
      seconePwdVisibile: false,
      secondPwdData: {
        pwd: ''
      },
      setSecondUserId: ''
    };
  },
  methods: {
    delAccount(index, item) {
      if (item.role === 'ROLE_USER') {
        this.$message.warning("只能删除子账号");
        return;
      } else {
        // 进行判断1： 是否解绑微信号
        this.$http(`/wx_wxuser/${item.user_id}`, 'GET').then(res => {
            if (res.data.error_code === 0) {
              if (Number(res.data.data.length) > 0) { // 表示绑定微信账号
                this.$message.warning('该账号绑定了微信账号,不能删除');
            } else { // 未绑定微信账号
              this.$confirm('此操作将删除该账号, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$http(`/child_user`,'DELETE', {
                  user_id: item.user_id
                }).then(res => {
                    if (res.data.error_code === 0) {
                      this.tableData.splice(index, 1);
                      this.$message.success('删除成功');
                       if(this.tableData==0&&this.total!=1){
                        --this.page;
                        this.currentPage = this.pageNo;
                      }
                      this.init();
                    } else {
                      this.$message.warning(res.data.error_message);
                    }
                }).catch(err => {
                  console.log(err);
                })
              }).catch(() => {
              });
              }
            } else {
              this.$message.warning(res.data.error_message);
            }
        }).catch(err => {
          console.log(err);
        });
      }
    },
    // 提交设置二级密码
    submitSetSecondPwd() {
      if (this.secondPwdData.pwd) {

      } else {
        this.$message.warning("二级密码不能为空");
      }
    },
    secondPwdClose() {
      this.secondPwdData.pwd = '';
      this.setSecondUserId = '';
      this.seconePwdVisibile = false;
    },
    // 设置二级密码
    setSecondPwd(item) {
      this.setSecondUserId = item.user_id;
      this.seconePwdVisibile = true;
    },
    selectedTemplate(val) {
      this.selectTemplateName.forEach((item, index) => {
        if (Number(item.templateId) === Number(val)) {
          this.editInfo.host = item.host;
          this.editInfo.port = item.port;
          this.editInfo.hostUserName = item.hostUserName;
          this.editInfo.hostPassword = item.hostPassword;
          this.editInfo.heartbeat = item.heartBeat;
          this.editInfo.forwardHost = item.forwardHost;
          this.editInfo.forwardPort = item.forwardPort;
        }
      });
    },
    getAllTemplate() {
      this.$http('/host_template/all_list', 'GET').then(res => {
        if (res.status === 200) {
          this.selectTemplateName = res.data.data;
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 批量操作时选择的账号
    handleSelectionChange(val) {
      this.batchOperOptions = val;
    },
    // 账号批量编辑
    batchEditor() {
      if (this.batchOperOptions.length <= 0) {
        this.$message.warning("请选择编辑账号");
        return;
      } else { // 进行编辑
        this.isOrBatch = true;
        this.editDialog = true;
        this.handleClose();
      }
    },
    // 账号批量绑定
    batchBind() {
      this.isBatchBind = false;
      if (this.batchOperOptions.length <= 0) {
        this.$message.warning("请选择权限绑定账号");
        return;
      } else {
          let roleArr = [];
          this.batchOperOptions.forEach((item, index) => {
              roleArr.push(item.role);
          });
          if (roleArr.includes('ROLE_USER')) { // 表示包含总账号
              if (roleArr.includes('ROLE_USER,ROLE_SUBUSER')) {
                this.$message.warning("总账号,子账号不能同时勾选");
              } else {
                // 获取权限分配列表
                this.dataList = '';
                this.defaultCheckKeys = [];
                this.moduleIds = [];
                this.isBatchBind = true;
                this.premissBindVisibile = true;
                this.$http('/module', 'GET', {
                  searchSign: 1,
                  userId: ''
                }).then(res => {
                  if (res.status === 200) {
                    this.dataList = res.data;
                  }
                });
              }
          } else { // 不包含总账号
            if (roleArr.includes('ROLE_USER')) {
                this.$message.warning("总账号,子账号不能同时勾选");
            } else {
                // 获取权限分配列表
                this.dataList = '';
                this.defaultCheckKeys = [];
                this.moduleIds = [];
                this.isBatchBind = true;
                this.premissBindVisibile = true;
                this.$http('/module', 'GET', {
                  searchSign: 1,
                  userId: ''
                }).then(res => {
                  if (res.status === 200) {
                    this.dataList = res.data;
                    this.dataList.data.forEach((item, index) => {
                      item.children.forEach((v, i) => {
                        if (v.moduleName === '子账号管理') {
                          v.disabled = true;
                        }
                      })
                    })
                  }
                });
            }
          }

      }
    },
    // 查询页码重置
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    handlerclose() {
      this.addForm.userName = '';
      this.addForm.password = '';
      this.addForm.rptpassword = '';
      this.addForm.count = '';
      this.addForm.numberLength = '';
      this.addForm.startingValue = '';
      this.rechargeDialogVisible = false;
    },
    //添加子账号
    showChildAccount(scope){
      this.handlerclose();
      if(scope.row.containModule){
        this.accountUserId = scope.row.user_id;
        this.dialogFormVisible= true;
      }else{
         this.$message.error("请先绑定权限！");
      }
    },
     //添加账号限制
    number(num){
          switch(num){
              case 'count':
          　　　   this.addForm.count=this.addForm.count.replace(/[^\.\d]/g,'');
                  this.addForm.count=this.addForm.count.replace('.','');
                  break;
              case 'numberLength':
                  this.addForm.numberLength=this.addForm.numberLength.replace(/[^\.\d]/g,'');
                  this.addForm.numberLength=this.addForm.numberLength.replace('.','');
                  if(this.addForm.numberLength<1||this.addForm.numberLength>6){
                      this.addForm.numberLength="";
                  }
                  break;
              case 'startingValue':
                  this.addForm.startingValue=this.addForm.startingValue.replace(/[^\.\d]/g,'');
                  this.addForm.startingValue=this.addForm.startingValue.replace('.','');
                  break;
          }
  　　},
     //添加子账号
      addChildAccount() {
        let form=this.addForm;
        let userReg=/^(?=.*[a-zA-Z])([\w-]@?\.?){3,12}$/;
        let passReg =  /^[a-zA-Z0-9]{6,16}$/;
        if(form.userName==""){
          this.$message.warning("请填写账号！");
          return;
        };
         if(!userReg.test(form.userName)){
          this.$message.warning("账户由3-12位英文或英文和数字组合而成！");
          return;
        }
        if(form.count!=1&&form.startingValue==""){
          this.$message.warning("请填写序号起始值！");
          return;
        }
        if(form.count==""){
          this.$message.warning("请填写账号数量！");
          return;
        };
        if(form.password==""){
          this.$message.warning("请填写密码！");
          return;
        };
        if(!passReg.test(form.password)){
          this.$message.warning("密码由6-16位英文或数字组成！");
          return;
        };
        if(form.rptpassword!=form.password){
          this.$message.warning("两次密码输入不一致！");
          return;
        };
        form.numberLength = Number(form.count);
        if (Number(form.numberLength) > 50) {
          this.$message.warning("子账号最多建50个！");
          return
        }
         if(isNaN(Number(form.startingValue))){
          this.$message.warning("请输入正确的起始值");
          return;
        }
        if(isNaN(Number(form.count))){
          this.$message.warning("请输入正确的数量");
          return;
        }
        if (form.startingValue == '') {
          var parmas={
            "childUserName": form.userName,
            "number": Number(form.count),
            "parentUserId": Number(this.accountUserId),
            "password": form.password
          }
        } else {
          var parmas={
            "childUserName": form.userName,
            "number": Number(form.count),
            "parentUserId": Number(this.accountUserId),
            "password": form.password,
            "value": form.startingValue
          }
        }

        this.$http("user/batch_add_user","POST",parmas).then(res => {
            if (res.data.error_code == 0) {
              this.$message.success("添加成功");
              this.dialogFormVisible = false;
              this.pageNo = 1;
              this.currentPage = 1;
              this.init();
              form.userName="";
              form.password="";
              form.rptpassword="";
              form.count="";
              form.startingValue = "";
              form.numberLength = "";
            } else {
               if(res.data.error_message=="fail"){
                if(form.count==res.data.data.length){
                  this.$message.error(res.data.data.join(',')+'重复添加失败');
                }else{
                  this.$message.error(res.data.data.join(',')+'重复添加失败,其余添加成功');
                }

              }else{
                 this.$message.error(res.data.error_message);
              }

            }
        }).catch(err => {
            this.$message.error(err);
        });
      },
    // 权限保存
    permissToSave() {
      if (this.isBatchBind) {
        let userIdArr = [];
        this.batchOperOptions.forEach((item, index) => {
          userIdArr.push(item.user_id);
        });
        this.$http('/module/batch_user_module', 'POST', {
          moduleIds: this.moduleIds,
          userIds: userIdArr
        }).then(res => {
          if (res.status === 200) {
            this.$message.success('权限保存成功');
            this.moduleIds = [];
            this.premissBindVisibile = false;
            this.defaultCheckKeys = [];
            this.init();
          } else {
            this.$message.error('权限保存失败');
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        // 非批量权限绑定
        this.$http('/module/user_module', 'POST', {
          moduleIds: this.moduleIds,
          userId: this.roleId
        }).then(res => {
          if (res.status === 200) {
            this.$message.success('权限保存成功');
            this.moduleIds = [];
            this.premissBindVisibile = false;
            this.defaultCheckKeys = [];
            this.init();
          } else {
            this.$message.error('权限保存失败');
          }
        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 当前选中项
    selectNode(data, checked, indeterminate) {
      let delIndex = -1;
      if (data.moduleId && checked) {
        this.moduleIds.push(data.moduleId);
        let currentData = new Set(this.moduleIds);
        this.moduleIds = [...currentData];
      } else {
        this.moduleIds.forEach((item, index) => {
          if (Number(data.moduleId) === Number(item)) {
            delIndex = index;
            this.moduleIds.splice(delIndex, 1);
          }
        })
      }
    },
    // 权限绑定
    premissionBind(index, item) {
      this.isOrBatch= false;
      this.premissBindVisibile = true;
      this.defaultCheckKeys = [];
      this.roleId = item.user_id;
      this.moduleIds = [];
      // 获取权限菜单信息
      this.$http('/module', 'GET', {
        searchSign: 1,
        userId: item.user_id
      }).then(res => {
        if (res.status === 200) {
          this.dataList = res.data;
          this.dataList.data.forEach((item, index) => {
            item.children.forEach((v, i) => {
              if (v.contain === true) {
                this.defaultCheckKeys.push(v.moduleId);
                this.moduleIds.push(v.moduleId);
              }
            })
          })
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 用户绑定角色列表
    bindRole(index, item) {
      this.loading = true;
      this.roleBindVisiable = true;
      // item.user_id
      this.$http('/role_module', 'GET', {
        userId:item.user_id
      }).then(res => {
        if (res.status === 200) {
          this.gridDataList = res.data;
          this.loading = false;
        } else {
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getInfo(index,item){
      this.handlerclose();
      this.isOrBatch = false;
      this.$http("/user_host_set","GET",{
        userId:item.user_id
      }).then(res=>{
        // console.log(res.data.data);
        if(res.data.error_code==0){
          this.editInfo=res.data.data;
          this.editInfo.userId=item.user_id;
          this.editDialog=true;
        }else{
          this.$message.error(res.data.error_message);
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    checkUpForm(){
      let editInfo=this.editInfo;
      let hostReg=/^(\d{1,3}\.){3}\d{1,3}$/;
      // let hostReg=/^(\d{1,3}\.){3}\d{1,3}(:\d{2,5})?([^\u4e00-\u9fa5\w]{1})?$/;
      let portReg=/^\d{2,5}$/;
      let heartbeatReg=/\D/g;
      let userNameReg=/\W/g;
      let passwordReg=/\W/g;
      let hport=editInfo.host.split(":")[1]||"";
      let zport=editInfo.forwardHost.split(":")[1]||"";
      hport=hport.replace(/\D/g,"");
      zport=zport.replace(/\D/g,"");
      if(editInfo.host==""){
        this.$message.warning("请填写HOST地址");
        return;
      }
      // if(!hostReg.test(editInfo.host)){
      //   this.$message.warning("请填写有效的HOST地址");
      //   return;
      // }
      if(editInfo.port==""){
        this.$message.warning("请填写端口号");
        return;
      }
      // else{
      //   if(hport&&editInfo.port!=hport){
      //     this.$message.warning("端口号有误");
      //     return;
      //   }
      // }
      if(!portReg.test(editInfo.port)){
        this.$message.warning("请填写有效的2-5位端口号(整数)");
        return;
      }
      if(editInfo.hostUserName==""){
        this.$message.warning("请填写账号");
        return;
      }
      if(userNameReg.test(editInfo.hostUserName)){
        this.$message.warning("请输入有效的账号");
        return;
      }
      if(editInfo.hostPassword==""){
        this.$message.warning("请填写密码");
        return;
      }
      if(passwordReg.test(editInfo.hostPassword)){
        this.$message.warning("请填写有效的密码");
        return;
      }
      if(editInfo.heartbeat==""){
        this.$message.warning("请填写心跳");
        return;
      }
      if(heartbeatReg.test(editInfo.heartbeat)||editInfo.heartbeat>600||editInfo.heartbeat<1){
        this.$message.warning("心跳只能是1-600的整数");
        return;
      }
      if(editInfo.forwardHost==""){
        this.$message.warning("请填写聊天转发HOST地址");
        return;
      }
      if(!hostReg.test(editInfo.forwardHost)){
        this.$message.warning("请填写有效的聊天转发HOST地址");
        return;
      }
      if(editInfo.forwardPort==""){
        this.$message.warning("请填写聊天转发端口号");
        return;
      }else{
        // if(zport&&editInfo.forwardPort!=zport){
        //   this.$message.warning("端口号有误");
        //   return;
        // }
      }
      if(!portReg.test(editInfo.forwardPort)){
        this.$message.warning("请填写有效的聊天转发2-5位端口号（整数）");
        return;
      }
      this.saveEdit();
    },
    saveEdit(){
      // this.editInfo.host=this.editInfo.host.split(":")[0].replace(/(\W|\.)$/,"");
      // this.editInfo.forwardHost=this.editInfo.forwardHost.split(":")[0].replace(/(\W|\.)$/,"");
      if (this.isOrBatch) { // 批量编辑
      let arr = [];
      this.batchOperOptions.forEach((item, index) => {
        arr.push(item.user_id);
      });
      this.editInfo.userId = 0;
      this.editInfo.userIds = arr;
      this.$http('/user_host_set/batch_add_template', 'POST',this.editInfo).then(res => {
        if (res.data.error_code === 0) {
          this.$message.success("编辑成功");
          this.editDialog=false;
          console.length(this.editorName)
          this.editorName = "";
        }
      }).catch(err => {
        console.log(err);
      });
      } else { // 非批量编辑
        let parmas=this.editInfo;
        this.$http("/user_host_set","POST",parmas).then(res=>{
          if(res.data.error_code==0){
            this.$message.success("编辑成功");
            this.editDialog=false;
            this.editorName = "";
          }else{
            this.$message.error(res.data.error_message);
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    searchInit(){
      this.pageNo = 1;
      this.currentPage = 1;
      this.init();
    },
    //日期搜索
    getSelectInfo(){
      this.pageNo=1;
      this.init();
    },
    //删除账号
    deleteAccount(index) {
      this.$confirm("确认删除账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http("account/del/user", "POST", {
            user_name: this.tableData[index].userName
          })
            .then(res => {
              if (res.data.error_code == 0) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.init();
              } else {
                this.$message({
                  message: "删除失败:" + res.data.data,
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$message({
                message: "删除失败:" + res.data.error_message,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //解封账号
    deblocking(index) {
      this.$http("account/allow", "POST", {
        user_name: this.tableData[index].userName
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "解封成功",
              type: "success"
            });
            this.init();
          } else {
            this.$message({
              message: "解封失败:" + res.data.data,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "解封失败:" + res.data.error_message,
            type: "error"
          });
        });
    },
    //重置密码
    resetpas(index) {
        this.$confirm('此操作将重置该账号密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http("user/reset_user", "POST", {
            userName: this.tableData[index].user_name
          })
            .then(res => {
              if (res.data.error_code == 0) {
                this.$message({
                  message: "重置密码成功(123456)",
                  type: "success"
                });
              } else {
                this.$message({
                  message: "重置密码失败:" + res.data.error_message,
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$message({
                message: "重置密码失败:" + res.data.error_message,
                type: "error"
              });
            });
        }).catch(() => {
        });
    },
    //封禁账号
    blocked(index) {
      this.$http("account/ban", "POST", {
        user_name: this.tableData[index].userName
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "封号成功",
              type: "success"
            });
            this.init();
          } else {
            this.$message({
              message: "封号失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "封号失败:" + res.data.error_message,
            type: "error"
          });
        });
    },
    //角色权限
    //分页
    handleCurrentChange(val) {
      this.pageNo = val;
      this.init();
    },
    //添加账号
    addAccount() {
        let reg=/^(?=.*[a-zA-Z])([\w-]@?\.?){3,18}$/;
        let name=this.account;
        if(name==""){
          this.$message.warning("请输入账号");
          return;
        };
        if(!reg.test(name)){
          this.$message.warning("账户由3-18位英文或英文和数字组合而成");
          return;
        };
        this.$http("account/create", "POST", {
          user_name: name,
          role: this.accountLimited
        })
          .then(res => {
            if (res.data.error_code == 0) {
              this.$message({
                message: res.data.error_message,
                type: "success"
              });
              this.init();
              this.account = "";
            } else {
              this.$message({
                message: "添加失败:" + res.data.error_message,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "添加失败:" + res.data.error_message,
              type: "error"
            });
          });
    },
    //初始化列表
    init() {
      let time1, time2;
      if (this.time == null) {
        time1 = "";
        time2 = "";
      } else {
        time1 = this.time[0];
        time2 = this.time[1];
      }
      this.searchParams.time1 = time1;
      this.searchParams.time2 = time2;
      this.searchParams.userName = this.username;
      this.$http("account/list", "POST", {
        userName: this.username,
        pageNo: this.pageNo,
        startTime: time1,
        endTime: time2,
        length: this.pageSize
      })
        .then(res => {
          if(res.data.error_code==0){
              let data = res.data.data;
              this.total = data.total_count;
              this.tableData = data.result;
              this.tableData.map((item, itemIndex) => {
                if(Number(item.parentUserId) === 0) {
                  item.parentUserId = '';
                } else {
                  item.parentUserId = item.parentUserName + '(' + item.parentUserId + ')';
                }
                if (item.role.indexOf("ROLE_ADMIN")>-1) {
                  item.user_role = "管理员";
                }
                else if (item.role.indexOf("ROLE_DAEMON")>-1) {
                  item.user_role = "养号平台用户";
                }
                else if (item.role.indexOf("ROLE_PRIMARY")>-1) {
                  item.user_role = "高级用户";
                }
                else if(item.role.indexOf('ROLE_SUBUSER')>-1){
                  item.user_role = "子账号";
                }
                else if (item.role.indexOf("ROLE_USER")>-1) {
                  item.user_role = "普通用户";
                }
              });
          }else if(res.data.error_code==400){
             this.$message({
                message: "参数错误",
                type: "error"
              });
          }else if(res.data.error_code==500){
             this.$message({
                message: res.data.error_message,
                type: "error"
              });
          }

        })
        .catch(err => {
         this.$message({
                message: "未知错误",
                type: "error"
              });
        });
    },
    recharge(index,row){
      this.userId = row.user_id;
      this.dialogName = row.user_name;
      this.rechargeDialogVisible = true;
    },
    handleClose(){
      this.remarks='';
      this.fee = '';
      this.editInfo.host="";
      this.editInfo.port="";
      this.editInfo.hostUserName="";
      this.editInfo.hostPassword="";
      this.editInfo.forwardHost="";
      this.editInfo.forwardPort="";
      this.editInfo.userId="";
      this.editInfo.heartbeat=600;
      this.editorName = "";
      // done();
    },
    capitalRecord(index,row){
      this.$router.push({
        name:"rechargeRecord",
        query:{name:row.user_name,id:row.user_id}
      })
    },
    submitRecharge(){
           this.$http("user_point/recharge", "POST", {
            "flowType": 1,
            "occurPoint": this.fee,
            "summary": this.remarks,
            "userId": this.userId
          })
            .then(res => {
              if (res.data.error_code == 0) {
                this.$message({
                  message: "充值成功",
                  type: "success"
                });
                this.rechargeDialogVisible = false;
              } else {
                this.$message({
                  message: "充值失败",
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$message({
                message: "充值失败",
                type: "error"
              });
            });
    },
    proving(){
        this.fee=this.fee.replace(/[^\.\d]/g,'');
        this.fee=this.fee.replace('.','');
    },
    getAaccessKey(){
         this.$http("access_user/access_key", "POST")
            .then(res => {
              if (res.data.error_code == 0) {
                this.key = res.data.data;
                this.keyDialogVisible = true;
              } else {
                this.$message({
                  message: "获取失败",
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$message({
                message: "获取失败",
                type: "error"
              });
            });
    },
    copyKey(e){
       this.$message({
          message: "复制成功",
          type: "success"
        });
        this.keyDialogVisible = false;
    },
    onError(e){
       this.$message({
          message: "复制失败",
          type: "warning"
        });
    }
  },
  mounted() {
    this.token = sessionStorage.getItem('token');
    this.init();
    this.getAllTemplate();
  },
  //监控输入框值得变化
  watch: {
    time() {
      if (this.time == null) {
        this.currentPage = 1;
        this.pageNo = 1;
        this.init();
      }
    },
    username() {
      if (this.username == "") {
        this.pageNo = 1;
        this.currentPage = 1;
        this.init();
      }
    }
  }
};
</script>
<style scoped lang="scss">
#account {
  .edit-form{
    padding:0 10px;
  }
  .addAccount {
    background-color: #fff;
    padding: 30px;
    .add {
      box-sizing: border-box;
      overflow: hidden;
      margin-bottom: 20px;
      li:nth-child(1) {
        padding-right: 19px;
      }
      .left {
        float: left;
        padding-right: -20px;
        line-height: 40px;
        span {
          line-height: 24px;
          font-size: 14px;
          margin-right: 40px;
        }
        .el-input {
          width: 200px !important;
        }
      }
      .right {
        float: right;
        width: 20%;
        .el-button {
          height: 32px;
          line-height: 8px;
          float: right;
        }
      }
    }
  }
  .accountTable {
    background-color: #fff;
    padding: 0 30px 30px 30px;
    .table {
      background-color: #fff;
      .tableTop {
        height:30px;
        .el-input {
          width: 200px !important;
          float: left;
        }
        .el-input__inner{
          height:32px!important;

        }
        .el-date-editor {
          float: right;
          .el-range-separator{
            line-height: 24px!important;
          }
        }
      }
      .tableBottom {
        text-align: center;
        margin-top: 10px;
        .el-pagination {
          display: inline-block;
        }
        span {
          color: #303133;
          font-size: 14px;
        }
      }
    }
  }
}
  .user_name_box,.fee_box{
      height:40px;
      line-height: 40px;
        p{
          float: left;
          width:200px;
          margin-left: 20px;
        }
        em{
            float: left;
            font-weight:bold;
            font-size: 16px;
            width:80px;
        }
        .fee_input{
          width:200px;
          margin-left: 20px;
          float: left;
        }
        span{
          float: left;
          margin-left: 20px;
        }
  }
  .remark_box{
      height:80px;
      margin-top: 14px;
        em{
            float: left;
            font-weight:bold;
            font-size: 16px;
            width:80px;
        }
        .textarea{
            margin-left: 20px;
            float: left;
            width: 300px;
        }
  }
  .key_content{
    word-wrap: break-word;
    word-break: normal;
  }
</style>
