<template>
  <div id="account" class="main-body">
    <div class="addAccount">
      <h3 class="page-title">账号信息</h3>
    </div>
    <div class="main-wrapper" style="padding-top:0;">
      <el-input v-model="userName" placeholder="请输入内容" class="ele-input"></el-input>
      <el-button type="primary" class="ele-btn" @click="handleUserId">
        <i class="el-icon-search">添加用户</i>
      </el-button> 
      <div class="main-text">
        <el-button type="primary" class="ele-btn" @click="downloadXLS">
          <i class="el-icon-search">添加用户</i>
        </el-button> 
        <el-button type="primary" class="ele-btn">
          <i class="el-icon-search">添加用户</i>
        </el-button>
        <el-button type="primary" class="ele-btn">
          <i class="el-icon-search">添加用户</i>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
     userName:""
    };
  },
  mounted() {
  },
  methods: {
    handleUserId(){
      this.$http("user/user_list", "POST", {
        length:99999,
        pageNo:1,
        userName:this.userName
      }).then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: res.data.error_message,
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.error_message,
              type: "error"
            });
          }
        }).catch(err => {
          this.$message({
            message: err,
            type: "error"
          });
        });
    },
    // 下载excel
    downloadXLS(){
      // window.open(this.downPublicUrl+"api/v1/phone_group/exportSource/" + this.editId + "?token=" + this.token,"_blank");
    }
  },
};
</script>
<style scoped lang="scss">
#account {
  .addAccount {
    background-color: #fff;
    padding: 30px;
  }
  .main-text{
    margin: 50px 0;
  }
  
}
</style>
