<template>
    <div id="account" class="main-body">
        <div class="main-wrapper">
        <div class="addAccount">
            <div class="record_title">
                <p @click="clickToggle(1)" :class="[{'active':tableShow==1}]">转码记录</p>
                <p @click="clickToggle(0)" :class="[{'active':tableShow==0}]">下载记录</p>
            </div>
        </div>
        <div class="content_box">
            <div class="content" v-show="tableShow == 1">
                <div class="transcoding"><em>当日转码条数: </em><span>{{today}}</span></div>
                <div class="transcoding"><em>三天转码条数: </em><span>{{threeDay}}</span></div>
                <div class="transcoding"><em>七天转码条数: </em><span>{{aWeek}}</span></div>
            </div>
            <div class="content" v-show="tableShow == 0">
                <div class="transcoding"><em>当日下载条数: </em><span>{{today}}</span></div>
                <div class="transcoding"><em>三天下载条数: </em><span>{{threeDay}}</span></div>
                <div class="transcoding"><em>七天下载条数: </em><span>{{aWeek}}</span></div>
            </div>
        </div>
        <div class="search_box">
             <el-date-picker
                v-model="dateValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                class="input_length ele-input">
            </el-date-picker>
            <el-button type="primary" class="search_btn ele-btn" @click="searchAccount">搜索</el-button>
            <p class="search_content">
                搜索结果:
            </p>
            <span v-show="tableShow == 0">{{number}}</span>
            <span v-show="tableShow == 1">{{number}}</span>
        </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dateValue:[],
            rechargeTotal:0,
            tableShow:1,
            userId:'',
            number:'',
            today:'',
            threeDay:'',
            aWeek:''
        }
    },
    methods:{
        searchAccount(){
            let time1, time2;
            if (this.dateValue == null) {
                time1 = "";
                time2 = "";
            } else {
                time1 = this.dateValue[0];
                time2 = this.dateValue[1];
            }
            this.$http("sixtwo/transcode_count?"+'endTime'+'='+time2+'&'+'showType'+'='+this.tableShow+'&'+'startTime'+'='+time1, "GET").then(res => {
                let data = res.data;
                if (data.error_code === 0) {
                    this.number = data.data;
                } else {
                    this.$message.error("获取记录失败");
                }
            }).catch(err => {
                this.$message.error("获取记录失败");
            });
        },
        clickToggle(index){
            this.tableShow = index
            this.getDateList();
            this.dateValue = [];
        },
        getDateList(){
            this.$http("sixtwo/transcode_count/default?"+'showType'+'='+this.tableShow, "GET").then(res => {
                let data = res.data;
                if (data.error_code === 0) {
                    this.today = data.data.ToDay;
                    this.threeDay = data.data.FirstThreeDays;
                    this.aWeek = data.data.FirstWeek;
                } else {
                    this.$message.error("获取记录失败");
                }
            }).catch(err => {
                this.$message.error("获取记录失败");
            });
        }
    },
    mounted(){
      if(this.$route.query.id != undefined){
		    this.userId = this.$route.query.id;
        }
      this.getDateList();
    }
}
</script>

<style scoped lang="scss">
    #account {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .addAccount {
            background-color: #fff;
            .record_title{
                height:50px;
                border-bottom: 1px solid #999;
                margin-bottom: 20px;
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
        .content_box{
            background-color: #fff;
            height:200px;
            .content{
                width:300px;
                height:160px;
                .transcoding{
                    font-size: 14px;
                    color:#333;
                    margin-bottom: 20px;
                     em{
                        font-weight: bold;
                    }
                }
            }
        }
        .search_box{
            background-color: #fff;
            height: 80px;
            .input_length{
                float: left;
                height:32px!important;
            }
            .search_btn{
                float: left;
                margin-left: 14px;
            }
            .search_content{
                width:80px;
                height:30px;
                float: left;
                line-height:30px;
                font-weight: bold;
                color:#333;
                font-size: 14px;
                margin-left:40px;
            }
            span{
                float: left;
                line-height:40px;
            }
        }
    }
</style>
