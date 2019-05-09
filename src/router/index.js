import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 总后台
const login = r => require.ensure([], () => r(require('@/views/login/index')), 'login')
const home = r => require.ensure([], () => r(require('@/views/index')), 'home')
const camilo = r => require.ensure([], () => r(require('@/views/ba_camilo/index')), 'camilo')
const char = r => require.ensure([], () => r(require('@/views/ba_char/char')), 'char')
//  账号
const accountIndex = r => require.ensure([], () => r(require('@/views/ba_account/index')), 'accountIndex')
const account = r => require.ensure([], () => r(require('@/views/ba_account/account')), 'account')
const accountInfo = r => require.ensure([], () => r(require('@/views/ba_account/accountInfo')), 'accountInfo')
const accountDetails = r => require.ensure([], () => r(require('@/views/ba_account/accountDetails')), 'accountDetails')
const rechargeRecord = r => require.ensure([], () => r(require('@/views/ba_account/rechargeRecord')), 'rechargeRecord')
const dataStatistics = r => require.ensure([], () => r(require('@/views/ba_account/dataStatistics')), 'dataStatistics')
const ba_roleList = r => require.ensure([], () => r(require('@/views/ba_account/roleList')), 'ba_roleList')
const roleManage = r => require.ensure([], () => r(require('@/views/ba_account/roleManage')), 'roleManage')
const templateConfigurat = r => require.ensure([], () => r(require('@/views/ba_account/templateConfigurat')), 'templateConfigurat')
//  微信号分组管理
const wxIndex = r => require.ensure([], () => r(require('@/views/ba_wx/index')), 'wxIndex')
const wxGroup = r => require.ensure([], () => r(require('@/views/ba_wx/wxGroup')), 'wxGroup')
const wxContact = r => require.ensure([], () => r(require('@/views/ba_wx/wxContact')), 'wxContact')
const wxId = r => require.ensure([], () => r(require('@/views/ba_wx/wxId')), 'wxId')
//  脚本管理
const footer = r => require.ensure([], () => r(require('@/views/ba_footer/index')), 'footer')
const footerList = r => require.ensure([], () => r(require('@/views/ba_footer/footerList')), 'footerList')
const footerGroup = r => require.ensure([], () => r(require('@/views/ba_footer/footerGroup')), 'footerGroup')

const qrCode = r => require.ensure([], () => r(require('@/views/ba_skip/qrCode')), 'qrCode')

//  任务管理
const task = r => require.ensure([], () => r(require('@/views/ba_task/index')), 'task')
const newTask = r => require.ensure([], () => r(require('@/views/ba_task/newTask')), 'newTask')
const bePerformed = r => require.ensure([], () => r(require('@/views/ba_task/bePerformed')), 'bePerformed')
const historyTask = r => require.ensure([], () => r(require('@/views/ba_task/historyTask')), 'historyTask')
const newCommonTask = r => require.ensure([], () => r(require('@/views/ba_task/newCommonTask')), 'newCommonTask')
const commonBePerformed = r => require.ensure([], () => r(require('@/views/ba_task/commonBePerformed')), 'commonBePerformed')
const historyCommonTask = r => require.ensure([], () => r(require('@/views/ba_task/historyCommonTask')), 'historyCommonTask')
const performTask = r => require.ensure([], () => r(require('@/views/ba_task/performTask')), 'performTask')

const commonErrtask = r => require.ensure([], () => r(require('@/views/ba_task/commonErrtask')), 'commonErrtask')
const commonSuccesstask = r => require.ensure([], () => r(require('@/views/ba_task/commonSuccesstask')), 'commonSuccesstask')
const errTask = r => require.ensure([], () => r(require('@/views/ba_task/errTask')), 'errTask')
const successTask = r => require.ensure([], () => r(require('@/views/ba_task/successTask')), 'successTask')

const materialIndex = r => require.ensure([], () => r(require('@/views/ba_material/index')), 'materialIndex')
const materialManage = r => require.ensure([], () => r(require('@/views/ba_material/materialManage')), 'materialManage')

