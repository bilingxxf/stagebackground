<template>
    <div class="dialog_box" v-if="visible">
        <div class="dialog_header">
            {{dialogData.title}}
        </div>
        <div class="dialog_content">
            <el-table
                :data="dialogData.tableData"
                @selection-change="handleSelectionChange"
                style="width: 100%">
                 <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址">
                </el-table-column>
            </el-table>
        </div>
        <div class="dialog_footer">
            <el-button type="primary" @click="submit">确认</el-button>
            <el-button type="primary" @click="cancel" v-if="dialogData.showCancel">取消</el-button>
        </div>
    </div>
</template>
<script>
import{mapState,mapMutations,mapGetters,mapActions} from 'vuex'
export default {
    data(){
        return{

        }
    },
    computed:{
        ...mapState([
            'visible',
            'dialogData'
        ])
    },
    methods:{
        submit(){
            if(this.$listeners.callback){
                this.$emit('callback')
            }else{
                this.cancel();
            }
        },
        cancel(){
            this.$store.dispatch('hideDialog')
        },
        handleSelectionChange(val){
            this.$emit('handleChangeSelect',val)
        },
        ...mapMutations([
            
        ]),
        ...mapActions([

        ])
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .dialog_box{
        width: 600px;
        min-height: 400px;
        position: fixed;
        top:20%;
        left: 0;
        right: 0;
        margin:0 auto;
        background-color: #fff;
        border: 1px solid #eee;
        .dialog_header{
            height: 40px;
            background-color: #409EFF;
            line-height: 40px;
            text-align: center;
        }
        .dialog_content{
           margin-bottom: 20px;
        }
        .dialog_footer{
            height:60px;
            text-align: center;
            background-color: #fff;
        }
    }
</style>

