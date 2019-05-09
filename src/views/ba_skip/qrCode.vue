<template>
    <div class="qrCode">
    	<div class="title">二维码登陆</div>
        <div class="wrap">
            <div class="img-wrap"> <img :src='"data:image/gif;base64,"+img' alt=""></div>
            <div style="font-size: 16px;">{{hint}}</div>
            <!--{{this.$route.query.task_id}}-->
            <!--{{task_id}}-->
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
      return {
          img: "",
          device: "",
          data: "",
          shown: false,
          hint: '正在获取二维码，请稍候...',
          leave: '',
          task_id:this.$route.query.task_id,
          imgTimer:'',
          imgTimer1:'',
          imgTimer0:''
      };
  },
  mounted() {
    this.showCode(false);
    this.getQrCode()
  },
 destroyed() {
	clearTimeout(this.imgTimer);
	clearTimeout(this.imgTimer0);
	clearTimeout(this.imgTimer1);
  },
  methods: {
  	getQrCode(){
  		let $this = this;
  		this.$http('get_qr_code','GET',{
  			task_id:this.task_id,
  			token:sessionStorage.getItem('token')
  		}).then(res=>{
//			console.log(res.data)
  			if(res.data.error_code==0){
				let data = res.data;
				this.img = data.error_message;
				this.hint="请扫描二维码";
  			}else if(res.data.error_code==400){
  				let timer = setTimeout(()=>{
  					console.log(timer)
  					$this.imgTimer = timer;
  					$this.imgTimer0 = timer-1;
  					$this.imgTimer1 = timer+1;
  					this.getQrCode();
  				},1000)
  			}else if(res.data.error_code==403){
  				this.$message({
					message: res.data.error_message,
					type: 'error'
				});
  			}
  		})
  	},
    showCode(shown) {
        let $this = this;
//      $this.$totalHttp.get("/api/user/login").then(function(data) {
//          if (data.data.error_code == 200) {
//          	$this.hint = "请使用微信扫一扫进行绑定"
//              $this.img = data.data.error_message;
//              $this.device = data.data.device;
//              $this.data = data.data;
//              let timer = setInterval(() => {  //轮询
//              	$this.leave = timer;
//                  let info = $this.device;
//                  $this.$totalHttp.post("/api/user/checkLogin",
//                      { device: info,userId:localStorage.getItem('user_id') }
//                    )
//                     .then(function(res) {
//                      let status = JSON.parse(res.data.error_code);
//                      let status_code = JSON.parse(res.data.status);
//                      if( $this.shown ){              //如果切换到账号密码登陆，就停止轮询
//                           clearInterval(timer);  
//                      }
//                      if (status == 200) {
//                      	$this.hint = "正在进行绑定，请稍候..."
//                          clearInterval(timer);   //扫码成功，停止轮询
//                          $this.$totalHttp.post("/api/user/loginCode",
//                              { device: $this.device}
//                            )
//                            .then(function(data) {
//                            	console.log(data)
//                              let status = data.data.error_code;
//                              let status_code = JSON.parse(res.data.status);
//                              if (status == -301) {
//                                  setTimeout(()=>{
//                                       $this.$totalHttp.post("/api/user/loginCode",{ device: $this.device,userId:localStorage.getItem('user_id') }
//                                      ).then(function (res) {
//                                             console.log(res)
//                                         let status = res.status;
//                                         if(status==-301){
//                                             alert(301+'登陆失败')
//                                         } else if (status == 200) {
//                                              $this.$router.push("success");
//                                          }
//                                     })
//                                  },200)
//                              }else {
//                                alert("成功");
//                                $this.$router.push("success");
//                              }
//                          });
//                      } else if( status == 422 ){
//                      	if(status_code == 4) {
//                      		alert('您已经取消登录,若想再次登录，请点击"刷新二维码"重新获取二维码...');
//                      		clearInterval(timer);   //扫码成功，停止轮询
//                      	}
//                      }
//                    });
//              }, 3000); 
//          } else {
//            alert("获取二维码失败");
//          }
//      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.qrCode{
	/*background: #fff;*/
	height: 95%;
}
.wrap {
	margin-top: 15px;
	background: #fff;
	height: 100%;
    text-align: center;
    .green{
        color: #58bc9c !important;
        cursor: pointer;
    }
    .img-wrap {
        width: 160px;
        height: 160px;
        margin: 250px 0 50px;
        display: inline-block;
        border: 1px solid green;
        img{
            width: 160px;
            height: 160px;
        }
    }
    > div {
        margin-bottom: 10px;
        font-size: 14px;
        color: #73879c;
    }
    .wrap-account {
        width: 400px;
        margin: 40px auto;
        > div{
          margin-bottom: 10px;
          font-size: 14px;
          color: #73879c;
          overflow: hidden;
          line-height: 40px;
        }
        span {
          width: 80px;
          display: inline-block;
          text-align: right;
          margin-right: 5px;
          float: left;
        }
    }
}
</style>

