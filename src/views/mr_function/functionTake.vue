<template>
  <div id="friendTake">
    <div class="title">
      <ul>
        <li style="float:left">
          <h3>发朋友圈</h3>
        </li>
        <li style="float:right;padding-right:50px">
          <h3>
            <el-button type="text" @click="record">朋友圈记录</el-button>
          </h3>
        </li>
      </ul>

      <div class="cloose">
        <p @click="fansTaskShow=true,mask=true">
          选择发布账号
          <i class="el-icon-circle-plus"></i>
        </p>
        <span>发布内容</span>
      </div>

      <div class="main">
        <template>
          <ul class="textbox">
            <li><span>文字</span></li>
            <li class="li2">
              <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="friendsterData.takeText"></el-input>
            </li>
          </ul>
        </template>

        <ul class="upload">
          <li><span>图片</span></li>
          <li>
            <el-upload :action="uploadUrl" list-type="picture-card" :auto-upload=false ref="uploadFriend" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="maxPiece">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </li>
          <div class="btnbox">
            <el-button size="small" plain @click="savePla">立即发送</el-button>
            <el-button size="small" plain>定时发送</el-button>
          </div>
        </ul>
      </div>
    </div>
    <!-- 弹框 -->
    <transition-group name="fade">
      <div class="modal" v-show="fansTaskShow" :key="1">

        <div class="camilo">
          <div class="modal-header">
            <h2>添加账号
              <span @click="fansTaskShow= false,mask = false">x</span>
            </h2>
          </div>
          <div class="modal-body">
            <div class="search">
              <el-input placeholder="请输入搜索关键字" v-model="input4">
                <template slot="append" @click="searchContent">搜索</template>
              </el-input>
            </div>
            <div class="content">
              <div class="left">

                <h3>
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部分组</el-checkbox>
                </h3>
                <div class="checkleft">
                  <template>

                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                      <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>
                  </template>

                </div>
              </div>
              <div class="right">
                <template>
                  <h3>
                    <el-checkbox :indeterminate="isIndeterminate_two" v-model="checkAll_two" @change="handleCheckAllChange_two">分组账号</el-checkbox>
                  </h3>
                  <div style="margin: 15px 0;"></div>
                  <el-checkbox-group v-model="checkedCities_two" @change="handleCheckedCitiesChange_two">
                    <el-checkbox v-for="group_accounts in groupId" :label="group_accounts" :key="group_accounts">{{group_accounts}}</el-checkbox>
                  </el-checkbox-group>
                </template>
              </div>
            </div>
            <div class="total">
              当前已选账号：0个
            </div>
          </div>
          <div class="modal-footer">
            <el-button plain type="primary" @click="sendAcount">确认</el-button>
          </div>
        </div>
      </div>
    </transition-group>
    <!-- 蒙板 -->
    <div class="mask" v-show="mask" style="z-index:110"></div>
    <!-- 定时发布 弹窗 -->
    <div class="fansTaskTime public" v-show="fansTaskTime">
      <div class="header">
        <h5>好友请求设置</h5>
        <span @click="mask=false,fansTaskTime=false">×</span>
      </div>
      <div class="content">
        <div class="contentItem">
          <p>可选择5分钟后的任意时刻定时发布，成功设置后不支持修改,但在设定的时间前可取消。</p>
          <div>
            <el-date-picker v-model="valueTime" type="datetime" placeholder="请选择发布日期时间">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button type="success" @click="fansTaskTime">确定</el-button>
        <el-button @click="mask=false,fansTaskTime=false">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
