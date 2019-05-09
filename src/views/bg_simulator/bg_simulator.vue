<template>
  <div id="main_simu" class="simu-manager">
    <div class="simulator_main main-body">
      <div class="main_content main-wrapper">
        <div class="simulator_main_head ">
          <span class="page-title">模拟器管理</span>
        </div>
        <div class="search">
          <div class="search_input">
            <el-input class="ele-input"  size="small" v-model="sterminalId" placeholder="请输入模拟器ID" @keyup.enter.native="searchEnterFun"></el-input>
            <el-input class="ele-input"  size="small" v-model="suserName" placeholder="请输入平台账号" @keyup.enter.native="searchEnterFun"></el-input>
            <el-input class="ele-input"  size="small" v-model="suserId" placeholder="请输入用户ID" @keyup.enter.native="searchEnterFun"></el-input>
            <el-button class="ele-btn" type="primary" @click="searchEve">搜索</el-button>
          </div>
          <!--<el-button class="ele-btn" type="primary" @click="routerConfig">模拟器配置</el-button>-->
        </div>
        <div class="simulator_main_table">
          <div class="main_table">
            <el-table :data="tableData" :header-cell-style="getHeaderClass" class="ele-table-init">
              <el-table-column label="" width="30">
              </el-table-column>
              <el-table-column prop="id" label="ID" align="left" type="index">
              </el-table-column>
              <el-table-column label="模拟器ID" align="left">
                <template slot-scope="scope">
                  <el-tooltip  placement="top" effect="light" :open-delay="300">
                    <span class="writeWrapper">{{scope.row.terminal_id}}</span>
                    <div slot="content"> {{scope.row.terminal_id}}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="分配用户名" align="left" width="130">
              </el-table-column>
               <el-table-column prop="user_id" label="用户ID" align="left" width="100">
              </el-table-column>
              <el-table-column label="消息中心" align="left">
                <template slot-scope="scope">
                  <el-tooltip  placement="top" effect="light" :open-delay="300">
                    <span class="writeWrapper">{{scope.row.message_center}}</span>
                    <div slot="content"> {{scope.row.message_center}}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="message_center_user" label="消息中心用户名" align="left" width="150">
              </el-table-column>
              <el-table-column prop="message_center_password" label="消息中心密码" align="left" width="150">
              </el-table-column> -->
              <el-table-column prop="liveCount" label="在线数/账号数" align="left" width="150">
              </el-table-column>
              <el-table-column prop="cpu" label="CPU" align="left" width="120">
              </el-table-column>
              <el-table-column prop="memory" label="内存" align="left" width="100">
              </el-table-column>
              <el-table-column label="状态" align="left" width="80">
                <template slot-scope="scope">
                  {{scope.row.online | statusLable}}
                </template>
              </el-table-column>
              <el-table-column  label="操作" align="right" width="180">
                <template slot-scope="scope">
                      <el-button type="text" v-if="!scope.row.enable == 1" @click="changeStatus(scope.row,1)">启用</el-button>
                      <el-button type="text" v-if="!scope.row.enable == 0" @click="changeStatus(scope.row,2)">禁用</el-button>
                      <el-button type="text" @click="editSimu(scope.row)">编辑</el-button>
                      <el-button type="text" @click="delSimu(scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column label="" width="30"></el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="page">
            <el-pagination
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--编辑弹窗-->
  		<transition name="fade">
        <div class="editorPop" v-if="taskShow" :key="1">
          <div class="content">
            <div class="header">编辑</div>
            <div class="text">
              <!-- 用户名 -->
              <div class="item user-name">
                <span>用户名</span>
                <el-input class="ele-input" v-model="simulatorGroup.editUserName" placeholder="用户名"></el-input>
                <el-button @click="searchIdOfName">搜索</el-button>
              </div>
              <div class="item">
                <span>分配用户ID</span>
                <el-input class="ele-input" v-model="simulatorGroup.editUserId" placeholder="分配用户ID"></el-input>
              </div>
              <div class="item">
                <span>消息中心</span>
                <el-input  class="ele-input"  v-model="simulatorGroup.editNews" placeholder="消息中心"></el-input>
              </div>
              <div class="item">
                <span>消息中心用户名</span>
                <el-input class="ele-input"  v-model="simulatorGroup.editNewsUser" placeholder="消息中心用户名"></el-input>
              </div>
              <div class="item">
                <span>消息中心密码</span>
                <el-input class="ele-input"  v-model="simulatorGroup.editNewsUserpass" placeholder="消息中心密码"></el-input>
              </div>
              <div class="item_btn">
                <el-button type="primary" class="ele-btn" @click="submitInfo">确认</el-button>
                <el-button type="primary" class="ele-btn" @click="simuInput='',taskShow=false">取消</el-button>
              </div>
            </div>
          </div>
        </div>
  		</transition>
  </div>
