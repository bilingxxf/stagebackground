<template>
  <div id="addPoint">
    <div class="part">
      <div class="pointName">
        <span>计划名称</span>
        <el-input v-model="pointData.pointName" style="width:240px;"></el-input>
      </div>
      <div class="partItem">
        <div class="top">
          <el-checkbox v-model="pointData.friends_add.friendsAdd"
            @change="checkedChange(pointData.friends_add.friendsAdd,'addBottom')">
            <span style="font-size: 19px;color:#666666 !important;">好友互加</span>
          </el-checkbox>
        </div>
        <div class="bottom" v-if="addBottom">
          <div class="item">
            <el-checkbox v-model="pointData.friends_add.friendsValidation">自动通过好友验证</el-checkbox>
          </div>
          <div class="item">
            <p class="first">互加时间段</p>
            <p class="scoend">系统会在时间段内加好友 *频率* 次</p>
          </div>
          <div class="item" v-for="(item,index) in pointData.friends_add.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>频率</span>
            <el-input v-model="item.frequency"></el-input>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.friends_add.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>
      </div>
      <div class="partItem">
        <div class="top">
          <el-checkbox v-model="pointData.friends_chat.friendsChat"
            @change="checkedChange(pointData.friends_chat.friendsChat,'chatBottom')">
            <span style="font-size: 19px;color:#666666 !important;">好友互聊</span>
          </el-checkbox>
        </div>
        <div class="bottom" v-if="chatBottom">
          <div class="item">
            <p class="first">互动时间段</p>
            <p class="scoend">系统会在时间段内发送 *频率* 条信息</p>
          </div>
          <div class="item" v-for="(item,index) in pointData.friends_chat.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>频率</span>
            <el-input v-model="item.frequency"></el-input>
          </div>
          <div class="bottom">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.friends_chat.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>
      </div>

      <div class="partItem">
        <div class="top">
          <el-checkbox v-model="pointData.group_chat.groupChat"
            @change="checkedChange(pointData.group_chat.groupChat,'groupBottom')">
            <span style="font-size: 19px;color:#666666 !important;">群聊</span>
          </el-checkbox>
        </div>
        <div class="bottom" v-if="groupBottom">
          <div class="item">
            <p class="first">互动时间段</p>
            <p class="scoend">系统会在时间段内发送 *频率* 条信息</p>
          </div>
          <div class="item" v-for="(item,index) in pointData.group_chat.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>频率</span>
            <el-input v-model="item.frequency"></el-input>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;" @click="addTime(pointData.group_chat.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>
      </div>

      <div class="partItem">
        <div class="top">
          <el-checkbox v-model="pointData.Subscription.subscription"
            @change="checkedChange(pointData.Subscription.subscription,'subscriptionBottom')">
            <span style="font-size: 19px;color:#666666 !important;">订阅号</span>
          </el-checkbox>
        </div>
        <div class="bottom" v-if="subscriptionBottom">
          <div class="item">
            <el-checkbox v-model="pointData.Subscription.Read.read">阅读</el-checkbox>
          </div>
          <div class="item">
            <p class="first">在时间段内自动从推送的订阅号中阅读文章</p>
          </div>
          <div class="item" v-for="(item,index) in pointData.Subscription.Read.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>篇数</span>
            <el-input v-model="item.frequency"></el-input>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.Subscription.Read.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>

        <div class="bottom" v-if="subscriptionBottom">
          <div class="item">
            <el-checkbox v-model="pointData.Subscription.Like.like">点赞</el-checkbox>
          </div>
          <div class="item">
            <p class="first">在时间段内，每阅读N篇文章点赞1次</p>
          </div>
          <div class="item" v-for="(item,index) in pointData.Subscription.Like.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>点赞频率</span>
            <el-input v-model="item.frequency"></el-input>
            <span>(不可大于阅读篇数)</span>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.Subscription.Like.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>

        <div class="bottom" v-if="subscriptionBottom">
          <div class="item">
            <el-checkbox v-model="pointData.Subscription.Collect.collect">收藏</el-checkbox>
          </div>
          <div class="item">
            <p class="first">在时间段内，每阅读N篇文章收藏1次</p>
          </div>
          <div class="item" v-for="(item,index) in pointData.Subscription.Collect.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>收藏频率</span>
            <el-input v-model="item.frequency"></el-input>
            <span>(不可大于阅读篇数)</span>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.Subscription.Collect.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>
      </div>

      <div class="partItem">
        <div class="top">
          <el-checkbox v-model="pointData.Bottle.bottle"
            @change="checkedChange(pointData.Bottle.bottle,'bottleBottom')">
            <span style="font-size: 19px;color:#666666 !important;">漂流瓶</span>
          </el-checkbox>
        </div>
        <div class="bottom" v-if="bottleBottom">
          <div class="item">
            <el-checkbox v-model="pointData.Bottle.gain_bottle.gainBottle">捞瓶</el-checkbox>
          </div>
          <div class="item">
            <p class="first">在时间段内自动从推送的订阅号中阅读文章</p>
          </div>
          <div class="item" v-for="(item,index) in pointData.Bottle.gain_bottle.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>次数</span>
            <el-input v-model="item.frequency"></el-input>
            <span>自动回复</span>
            <el-checkbox v-model="pointData.Bottle.gain_bottle.reply"></el-checkbox>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.Bottle.gain_bottle.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>

        <div class="bottom" v-if="bottleBottom">
          <div class="item">
            <el-checkbox v-model="pointData.Bottle.lose_bottle.loseBottle">丢瓶</el-checkbox>
          </div>
          <div class="item">
            <p class="first">系统会自动发送文字</p>
          </div>
          <div class="item" v-for="(item,index) in pointData.Bottle.lose_bottle.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>次数</span>
            <el-input v-model="item.frequency"></el-input>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.Bottle.lose_bottle.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>
      </div>

      <div class="partItem">
        <div class="top">
          <el-checkbox v-model="pointData.Walk.walk">
            <span style="font-size: 19px;color:#666666 !important;">步数</span>
          </el-checkbox>
        </div>
      </div>

      <div class="partItem">
        <div class="top">
          <el-checkbox v-model="pointData.Circle.circle"
            @change="checkedChange(pointData.Circle.circle,'circleBottom')">
            <span style="font-size: 19px;color:#666666 !important;">朋友圈</span>
          </el-checkbox>
        </div>
        <div class="bottom" v-if="circleBottom">
          <div class="item">
            <el-checkbox v-model="pointData.Circle.send_circle.sendCircle">发圈</el-checkbox>
          </div>
          <div class="item" v-for="(item,index) in pointData.Circle.send_circle.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>次数</span>
            <el-input v-model="item.frequency"></el-input>
            <span>发圈模式</span>
            <el-select v-model="item.pattern" placeholder="请选择">
              <el-option v-for="items in patterns" :key="items.value" :label="items.label" :value="items.value">
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.Circle.send_circle.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>

        <div class="bottom" v-if="circleBottom">
          <div class="item">
            <el-checkbox v-model="pointData.Circle.Comment.comment">评论</el-checkbox>
          </div>
          <div class="item" v-for="(item,index) in pointData.Circle.Comment.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>次数</span>
            <el-input v-model="item.frequency"></el-input>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.Circle.Comment.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>
        <div class="bottom" v-if="circleBottom">
          <div class="item">
            <el-checkbox v-model="pointData.Circle.Like.like">点赞</el-checkbox>
          </div>
          <div class="item" v-for="(item,index) in pointData.Circle.Like.time" :index="index" :key="index">
            <span>{{index+1}}</span>
            <el-time-picker placeholder="起始时间" v-model="item.startTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>至</span>
            <el-time-picker placeholder="结束时间" v-model="item.endTime" value-format="timestamp" :picker-options="{
		                      selectableRange:'00:00:00-23:59:59'
		                    }">
            </el-time-picker>
            <span>次数</span>
            <el-input v-model="item.frequency"></el-input>
          </div>
          <div class="item">
            <div class="cross">
              <hr>
            </div>
            <el-button type="text" style="display: block;margin-top: 20px;"
              @click="addTime(pointData.Circle.Like.time)">
              <i class="el-icon-circle-plus-outline">添加时间段</i>
            </el-button>
          </div>
        </div>
      </div>
      <div class="partBottom">
        <el-button type="primary" @click="savePlan">保存计划</el-button>
        <el-button @click="saveAndclose">保存计划&关闭所有功能</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from "axios";
  export default {
    data() {
      return {
        walkBottom: false,
        circleBottom: false,
        addBottom: false,
        chatBottom: false,
        groupBottom: false,
        subscriptionBottom: false,
        bottleBottom: false,
        patterns: [{
            value: 0,
            label: "随机"
          },
          {
            value: 1,
            label: "全文字"
          },
          {
            value: 2,
            label: "带图"
          }
        ],
        pointData: {
          key: "",
          pointName: "",
          Walk: {
            walk: false
          },
          friends_add: {
            friendsAdd: false,
            friendsValidation: false,
            time: [{
              startTime: "",
              endTime: "",
              frequency: "0"
            }]
          },
          friends_chat: {
            friendsChat: false,
            time: [{
              startTime: "",
              endTime: "",
              frequency: "0"
            }]
          },
          group_chat: {
            groupChat: false,
            time: [{
              startTime: "",
              endTime: "",
              frequency: "0"
            }]
          },
          Subscription: {
            subscription: false,
            Read: {
              read: false,
              time: [{
                startTime: "",
                endTime: "",
                frequency: "0"
              }]
            },
            Like: {
              like: false,
              time: [{
                startTime: "",
                endTime: "",
                frequency: "0"
              }]
            },
            Collect: {
              collect: false,
              time: [{
                startTime: "",
                endTime: "",
                frequency: "0"
              }]
            }
          },
          Bottle: {
            bottle: false,
            gain_bottle: {
              gainBottle: false,
              reply: false,
              time: [{
                startTime: "",
                endTime: "",
                frequency: "0"
              }]
            },
            lose_bottle: {
              loseBottle: false,
              time: [{
                startTime: "",
                endTime: "",
                frequency: "0"
              }]
            }
          },
          Circle: {
            circle: false,
            send_circle: {
              sendCircle: false,
              pattern: "",
              time: [{
                startTime: "",
                endTime: "",
                frequency: "0"
              }]
            },
            Comment: {
              comment: false,
              time: [{
                startTime: "",
                endTime: "",
                frequency: "0"
              }]
            },
            Like: {
              like: false,
              time: [{
                startTime: "",
                endTime: "",
                frequency: "0"
              }]
            }
          }
        },
        token: ""
      };
    },
    methods: {
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
      /*添加时间段*/
      addTime(data) {
        data.push({
          startTime: "",
          endTime: "",
          frequency: "0"
        });
      },
      /*保存计划*/
      savePlan() {
        console.log(this.pointData.friends_chat)
        if (sessionStorage.getItem("pointData")) {
          console.log(sessionStorage.getItem("pointData"))
          let data = JSON.parse(sessionStorage.getItem("pointData")).key;
          console.log(this.pointData)
          //      if (this.pointData.pointName == "") {
          //        this.$message({
          //          message: "请输入计划名称",
          //          type: "warning"
          //        });
          //      } else {
          //        axios
          //          .post(
          //            "http://106.14.222.244:8000/api/v1/text?type=haveNo&key=" + data,
          //            this.pointData,
          //            {
          //              headers: {
          //                "Content-Type": "application/x-www-form-urlencoded"
          //              }
          //            }
          //          )
          //          .then(res => {
          //            if (res.data.code == 0) {
          //              this.$message({
          //                message: "修改成功",
          //                type: "success"
          //              });
          //              this.$router.push("con_pointManage");
          //            } else {
          //              this.$message({
          //                message: "修改失败",
          //                type: "error"
          //              });
          //            }
          //          })
          //          .catch(err => {
          //            this.$message({
          //              message: "修改失败",
          //              type: "error"
          //            });
          //          });
          //      }
          //    } else {
          //      console.log(1)
          //      if (this.pointData.pointName == "") {
          //        this.$message({
          //          message: "请输入计划名称",
          //          type: "warning"
          //        });
          //      } else {
          //        axios
          //          .post(
          //            "http://106.14.222.244:8000/api/v1/text?type=haveNo",
          //            this.pointData,
          //            {
          //              headers: {
          //                "Content-Type": "application/x-www-form-urlencoded"
          //              }
          //            }
          //          )
          //          .then(res => {
          //            if (res.data.code == 0) {
          //              this.token = res.data.data;
          //              this.$message({
          //                message: "新增成功",
          //                type: "success"
          //              });
          //              this.findKey(this.token);
          //            } else {
          //              this.$message({
          //                message: "新增失败",
          //                type: "error"
          //              });
          //            }
          //          })
          //          .catch(err => {
          //            this.$message({
          //              message: "新增失败",
          //              type: "error"
          //            });
          //          });
          //      }
        }
      },
      /*获取KEY*/
      findKey(item) {
        axios
          .get(
            "http://106.14.222.244:8000/api/v1/usekey?type=havenoKey&key=" +
            sessionStorage.getItem("user_id"), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          )
          .then(res => {
            if (res.data.code == 0) {
              let arr = [];
              let arrs = [];
              if (!res.data.data) {
                arr.push(item);
                this.saveKey(arr.join(","));
                this.$router.push("con_pointManage");
              } else {
                JSON.parse(res.data.data)
                  .key.split(",")
                  .map(function (part) {
                    if (part != "") {
                      arrs.push(part);
                    }
                  });
                arrs.push(item);
                this.saveKey(arrs.join(","));
                this.$router.push("con_pointManage");
              }
            } else {
              this.$message({
                message: "查询失败",
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "查询失败",
              type: "error"
            });
          });
      },
      /*保存key*/
      saveKey(items) {
        axios
          .post(
            "http://106.14.222.244:8000/api/v1/text?type=havenoKey&key=" +
            sessionStorage.getItem("user_id"), {
              key: items
            }, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          )
          .then(res => {})
          .catch(err => {});
      },
      /*保存计划关闭功能*/
      saveAndclose() {
        this.pointData.friends_add.friendsAdd = false;
        this.pointData.Circle.circle = false;
        this.pointData.Walk.walk = false;
        this.pointData.friends_chat.friendsChat = false;
        this.pointData.group_chat.groupChat = false;
        this.pointData.Subscription.subscription = false;
        this.pointData.Bottle.bottle = false;
        this.savePlan();
      },
      /*显示隐藏*/
      checkedChange(item, show) {
        console.log(item)
        this[show] = item;
      }
    },
    mounted() {
      if (sessionStorage.getItem("pointData")) {
        this.pointData = JSON.parse(sessionStorage.getItem("pointData"));
        this.addBottom = this.pointData.friends_add.friendsAdd;
        this.chatBottom = this.pointData.friends_chat.friendsChat;
        this.groupBottom = this.pointData.group_chat.groupChat;
        this.subscriptionBottom = this.pointData.Subscription.subscription;
        this.bottleBottom = this.pointData.Bottle.bottle;
        this.circleBottom = this.pointData.Circle.circle;
        this.walkBottom = this.pointData.Walk.walk;
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #addPoint {
    padding: 22px 88px;

    i {
      font-size: 18px;
      color: #bababa;
    }

    .cross {
      padding: 20px 0;

      hr {
        width: 62%;
        height: 1px;
        border: none;
        background: #e8e8e8;
      }
    }

    .part {
      padding: 50px 52px;
      background-color: #fff;

      .pointName {
        margin-bottom: 40px;

        span {
          font-size: 19px;
        }
      }

      .partItem {
        margin-bottom: 40px;

        .top {
          margin-bottom: 5px;
        }

        .bottom {
          background-color: rgba(251, 251, 251, 1);
          padding: 10px;

          .item {
            margin-bottom: 10px;

            span {
              margin-left: 20px;
            }

            .first {
              font-size: 14px;
            }

            .scoend {
              font-size: 12px;
            }

            .el-input {
              width: 120px !important;
            }
          }
        }
      }

      .partBottom {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
</style>
