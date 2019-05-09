<template>
    <div class="develop" style="background:#fff;padding-bottom:50px;">
        <div class="develop-heading">
            <span class="index">管理配置</span>
        </div>
        <div class="new_btn">
            <el-button type="primary">新增配置 </el-button>
            <div @click="$router.push('/mr_functionTaskDate')">任务日志</div>
        </div>
        <ul class="control">
            <li>
                <span>新建配置</span>
            </li>
        </ul>
        <div class="mid">
            <p class="mid_head">
                <span>配置类型</span>
                <el-button type="danger" @click="mask=true,det=true">删除配置 </el-button>
                <el-button type="primary" @click="mask=true,succ=true">修改配置 </el-button>
            </p>
            <hr style="width:95%;margin:0 auto;background:#c0c4cc;;height:1px;border:none;">
            <div class="mid_foot">
                <p>配置名称</p>
                <el-input placeholder="新建配置"></el-input>
            </div>
        </div>
        <div class="develop_box">
            <div class="shake">
                <div style="margin:0 auto;width:65%">
                    <span>
                        <el-checkbox v-model="checked">摇一摇</el-checkbox>
                    </span>
                    <p>每日次数（最大2000）</p>
                    <el-input type="number"  :disabled="!checked"></el-input>
                    <p>开始时间</p>
                    <el-date-picker v-model="valueTime" type="datetime" placeholder="请选择开始日期时间"  :disabled="!checked">
                    </el-date-picker>
                    <p>结束时间</p>
                    <el-date-picker v-model="valueTime" type="datetime" placeholder="请选择结束日期时间"  :disabled="!checked">
                    </el-date-picker>
                    <p>时间间隔</p>
                    <el-input type="number" value="分"  :disabled="!checked"></el-input>
                    <template>
                        <el-checkbox  style="margin-top:20px;"  :disabled="!checked">是否自动打招呼</el-checkbox>
                    </template>
                </div>
            </div>
            <div class="drift">
                <div style="margin:0 auto;width:65%">
                    <span>
                        <el-checkbox v-model="checkeds">漂流瓶</el-checkbox>
                    </span>
                    <p>打捞次数</p>
                    <el-input type="number" :disabled="!checkeds"></el-input>
                    <p>打捞红雨回复</p>
                    <el-input type="textarea" placeholder="你好" :disabled="!checkeds"></el-input>
                    <p>扔出次数</p>
                    <el-input type="number" :disabled="!checkeds"></el-input>
                    <p>扔瓶子消息</p>
                    <el-input type="textarea" placeholder="你好啊" :disabled="!checkeds"></el-input>
                    <p>开始时间</p>
                    <el-date-picker v-model="valueTime" type="datetime" placeholder="请选择开始日期时间" :disabled="!checkeds">
                    </el-date-picker>
                    <p>结束时间</p>
                    <el-date-picker v-model="valueTime" type="datetime" placeholder="请选择结束日期时间" :disabled="!checkeds">
                    </el-date-picker>
                    <p>时间间隔</p>
                    <el-input type="number" value="30" :disabled="!checkeds"></el-input>
                </div>
            </div>
        </div>
        <!-- 蒙板 -->
        <div class="mask" v-show="mask"></div>
        <!-- 删除按钮 弹窗 -->
        <div class="det public" v-show="det">
            <div class="header">
                <h5>删除快捷语</h5>
                <span @click="mask=false,det=false">×</span>
            </div>
            <div class="content">
                <div class="contentItem">
                    <p>确定要删除该快捷语吗？</p>
                </div>
            </div>
            <div class="footer">
                <el-button type="success" @click="det">确定</el-button>
                <el-button @click="mask=false,det=false">取消</el-button>
            </div>
        </div>
        <!-- 修改成功按钮 弹窗 -->
        <div class="succ public" v-show="succ">
            <div class="header">
                <h5>提示</h5>
                <span @click="mask=false,succ=false">×</span>
            </div>
            <div class="content">
                <div class="contentItem">
                    <p style="text-align:center">修改成功!</p>
                </div>
            </div>
            <div class="footer">
                <el-button type="success" @click="succ">确定</el-button>
                <el-button @click="mask=false,succ=false">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            det: false, // 是否删除确认
            mask: false, // 蒙版
            succ: false,
            valueTime: "",
            checked: false,
            checkeds:false,
        };
    },
    methods: {
        aaaa() {
            this.checked = !this.cheched;
            if (this.checked) {
                //发请求
                this.checked = false;
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.develop-heading {
    padding: 0 15px 0 35px;
    width: 100%;
    height: 47px;
    line-height: 29px;
    font-size: 18px;
    z-index: 5;
    background: #fff;
    padding: 10px 15px;
    border-bottom: 1px solid #ccc;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}
//  新增配置按钮
.new_btn {
    position: relative;
    .el-button {
        margin-top: 20px;
        margin-left: 50px;
    }
    div {
        position: absolute;
        right: 50px;
        color: #58bc9c;
        cursor: pointer;
    }
}

//新建配置tab卡
.control {
    width: 100%;
    height: 40px;
    margin-left: 50px;
    li {
        width: 130px;
        border-bottom: 3px solid #58bc9c;
        text-align: center;
        margin-top: 16px;
        height: 40px;
        line-height: 40px;
    }
}
.mid {
    border: 1px solid #c0c4cc;
    border-radius: 5px;
    width: 95%;
    height: 170px;
    margin: 0 auto;
    .mid_head {
        height: 60px;
        line-height: 60px;
        span {
            margin-left: 30px;
            float: left;
        }
        .el-button {
            float: right;
            margin-right: 30px;
            margin-top: 10px;
        }
    }
    .mid_foot {
        p {
            margin-left: 30px;
            margin-top: 20px;
        }
        .el-input {
            width: 230px;
            margin-left: 30px;
            margin-top: 5px;
        }
    }
}
.develop_box {
    display: -webkit-flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 50px;
    .shake,
    .drift {
        width: 45%;
        border: 1px solid #c0c4cc;
        padding: 30px;
        p {
            color: rgba(0, 0, 0, 0.65);

            margin: 30px 0 10px 10px;
        }
        .el-input {
            width: 100%;
        }
    }
}
// 弹窗样式
.public {
    position: absolute;
    left: 30%;
    top: 30%;
    width: 500px;
    border-radius: 6px;
    background-color: #fff;
    z-index: 11;
    box-sizing: border-box;
    .header {
        padding: 10px 15px;
        overflow: hidden;
        font-size: 14px;
        background-color: #e1ebf4;
        border-radius: 6px 6px 0 0;
        h5 {
            text-align: center;
            float: left;
            width: 95%;
            line-height: 20px;
        }
        span {
            float: right;
            color: #73879c;
            cursor: pointer;
            line-height: 20px;
        }
    }
    .content {
        padding: 15px;
        .specialSelect {
            margin: 10px 0 0 25px;
            width: 260px;
        }
        .contentItem {
            padding: 5px 0;
            overflow: hidden;
            span {
                float: left;
                line-height: 40px;
            }
            .el-input {
                float: left;
                width: 80%;
                margin-left: 20px;
            }
            .el-select {
                float: left;
                width: 80%;
                margin-left: 20px;
            }
        }
    }
    .footer {
        padding: 15px;
        border-top: 1px solid #e5e5e5;
        text-align: center;
    }
}
</style>