</template>
<script>
export default {
  data(){
    return{
      tableData:[],
      userId: '',
      taskShow: false,
      editRow: '',
      simulatorGroup:{
        editUserName: '',
        editUserId: '',
        editNews: '',
        editNewsUser: '',
        editNewsUserpass:''
      },
      pageSize: 10,
      total: 0,
      pages: 1,
      sterminalId:'',
      suserName:"",
      suserId:""
    }
  },
  methods:{
    searchIdOfName() {
      if (this.simulatorGroup.editUserName) {
        this.$http('/user/user_id', 'GET', {
          userName: this.simulatorGroup.editUserName
        }).then(res => {
          if (res.status === 200) {
            if (res.data.data === -1) {
              this.$message.warning("用户名不存在，请重新输入");
              this.simulatorGroup.editUserId = '';
            } else {
              this.simulatorGroup.editUserId = res.data.data;
            }
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
          this.$message.warning("请输入用户名");
          this.simulatorGroup.editUserId = '';
      }
    },
    searchEve(){
      this.pages = 1;
      this.getSimulator();
    },
    routerConfig(){
      this.$router.push({
        path:"/simulatorConfig"
      })
    },
    getHeaderClass({ row, column, rowIndex, columnIndex }) { // 表头style
      if (rowIndex == 0) {
        return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px";
      } else {
        return "";
      }
    },
    getSimulator(){ // 获取模拟器管理列表
      let parmas={
        'length':10,
        'pageNo':this.pages
      };
      if(this.sterminalId!=""){
        parmas.terminalId=this.sterminalId;
      };
      if(this.suserId!=""){
        parmas.userId=this.suserId;
      };
      if(this.suserName!=""){
        parmas.userName=this.suserName;
      };
      this.$http('terminal/terminal_list','POST',parmas).then(res=>{
        if(res.data.error_code == 0) {
          this.tableData = []
          let data =  res.data.data.result;
          if(data.length>0){
            data.map((item)=>{
              // console.log((parseFloat(item.memory) * 100).toFixed(0))
              this.tableData.push({
                'terminal_id':item.terminal_id,
                'user_id':item.user_id,
                'message_center':item.message_center,
                'message_center_user': item.message_center_user,
                'message_center_password': item.message_center_password,
                'enable':item.enable,
                'liveCount':item.live_count + '/'+ item.total_count,
                'memory':(parseFloat(item.memory) * 100).toFixed(0) + 'M',
                'cpu':(parseFloat(item.cpu) * 100).toFixed(1) + '%',
                'online':item.online,
                'user_name':item.user_name
              })
            })
          }
          this.total = res.data.data.total_count
        } else {
          this.$message.error('获取列表失败')
        }
      }).catch(err=>{
        console.log(err)
        this.$message.error('获取数据失败,请重新刷新获取')
      })
    },
    editSimu(row){ // 编辑
      this.row = row
      this.taskShow = true
      this.simulatorGroup.editUserId = row.user_id
      this.simulatorGroup.editUserName = row.user_name
      this.simulatorGroup.editNews = row.message_center
      this.simulatorGroup.editNewsUser = row.message_center_user
      this.simulatorGroup.editNewsUserpass = row.message_center_password
    },
    changeStatus(row,id){ // 启用/ 禁用
       let terminal_id = row.terminal_id
      if(id == 1) {
        this.$http('terminal/operate/'+terminal_id+'/'+ true, 'POST').then(res=>{
          console.log(res)
          if(res.data.error_code == 0) {
            this.$message.success('启用成功')
            this.getSimulator()
          } else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err=>{
          this.$message.error('启用失败')
        })
      } else {
        this.$http('terminal/operate/'+terminal_id+'/'+ false, 'POST').then(res=>{
          console.log(res)
          if(res.data.error_code == 0) {
            this.$message.success('禁用成功')
            this.getSimulator()
          } else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err=>{
          this.$message.error('禁用失败')
        })
      }
    },
    delSimu(row){ // 删除
      let terminal_id = row.terminal_id
      this.$http('terminal/?terminal_id='+terminal_id,'GET').then(res=>{
        console.log(res)
        if(res.data.error_code == 0) {
          this.$message.success('删除成功')
          this.getSimulator()
        }else{
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        this.$message.error('删除失败')
      })
    },
    submitInfo() { // 提交编辑
      let terminal_id = this.row.terminal_id
      let data = {
        "messageCenter": this.simulatorGroup.editNews,
        "messageCenterPassword":this.simulatorGroup.editNewsUserpass,
        "messageCenterUser": this.simulatorGroup.editNewsUser,
        "terminalId": terminal_id,
        "userId": this.simulatorGroup.editUserId
      }
      this.$http('terminal/dispatch','POST',data).then(res=>{
        if(res.data.error_code == 0) {
          this.$message.success('设置成功')
          this.getSimulator()
          this.taskShow = false
        }
      }).catch(err=>{
        this.$message.error('设置失败')
      })
    },
    handleCurrentChange(val){ // 分页切换
      this.pages = val
      this.getSimulator()
    },
    searchEnterFun(){ // 搜索
      this.getSimulator()
    }
  },
  created(){

  },
  mounted(){
    this.userId = sessionStorage.getItem('user_id')
    this.getSimulator()
  },
  filters: {
    statusLable: function(value) {
      if (value === 0) {
        return "离线";
      } else if (value === 1) {
        return "在线";
      }
    }
  },
  watch:{

  }
}
</script>
<style lang="scss" scoped>
#main_simu{
  .simulator_main{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .main_content{
      box-sizing: border-box;
      background-color: #fff;
      overflow: hidden;
      .simulator_main_head{
        margin-bottom: 20px;
      }
      .simulator_main_table{
        .main_table{
          position: relative;
        }
      }
      .search{
        overflow: hidden;
        margin: 20px auto;
        // padding: 0 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .search_input{
          /*width: 200px;*/
        }
      }
    }
    .page{
      text-align: center
    }
  }
 .editorPop {
			position: absolute;
			z-index: 1000;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.3);
			.content {
				width: 550px;
				// height: 280px;
				background-color: #fff;
				border-radius: 5px;
				position:absolute;
				top:30%;
				left:50%;
				margin-left:-275px;
				.header {
					font-size: 14px;
					line-height: 48px;
					text-align: center;
					border-top-left-radius: 5px;
					border-top-right-radius: 5px;
					background-color:#409EFF;
					color: #fff;
				}
				.text{
					padding: 10px 50px 50px;
				}
				.item {
					width: 100%;
					margin: 10px 0 ;
					overflow: hidden;
					text-align: center;
					span {
						display: inline-block;
            font-size: 14px;
            width: 300px;
            text-align: left;
					}
					.el-input {
						// float: left;
						width: 300px !important;
					}
					.el-select {
						width: 300px;
						float: left;
					}
				}
				.item_btn{
					margin-top: 40px;
					text-align: center;
				}
			}
		}
}
</style>

