<template>
    <div id="account" class="main-body">
        <div class="main-wrapper">
        <div class="addAccount">
            <div class="record_title">
                <p @click="clickToggle(1)" :class="[{'active':tableShow==1}]">充值记录</p>
                <p @click="clickToggle(2)" :class="[{'active':tableShow==2}]">消费记录</p>
            </div>
        </div>
        <div class="search_box">
            <el-input v-model="accountValue" placeholder="请输入账号(回车搜索)" @keyup.enter.native="searchAccount()" class="input_length ele-input"></el-input>
            <el-button type="primary" class="search_btn ele-btn" @click="searchAccount">搜索</el-button>
        </div>
        <div v-show="tableShow == 1">
            <el-table
                :data="list"
                style="width: 100%"
                class="ele-table-init">
                <el-table-column
			     width="30">
			    </el-table-column>
                <el-table-column
                    prop="userName"
                    label="用户名"
                    align="left"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="createdTime"
                    label="充值时间"
                    align="left"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="occurPoint"
                    label="充值金额"
                    align="left"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="summary"
                    label="备注"
                    align="left"
                    width="auto">
                </el-table-column>
                <el-table-column
			     width="30">
			    </el-table-column>
            </el-table>
        </div>
        <div v-show="tableShow == 2">
            <el-table
                :data="list"
                style="width: 100%"
                class="ele-table-init">
                <el-table-column
			     width="30">
			    </el-table-column>
                <el-table-column
                    prop="userName"
                    label="用户名"
                    align="left"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="createdTime"
                    label="消费时间"
                    align="left"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="occurPoint"
                    label="消费金额"
                    align="left"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="summary"
                    label="备注"
                    align="left"
                    width="auto">
                </el-table-column>
                <el-table-column
			     width="30">
			    </el-table-column>
            </el-table>
        </div>
        <div class="pagination_box">
            <el-pagination @current-change="recordCurrentChange" :page-size="10" layout="total,prev, pager, next" :total="rechargeTotal"></el-pagination>
        </div>
        <Dialog @callback="submit" @handleChangeSelect="select"></Dialog>
        </div>                   
    </div>
</template>
<script>
import Dialog from '../../components/dialog'
export default {
    data(){
        return{
            accountValue:'',
            list: [],
            rechargeTotal:0,
            tableShow:1,
            userId:'',
            pageNo:1,
            searchId:'',
            params:{},
            tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
        }
    },
    methods:{
        searchAccount(){
            this.params.pageNo = this.pageNo;
            this.params.userName = this.accountValue;
            this.params.userId = this.searchId;
            this.$http("user_point/query", "POST",{
                  "flowType": this.tableShow,
                  "length": 10,
                  "pageNo": 1,
                  "userId": this.searchId||0,
                  "userName": this.accountValue
             }).then(res => {
                    let data = res.data;
                    if (data.error_code === 0) {
                        this.rechargeTotal = data.data.totalCount;
                        this.list = data.data.data;
                    } else {
                        this.$message.error("获取记录失败");
                    }
             }).catch(err => {
                    this.$message.error("获取记录失败");
             });
        },
        clickToggle(index){
            this.tableShow = index;
            this.searchAccount(); 
        },
        recordCurrentChange(val){
             this.$http("user_point/query", "POST",{
                  "flowType": this.tableShow,
                  "length": 10,
                  "pageNo": val,
                  "userId": this.params.userId ,
                  "userName": this.params.userName
             }).then(res => {
                let data = res.data;
                if (data.error_code === 0) {
                    this.rechargeTotal = data.data.totalCount;
                    this.list = data.data.data;
                } else {
                    this.$message.error("获取记录失败");
                }
                }).catch(err => {
                    this.$message.error("获取记录失败");
                }); 
        },
        handleSeeDetail(){
            this.$store.dispatch("showDialog",{
                title:'查看明细',
                showCancel:true,
                tableData:this.tableData
            })
        },
        submit(){
            console.log(123)
        },
        select(val){
            console.log(val)
        }
    },
    mounted(){
      if(this.$route.query.id != undefined && this.$route.query.name != undefined){
            this.accountValue = this.$route.query.name;
            this.searchId = this.$route.query.id;
        }else{
            this.accountValue = '';
        }
      this.searchAccount(); 
    },
    components:{
        Dialog
    }
}
</script>

<style scoped lang="scss">
    #account {
        width: 100%;
        height: 100%;
        .addAccount {
            background-color: #fff;
            margin-bottom: 20px;
            .record_title{
                height:60px;
                border-bottom: 1px solid #999;
                p{
                    width:100px;
                    height:40px;
                    float: left;
                    line-height: 40px;
                    cursor: pointer;
                }
                .active{
                    color:#409EFF;
                }
            }   
        }
        .search_box{
            background-color: #fff;
            height: 30px;
            .input_length{
                width:200px!important;
                float: left;
            }
            .search_btn{
                float: left;
                margin-left: 14px;
            }
        }
        .recharge_table{
            padding-left: 30px;
            background-color: #fff;
        }
        .pagination_box{
            background-color: #fff;
            text-align: center;
            padding-top: 20px;
        }
    }
</style>