const cityOptions = ["家人", "朋友", "同事", "好友"];
const groupIdOptions = ["账号一", "账号二", "账号三", "账号四"];
export default {
  data() {
    return {
      user_id: null,

      tableNew: [],
      friendsterData: {
        group_all: [],
        group_id:[],
        takeText: "",
        takeImage: "",
      },
      textCheckbox: false,
      imageCheckbox: false,
      mask: false,
      fansTaskShow: false, // 弹框
      fansTaskTime: false,
      valueTime: "",
      input4: "",
      maxPiece: 9, //图片最大张数

      dialogImageUrl: "", //上传
      dialogVisible: false, //上传
      //复选框
      checkAll: false,
      checkedCities: ["家人"],
      cities: cityOptions,
      isIndeterminate: true,
      uploadUrl: "",
      //分组账号
      checkAll_two: false,
      checkedCities_two: ["账号一",],
      groupId: groupIdOptions,
      isIndeterminate_two: true
    };
  },
  methods: {
    /*朋友圈记录*/
    record() {
      this.$router.push("mr_functionRecord");
      sessionStorage.removeItem("friendsterData");
    },
    //上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //上传
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //全选复选
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
      //将全部分组 数据放入表单 的 group_all中
      this.friendsterData.group_all = value;
    },
    //分组账号
    handleCheckAllChange_two(val) {
      this.checkedCities_two = val ? groupIdOptions : [];
      this.isIndeterminate_two = false;
    },
    handleCheckedCitiesChange_two(value) {
      let checkedCount = value.length;
      this.checkAll_two = checkedCount === this.groupId.length;
      this.isIndeterminate_two =
        checkedCount > 0 && checkedCount < this.groupId.length;
        //将分组账号数据放入表单的group_id中
        this.friendsterData.group_id = value;
    },
    /*立即发送*/
    savePla() {
       this.$refs.uploadFriend.submit();
      if (this.friendsterData.takeText == "") {
        this.$message({
          message: "请输入文本内容",
          type: "warning"
        });
      } else {
        let info = JSON.stringify(this.friendsterData);
        console.log(info);
        this.$http(
          "http://106.14.222.244:8000/api/v1/text?key=" +
            sessionStorage.getItem("user_id") +
            "&type=tjy_friendste",
          "POST",
          info
        )
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("保存成功");
            } else {
              this.$message.error("保存失败");
            }
          })
          .catch(err => {
            this.$message.error("保存失败");
          });
      }
    },
    /*获取当前年月日*/
    gainDate() {
      return (
        new Date().getFullYear() +
        "/" +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getDate() +
        " "
      );
    },
    /*获取*/
    findKe() {
      this.$http(
        "http://106.14.222.244:8000/api/v1/usekey?key=" +
          sessionStorage.getItem("user_id") +
          "&type=tjy_friendste",
        "GET"
      ).then(res => {
        if (res.data.code == 0) {
          let info =JSON.stringify(res.data.data);
          console.log(info);
          this.tableNew.push(info);
        } else {
          this.$message({
            message: "查询失败",
            type: "error"
          });
        }
      });
    },
    //发朋友圈
    beforeUploadFriend(file) {
      var $this = this;

      var isIMG;
      if (file.type === "image/jpeg") {
        flag = true;
        isIMG = file.type === "image/jpeg";
      } else if (file.type === "image/png") {
        flag = true;
        isIMG = file.type === "image/png";
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      //		       var reader = new window.FileReader();
      //				 reader.readAsDataURL(file);
      //				 reader.onloadend = function() {
      //		            $this.friendBaseImg = reader.result;
      //					this.fileInfo= file;
      //		            $this.uploadImg(this.fileInfo);
      //				 }
      if (!flag) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isIMG && isLt2M;
    },
    //确认
    sendAcount() {
      let _self = this;
      _self.fansTaskShow = false;
      _self.mask = false;
    },
    //搜索
    searchContent() {
      let _self = this;
      let arr = [];
      _self.cities.map(item => {
        if (item.indexOf(_self.input4) !== -1) {
          arr.push(item);
        }
      });
      console.log(arr);
    }
  },
   mounted() {
    this.findKe();
    //上传图片地址
    this.uploadUrl =
      "http://106.14.222.244:8000/api/v1/file?type=tjy_friendste&key=" +
      sessionStorage.getItem("user_id");
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#friendTake {
  margin: 22px 88px;
  height: 100%;
  background: #e8eff6;
  box-sizing: border-box;
  .title {
    padding: 30px;
    padding-left: 90px;
    background: #fff;
    span{font-size:14px;color:#73879c;}
    h3 {
      font-size: 19px;
    }

    padding-bottom: 50px;
    ul {
      overflow: hidden;
      .li {
        float: left;
      }
      .li2 {
        width: 400px;
      }
    }

    .cloose {
      p {
        color: #73879c;
        cursor: pointer;
        width: 100%;
        height: 40px;
        line-height: 40px;
        i {
          color: #409eff;
        }
      }
    }

    .main {
      .textbox {
        padding: 15px 450px 15px 0px;
      }
      .upload {
        padding: 20px 0 20px 0px;
        overflow: hidden;

        .btnbox {
          margin-top: 25px;
          .el-button {
            border: 1px solid #409eff;
            color: #409eff;
          }
          .el-button:focus,
          .el-button:hover {
            border-color: #409eff;
            background-color: #e6f2ff;
          }
        }
      }
    }
  }
  //弹框样式
  .modal {
    // background: red;
    height: 20px;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .camilo {
    width: 520px;
    height: 560px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -260px;
    margin-top: -280px;
    z-index: 111;
    background: #fff;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    .modal-header {
      position: relative;
      padding: 10px 15px;
      background: #409eff;
      color: #fff;
      text-align: center;
      border-radius: 6px 6px 0 0;
      border-bottom: 1px solid #e5e5e5;
      h2 {
        font-size: 18px;
        position: relative;
        line-height: 25px;
        span {
          position: absolute;
          right: 0px;
          cursor: pointer;
          padding: 0px 10px;
        }
      }
    }
    .modal-body {
      padding: 15px 20px 0;
      line-height: 20px;
      text-align: center;
      font-size: 14px;
      color: #73879c;
      border-bottom: 1px solid #e5e5e5;
      .content {
        height: 320px;
        margin: 15px 0;
        border: 1px solid #e5e5e5;
        h3 {
          line-height: 40px;
          border-bottom: 1px solid #e5e5e5;
        }
        .left {
          width: 50%;
          height: 320px;
          float: left;
          overflow: auto;
          border-right: 1px solid #e5e5e5;
          ul > li {
            padding-left: 20px;
            text-align: left;
            line-height: 40px;
            border-bottom: 1px solid #e5e5e5;
          }
        }
        .right {
          width: 50%;
          float: right;
        }
      }
      .total {
        height: 45px;
        line-height: 30px;
        color: #409eff;
      }
    }
    .modal-footer {
      padding: 10px 0;
      line-height: 20px;
      text-align: center;
      font-size: 14px;
      color: #73879c;
    }
  }
}
</style>

