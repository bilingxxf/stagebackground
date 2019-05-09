<template>
    <div id="account" class="main-body role-manage">
        <div class="main-wrapper">
          <div class="main-left">
            <div class="left-top">
              <div class="heade">
                <span class="heade-title">角色名称：</span>
                <el-select @change="selectedRole($event)" v-model="value" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in gridDataList.data"
                    :key="index"
                    :label="item.roleName"
                    :value="item.role + '+' + item.userId">
                  </el-option>
                </el-select>
              </div>
              <el-button v-if="false">搜索</el-button>
              <el-button @click="permissToSave">权限保存</el-button>
            </div>
          </div>
          <div class="main-right">
            <p class="title">权限菜单信息</p>
            <el-tree
              :data="dataList.data"
              :props="props"
              show-checkbox
              default-expand-all
              node-key="moduleId"
              ref="tree"
              @check-change="selectNode"
              :default-checked-keys="defaultCheckKeys"
              highlight-current>
            </el-tree>
          </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
          value: '',
          props: {
            id: 'moduleGroupId',
            label: 'moduleGroupName'
          },
          dataList: '',
          gridDataList: '',
          roleId: '1',
          moduleIds: [],
          defaultCheckKeys: []
        }
    },
    methods:{
      // 权限保存
      permissToSave() {
        this.$http('/module/user_module', 'POST', {
          moduleIds: this.moduleIds,
          userId: this.roleId
        }).then(res => {
          if (res.status === 200) {
            this.$message.success('权限保存成功');
          } else {
            this.$message.error('权限保存失败');
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 当前选中项
      selectNode(data, checked, indeterminate) {
        let delIndex = -1;
        if (data.moduleId && checked) {
          this.moduleIds.push(data.moduleId);
        } else {
          this.moduleIds.forEach((item, index) => {
            if (Number(data.moduleId) === Number(item)) {
              delIndex = index;
              this.moduleIds.splice(delIndex, 1);
            }
          })
        }
      },
      // 权限菜单信息
      selectedRole(index) {
        this.roleId = index.split('+')[1];
        let roleName = index.split('+')[0];
        this.defaultCheckKeys = [];
        this.moduleIds = [];
        this.$http('/role_module/role_module_list', 'GET', {
          EnumAuthorityRole: roleName
        }).then(res => {
          if (res.status === 200) {
            this.dataList = res.data;
            this.dataList.data.forEach((item, index) => {
              item.children.forEach((v, i) => {
                if (v.contain === true) {
                  this.defaultCheckKeys.push(v.moduleId);
                  this.moduleIds.push(v.moduleId);
                }
              })
            })
          } else {
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 用户绑定角色列表
      bindRole() {
        this.$http('/role_module', 'GET', {
          userId: ''
        }).then(res => {
          if (res.status === 200) {
            this.gridDataList = res.data;
            // 默认选中
            this.value = this.gridDataList.data[0].roleName;
            let defaultValue = this.gridDataList.data[0].role + '+' + this.gridDataList.data[0].userId;
            this.selectedRole(defaultValue);
          } else {
          }
        }).catch(err => {
          console.log(err);
        });
      },
    },
    mounted(){
      this.bindRole();
    }
}
</script>

<style scoped lang="scss">
    #account {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .main-wrapper {
          display: flex;
          .main-left,.main-right {
          }
          .main-left {
            width: 30%;
            background-color: #F4F4F4;
            .left-top {
              padding: 20px;
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 160px;
              background-color: #fff;
              border: 1px solid #ddd;
              border-left: none;
              box-sizing: border-box;
              .heade {
                display: flex;
                justify-content: space-between;
                .heade-title {
                  font-size: 14px;
                }
              }
            }
          }
          .main-right {
            padding: 20px;
            width: 70%;
            background-color: #fff;
            border: 1px solid #ddd;
            border-right: none;
            border-bottom: none;
            box-sizing: border-box;
            .title {
              font-size: 14px;
            }
          }
        }
    }
</style>