// 微营销
// 群
const mr_groupIndex = r => require.ensure([], () => r(require('@/views/mr_group/groupIndex')), 'mr_groupIndex')
const mr_addGroupowner = r => require.ensure([], () => r(require('@/views/mr_group/addGroupowner')), 'mr_addGroupowner')
const mr_addScene = r => require.ensure([], () => r(require('@/views/mr_group/addScene')), 'mr_addScene')
const mr_groupCode = r => require.ensure([], () => r(require('@/views/mr_group/groupCode')), 'mr_groupCode')
const mr_groupDetails = r => require.ensure([], () => r(require('@/views/mr_group/groupDetails')), 'mr_groupDetails')
const mr_groupManage = r => require.ensure([], () => r(require('@/views/mr_group/groupManage')), 'mr_groupManage')
const mr_groupOwner = r => require.ensure([], () => r(require('@/views/mr_group/groupOwner')), 'mr_groupOwner')
const mr_groupScene = r => require.ensure([], () => r(require('@/views/mr_group/groupScene')), 'mr_groupScene')
const mr_JobLog = r => require.ensure([], () => r(require('@/views/mr_group/JobLog')), 'mr_JobLog')
const mr_recordScene = r => require.ensure([], () => r(require('@/views/mr_group/recordScene')), 'mr_recordScene')
// 朋友圈
const mr_functionIndex = r => require.ensure([], () => r(require('@/views/mr_function/functionIndex')), 'mr_functionIndex')
const mr_functionCheckDevelop = r => require.ensure([], () => r(require('@/views/mr_function/functionCheckDevelop')), 'mr_functionCheckDevelop')
const mr_functionMass = r => require.ensure([], () => r(require('@/views/mr_function/functionMass')), 'mr_functionMass')
const mr_functionSnsTDetail = r => require.ensure([], () => r(require('@/views/mr_function/functionSnsTDetail')), 'mr_functionSnsTDetail')
const mr_functionTake = r => require.ensure([], () => r(require('@/views/mr_function/functionTake')), 'mr_functionTake')
const mr_functionTaskDate = r => require.ensure([], () => r(require('@/views/mr_function/functionTaskDate')), 'mr_functionTaskDate')
const mr_functionNewmass = r => require.ensure([], () => r(require('@/views/mr_function/functionNewmass')), 'mr_functionNewmass')

/* 养号配置平台 */
// 首页
const con_home = r => require.ensure([], () => r(require('@/views/con_home/index')), 'con_home')
const con_statistics = r => require.ensure([], () => r(require('@/views/con_home/statistics')), 'con_statistics')
// 账号管理
const con_account = r => require.ensure([], () => r(require('@/views/con_account/index')), 'con_account')
const con_accountManage = r => require.ensure([], () => r(require('@/views/con_account/accountManage')), 'con_accountManage')
// 分组管理
const con_group = r => require.ensure([], () => r(require('@/views/con_group/index')), 'con_group')
const con_groupManage = r => require.ensure([], () => r(require('@/views/con_group/groupManage')), 'con_groupManage')
// 分组管理
const con_point = r => require.ensure([], () => r(require('@/views/con_point/index')), 'con_point')
const con_pointManage = r => require.ensure([], () => r(require('@/views/con_point/pointManage')), 'con_pointManage')
const con_addPoint = r => require.ensure([], () => r(require('@/views/con_point/addPoint')), 'con_addPoint')
// 模拟器管理
const simulatorIndex = r => require.ensure([], () => r(require('@/views/bg_simulator/index')), 'Index')
const simulator = r => require.ensure([], () => r(require('@/views/bg_simulator/bg_simulator')), 'bg_simulator')
const simulatorConfig = r => require.ensure([], () => r(require('@/views/bg_simulator/simulatorConfig')), 'simulatorConfig')

