<template>
	<el-container id="login">
		<div class="container" v-loading="loading">
			<div class="login-main">
				<img class="company-logo" src="../../assets/images/logo.png" />
				<p class="login-title">总后台登录</p>
				<el-row style="margin: 10px 0 0 0;">
	  					<el-col :span="24">
		  					<el-form  :rules="loginRules" :model="loginForm" ref="loginForm">
		  						<el-form-item prop="username">
							    	<el-input class="inp-btn userName" v-model="loginForm.username" type="input" placeholder="用户名"></el-input>
								</el-form-item>
								<el-form-item prop="password">
								   <el-input class="inp-btn psw" v-model="loginForm.password" :type="seen ? 'password': 'text' " placeholder="密码" @keyup.enter.native="loginHandle('loginForm')"></el-input>
									<img class="no-display" :src="[seen ? require('../../assets/images/icon_2.png') : require('../../assets/images/icon_1.png')]" @click="seenHandle" />
								</el-form-item>
		  					</el-form>
	  					</el-col>
	  				</el-row>
				<el-row>
					<button class="login-btn" @click="loginHandle('loginForm')">登录</button>
				</el-row>
			</div>
		</div>
	</el-container>
</template>
<script>
export default {
	name: 'login',
	data() {
		let validateUsername = (rule, value, callback) => {
			if(!value) {
				callback(new Error('用户名不能为空'));
			} else {
				callback();
			}
		}
		let validatePass = (rule, value, callback) => {
			if(!value) {
				callback(new Error('密码不能为空'))
			}else {
				callback();
			}
		}
		return {
			loading:false,
			seen: true,
			loginForm: {
				username: '',
				password: '',
			},
			loginRules: {
				username: [{required: true, trigger: 'blur',validator: validateUsername}],
				password: [{required: true, trigger: 'blur', validator: validatePass}]
			}
		}
	},
	methods: {
		seenHandle() {
			this.seen = !this.seen
		},
		loginHandle(formName) {
			let $this = this;
			let userReg=/^(?=.*[a-zA-Z])([\w-]@?\.?){3,18}$/;
		 	let passReg =  /^[a-zA-Z0-9]{6,16}$/;
			$this.$refs[formName].validate((valid) => {
		        if (valid&&userReg.test($this.loginForm.username)&&passReg.test($this.loginForm.password)) {
					this.loading= true;
					$this.$http(`user/login`, 'POST',{
						username:$this.loginForm.username,
						password:$this.loginForm.password
					})
					.then((res) => {
						this.loading= false;
						if(res.data.error_code == 0) {
							let indentity=res.data.error_message.split(",");
							sessionStorage.setItem('token',res.data.data);
							sessionStorage.setItem('username',$this.loginForm.username);
							sessionStorage.setItem('user_id',res.data.user_id);
							if(indentity.indexOf("ROLE_ADMIN")>=0){
								sessionStorage.setItem("indentity","ROLE_ADMIN");
								this.$message.success('登录成功');
								this.$router.push('/account');	
							}else if(indentity.indexOf("ROLE_DAEMON")>=0){
								sessionStorage.setItem("indentity","ROLE_DAEMON");
							}
							else if(indentity.indexOf("ROLE_PRIMARY")>=0){
								sessionStorage.setItem("indentity","ROLE_PRIMARY");
							}
							else{
								sessionStorage.setItem("indentity","ROLE_USER");
							}
							if(sessionStorage.getItem("indentity")=="ROLE_USER"){
								this.$message.error('登录失败,权限不够');
							}else if(sessionStorage.getItem("indentity")=="ROLE_DAEMON"){
								this.$message.error('登录失败,权限不够');	
							}else if(sessionStorage.getItem("indentity")=="ROLE_PRIMARY"){
								this.$message.error('登录失败,权限不够');
							}else{
								this.$router.push({
									path: '/',
									component: () => import('@/views/index')
								})
							}
						} else if(res.data.error_code==400){
							this.$message.error(res.data.error_message);
						} else if(res.data.error_code==500){
							this.$message.error('服务器正在维护');
						}
					})
		        } else {
					this.$message.error('请填写正确的账号密码');
		            return false;
		        }
		    });
		}
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: url(../../assets/images/bg.jpg) no-repeat;
	background-size: 100% 100%;
}
.login-main {
	position: absolute;
	width: 400px;
	height: 540px;
	background: #FFFFFF;
	top: 50%;
	left: 50%;
	margin-top: -270px;
	margin-left: -200px;
	border-radius: 6px;
}
.company-logo {
	display: block;
	width: 80px;
	height: 80px;
	margin: 40px auto 26px;
}
.login-title {
	text-align: center;
	font-size: 24px;
	color: rgba(0, 0, 0, .8);
	padding-bottom: 20px;
}
.inp-btn {
	display: block;
	width: 338px;
	border-bottom: 2px solid #E0E0E0;
	font-size: 18px;
	color: rgba(0, 0, 0, .5);
	padding-bottom: 8px;
	margin: 7px auto 0;
}
.login-btn {
	display: block;
	border: 0;
	padding: 13px 150px;
	border-radius: 12px;
	margin: 40px auto 74px;
	background: -webkit-linear-gradient(right, #4fb0db, #80cef2);
	background: -moz-linear-gradient(right, #4fb0db, #80cef2);
	background: -o-linear-gradient(right, #4fb0db, #80cef2);
	background: -ms-linear-gradient(right, #4fb0db, #80cef2);
	background: linear-gradient(to left, #4fb0db, #80cef2);
	box-shadow: #68c0e8 5px 9px 24px -3px;
	font-size: 20px;
	color: #FFFFFF;
	cursor: pointer;
}
.psw-wrap {
	position: relative;
}
.no-display {
	display: inline-block;
	width: 20px;
	height: 20px;
	position: absolute;
	right: 44px;
	top: 22px;
	cursor: pointer;
}
.hint {
	font-size: 22px;
	color: #999999;
}
.go-back {
	float: right;
	width: 90px;
	height: 46px;
	color: #FFFFFF;
	font-size: 22px;
	background-image: -webkit-linear-gradient(right, #4fb0db, #80cef2);
	background-image: -moz-linear-gradient(right, #4fb0db, #80cef2);
	background-image: -o-linear-gradient(right, #4fb0db, #80cef2);
	background-image: -ms-linear-gradient(right, #4fb0db, #80cef2);
	background-image: linear-gradient(right, #4fb0db, #80cef2);
	box-shadow: #68c0e8 3px 5px 22px -3px;
	border-radius: 6px;
	margin: 0 32px 0 0;
	cursor: pointer;
}
</style>