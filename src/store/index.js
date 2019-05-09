import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  logined: false,
  indentity:null,
  visible:false,
  dialogData:{
    title:'',
    content:'',
    showCancel:'',
    tableData:''
  }
}
const mutations={
	indentity(state){
		state.indentity=sessionStorage.getItem("indentity");
  },
  setDialogData(state,data){
    state.dialogData = data;
  }
}
const actions={
  showDialog({state,commit},data){
    commit("setDialogData",data)
    state.visible = true;
  },
  hideDialog({state,commit},val){
    state.visible = false
  }
}
const store = new Vuex.Store({
  state,
  mutations,
  actions
})
export default store
