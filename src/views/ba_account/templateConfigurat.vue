<template>
    <div id="account" class="main-body role-manage template-configurat">
        <div class="main-wrapper tem-wrapper">
          <div class="tem-header">
            <el-input
            @change="searchInit()"
            suffix-icon="el-icon-search"
            v-model="templateName"
            placeholder="请输入模板名称"></el-input>
            <el-button @click="addTem">添加</el-button>
          </div>
          <div class="tem-content">
            <el-table
              :data="tableData.result"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="70">
              </el-table-column>
              <el-table-column
                prop="hostTemplateName"
                label="模板名称"
                width="160">
              </el-table-column>
              <el-table-column
                prop="host"
                label="HOST"
                width="100">
              </el-table-column>
              <el-table-column
                prop="port"
                label="PORT"
                width="100">
              </el-table-column>
              <el-table-column
                prop="hostUserName"
                label="账号"
                >
              </el-table-column>
              <el-table-column
                prop="hostPassword"
                label="密码"
                >
              </el-table-column>
              <el-table-column
                prop="heartBeat"
                label="心跳（秒）"
                width="150">
              </el-table-column>
              <el-table-column
                prop="forwardHost"
                label="聊天转发服务HOST"
                width="200">
              </el-table-column>
              <el-table-column
                prop="forwardPort"
                label="聊天转发服务PORT"
                width="200">
              </el-table-column>
              <el-table-column
                prop=""
                label="操作">
                  <template slot-scope="scope">
                    <span @click="editTem(scope.$index,scope.row)" class="edit">编辑</span>
                    <span @click="delTem(scope.$index,scope.row)" class="del">删除</span>
                  </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100, 500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableDataCounts">
          </el-pagination>
          </div>
        </div>
        <!-- 编辑弹窗 -->
        <el-dialog
        :title="templateTitle"
        @close="handleClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="460px"
        :visible.sync="templateVisibile">
          <table width="420" class="template-table" cellpadding="0" cellspacing="0" border="1">
            <tr>
              <td>模板名称</td>
              <td>
                <el-input v-model="exitContent.name" placeholder="请填写模板名称"></el-input>
              </td>
            </tr>
            <tr>
              <td>HOST</td>
              <td>
                <el-input v-model="exitContent.host" placeholder="请填写HOST地址"></el-input>
              </td>
            </tr>
            <tr>
              <td>PORT</td>
              <td>
                <el-input v-model="exitContent.port" placeholder="请填写端口号（2-5位整数）"></el-input>
              </td>
            </tr>
            <tr>
              <td>账号</td>
              <td>
                <el-input v-model="exitContent.hostUserName" placeholder="请填写账号"></el-input>
              </td>
            </tr>
            <tr>
              <td>密码</td>
              <td>
                <el-input v-model="exitContent.hostPassword" placeholder="请填写密码"></el-input>
              </td>
            </tr>
            <tr>
              <td>心跳（秒）</td>
              <td>
                <el-input type="number" min="0" max="600" v-model="exitContent.heartbeat" placeholder="请填写心跳（秒）"></el-input>
              </td>
            </tr>
            <tr>
              <td style="padding-left: 8px;text-align: left;box-sizing: border-box;" colspan="2">聊天转发服务</td>
            </tr>
            <tr>
              <td>HOST</td>
              <td>
                <el-input v-model="exitContent.forwardHost" placeholder="请填写HOST地址"></el-input>
              </td>
            </tr>
            <tr>
              <td>PORT</td>
              <td>
                <el-input v-model="exitContent.forwardPort" placeholder="请填写端口号（2-5位整数）"></el-input>
              </td>
            </tr>
          </table>
          <el-button @click="submit">保存</el-button>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
          templateName: '',
          templateTitle: '',
          tableData: [],
          tableDataCounts: 0,
          templateVisibile: false,
          exitContent: {
            name: '',
            host:"",
            port:"",
            hostUserName: "",
            hostPassword: "",
            heartbeat: '',
            forwardHost: "",
            forwardPort: "",
            userId: ""
          },
          currentState: '',
          currentPage: 1,
          pageSize: 10
        }
    },
    watch: {
      templateName: function (val) {
        this.getTemplateOfPages();
      }
    },
    methods:{
      searchInit() {
        // this.getTemplateOfPages();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getTemplateOfPages();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getTemplateOfPages();
      },
      addTem() {
        this.currentState = 0;
        this.templateTitle = '添加';
        this.templateVisibile = true;
      },
      editTem(index, item) {
        this.currentState = 1;
        this.templateTitle = '编辑';
        this.templateVisibile = true;
        this.exitContent.userId = item.templateId;
        this.exitContent.name = item.hostTemplateName;
        this.exitContent.host = item.host;
        this.exitContent.port = item.port;
        this.exitContent.hostUserName = item.hostUserName;
        this.exitContent.hostPassword = item.hostPassword;
        this.exitContent.heartbeat = item.heartBeat;
        this.exitContent.forwardHost = item.forwardHost;
        this.exitContent.forwardPort = item.forwardPort;
      },
      delTem(index, item) {
        this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/host_template', 'DELETE', {
            templateId: item.templateId
          }).then(res => {
            if (res.data.error_code === 0) {
              this.tableData.result.splice(index, 1);
              this.getTemplateOfPages();
              this.$message.success("删除成功");
            }else{
              this.$$message.error(res.data.error_message);
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {
        });
      },
      handleClose() {
        this.exitContent.name = '';
        this.exitContent.host = '';
        this.exitContent.port = '';
        this.exitContent.hostUserName = '';
        this.exitContent.hostPassword = '';
        this.exitContent.heartbeat = '';
        this.exitContent.forwardHost = '';
        this.exitContent.forwardPort = '';
      },
      submit() {
        let editInfo=this.exitContent;
        let hostReg=/^(\d{1,3}\.){3}\d{1,3}$/;
        let portReg=/^\d{2,5}$/;
        let heartbeatReg=/\D/g;
        let userNameReg=/\W/g;
        let passwordReg=/\W/g;
        if (editInfo.name == '') {
          this.$message.warning("请输入模板名称");
          return;
        }
        if (editInfo.name.length > 20) {
          this.$message.warning("模板名称最多20个字符");
          return;
        }
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
        if(!portReg.test(editInfo.port)){
          this.$message.warning("请填写有效的2-5位端口号（整数）");
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
        }
        if(!portReg.test(editInfo.forwardPort)){
          this.$message.warning("请填写有效的聊天转发2-5位端口号（整数）");
          return;
        }
        if (Number(this.currentState) === 0) { // 添加
          this.addTheTemplate();
        } else if (Number(this.currentState) === 1) { // 编辑
          this.editTheTemplate();
        }
      },
      addTheTemplate() {
        this.$http('/host_template', 'POST', {
            hostTemplateName: this.exitContent.name,
            host: this.exitContent.host,
            port: this.exitContent.port || 0,
            hostUserName: this.exitContent.hostUserName,
            hostPassword: this.exitContent.hostPassword,
            heartBeat: this.exitContent.heartbeat,
            forwardHost: this.exitContent.forwardHost,
            forwardPort: this.exitContent.forwardPort
        }).then(res => {
          if (res.data.error_code == 0) {
            this.getTemplateOfPages();
            this.handleClose();
            this.templateVisibile = false;
            this.$message.success("添加成功");
          }else{
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      editTheTemplate() {
        this.$http('/host_template', 'PUT', {
            hostTemplateName: this.exitContent.name,
            host: this.exitContent.host,
            port: this.exitContent.port || 0,
            hostUserName: this.exitContent.hostUserName,
            hostPassword: this.exitContent.hostPassword,
            heartBeat: this.exitContent.heartbeat,
            forwardHost: this.exitContent.forwardHost,
            forwardPort: this.exitContent.forwardPort,
            templateId: this.exitContent.userId
        }).then(res => {
          if (res.data.error_code === 0) {
            this.handleClose();
            this.getTemplateOfPages();
            this.templateVisibile = false;
            this.$message.success("修改成功");
          }else{
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getTemplateOfPages() {
        this.$http('/host_template/list', 'POST', {
          hostTemplateName: this.templateName,
          length: this.pageSize,
          pageNo: this.currentPage
        }).then(res => {
          if (res.data.error_code === 0) {
            this.tableData = res.data.data;
            this.tableDataCounts = this.tableData.totalCount;
          }else{
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          console.log(err);
        })
      }
    },
    mounted(){
      this.getTemplateOfPages();
    }
}
</script>

<style scoped lang="scss">
    #account {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .main-wrapper {
          .tem-header {
            display: flex;
            margin-bottom: 10px;
          }
          .tem-content {
            text-align: center;
          }
        }
    }
</style>
