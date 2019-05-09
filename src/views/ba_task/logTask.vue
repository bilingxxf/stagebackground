<template>
    <div class="logTask">
        <div class="title">日志信息</div>
        <div class="main" ref="main">
            <div class="info" ref="info">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste repellat placeat earum rem sint molestiae a nisi magni quis, praesentium quidem sequi rerum ipsum eaque voluptas cumque tempore porro aperiam!
                <div class="mess" v-for="(item,index) in aa" :key="index">{{item}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
    data () {
        return {
         aa:[],
         leave:'',
         flag:true
        }
    },
    destroyed() {
        clearInterval(this.leave); 
    },
    mounted () {  
        this.scrollToBottom();
         setInterval(()=>{
            this.showCode();
         },1000)
    },  
    //每次页面渲染完之后滚动条在最底部  
    updated:function(){
        var container = this.$refs.main  
        console.log(container.scrollTop+'---'+container.scrollHeight)
        if (container.scrollHeight>container.scrollTop+950) {//850
            this.flag= false
        }else{
            this.flag= true;
        }
        if(this.flag){
            this.scrollToBottom();
        }else{
            return
        }
    },  
    methods:{  
        scrollToBottom: function () {  
            this.$nextTick(() => {  
                var container = this.$refs.main  
                container.scrollTop = container.scrollHeight;  
            })  
        },
        showCode(){
            // this.$http('', 'GET')
            // .then(res => {
            // })
            this.aa.push('a')
        }
        // showCode(shown) {
        //     let $this = this;
        //     $this.$http.get("/api/user/login").then(function(data) {
        //         if (data.data.error_code == 200) {
        //             $this.hint = "请使用微信扫一扫进行绑定"
        //             $this.img = data.data.error_message;
        //             $this.device = data.data.device;
        //             $this.data = data.data;
        //             let timer = setInterval(() => {  //轮询
        //                 $this.leave = timer;
        //                 let info = $this.device;
        //                 $this.$totalHttp.post("/api/user/checkLogin",
        //                     { device: info,userId:sessionStorage.getItem('name') }
        //                 )
        //                 .then(function(res) {
        //                     let status = JSON.parse(res.data.error_code);
        //                     let status_code = JSON.parse(res.data.status);
        //                     if( $this.shown ){              //如果切换到账号密码登陆，就停止轮询
        //                         clearInterval(timer);  
        //                     }
        //                     if (status == 200) {
        //                         $this.hint = "正在进行绑定，请稍候..."
        //                         clearInterval(timer);   //扫码成功，停止轮询
        //                         $this.$totalHttp.post("/api/user/loginCode",
        //                             { device: $this.device}
        //                         )
        //                         .then(function(data) {
        //                             console.log(data)
        //                             let status = data.data.error_code;
        //                             let status_code = JSON.parse(res.data.status);
        //                             if (status == -301) {
        //                                 setTimeout(()=>{
        //                                     $this.$totalHttp.post("/api/user/loginCode",{ device: $this.device,userId:sessionStorage.getItem('name') }
        //                                     ).then(function (res) {
        //                                         console.log(res)
        //                                     let status = res.status;
        //                                     if(status==-301){
        //                                         alert(301+'登陆失败')
        //                                     } else if (status == 200) {
        //                                             $this.$router.push("success");
        //                                         }
        //                                 })
        //                                 },200)
        //                             }else {
        //                             alert("成功");
        //                             $this.$router.push("success");
        //                             }
        //                         });
        //                     } else if( status == 422 ){
        //                         if(status_code == 4) {
        //                             alert('您已经取消登录,若想再次登录，请点击"刷新二维码"重新获取二维码...');
        //                             clearInterval(timer);   //扫码成功，停止轮询
        //                         }
        //                     }
        //                 });
        //             }, 3000); 
        //         } else {
        //         alert("获取二维码失败");
        //         }
        //     });
        // },


    }
}
</script>
<style lang="scss" scoped>
.logTask{
    color: #555b6b;
    .title {
        line-height: 30px;
        margin-bottom: 20px;
        font-size: 14px;
    }
    .main{
        min-height: 750px;
        max-height: 750px;
        overflow: auto;
        background: #fff;
    }
    .mess{
        height: 100px;
    }
}
</style>
