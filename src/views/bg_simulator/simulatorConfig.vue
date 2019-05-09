<template>
    <div class="main-body">
      <div class="main-wrapper">
        <div class="page-title">
          <span>模拟器配置</span>
        </div>
        <div class="config-form">
          <el-form ref="form" :model="form" label-width="140px">
            <p class="second-form-tit">服务器配置</p>
            <el-form-item label="服务器">
              <el-input v-model="form.server.host" class="ele-input" ref="taskServer"></el-input>
            </el-form-item>
            <el-form-item label="系统配置">
              <el-checkbox label="禁用WEB服务器连接" v-model="form.server.connect"></el-checkbox>
              <el-checkbox label="WEB通讯加密" v-model="form.server.encryption"></el-checkbox>
              <el-checkbox label="启动时接受任务" v-model="form.server.task"></el-checkbox>
            </el-form-item>
            <el-form-item label="用户ID">
              <el-input v-model="form.server.userId" class="ele-input" placeholder="请填写用户ID" ref="taskUserId"></el-input>
            </el-form-item>
            <el-form-item label="终端ID">
              <el-input v-model="form.server.username" class="ele-input" placeholder="请填写终端ID" ref="terminalId"></el-input>
            </el-form-item>
            <el-form-item label="终端任务">
              <el-checkbox label="只接受本终端任务" v-model="form.server.only"></el-checkbox>
            </el-form-item>
            <el-form-item label="心跳延时(秒)">
              <el-input v-model="form.server.timeout" class="ele-input" ref="heartBeatDelay"></el-input>
            </el-form-item>
            <p class="second-form-tit">账号配置</p>
            <el-form-item label="账号配置">
              <el-checkbox label="启动后自动登录本机所有账号" v-model="form.account.autoLogin"></el-checkbox>
              <el-checkbox label="快速登录" v-model="form.account.fastLogin"></el-checkbox>
              <el-checkbox label="登录出错后清除本地账号数据" v-model="form.account.clear"></el-checkbox>
              <el-checkbox label="禁止自动删除账号" v-model="form.account.delete"></el-checkbox>
            </el-form-item>
            <el-form-item label="并发登录账号数">
              <el-input v-model="form.account.loginNumber" class="ele-input" ref="maxLoginCountOnceTime"></el-input>
            </el-form-item>
            <el-form-item label="最大在线账号数">
              <el-input v-model="form.account.maxLogin" class="ele-input" ref="maxLiveCount"></el-input>
            </el-form-item>
            <el-form-item label="显示登录二维码">
              <el-checkbox label="是" v-model="form.account.showQrcode"></el-checkbox>
            </el-form-item>
            <p class="second-form-tit">数据配置</p>
            <el-form-item label="数据配置">
              <el-checkbox label="好友列表" v-model="form.dataConfig.friendList"></el-checkbox>
              <el-checkbox label="群联系人" v-model="form.dataConfig.groupList"></el-checkbox>
              <el-checkbox label="聊天记录" v-model="form.dataConfig.historyList"></el-checkbox>
              <el-checkbox label="朋友圈" v-model="form.dataConfig.friendsCircle"></el-checkbox>
            </el-form-item>
            <el-form-item label="限制朋友圈天数">
              <el-input v-model="form.dataConfig.friendsCircleDays" class="ele-input"></el-input>
            </el-form-item>
            <el-form-item label="是否启用聊天聚合">
              <el-checkbox label="是" v-model="form.dataConfig.aggregation"></el-checkbox>
            </el-form-item>
            <div class="group" v-show="form.dataConfig.aggregation">
              <el-form-item label="服务器">
                <el-input v-model="form.dataConfig.host" class="ele-input"></el-input>
              </el-form-item>
              <el-form-item label="端口">
                <el-input v-model="form.dataConfig.port" class="ele-input"></el-input>
              </el-form-item>
              <el-form-item label="账号">
                <el-input v-model="form.dataConfig.user" class="ele-input"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="form.dataConfig.password" class="ele-input"></el-input>
              </el-form-item>
            </div>
            <p class="second-form-tit">功能配置</p>
            <el-form-item label="功能配置">
              <el-checkbox label="自动通过好友申请" v-model="form.function.autoFriend"></el-checkbox>
              <el-checkbox label="自动抢红包" v-model="form.function.autoPacket"></el-checkbox>
              <el-checkbox label="自动接收群聊邀请" v-model="form.function.autoGroup"></el-checkbox>
            </el-form-item>
            <el-form-item label="自动通过最大次数">
              <el-input v-model="form.function.maxFriends" class="ele-input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" class="ele-btn">导出配置文件</el-button>
              <el-button class="ele-gray" @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>

