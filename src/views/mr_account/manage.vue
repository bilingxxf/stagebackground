<template>
  <div id="managent" class="main-body">
    <div class="manage main-wrapper">
      <div class="manage-header">当前有{{unlineAccount}}个账号离线，点击“一键上线”可立即批量发送登录申请。</div>
      <div class="flex-total">
        <div class="item">
          <div class="number">{{accountTotal || '-'}}</div>
          <p>总数</p>
        </div>
        <div class="item">
          <div class="number">{{onlineAccount || '-'}}</div>
          <p>在线数</p>
        </div>
        <div class="item">
          <div class="number">{{unlineAccount || '-'}}</div>
          <p>离线数</p>
        </div>
      </div>
      <div class="headerButton">
        <el-button
          type="primary"
          class="ele-btn"
          @click="showOnLine"
          :disabled="timeOutStopBtn"
        >一键上线</el-button>
        <el-button type="primary" class="ele-btn" @click="showDownLine">一键下线</el-button>
      </div>
      <div class="search">
        <div class="page-title">
          <span>账号管理</span>
        </div>

        <!-- 账号详情 -->
        <div>
          <div class="search-content">
            <div class="left">
              <el-select size="small" class="ele-select" v-model="statu" @change="page = 1,init()">
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                size="small"
                class="ele-select"
                v-model="selectGroup"
                placeholder="请选择分组"
                clearable
                @change="page=1,init()"
              >
                <el-option
                  v-for="item in groups"
                  :key="item.value"
                  :label="item.wx_user_group_name"
                  :value="item.wx_user_group_id"
                ></el-option>
              </el-select>
              <el-select
                size="small"
                class="ele-select"
                v-model="accountStatusInfo"
                placeholder="状态"
                clearable
                @change="page=1,init()"
              >
                <el-option
                  v-for="item in accountStatusGroup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                size="small"
                class="ele-select"
                v-model="terminalId"
                placeholder="所有客户终端"
                clearable
                @change="page=1,init()"
              >
                <el-option label="终端" value=""></el-option>
                <el-option label="未绑定" value="0"></el-option>
                <el-option
                  v-for="(item,index) in terminal"
                  :key="index"
                  :label="item.terminal_id==0?'未绑定':item.terminal_id+'('+item.onlineCount+'/'+item.terminalTotalCount+')'"
                  :value="item.terminal_id"
                ></el-option>
              </el-select>
              <el-input
                class="ele-input"
                @change="page=1,init()"
                placeholder="请输入微信昵称"
                suffix-icon="el-icon-search"
                v-model="wxorname"
              ></el-input>
            </div>
            <div class="right">
              <a :href="href" download="数据.xls">导出数据</a>
              <el-button type="primary" class="ele-btn" @click="routeAdd">添加账号</el-button>
            </div>
          </div>
          <div class="table">
            <div class="edit-group">
              <em>批量操作：</em>
              <span class="edit-btn" type="text" size="mini" @click="showModel('name','修改昵称')">修改昵称</span>
              <span class="edit-btn" type="text" size="mini" @click="showModel('head','修改头像')">修改头像</span>
              <!-- <span type="text" size="mini" @click="mask=true,checkSelect.length>0?setgroup=true:batchChanges=true,batchName='修改分组'">修改分组</span>  -->
              <span class="edit-btn" type="text" size="mini" @click="showModel('area','修改地区')">修改地区</span>
              <!-- <span type="text" size="mini" @click="mask=true,checkSelect.length>0?signature=true:batchChanges=true,batchName='修改个性签名'">修改签名</span> -->
              <span class="edit-btn" type="text" size="mini" @click="showModel('sex','修改性别')">修改性别</span>
              <!-- <span type="text" size="mini" @click="mask=true,jsonName.length>0?setpass=true:batchChanges=true,batchName='修改密码'">修改密码</span>
              <span type="text" size="mini" @click="mask=true,jsonName.length>0?batchChange=true:batchChanges=true,batchName='修改封面'">修改封面</span>-->
              <!-- <span type="text" size="mini" @click="mask=true,checkSelect.length>0?batchChange=true:batchChanges=true,batchName='养号配置'">养号配置</span> -->
              <span
                class="edit-btn"
                type="text"
                size="mini"
                @click="showModel('validate','好友验证')"
              >好友验证</span>
              <!-- <span type="text" size="mini" @click="mask=true,jsonName.length>0?permissions=true:batchChanges=true,batchName='朋友圈权限'">朋友圈权限</span> -->
              <span class="edit-btn" type="text" size="mini" @click="showModel('delete','删除')">删除</span>
              <!-- <span type="text" size="mini" @click="mask=true,checkSelect.length>0?batchChange=true:batchChanges=true,batchName='互加'">拉群</span> -->
              <!-- <span type="text" size="mini" @click="mask=true,checkSelect.length>0?batchChange=true:batchChanges=true,batchName='加群'">入群</span>-->
              <span class="edit-btn" type="text" size="mini" @click="showModel('group','修改分组')">修改分组</span>
              <span class="edit-btn" @click="showModel('cover','设置朋友圈封面')"
              >设置朋友圈封面</span>
              <span class="edit-btn" @click="showModel('power','设置朋友圈权限')">设置朋友圈权限</span>
              <span class="edit-btn" @click="tableOneKeyModel('group','上线')">上线</span>
              <span class="edit-btn" @click="showModel('bindTerminal','绑定客户终端')">绑定客户终端</span>
              <span class="edit-btn" @click="showModel('unbindTerminal','解除客户终端')">解除客户终端</span>
            </div>
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="tableLoading"
              class="ele-table-init"
              @sort-change="addSort"
              :default-sort = "{prop: 'addCount', order: addSortOrder}"
            >
             <el-table-column type="selection" align="left" fixed="left"></el-table-column>
              <!-- <el-table-column width="30" ></el-table-column> -->
             
              <el-table-column label="序号" width="50" align="left">
                <template slot-scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
              </el-table-column>

              <el-table-column width="140" label="账号昵称" align="left">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.nickname}"
                    placement="bottom"
                    effect="light"
                    :offset="80"
                  >
                    <span slot="content">{{scope.row.nickname}}</span>
                    <p class="writeWrapper">{{scope.row.nickname}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="微信号" width="140" align="left">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.wx_username}"
                    placement="bottom-end"
                    effect="light"
                    :offset="80"
                  >
                    <span class="tooltipText" slot="content">
                      <span class="tooltipText">{{scope.row.wx_username}}</span>
                    </span>
                    <p class="writeWrapper">{{scope.row.wx_username}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="sex" label="性别" width="50" align="left">
                <template slot-scope="scope">{{scope.row.sex | capitalize}}</template>
              </el-table-column>
              <el-table-column label="二维码" align="left" width="65">
                <template slot-scope="scope">
                  <img src="../../assets/erweima.png" height="100" @click="getCode(scope.$index)">
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机号" align="left" width="110"></el-table-column>
              <el-table-column prop="pingCity" label="地区" align="left" width="120">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.pingCity}"
                    placement="bottom-end"
                    effect="light"
                    :offset="80"
                  >
                    <span slot="content">{{scope.row.pingCity}}</span>
                    <p class="writeWrapper">{{scope.row.pingCity}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="contactCount" label="好友数" align="center" width="70"></el-table-column>
              <el-table-column prop="currenContactCount" label="新增" align="center" width="70"></el-table-column>
              <el-table-column prop="group_name" label="分组" align="center" width="70">
                 <template slot-scope="scope">
                    <el-tooltip
                      :open-delay="350"
                      content="{scope.row.group_name}"
                      placement="bottom-end"
                      effect="light"
                      :offset="80">
                        <span slot="content">{{scope.row.group_name}}</span>
                        <p class="writeWrapper" >{{scope.row.group_name}}</p>
                    </el-tooltip>
                  </template>
              </el-table-column>
              <el-table-column prop="locked" label="状态" align="left" width="70">
                <template slot-scope="scope">{{scope.row.online | statulize}}</template>
              </el-table-column>
              <el-table-column prop="status" label="健康状态" align="left" width="85">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.status | accountStatus}"
                    placement="bottom-end"
                    effect="light"
                    :offset="80">
                      <span slot="content">{{scope.row.status | accountStatus}}</span>
                      <p class="writeWrapper" >{{scope.row.status | accountStatus}}</p>
                  </el-tooltip>
                  </template>
              </el-table-column>
              <el-table-column prop="errorMessage" label="状态描述" align="left" width="80">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{scope.row.errorMessage ? scope.row.errorMessage:'正常'}"
                    placement="bottom-end"
                    effect="light"
                    :offset="80">
                      <span slot="content">{{scope.row.errorMessage ? scope.row.errorMessage:'正常'}}</span>
                      <p class="writeWrapper">{{scope.row.errorMessage ? scope.row.errorMessage:'正常'}}</p>
                  </el-tooltip>
                  </template>
              </el-table-column>
              <el-table-column prop="terminalId" label="所属终端ID" align="left" width="200">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="350"
                    content="{}"
                    placement="bottom"
                    effect="light"
                    :offset="80"
                  >
                    <span slot="content">{{scope.row.terminalId}}</span>
                    <p class="writeWrapper">{{scope.row.terminalId}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="right" width="300">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="scope.row.online===1"
                    @click="takeLogout(scope.$index),batchName='下线'"
                  >下线</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.online===0"
                    @click="takeLogin(scope.$index),batchName='上线'"
                  >上线</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.online===1"
                    @click="takeFriend(scope.row)"
                  >朋友圈</el-button>
                  <el-button
                    type="text"
                    @click="takeUserID(scope.$index)"
                    v-if="scope.row.wx_username.startsWith('wxid')&&scope.row.online===1"
                  >设置微信号</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.online===1"
                    @click="setCover(scope.row,'设置朋友圈封面'), batchName='设置朋友圈封面'"
                  >朋友圈封面</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.online===1"
                    @click="setPower(scope.row,'设置朋友圈权限'), batchName='朋友圈权限'"
                  >朋友圈权限</el-button>
                </template>
              </el-table-column>
              <el-table-column width="30"></el-table-column>
            </el-table>
          </div>
          <div class="pagination" v-if="tableData.length!=0">
            <el-pagination
              @size-change="recordSizeChange"
              @current-change="recordCurrentChange"
              :current-page.sync="page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="limit"
              layout="total,sizes, prev, pager, next"
              :total="allAccount"
            ></el-pagination>
          </div>
        </div>
        <!-- 已注销账号 -->
        <div v-if="cancellation" key="cancellation"></div>
      </div>
      <!--表格头部上线-->
      <Dialog @callback="tableOnekeyOnline" v-if="dialogFlag=='tableOneKey'">
        <div class="dialog-content downline" slot="content">
          <p>是否确认上线</p>
          <p>上线后，请勿进行解绑操作！</p>
        </div>
      </Dialog>
      <Dialog @callback="logoutBnt" v-if="dialogFlag=='downline'">
        <div class="dialog-content downline" slot="content">
          <p>确定要下线吗</p>
          <p>如有任务正在运行，请不要轻易下线，否则任务不能正确执行。</p>
        </div>
      </Dialog>
      <Dialog @callback="loginBnt" v-if="dialogFlag=='online'">
        <div class="dialog-content online" slot="content">
          <p>是否确认上线</p>
          <p>上线后，请勿进行解绑操作！</p>
        </div>
      </Dialog>
      <Dialog @callback="downline" v-if="dialogFlag=='batch-downline'">
        <div class="dialog-content online" slot="content">
          <p>确定要批量下线吗？</p>
          <p>如有任务正在运行，请不要轻易下线，否则任务不能正确执行。</p>
        </div>
      </Dialog>
      <Dialog @callback="online" v-if="dialogFlag=='batch-online'">
        <div class="dialog-content batch-online" slot="content">
          <p>是否确认批量上线？</p>
          <p>上线后，请勿进行解绑操作！</p>
        </div>
      </Dialog>
      <!--修改昵称-->
      <Dialog @callback="batchUp" v-if="dialogFlag=='name'" @cancelCallback="resetInitData">
        <div class="dialog-content name" slot="content">
          <span style="color:#666;">昵称：</span>
          <el-input class="ele-input" v-model="batch.nickname" placeholder="请输入昵称"></el-input>
        </div>
      </Dialog>
      <!--修改头像-->
      <Dialog @callback="imagebatchUp" v-if="dialogFlag=='head'">
        <div class="dialog-content head" slot="content">
          <el-upload
            ref="uploadFriend"
            :auto-upload="false"
            :action="uploadUrl"
            list-type="picture-card"
            :show-file-list="true"
            :before-upload="beforeUploadFriend"
            :on-change="changeImg"
            :on-success="successHeadimg"
            v-model="img"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </Dialog>
      <!--修改地区-->
      <Dialog @callback="citybatchUp" v-if="dialogFlag=='area'" @cancelCallback="resetInitData">
        <div class="dialog-content area" slot="content">
          <el-cascader
            class="ele-select"
            :options="cityOptions"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </div>
      </Dialog>
      <!--修改性别-->
      <Dialog @callback="setsexBatchUp" v-if="dialogFlag=='sex'" @cancelCallback="resetInitData">
        <div class="dialog-content sex" slot="content">
          <el-select class="ele-select" v-model="batch.sex" placeholder="请选择">
            <el-option
              v-for="item in batchSexs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </Dialog>
      <!--修改好友验证-->
      <Dialog @callback="validationbtn" v-if="dialogFlag=='validate'" @cancelCallback="resetInitData">
        <div class="dialog-content validate" slot="content">
          <el-select class="ele-select" v-model="batch.validations" placeholder="请选择">
            <el-option
              v-for="item in batchvalidation"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </Dialog>
      <Dialog @callback="deleteidbatchUp" v-if="dialogFlag=='delete'">
        <div class="dialog-content delete" slot="content">
          <p style="color:#666;">确定要删除吗？</p>
        </div>
      </Dialog>
      <Dialog @callback="setGroupBatchUp" v-if="dialogFlag=='group'" @cancelCallback="resetInitData">
        <div class="dialog-content group" slot="content">
          <el-select class="ele-select" v-model="groupsTwo" placeholder="请选择分组">
            <el-option
              v-for="item in groupsTwos"
              :key="item.wx_user_group_id"
              :label="item.wx_user_group_name"
              :value="item.wx_user_group_id"
            ></el-option>
          </el-select>
        </div>
      </Dialog>
      <Dialog v-if="dialogFlag=='code'">
        <div class="dialog-content qrcode" slot="content">
          <div class="qrcode-box" id="qrcode" ref="qrcode" v-if="getQrCode" v-loading="loading"></div>
          <div class="qrcode-box" v-else>
            <img src="../../assets/no.svg" style="width:100%;height:100%" alt v-if="noHave">
            <img src="../../assets/fail.svg" style="width:100%;height:100%" alt v-if="fail">
          </div>
        </div>
      </Dialog>

      <!-- 设置朋友圈封面 -->
      <Dialog @callback="imageCover" v-if="dialogFlag=='cover'" @cancelCallback="hideModel">
        <div class="dialog-content head" slot="content">
          <el-upload
            ref="friendCover"
            :auto-upload="false"
            :action="uploadUrl"
            list-type="picture-card"
            :show-file-list="true"
            :before-upload="beforeUploadFriend"
            :on-change="changeImgCover"
            v-model="img"
            :on-success="successCover"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </Dialog>

      <!-- 设置朋友圈权限 -->
      <Dialog @callback="powerscallback" v-if="dialogFlag=='power'" @cancelCallback="hideModel">
        <div class="dialog-content sex" slot="content">
          <el-select class="ele-select" v-model="setPowers" placeholder="请选择">
            <el-option
              v-for="item in powers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </Dialog>
        <!-- 设置微信号 -->
      <Dialog @callback="useridbatchUp" v-if="flag=='wxh'" @cancelCallback="hideModel">
        <div class="dialog-content sex" slot="content">
            <span style="color:#666;">微信号：</span>
            <el-input class="ele-input" v-model="batch.userid" placeholder="输入微信号"></el-input>
        </div>
      </Dialog>
      <!-- 查看二维码-->
       <Dialog v-if="dialogFlag=='qrcode'">
        <div class="dialog-content qrcode" slot="content">
          <div class="qrcode-box" id="qrcode" ref="qrcode" v-if="getQrCode" v-loading="loading"></div>
          <div class="qrcode-box" v-else>
            <img src="../../assets/no.svg" style="width:100%;height:100%" alt v-if="noHave">
            <img src="../../assets/fail.svg" style="width:100%;height:100%" alt v-if="fail">
          </div>
        </div>
      </Dialog>

      <Dialog v-if="dialogFlag=='bindTerminal'" @callback="bindTerminalEve" @cancelCallback="bindCancelCallback">
        <div class="dialog-content bind-terminal" slot="content">
          <el-select
            size="small"
            class="ele-select"
            v-model="bindTerminalId"
            placeholder="选择绑定终端"
            clearable
          >
            <el-option
              v-for="(item,index) in terminal"
              v-if="item.terminal_id!=0"
              :key="index"
              :label="item.terminal_id"
              :value="item.terminal_id"
            ></el-option>
          </el-select>
          <!--<div class="radio-group" style="margin-top: 20px;font-size: 14px">-->
            <!--<span>绑定后是否立即登录：</span>-->
            <!--<el-radio v-model="bindRadio" :label="1">是</el-radio>-->
            <!--<el-radio v-model="bindRadio" :label="0">否</el-radio>-->
          <!--</div>-->
        </div>
      </Dialog>
      <Dialog v-if="dialogFlag=='unbindTerminal'" @callback="unbindTerminalEve">
        <div class="dialog-content unbind-terminal" slot="content" @callback="unbindTerminalEve">
          <p>确定要解除客户终端吗？</p>
        </div>
      </Dialog>

      <!-- 蒙层 -->
      <div class="mask" v-show="mask"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import City from "../../../static/city";
import QRCode from "qrcodejs2";
import publicUrl from "../../utils/public";
import Dialog from "../../components/dialog.vue";
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
export default {
  components: {
    Dialog
  },
  data(){
    return {
      terminal:[],
      terminalId:"",
      bindRadio:1,
      bindTerminalId:"",
      text:"",
      powers: [
        {
          value: 1,
          label: "全部"
        },
        {
          value: 2,
          label: "半年"
        },
        {
          value: 3,
          label: "3天"
        }
      ],
      setPowers: "",
      flag: "",
      cityOptions: [],
      citySelect: {
        country: "CN",
        city: null,
        province: null
      },
      pop: "",
      isImage: false,
      UserID: [],
      codeImage: "",
      qr_codeID: [],
      friendID: [],
      maxPiece: 3,
      friendText: "",
      multipleSelection: [],
      selectedOptions: [],
      jsonName: [],
      selectname: "",
      taskGroupName: "",
      selectGroup: "",
      ids: [],
      setgroup: false,
      signature: false,
      setpass: false,
      deleteid: false,
      setsex: false,
      validation: false,
      permissions: false,
      logout: false,
      login: false,
      Friend: false,
      codeWindow: false,
      setUserID: false,
      setcityAccording: false,
      friendImg: "friendImg",
      img: "",
      headimage: false,
      getBaseImg: "",
      uploadUrl: "",
      uploadFriend: "",
      tableData1: [],
      Personal: false,
      Personals: {
        name: "",
        area: "",
        signature: ""
      },
      batchChanges: false,
      batch: {
        nickname: "",
        sex: 1,
        textarea: "",
        group: null,
        city: [],
        pass: "",
        userid: "",
        validations: true,
        permissions: ""
      },
      cities: [],
      on_offline: [], //一键上下线所有微信号ID
      batchSexs: [
        {
          label: "男",
          value: 1
        },
        {
          label: "女",
          value: 2
        }
      ],
      batchvalidation: [
        {
          label: "需要验证",
          value: true
        },
        {
          label: "不需要验证",
          value: false
        }
      ],
      friendsterData: {
        key: "",
        takeText: "",
        group_all: [],
        flock_all: [],
        content: [],
        nickName: [],
        takeImage: [],
        wx_username: [],
        time: ""
      },
      tableNew: [],
      batchChange: false,
      batchName: "",
      accountTotal: 0,
      newAccount: 0,
      onlineAccount: 0,
      unlineAccount: 0,
      placeholder: "请输入账号",
      wxorname: "",
      wxname: "",
      pageNo: 1,
      limit: 10,
      page: 1,
      currentPage: 1,
      pageSize1: 10,
      currentPage1: 1,
      pageSize: 10,
      total: 0,
      allAccount: 0,
      totals: 10,
      totals1: 10,
      tableData: [],
      mask: false,
      accountDetails: true,
      cancellation: false,
      statu: "",
      status: [
        {
          label: "全部账号",
          value: ""
        },
        {
          label: "在线",
          value: 1
        },
        {
          label: "离线",
          value: 2
        }
      ],
      statusTostring: ["", "在线", "离线"],
      loginTime: "",
      loginTimes: [
        {
          label: "绑定时间",
          value: 0
        },
        {
          label: "登陆时间",
          value: 1
        },
        {
          label: "下线时间",
          value: 2
        }
      ],
      group: "",
      groups: [],
      groupsTwo: "",
      groupsTwos: [],
      sex: "",
      sexs: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "男",
          value: 1
        },
        {
          label: "女",
          value: 2
        }
      ],
      sexsTostring: ["", "男", "女"],
      userId: [],
      checkSelect: [],
      groupchildrenId: [],
      deletegroups: [],
      deletegroup: "",
      headurl: "",
      href: "", //数据导出
      addAccount: "",
      teken: "",
      task_template_list: [],
      downloadLength: 0,
      getQrCode: true,
      loading: true,
      showLoading: true,
      tableLoading: true,
      fail: false,
      noHave: false,
      publicUrl: publicUrl.info(),
      mainPage: "",
      accountStatusInfo: "", // 健康状态
      accountStatusGroup: [
        {
          value: "",
          label: "健康状态"
        },
        {
          value: -2,
          label: "正常"
        },
        {
          value: 1,
          label: "封号"
        },
        {
          value: 2,
          label: "密码错误"
        },
        {
          value: 3,
          label: "环境异常"
        },
        {
          value: 4,
          label: "Token过期"
        },
        {
          value: 5,
          label: "主机需要授权"
        },
        {
          value: 101,
          label: "其它错误"
        }
      ],
      timeOutStopBtn: false,
      addSortOrder:"descending"
    };
  },

  created() {
    this.cityOptions = City.citys();
    this.userId = sessionStorage.getItem("user_id");
    this.token = sessionStorage.getItem("token");
    this.href =
      this.publicUrl.linkUrl +
      "api/v1/download_excel?token=" +
      this.token +
      "&limit=99999" +
      "&page=1" +
      "&is_online" +
      this.statu;
    this.addAccount = "";
  },
  computed:{
      ...mapState([
        'dialogFlag'
    ])
  },
  mounted() {
    this.getResources();
    this.init();
    // 上传头像地址
    this.uploadUrl =
      this.publicUrl.resourceUrl +
      "api/v1/file?type=tyc_userHeaderImage&key=" +
      this.userId;
    //发圈图地址
    this.uploadUrlFriend =
      this.publicUrl.resourceUrl +
      "api/v1/file?type=tyc_sendpostImg&key=" +
      sessionStorage.getItem("user_id");
    //一键上下线单独接口
    this.$http("get_all_wxuserid", "GET")
      .then(res => {
        if (res.data.error_code == 0) {
          let data = res.data.wx_user_id;
          this.on_offline = data;
        } else {
        }
      })
      .catch(err => {});
    // 分组select列表
    this.$http("wx_group/group_list", "POST", {
      limit: 99999,
      page: 1
    }).then(res => {
        if (res.data.error_code == 0) {
          this.groups = res.data.data.result;
        } else {
          this.$message({
            message: "获取列表失败:" + res.data.error_message,
            type: "error"
          });
        }
      })
      .catch(err => {});
    //获取任务列表
    this.$http("task_template", "GET", {
      per_page: 99999,
      page: 1
    })
      .then(res => {
        if (res.data.error_code == 0) {
          this.task_template_list = res.data.data.result;
        } else {
          this.$message({
            message: "获取列表失败:" + res.data.error_message,
            type: "error"
          });
        }
      })
      .catch(err => {});
    this.getTerminal();
  },
  methods: {
    //新增好友排序
    addSort(sortData){
      let sortType=sortData.order;
      this.addSortOrder=sortType;
    },
    //绑定终端取消回调
    bindCancelCallback(){
      this.bindTerminalId="";
      this.$store.dispatch("hideDialog");
    },
    //解绑终端
    unbindTerminalEve(){
      this.$http("terminal/binding","PUT",{
        operationType:2,
        ids:this.jsonName
      }).then((res)=>{
        if(res.status==200){
          let code=res.data.code;
          let msg=res.data.message;
          switch (code) {
            case 0:
              this.$message.success("解绑成功!");
              this.page=1;
              this.init();
              this.getTerminal();
              break;
            default:
              this.$message.error(msg)
              break;
          }
          this.$store.dispatch("hideDialog");
          this.bindTerminalId="";
        }else{
          this.$message.error("解绑失败!");
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    //绑定终端
    bindTerminalEve(){
      let _this=this;
      if(this.bindTerminalId==""){
        this.$message.warning("请选择绑定终端");
        return;
      }
      this.$http("terminal/binding","PUT",{
        operationType:1,
        terminalId:this.bindTerminalId,
        ids:this.jsonName
      }).then((res)=>{
        if(res.status==200){
          let code=res.data.code;
          let msg=res.data.message;
          switch (code) {
            case 0:
              this.$message.success("绑定成功!");
              this.page=1;
              this.init();
              this.getTerminal();
              break;
            default:
              this.$message.error(msg)
              break;
          }
          this.$store.dispatch("hideDialog");
          this.bindTerminalId="";
        }else{
          this.$message.error("绑定失败!");
        }
      }).catch((err)=>{
        console.log(err);
      })
      //this.tableOnekeyOnline();
    },
    //获取终端列表
    getTerminal() {
      this.$http("terminal/searchkey", "GET", {
        userId: sessionStorage.getItem("user_id")
      }).then((res) => {
        if (res.data.error_code == 0) {
          let list = res.data.data;
          if(list instanceof Array){
            this.terminal = list;
          }
        }
      })
    },
    //恢复初始数据
    resetInitData(){
      this.batch.nickname = "";
      this.batch.sex = 1;
      this.batch.textarea = "";
      this.groupsTwo = "";
     this.selectedOptions=[];
      this.batch.pass = "";
      this.batch.userid = "";
      this.batch.validations = true;
      this.batch.permissions = "";
      this.$store.dispatch("hideDialog");
    },
    //朋友圈权限
    setPower(row, title) {
      this.UserID.push(row.wx_user_id);
      this.flag = "power";
      this.$store.dispatch("showDialog", {
        title: title,
        showCancel: true,
        flag:"power"
      });
    },
    powerscallback() {
      let param = {};
      param.permission = this.setPowers;
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置朋友圈权限",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.UserID = [];
            this.setPowers = "";
            this.hideModel();
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    },
    //设置朋友圈封面
    setCover(row, title) {
      this.UserID.push(row.wx_user_id);
      this.flag = "cover";
      this.$store.dispatch("showDialog", {
        title: title,
        showCancel: true,
        flag:"cover"
      });
    },
    successCover() {
      axios
        .get(
          this.publicUrl.resourceUrl +
            "api/v1/usekey?type=tyc_userHeaderImage&key=" +
            this.userId,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            this.mainPage = this.publicUrl.newResourceUrl + res.data.data;
            let param = {};
            param.mainPage = this.mainPage;
            let paramInfo = JSON.stringify(param);
            let data = {
              taskTemplateName: "设置朋友圈封面",
              planParams: paramInfo,
              wxIds: this.UserID.toString() || this.jsonName.toString()
            };
            let str = {
              param: JSON.stringify(data)
            };
            this.$http("plan/start_plan", "POST", str)
              .then(res => {
                if (res.data.error_code == 0) {
                  this.specifyInput = "";
                  this.$message({
                    message: "执行成功",
                    type: "success"
                  });
                  this.UserID = [];
                  this.hideModel();
                } else {
                  this.$message({
                    message: "执行失败" + res.data.error_message,
                    type: "error"
                  });
                }
              })
              .catch(err => {
                this.$message({
                  message: "执行失败" + err,
                  type: "error"
                });
              });
          } else {
            this.$message({
              message: "查询图片失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "查询图片失败",
            type: "error"
          });
        });
      //  this.hideModel();
    },
    imageCover() {
      let _this = this;
      let img = _this.img;
      if (img == "") {
        this.$message.error("请上传图片");
        return;
      }
      this.$refs.friendCover.submit();
    },
    changeImgCover(file, fileList) {
      this.img = file;
    },
    showModel(type, title) {
      let _this = this;
      if (_this.jsonName.length == 0) {
        _this.$message.error("请选择账号！");
        return;
      }
      switch (type) {
        case "group":
          _this.AnGroup();
          break;
        default:
          break;
      }
      _this.flag = type;
      _this.$store.dispatch("showDialog", {
        title: title,
        showCancel: true,
        flag:type
      });
    },
    hideModel() {
      this.$store.dispatch("hideDialog");
      this.UserID = [];
    },
    qrcode(qrcodeImg) {
      let qrcode = new QRCode("qrcode", {
        width: 200, // 设置宽度，单位像素
        height: 200, // 设置高度，单位像素
        text: qrcodeImg // 设置二维码内容或跳转地址
      });
    },
    changeImg(file, fileList) {
      this.img = file;
    },
    routeAdd() {
      this.$router.push("mr_add");
    },
    // 表格头部背景颜色
    getHeaderClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#ecf5ff;font-size:14px;color:#409eff;height:40px";
      } else {
        return "";
      }
    },
    //分页
    recordCurrentChange(val) {
      this.page = val;
      this.tableLoading = true;
      this.init();
    },
    recordSizeChange(val) {
      this.limit = val;
      this.recordCurrentChange(1);
    },
    handleChange(value) {
    },

    beforeAvatarUpload(file) {},
    //点击获取二维码
    getCode(index) {
      this.flag = "qrcode";
      this.$store.dispatch("showDialog", {
        title: "二维码",
        flag:'code'
      });

      // this.codeWindow = true;
      // this.mask = true;
      this.qr_codeID = [];
      this.qr_codeID.push(this.tableData[index].wx_user_id);
      this.$http(
        "wx_wxuser/get_qr_code?wx_user_id=" + this.qr_codeID,
        "GET",
        {}
      ).then(res => {
        if (res.data.error_code == 0) {
          let data = res.data;
          if (data.error_message == "") {
            // this.$message({
            //     message: "暂无二维码",
            //     type: "warning"
            // });
            this.getQrCode = false;
            this.noHave = true;
            this.fail = false;
          } else {
            this.loading = false;
            let qrcodeImg = data.error_message;
            this.qr_codeID = [];
            this.getQrCode = true;
            this.$nextTick(() => {
              this.qrcode(qrcodeImg);
            });
            this.noHave = false;
            this.fail = false;
          }
        } else {
          this.$message({
            message: "获取二维码失败",
            type: "warning"
          });
          this.fail = true;
        }
      });
    },
    clearcode() {
      this.codeWindow = false;
      this.mask = false;
      this.codeImage = "";
      this.qr_codeID = [];
    },

    //修改微信id单个
    takeUserID(index) {
      this.UserID.push(this.tableData[index].wx_user_id);
      this.flag = 'wxh'
      this.$store.dispatch('showDialog',{
        title:'设置微信号',
        showCancel:true,
        flag: 'wxh'
      })
    },
    cancel() {
      this.setUserID = false;
      this.mask = false;
      this.UserID = [];
    },
    useridbatchUp() {
      this.setUserID = false;
      this.mask = false;
      let reg =/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
      if(!reg.test(this.batch.userid)){
        this.$message.warning('微信号长度6~20位英文或数字，下划线和减号(必须以字母开头)')
      } else if(this.batch.userid.length > 20 || this.batch.userid.length < 6) {
        this.$message.warning('微信号长度6~20位英文或数字')
      } else {
      this.$http(
        this.publicUrl.resourceUrl +
          "api/v1/text?key=" +
          this.UserID +
          "&type=tyc_alias",
        "POST",
        this.batch.userid
      )
        .then(res => {
          if (res.data.code == 0) {
          } else {
          }
        })
        .catch(err => {});
      let setID = "";
      this.task_template_list.forEach(item => {
        if (item.task_template_name === "设置微信号") {
          setID = item.task_template_id;
        }
      });

      this.$http("task/create_task", "POST", {
        task_template_name: "设置微信号",
        task_template_id: setID,
        enum_wxaccount_source: 2,
        account_list: this.UserID
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.UserID = [];
            this.hideModel()
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });

      }
    },
		// 修改性别
		setsexBatchUp() {
      this.setsexmethod();
      this.hideModel();
    },
    setsexmethod() {
			let param = {};
      param.permission = this.batch.sex
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置用户性别",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST",str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    },
    // 好友验证
    validationbtn() {
      this.setvalidaion();
      this.hideModel();
    },
    setvalidaion(item) {
			let param = {};
      param.permission = this.batch.validations
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置用户验证",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    },

    //修改分组弹出
    AnGroup() {
      // this.batchName='修改分组';
      // this.mask = true;
      // this.jsonName.length > 0
      //     ? (this.setgroup = true)
      //     : (this.batchChanges = true);
      // 分组获取分组列表
      this.$http("wx_group/group_list", "POST", {
        limit: 9999999,
        page: 1
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.groupsTwos = res.data.data.result;
          } else {
            this.$message({
              message: "获取列表失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    //点击确认 修改分组
    setGroupBatchUp() {
      let _this = this;
      let groupsTwo = _this.groupsTwo;
      if (!this.groupsTwo) {
        _this.$message.error("请选择分组");
        return;
      }
      this.mask = false;
      this.setgroup = false;
      this.$http("wx_user_group/wx_user_change_group", "POST", {
        wx_user_group_id: [], //旧分组id
        //  wx_user_id :   this.multipleSelection,           // 用户id
        wx_user_id: this.jsonName,
        new_wx_user_group_id: this.groupsTwo // 新分组id groupsTwo
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "移动分组成功",
              type: "success"
            });
            // this.movePop = false;
            // this.deletegroup = "";
            this.init();
          } else {
            this.$message({
              message: "移动分组失败:" + res.data.error_message,
              type: "error"
            });
          }
          this.hideModel();
        })
        .catch(err => {
          this.$message({
            message: "移动分组失败:" + res.data.error_message,
            type: "error"
          });
          this.hideModel();
        });
    },

    // 修改签名
    signaturebatchUp() {
      this.signature = false;
      this.mask = false;
      this.$http(
        this.publicUrl.resourceUrl +
          "api/v1/text?key=" +
          this.userId +
          "&type=tyc_signature",
        "POST",
        this.batch.nickname
      )
        .then(res => {
          if (res.data.code == 0) {
          } else {
          }
        })
        .catch(err => {});
      let setName = "";
      this.task_template_list.forEach(item => {
        if (item.task_template_name === "设置签名") {
          setName = item.task_template_id;
        }
      });
      this.$http("task/create_task", "POST", {
        task_template_name: "设置签名",
        task_template_id: setName,
        enum_wxaccount_source: 2,
        account_list: this.jsonName
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    },
    //修改昵称
    batchUp() {
      let _this = this;
      let nickname = _this.batch.nickname;
      if (nickname == "") {
        _this.$message.error("请输入昵称");
        return;
			}
			this.setbatch()
      // _this.jsonName.forEach(item => {
      //   _this.setbatch(item);
      // });
      _this.hideModel();
    },
    setbatch() {
			let param = {};
      param.permission = this.batch.nickname
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置用户昵称",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.init();
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    },
    //头像修改
    imagebatchUp() {
      let _this = this;
      let img = _this.img;
      if (img == "") {
        this.$message.error("请上传图片");
        return;
      }
      // this.jsonName.forEach(item => {
        this.setimage();
      // });
      this.hideModel();
    },
    successHeadimg(){
       axios
        .get(
          this.publicUrl.resourceUrl +
            "api/v1/usekey?type=tyc_userHeaderImage&key=" +
            this.userId,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            // console.log(this.jsonName)
            let mainPage = this.publicUrl.newResourceUrl + res.data.data;
            let param = {};
            param.mainPage = mainPage;
            let paramInfo = JSON.stringify(param);
            let data = {
              taskTemplateName: "设置用户头像",
              planParams: paramInfo,
              wxIds: this.UserID.toString() || this.jsonName.toString()
            };
            let str = {
              param: JSON.stringify(data)
            };
            this.$http("plan/start_plan", "POST", str)
              .then(res => {
                if (res.data.error_code == 0) {
                  this.specifyInput = "";
                  this.$message({
                    message: "执行成功",
                    type: "success"
                  });
                  this.UserID = [];
                  this.hideModel();
                } else {
                  this.$message({
                    message: "执行失败" + res.data.error_message,
                    type: "error"
                  });
                }
              })
              .catch(err => {
                this.$message({
                  message: "执行失败" + err,
                  type: "error"
                });
              });
          } else {
            this.$message({
              message: "查询图片失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "查询图片失败",
            type: "error"
          });
        });
    },
    setimage() {
      this.$refs.uploadFriend.submit();
    },
    //删除
    deleteidbatchUp() {
      this.deleteid = false;
      this.mask = false;
      this.$http("wx_wxuser_batch", "POST", {
        wx_user_id: this.jsonName,
        type: 2
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.deleteid = false;
            this.mask = false;
            this.batchChange = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            if(this.tableData.length==1&&this.page>=2){
              this.page=this.page-1;
            }
            this.init();
            this.tableData = res.data.data.result.map(function(item, index) {
              item["index"] = index;
              item["selectArr"] = [];
              item["selectNumber"] = 0;
              item["checked"] = false;
              item["children"] = [];
              return item;
            }); 
          } else {
            this.$message({
              message:  res.data.error_message,
              type: "error"
            });
          }
          this.hideModel();
        })
        .catch(err => {
          this.hideModel();
        });
    },

    //初始化列表
    init() {
      // 根据分组筛选 将组名提取出来
      this.groups.forEach(item => {
        if (item.wx_user_group_id == this.selectGroup) {
          this.taskGroupName = item.wx_user_group_name;
        }
      });
      //title头部数据
      this.$http("wx_wxuse_status", "GET")
        .then(res => {
          if (res.data.error_code == 0) {
            let data = res.data.data;
            this.tableLoading = false;
            this.onlineAccount = data.online;
            this.newAccount = data.new_wx_user_amount;
            this.unlineAccount = data.offline;
            this.accountTotal = data.wx_user_sum;
          } else {
            this.$message({
              message: "获取列表失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.tableLoading = true;
        });
      // 微信号列表
      let params = {};
      let data = {};
      let flag = 0;
      let group_name = this.selectGroup === "" ? "" : this.taskGroupName;

      if(group_name != ''){
          params['groupName']=group_name;
      }
      if(this.statu != ''){
          params['isOnline']=this.statu;
      }
      if(this.wxorname != ''){
          params['wxUserName']=this.wxorname;
      }
      if(this.accountStatusInfo != ''){
          params['status']=this.accountStatusInfo;
      }
      if(this.terminalId!=""){
        if(this.terminalId=='0'){
          params['terminalId']="";
        }else{
          params['terminalId']=this.terminalId;
        }
      }
      if(group_name == ''&&this.statu == ''&&this.wxorname == ''&&this.accountStatusInfo == ''&&this.terminalId==''){
        data = {
          pageNo: this.page,
          length: this.limit,
        };
      }else{
        data = {
          pageNo: this.page,
          length: this.limit,
          searchKey: JSON.stringify(params)
        };
      }
      // if(this.statu){
      //   console.log(1)
      //   params['isOnline'] = this.statu;
      // }
      // if(this.accountStatusInfo){
      //   console.log(2)
      //   params['accountStatus'] = this.accountStatusInfo
      // }
      //    if(this.selectGroup ===""){
      //         params.group_name ===" "
      //    }
      this.$http("wx_user_list_search_key", "POST", data)
        .then(res => {
          if (res.data.error_code == 0) {
            this.showLoading = false;
            this.allAccount = res.data.data.total_count;
            this.href =
              this.publicUrl.linkUrl +
              "api/v1/download_excel?token=" +
              this.token +
              "&limit=99999" +
              "&page=1" +
              "&is_online=" +
              this.statu +
              "&group_name=" +
              group_name;
            this.tableData = res.data.data.result.map(function(item, index) {
              item["index"] = index;
              item["selectArr"] = [];
              item["selectNumber"] = 0;
              item["checked"] = false;
              item["children"] = [];
              return item;
            });
            this.citysFor();
          } else {
            this.showLoading = true;
            this.$message({
              message: "获取列表失败:" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    //一键上线
    online() {
      // this.on_offline.forEach(item => {
      //     this.allOffline(item);
      // });
      this.OnekeyOnline();
      setInterval(() => {
        this.timeOutStopBtn = false;
      }, 30000);
    },
    tableOneKeyModel() {
      // 表格头部上线按钮点击Model
      if (this.jsonName.length == 0) {
        this.$message.error("请选择账号！");
        return;
      }
      this.flag = "tableOneKey";
      this.$store.dispatch("showDialog", {
        title: "上线",
        showCancel: true,
        flag:'tableOneKey'
      });
    },
    tableOnekeyOnline() {
      // 表格头部操作按钮上线
      let param = {
        taskTemplateName: "扫码登录",
        wxIds: this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 400 || res.data.error_code == 500) {
            this.$message.error(res.data.error_message);
          } else {
            this.$message({
              message: "上线成功",
              type: "success"
            });
            this.hideModel();
          }
        })
        .catch(err => {
          this.$message.error("上线失败");
        });
    },
    OnekeyOnline() {
      //一键上线 按钮
      let param = {
        taskTemplateName: "扫码登录"
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "一键上线成功",
              type: "success"
            });
            this.hideModel();
            this.timeOutStopBtn = true;
          } else {
            this.$message.error(res.data.error_message);
          }
        })
        .catch(err => {
          this.$message.error("一键上线失败");
        });
    },
    allOffline(item) {
      let setOffline = "";
      this.task_template_list.forEach(item => {
        if (item.task_template_name === "扫码登录") {
          setOffline = item.task_template_id;
        }
      });
      this.$http("task/create_task", "POST", {
        account_list: [item],
        task_template_name: "扫码登录",
        task_template_id: setOffline,
        enum_wxaccount_source: 3
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
          this.$store.dispatch("hideDialog");
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    },
    showOnLine() {
      this.flag = "batch-online";
      this.$store.dispatch("showDialog", {
        title: "一键上线",
        showCancel: true,
        flag:"batch-online"
      });
    },
    // 一键下线
    showDownLine() {
      this.flag = "batch-downline";
      this.$store.dispatch("showDialog", {
        title: "一键下线",
        showCancel: true,
        flag:"batch-downline"
      });
    },
    downline() {
      // this.on_offline.forEach(item => {
      //   this.allOnline(item);
      // });
      this.isDownline()
      // this.hideModel();
    },
    isDownline(){
      //一键下线 按钮
      let param = {
        taskTemplateName: "一键下线"
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "一键下线成功",
              type: "success"
            });
            this.hideModel();
            // this.timeOutStopBtn = true;
          } else {
            this.$message.error("一键下线失败");
          }
        })
        .catch(err => {
          this.$message.error("一键下线失败");
        });
    },
    allOnline(item) {
      let setOnline = "";
      this.task_template_list.forEach(item => {
        if (item.task_template_name === "一键下线") {
          setOnline = item.task_template_id;
        }
      });
      this.$http("task/create_task", "POST", {
        account_list: [item],
        task_template_name: "一键下线",
        task_template_id: setOnline,
        enum_wxaccount_source: 2
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.specifyInput = "";
            this.$message({
              message: "执行成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    },
    beforeUploadFriend(file) {
      var $this = this;
      let flag = false;
      var isIMG;
      if (file.type === "image/jpeg") {
        flag = true;
        isIMG = file.type === "image/jpeg";
      } else if (file.type === "image/png") {
        flag = true;
        isIMG = file.type === "image/png";
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!flag) {
        this.$message.error("上传图片只能是 JPG 或 PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isIMG && isLt2M;
    },

    // 图片格式验证
    beforeUploadFriend(file) {
      var $this = this;
      let flag = false;
      var isIMG;
      if (file.type === "image/jpeg") {
        flag = true;
        isIMG = file.type === "image/jpeg";
      } else if (file.type === "image/png") {
        flag = true;
        isIMG = file.type === "image/png";
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!flag) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isIMG && isLt2M;
    },
    //账号详情的查看
    PersonalInformation(index) {
      this.Personal = true;
      this.mask = true;
      this.Personals.name = this.tableData[index].nickname;
      this.Personals.area = this.tableData[index].city;
      this.Personals.signature = this.tableData[index].signature;
    },
    //已注销账号的查看
    PersonalInformations(index) {
      this.Personal = true;
      this.mask = true;
      this.Personals.name = this.tableData1[index].nickname;
      this.Personals.area = this.tableData1[index].city;
      this.Personals.signature = this.tableData1[index].signature;
    },
    //批量修改
    batchUp111() {
      let url = "wxuser",
        type = "put",
        params = {};
      if (this.batchName == "注销") {
        params = {
          cancelStatus: 1,
          wxuserIds: this.checkSelect
        };
      } else if (this.batchName == "修改地区") {
        params = {
          wxuserIds: this.checkSelect,
          location: this.batch.city.join("")
        };
      } else if (this.batchName == "修改头像") {
        params = {
          wxuserIds: this.checkSelect,
          headurl: this.headurl
        };
      } else if (this.batchName == "修改昵称") {
        params = {
          wxuserIds: this.checkSelect,
          nickname: this.batch.nickname
        };
      } else if (this.batchName == "修改性别") {
        params = {
          wxuserIds: this.checkSelect,
          sex: this.batch.sex
        };
      } else if (this.batchName == "修改个性签名") {
        params = {
          wxuserIds: this.checkSelect,
          signature: this.batch.textarea
        };
      } else if (this.batchName == "修改所属分组") {
        params = {
          wxuserIds: this.checkSelect,
          wxUserGroupId: this.batch.group
        };
      } else if (this.batchName == "下线") {
        params = {
          wxuserIds: this.checkSelect,
          status: 2
        };
      }
      this.$totalHttp[type](url, params)
        .then(res => {
          if (res.data.error_code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.batch = {
              nickname: "",
              sex: 1,
              textarea: "",
              group: null,
              city: []
            };
            if (this.batchName == "注销" || this.batchName == "下线") {
              this.initCancellation();
            }
            this.init();
            this.mask = false;
            this.batchChange = false;
          } else {
            this.$message({
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    //账号详情当前页变化
    currentChange(val) {
      this.currentPage = val;
      this.init();
    },
    //已注销账号当前页变化
    currentchange(val) {
      this.currentPage1 = val;
      this.initCancellation();
    },
    //表格勾选
    handleSelectionChange(selection) {
      this.jsonName = [];
      this.multipleSelection = selection.map(item => {
        this.jsonName.push(item.wx_user_id);
      });
      this.downloadLength = selection.length;
    },
    // 调出发圈悬浮框
    takeFriend(index) {
      // this.Friend = true;
      // this.mask = true;
      // this.friendID.push(this.tableData[index].wx_user_id);
      // this.friendsterData.wx_username.push(
      //     this.tableData[index].wx_username
      // );
      // this.friendsterData.nickName.push(
      //     this.tableData[index].nickname
      //         ? this.tableData[index].nickname
      //         : this.tableData[index].wx_username
      // );
      let t = JSON.stringify(index);
      this.$router.push({
        name: "mr_functionContent",
        query: {
          id: 4,
          info: t
        }
      });
    },
    //点击发布朋友圈
    gainDate() {
      return (this.friendsterData.time =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate() +
        " " +
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds() +
        " ");
    },
    clearFriend() {
      this.Friend = false;
      this.mask = false;
      this.friendID = [];
    },
    FriendBtn() {
      this.friendID;
      this.gainDate();
      if (this.friendsterData.takeText == "") {
        this.$message({
          message: "请输入内容",
          type: "warning"
        });
      } else {
        this.isImage = true;
        this.pop = setTimeout(() => {
          this.$message({
            message: "请选择图片",
            type: "warning"
          });
        }, 1000);
        this.$refs.uploadFriend.submit();
      }
    },
    takeFriendTask() {
      let setTakeFriend = "";
      this.task_template_list.forEach(item => {
        if (item.task_template_name === "发送朋友圈多图") {
          setTakeFriend = item.task_template_id;
        }
      });
      this.$http("task/create_task", "POST", {
        task_template_name: "发送朋友圈多图",
        task_template_id: setTakeFriend,
        enum_wxaccount_source: 2,
        account_list: this.friendID
      })
        .then(res => {
          if (res.data.error_code == 0) {
            this.Friend = false;
            this.specifyInput = "";
            this.mask = false;
            this.friendsterData.takeImage = [];
            this.friendsterData.wx_username = [];

            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.friendID = [];
            this.getResources();
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    },

    //图片上传之后的回调
    suc() {
      axios
        .get(
          this.publicUrl.resourceUrl +
            "api/v1/usekey?type=tyc_sendpostImg&key=" +
            sessionStorage.getItem("user_id")
        )
        .then(res => {
          if (res.data.code == 0) {
            if ((this.isImage = true)) {
              clearTimeout(this.pop);
            }
            this.Friend = false;
            this.mask = false;
            let data = res.data.data;
            this.friendsterData.takeImage.push(data);

            this.friendsterData.content = this.newFriend;
            this.tableNew.unshift(this.friendsterData);
            this.tableNew = JSON.stringify(this.tableNew);
            axios
              .post(
                this.publicUrl.resourceUrl +
                  "api/v1/text?type=tyc_sendpost&key=" +
                  sessionStorage.getItem("user_id"),
                this.tableNew
              )
              .then(res => {
                if (res.data.code == 0) {
                  this.takeFriendTask();
                  this.$message({
                    message: "上传成功",
                    type: "success"
                  });
                  this.takeFriend();
                } else {
                  this.$message({
                    message: "上传失败",
                    type: "error"
                  });
                }
              })
              .catch(err => {});
          } else {
          }
        });
    },
    //获取
    getResources() {
      axios
        .get(
          this.publicUrl.resourceUrl +
            "api/v1/usekey?type=tyc_sendpost&key=" +
            sessionStorage.getItem("user_id")
        )
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.data;
            this.tableNew = JSON.parse(data);
          } else {
          }
        })
        .catch(err => {});
    },
    //上传
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传
    handleRemove(file, fileList) {
    },
    //上线
    takeLogin(index) {
      // this.login = true;
      // this.mask = true;
      this.friendID = [this.tableData[index].wx_user_id];
      this.flag = "online";
      this.$store.dispatch("showDialog", {
        title: "上线",
        showCancel: true,
        flag:"online"
      });
    },
    clearLogin() {
      this.login = false;
      this.mask = false;
      this.friendID = [];
    },
    loginBnt() { // 上线
       let param = {
        taskTemplateName: "扫码登录",
        wxIds: this.friendID.toString()
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 400 || res.data.error_code == 500) {
            this.$message.error(res.data.error_message);
          } else {
            this.$message({
              message: "上线成功",
              type: "success"
            });
            this.hideModel();
          }
        })
        .catch(err => {
          this.$message.error("上线失败");
        });
    },
    // 下线
    takeLogout(index) {
      // this.logout = true;
      // this.mask = true;
      this.friendID = [this.tableData[index].wx_user_id];
      this.flag = "downline";
      this.$store.dispatch("showDialog", {
        title: "下线",
        showCancel: true,
        flag:"downline"
      });
    },
    clearLogout() {
      this.logout = false;
      this.mask = false;
      this.friendID = [];
    },
    logoutBnt() {
      let param = {
        taskTemplateName: "一键下线",
        wxIds: this.friendID.toString()
      };
      let str = {
        param: JSON.stringify(param)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 400 || res.data.error_code == 500) {
            this.$message.error("下线失败");
          } else {
            this.$message({
              message: "下线成功",
              type: "success"
            });
            this.hideModel();
          }
        })
        .catch(err => {
          this.$message.error("下线失败");
        });
    },
    //修改单个密码
    takePass(index) {
      // this.$message({
      //     message: "暂未开通",
      //     type: "warning"
      // });
      this.setpass = true;
      this.mask = true;
      this.friendID.push(this.tableData[index].wx_user_id);
    },
    clearPass() {
      this.setpass = false;
      this.mask = false;
      this.friendID = [];
    },
    passbatchUp() {
      this.setpass = false;
      this.mask = false;
      this.$http(
        this.publicUrl.resourceUrl +
          "api/v1/text?key=" +
          this.userId +
          "&type=tyc_password",
        "POST",
        this.batch.pass
      )
        .then(res => {
          if (res.data.code == 0) {
          } else {
          }
        })
        .catch(err => {});
      let setPass = "";
      this.task_template_list.forEach(item => {
        if (item.task_template_name === "设置用户密码") {
          setPass = item.task_template_id;
        }
      });
      this.$http("task/create_task", "POST", {
        account_list: this.friendID,
        task_template_name: "设置用户密码",
        task_template_id: setPass,
        enum_wxaccount_source: 2
      }).then(res => {
        if (res.data.error_code == 0) {
          this.specifyInput = "";
          this.$message({
            message: "执行成功",
            type: "success"
          });
          this.friendID = [];
        } else {
          this.$message({
            message: "执行失败" + res.data.error_message,
            type: "error"
          });
        }
      });
    },
    //修改地区
    citybatchUp() {
      let _this = this;
      let selectedOptions = _this.selectedOptions;
      if (selectedOptions.length == 0) {
        _this.$message.error("请选择地区");
        return;
      }
      _this.setcitybatchUp();
      _this.hideModel();
    },
    setcitybatchUp() {
      this.mask = false;
      this.setcityAccording = false;
      this.citySelect.city = this.selectedOptions[1];
      this.citySelect.province = this.selectedOptions[0];
			let param = {};
      param.permission = this.citySelect
      let paramInfo = JSON.stringify(param);
      let data = {
        taskTemplateName: "设置地区",
        planParams: paramInfo,
        wxIds: this.UserID.toString() || this.jsonName.toString()
      };
      let str = {
        param: JSON.stringify(data)
      };
      this.$http("plan/start_plan", "POST", str)
        .then(res => {
          if (res.data.error_code == 0) {
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.init();
          } else {
            this.$message({
              message: "执行失败" + res.data.error_message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "执行失败" + err,
            type: "error"
          });
        });
    },
    setcity() {
      this.batchName = "修改地区";
      this.mask = true;
      this.jsonName.length > 0
        ? (this.setcityAccording = true)
        : (this.batchChanges = true);
    },
    // 便利
    citysFor() {
      let citysArray = [];
      let shen = [];
      let shi = [];
      for (let j in this.tableData) {
        citysArray.push({
          province: this.tableData[j].province,
          city: this.tableData[j].city
        });
      }
      this.cityOptions.map((item, index) => {
        for (let k = 0; k < citysArray.length; k++) {
          if (item.value == citysArray[k].province) {
            shen.push({
              value: item.value,
              label: item.label
            });
            item.children.map((item, index) => {
              if (item.value == citysArray[k].city) {
                shi.push({
                  value: item.value,
                  label: item.label
                });
              }
            });
          }
        }
      });
      this.tableData.map((item, index) => {
        for (let k = 0; k < shen.length; k++) {
          if (item.province == shen[k].value) {
            item["pingCity"] = shen[k].label;
            if (item.city == shi[k].value) {
              item["pingCity"] += "/" + shi[k].label;

              break;
            }
          }
        }
      });
    }
  },
  //过滤器
  filters: {
    capitalize: function(value) {
      if (value === 1) {
        return "男";
      } else if (value === 2) {
        return "女";
      } else {
        return "未知";
      }
    },
    statulize: function(value) {
      if (value === 1) {
        return "在线";
      } else if (value === 0) {
        return "离线";
      } else {
        return "未知";
      }
    },
    accountStatus: function(value) {
      if (value === 0) {
        return "正常";
      } else if (value === 1) {
        return "封号";
      } else if (value === 2) {
        return "密码错误";
      } else if (value === 3) {
        return "环境异常";
      } else if (value === 4) {
        return "Token过期";
      } else if (value === 5) {
        return "主机需要授权";
      } else if (value === 101) {
        return "其它错误";
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../style/css/base.scss";
#managent {
  .qrcode-box {
    width: 222px;
    height: 222px;
    padding: 10px;
    border: 1px solid #e8e8e8;
    margin: 0 auto;
  }
  .dialog-content {
    p {
      line-height: 24px;
      color: #888;
      font-size: 16px;
    }
  }
  .manage {
    .manage-header {
      line-height: 1;
      background-size: 16px;
      color: #888;
      font-size: 14px;
    }
    .headerButton {
      text-align: center;
      margin-bottom: 40px;
      .el-button {
        width: 90px;
        margin: 0 22px;
      }
    }
    .search {
      .search-content {
        overflow: hidden;
        margin-bottom: $margin;
        span {
          color: #a94442;
          display: block;
          margin-bottom: 10px;
        }
        .left {
          float: left;
          .ele-select {
            margin-right: 17px;
          }
        }
        .right {
          display: flex;
          align-items: center;
          float: right;
          a {
            background: #409eff;
            color: #fff;
            width: 100px;
            height: 30px;
            line-height: 30px;
            padding: 0;
            border-radius: 3px;
            display: block;
            font-size: 12px;
            text-align: center;
            margin-right: 20px;
            transition: all 0.3s ease;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
    .table {
      border-bottom: 0;
      img {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .batch {
        line-height: 1;
        padding: 0px 0px 30px;
        color: #409eff;
        .el-button {
          padding: 0;
          margin-left: 0;
        }
      }
    }
    .page {
      padding: 15px 0 50px;
      text-align: center;
      .el-pagination {
        display: inline-block;
      }
    }
    #addServer2 {
      position: fixed;
      left: 35%;
      top: 30%;
      width: 500px;
      border-radius: 6px;
      background-color: #fff;
      z-index: 11;
      box-sizing: border-box;
    }
    .addServer {
      position: fixed;
      left: 36%;
      top: 30%;
      width: 600px;
      border-radius: 6px;
      background-color: #fff;
      z-index: 11;
      box-sizing: border-box;
      .header {
        padding: 10px 15px;
        overflow: hidden;
        font-size: 14px;
        background-color: #409eff;
        border-radius: 6px 6px 0 0;
        h5 {
          text-align: center;
          float: left;
          width: 100%;
          font-size: 20px;
          line-height: 36px;
          color: #fff;
        }
        span {
          float: right;
          color: #fff;
          cursor: pointer;
          line-height: 20px;
        }
      }
      .content {
        padding: 50px 0 40px;
        text-align: center;
        background: #fff;
        .qrCodeBox {
          width: 222px;
          height: 222px;
          padding: 10px;
          border: 1px solid #e8e8e8;
          display: inline-block;
          line-height: 222px;
          img {
            position: static !important;
            width: 200px;
            height: 200px;
          }
        }
        .specialSelect {
          margin: 10px 0 0 25px;
          width: 260px;
        }
        .contentItem {
          line-height: 1;
          font-size: 16px;
          color: #333;
          overflow: hidden;
          text-align: center;
          img {
            position: static;
            width: 180px;
            height: 180px;
          }
          /* span {
                            display: inline-block;
                            width: 20%;
                            text-align: left;
                        } */
          /* .el-cascader {
                            width: 200px;
                        }
                        .el-input {
                            width: 200px;
                        }
                        .el-select {
                            width: 200px;
                        } */
          .left {
            float: left;

            p:nth-child(2) {
              margin-top: 170px;
            }
          }
          .right {
            float: right;
            width: 80%;
            text-align: left;
          }
        }
      }
      .footer {
        padding: 15px;
        text-align: center;
        padding-bottom: 34px;
        background: #fff;
        .el-button {
          width: 90px;
          height: 30px;
          line-height: 0;
        }
      }
    }
  }
}
</style>