// 404页面
const bg_404 = r => require.ensure([], () => r(require('@/views/errorPage/404.vue')), 'bg_404')
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: home,
      children: [
        {
          path: '/',
          name: 'camilo',
          component: camilo,
          meta: {title: '卡密', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], icon: 'el-icon-message'},
          children: [
            {
              path: '/camilo',
              name: 'camilos',
              component: account,
              meta: { title: '卡密管理', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '0_1' }
            }
          ]
        },
        {
          path: '/accountIndex',
          name: 'accountIndex',
          component: accountIndex,
          meta: { title: '账号', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], icon: 'el-icon-menu' },
          children: [
            {
              path: '/account',
              name: 'account',
              component: account,
              meta: { title: '账号管理', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '1_1' }
            },
            // {
            //   path: '/accountDetails',
            //   name: 'accountDetails',
            //   component: accountDetails,
            //   meta: { title: '账号详情', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '1_2' }
            // },
            {
              path: '/rechargeRecord',
              name: 'rechargeRecord',
              component: rechargeRecord,
              meta: { title: '充值记录', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '1_3' }
            },
            {
              path: '/dataStatistics',
              name: 'dataStatistics',
              component: dataStatistics,
              meta: { title: '数据统计', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '1_4' }
            },
            {
              path: '/templateConfigurat',
              name: 'templateConfigurat',
              component: templateConfigurat,
              meta: { title: '模板配置', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '1_5' }
            }
            //						{
            //          	path: '/ba_roleList',
            //          	name: 'ba_roleList',
            //          	component: ba_roleList,
            //          	meta: { title: '角色管理', requiresAuth: true,indentity:["ROLE_USER","ROLE_DAEMON","ROLE_ADMIN"],index:"1_5" }
            //          },
            // {
            //   path: '/roleManage',
            //   name: 'roleManage',
            //   component: roleManage,
            //   meta: { title: '权限管理', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '1_6' }
            // }
          ]
        },
        {
          path: '/task',
          name: 'task',
          component: task,
          meta: { title: '任务', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN', 'ROLE_PRIMARY'], icon: 'el-icon-setting' },
          children: [
            {
              path: '/newCommonTask',
              name: 'newCommonTask',
              component: newCommonTask,
              meta: { title: '任务模板', requiresAuth: true, indentity: ['ROLE_DAEMON', 'ROLE_PRIMARY'], index: '2_5' }
            },
            {
              path: '/commonBePerformed',
              name: 'commonBePerformed',
              component: commonBePerformed,
              meta: { title: '未完成的任务', requiresAuth: true, indentity: ['ROLE_DAEMON', 'ROLE_PRIMARY'], index: '2_6' }
            },
            {
              path: '/historyCommonTask',
              name: 'historyCommonTask',
              component: historyCommonTask,
              meta: { title: '已完成的任务', requiresAuth: true, indentity: ['ROLE_DAEMON', 'ROLE_PRIMARY'], index: '2_7' },
              children: [
                {
                  path: '/commonSuccesstask',
                  name: 'commonSuccesstask',
                  component: commonSuccesstask,
                  meta: { title: '执行成功', requiresAuth: true, indentity: ['ROLE_DAEMON', 'ROLE_PRIMARY'], index: '2_7_1' }
                },
                {
                  path: '/commonErrtask',
                  name: 'commonErrtask',
                  component: commonErrtask,
                  meta: { title: '失败执行', requiresAuth: true, indentity: ['ROLE_DAEMON', 'ROLE_PRIMARY'], index: '2_7_2' }
                }
              ]
            },

            {
          	path: '/newTask',
          	name: 'newTask',
          	component: newTask,
          	meta: { title: '任务模板', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '2_1'}
            }, {
          	path: '/performTask',
          	name: 'performTask',
          	component: performTask,
          	meta: { title: '执行任务', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '2_8'}
            }, {
          	path: '/bePerformed',
          	name: 'bePerformed',
          	component: bePerformed,
          	meta: { title: '未完成的任务', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '2_2'}
            }, {
          	path: '/historyTask',
          	name: 'historyTask',
          	component: historyTask,
          	meta: { title: '已完成的任务', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '2_4'},
              children: [
                {
                  path: '/successTask',
                  name: 'successTask',
                  component: successTask,
                  meta: { title: '执行成功', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '2_4_1' }
                },
                {
                  path: '/errTask',
                  name: 'errTask',
                  component: errTask,
                  meta: { title: '执行失败', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '2_4_2' }
                }
              ]
            },
            {
              path: '/qrCode',
              name: 'qrCode',
              component: qrCode,
              meta: { title: '二维码登陆', requiresAuth: true, indentity: [0, 1], hidden: false, index: '2_6' }
            }
          ]
        },
        {
          path: '/footer',
          name: 'footer',
          component: footer,
          meta: { title: '脚本', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], icon: 'el-icon-document' },
          children: [
            {
              path: '/footerList',
              name: 'footerList',
              component: footerList,
              meta: { title: '脚本列表', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '3_1' }
            },
            {
              path: '/footerGroup',
              name: 'footerGroup',
              component: footerGroup,
              meta: { title: '脚本分组', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '3_2' }
            }
          ]
        },
        {
          path: '/wxIndex',
          name: 'wxIndex',
          component: wxIndex,
          meta: { title: '微信号', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN', 'ROLE_PRIMARY'], icon: 'el-icon-mobile-phone' },
          children: [
            {
              path: '/wxGroup',
              name: 'wxGroup',
              component: wxGroup,
              meta: { title: '微信号分组', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN', 'ROLE_PRIMARY'], index: '5_1' }
            }, {
              path: '/wxContact',
              name: 'wxContact',
              component: wxContact,
              meta: { title: '联系人分组', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN', 'ROLE_PRIMARY'], index: '5_2' }
            }, {
            	path: '/wxId',
            	name: 'wxId',
              component: wxId,
              meta: { title: '微信ID查询', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN', 'ROLE_PRIMARY'], index: '5_3' }
            }
          ]
        },
        {
          path: '/index',
          name: 'Index',
          component: simulatorIndex,
          meta: { title: '模拟器', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN', 'ROLE_PRIMARY'], icon: 'el-icon-mobile-phone' },
          children: [
            {
              path: '/bg_simulator',
              name: 'bg_simulator',
              component: simulator,
              meta: { title: '模拟器管理', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN', 'ROLE_PRIMARY'], index: '5_1' }
            },
            {
              path: '/simulatorConfig',
              name: 'simulatorConfig',
              component: simulatorConfig,
              meta: { title: '模拟器配置', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN', 'ROLE_PRIMARY'], index: '5_2', hidden: true }
            }
          ]
        },
        {
          path: '/materialIndex',
          name: 'materialIndex',
          component: materialIndex,
          meta: { title: '素材', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], icon: 'el-icon-menu' },
          children: [
            {
              path: '/materialManage',
              name: 'materialManage',
              component: materialManage,
              meta: { title: '公共素材', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '6_1' }
            }
          ]
        },

        // 微营销
        // {
        //   path: '/mr_groupIndex',
        //   name: 'mr_groupIndex',
        //   component: mr_groupIndex,
        //   meta: { title: '微-群', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], icon: ''},
        //   children: [
        //     {
        // 		  path: '/mr_groupManage',
        // 		  name: 'mr_groupManage',
        // 		  component: mr_groupManage,
        // 		  meta: { title: '群管理', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], index: '9_1' }
        //     },
        //     {
        // 		  path: '/mr_groupOwner',
        // 		  name: 'mr_groupOwner',
        // 		  component: mr_groupOwner,
        // 		  meta: { title: '群主配置', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], index: '9_2' }
        //     },
        //     {
        // 		  path: '/mr_groupCode',
        // 		  name: 'mr_groupCode',
        // 		  component: mr_groupCode,
        // 		  meta: { title: '扫码进群', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], index: '9_3' }
        //     },
        //     {
        // 		  path: '/mr_addGroupowner',
        // 		  name: 'mr_addGroupowner',
        // 		  component: mr_addGroupowner,
        // 		  meta: { title: '添加群主配置', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], hidden: true, index: '9_4' }
        //     },
        //     {
        // 		  path: '/mr_JobLog',
        // 		  name: 'mr_JobLog',
        // 		  component: mr_JobLog,
        // 		  meta: { title: '任务日志', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], hidden: true, index: '9_5' }
        //     },
        //     {
        // 		  path: '/mr_groupDetails',
        // 		  name: 'mr_groupDetails',
        // 		  component: mr_groupDetails,
        // 		  meta: { title: '群详情', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], hidden: true, index: '9_6' }
        //     }
        //   ]
        // },
        {
				  path: '/mr_functionIndex',
				  name: 'mr_functionIndex',
				  component: mr_functionIndex,
				  meta: { title: '微-朋友圈', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], icon: ''},
				  children: [
            {
						  path: '/mr_functionMass',
						  name: 'mr_functionMass',
						  component: mr_functionMass,
						  meta: { title: '群发消息', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], index: '10_1' }
            },
            {
						  path: '/mr_functionSnsTDetail',
						  name: 'mr_functionSnsTDetail',
						  component: mr_functionSnsTDetail,
						  meta: { title: '查看朋友圈', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], hidden: true, index: '10_9' }
            },
            {
						  path: '/mr_functionCheckDevelop',
						  name: 'mr_functionCheckDevelop',
						  component: mr_functionCheckDevelop,
						  meta: { title: '养号配置', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], index: '10_5'}
            },
            {
						  path: '/mr_functionTaskDate',
						  name: 'mr_functionTaskDate',
						  component: mr_functionTaskDate,
						  meta: { title: '养号任务列表', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], hidden: true, index: '10_6' }
            },
            {
						  path: '/mr_functionNewmass',
						  name: 'mr_functionNewmass',
						  component: mr_functionNewmass,
						  meta: { title: '新建群发', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_ADMIN'], hidden: true, index: '10_8' }
            },
            {
						  path: '/mr_functionTake',
						  name: 'mr_functionTake',
						  component: mr_functionTake,
						  meta: { title: '发朋友圈', requiresAuth: true, hidden: true, indentity: ['ROLE_USER'], index: '10_7' }
            }

          ]
        },
        // 养号配置平台
        {
          path: '/con_home',
          name: 'con_home',
          component: con_home,
          meta: { title: '养-首页', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], icon: ''},
          children: [
            {
              path: '/con_statistics',
              name: 'con_statistics',
              component: con_statistics,
              meta: { title: '账号统计', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '12_1' }
            }
          ]
        },
        {
          path: '/con_account',
          name: 'con_account',
          component: con_account,
          meta: { title: '养-账号', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], icon: ''},
          children: [
            {
              path: '/con_accountManage',
              name: 'con_accountManage',
              component: con_accountManage,
              meta: { title: '账号管理', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '13_1' }
            }
          ]
        },
        {
          path: '/con_group',
          name: 'con_group',
          component: con_group,
          meta: { title: '养-分组', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], icon: ''},
          children: [
            {
              path: '/con_groupManage',
              name: 'con_groupManage',
              component: con_groupManage,
              meta: { title: '分组管理', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '14_1' }
            }
          ]
        },
        {
          path: '/con_point',
          name: 'con_point',
          component: con_point,
          meta: { title: '养-养号', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], icon: ''},
          children: [
            {
              path: '/con_pointManage',
              name: 'con_pointManage',
              component: con_pointManage,
              meta: { title: '养号管理', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], index: '15_1' }
            },
            {
              path: '/con_addPoint',
              name: 'con_addPoint',
              component: con_addPoint,
              meta: { title: '养号计划', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_ADMIN'], hidden: true, index: '15_2' }
            }
          ]
        }

      ]
    },
    {
      path: '/char',
      name: 'char',
      component: char,
      meta: { title: '聊天' }
    },
    {
      path: '*',
      name: 'bg_404',
      component: bg_404,
      meta: { title: '404', requiresAuth: true, indentity: ['ROLE_USER', 'ROLE_DAEMON', 'ROLE_PRIMARY', 'ROLE_ADMIN'], icon: 'el-icon-ump-tianjiahaoyou1', hidden: true}
    }

    //  {
    //    path: '/qrCode',
    //    name: 'qrCode',
    //    component: qrCode,
    //    meta: { title: '二维码登陆', requiresAuth: true,indentity:[1,0],index:"2_6" }
    // }
  ]
})