<script>
    import FileSaver from 'file-saver';
    export default {
        name: "simulatorCongig",
        data(){
          return{
            form:{
              server:{
                host: 'http://121.41.42.167:8888/',
                userId: '',
                username:"",
                timeout:30,
                connect:false,
                encryption:false,
                task:true,
                only:true
              },
              account:{
                autoLogin:false,
                fastLogin:false,
                clear:false,
                delete:false,
                loginNumber:1,
                maxLogin:1000,
                showQrcode:true
              },
              dataConfig:{
                friendList:false,
                groupList:false,
                historyList:false,
                friendsCircle:false,
                friendsCircleDays:3,
                aggregation:false,
                host:"139.196.89.69",
                port:"61613",
                user:"admin",
                password:"password"
              },
              function:{
                autoFriend:false,
                autoPacket:false,
                autoGroup:false,
                maxFriends:20
              }
            },

          }
        },
        methods: {
          onCancel(){
            this.$router.back();
          },
          onSubmit(e) {
            const formData=this.form;
            const reg=/\D/g;
            const data = JSON.stringify(this.form);
            const blob = new Blob([data], {type: ''});
            if(formData.server.host==""){
              this.$message.warning("请填写服务器地址");
              this.$refs.taskServer.foces();
              return;
            }
            if(formData.server.userId==""){
              this.$message.warning("请填写用户ID");
              this.$refs.taskUserId.focus();
              return;
            }
            if(formData.server.username==""){
              this.$message.warning("请填写终端ID");
              this.$refs.terminalId.focus();
              return;
            }
            if(formData.server.timeout==""){
              this.$message.warning("请填写心跳延时");
              this.$refs.heartBeatDelay.focus();
              return;
            }
            if(reg.test(formData.server.timeout)){
              this.$message.warning("心跳延时只能是数字");
              this.$refs.heartBeatDelay.focus();
              return;
            }
            if(formData.account.loginNumber==""){
              this.$message.warning("请填写并发登录账号数");
              this.$refs.maxLoginCountOnceTime.focus();
              return;
            }
            if(reg.test(formData.account.loginNumber)){
              this.$message.warning("并发登录账号数只能是数字");
              this.$refs.maxLoginCountOnceTime.focus();
              return;
            }
            if(formData.account.maxLogin==""){
              this.$message.warning("请填写最大在线账号数");
              this.$refs.maxLiveCount.focus();
              return;
            }
            if(reg.test(formData.account.maxLogin)){
              this.$message.warning("最大在线账号数只能是数字");
              this.$refs.maxLiveCount.focus();
              return;
            }
            if(formData.dataConfig.friendsCircleDays==""){
              this.$message.warning("请填写限制朋友圈天数");
              return;
            }
            if(reg.test(formData.dataConfig.friendsCircleDays)){
              this.$message.warning("限制朋友圈天数只能是数字");
              return;
            }
            if(formData.dataConfig.aggregation){
              if(formData.dataConfig.host==""){
                this.$message.warning("请填写聊天聚合服务器");
                return;
              }
              if(formData.dataConfig.port==""){
                this.$message.warning("请填写聊天聚合端口号");
                return;
              }
              if(formData.dataConfig.user==""){
                this.$message.warning("请填写聊天聚合账号");
                return;
              }
              if(formData.dataConfig.password==""){
                this.$message.warning("请填写聊天聚合密码");
                return;
              }
            }
            if(formData.function.maxFriends==""){
              this.$message.warning("请填写自动通过最大次数");
              return;
            }
            if(reg.test(formData.function.maxFriends)){
              this.$message.warning("自动通过最大次数只能是数字");
              return;
            }
            FileSaver.saveAs(blob, 'SystemConfig.json');
            e.preventDefault();
          }
        }
    }
</script>

<style scoped lang="scss">
  .config-form{
    .second-form-tit{
      color:#999;
      margin: 10px 0;
    }
  }
</style>
