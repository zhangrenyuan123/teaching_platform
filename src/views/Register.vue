<template>
    <div id="register">
        <header>
            <div class="header_container">
                <router-link to="/login"><img src="../assets/images/logo.png" alt="logo"></router-link>
            </div>
            <P><router-link to="/login">已有账号？登入</router-link></P>
        </header>
        <div class="register_content">
            <el-steps :active="active" finish-status="success">
                <el-step title="第1步"></el-step>
                <el-step title="第2步"></el-step>
                <el-step title="第3步"></el-step>
            </el-steps>
            <div class="register_box">
                <keep-alive>
                    <component :is="step" :isStudent='isStudent' @update="firstStepResult" @clickDown="next"></component>
                </keep-alive>
            </div>
            
        </div>
        <footer>
            <p>copyright 2019-2020 延边大学2020毕业设计 版权所有</p>
        </footer>
    </div>
</template>

<script>
import step_1 from '../components/register_step_1'
import step_2 from '../components/register_step_2'
import step_3 from '../components/register_step_3'

export default {
    data() {
        return {
            active: 0,
            step:step_1,
            isStudent:true
        }
    },
    methods: {
        next(){
            if (this.active++ > 2) this.active = 0;
            if(this.active === 0){
                this.step = step_1;
            }else if(this.active === 1){
                this.step = step_2;
            }else{
                this.step = step_3;
            }
        },
        //判断第一步用户选择是学生还是教师
        firstStepResult(name){
            if(name === 'student'){
                this.isStudent = true;
            }else{
                this.isStudent = false;
            }
        }
    },
    components:{
        step_1,
        step_2,
        step_3
    }
}
</script>

<style lang="less" scoped>
    .register_content{
        position: relative;
        width: 70%;
        height: calc(100vh - 120px);
        margin: 0 auto;
        padding-top: 30px;
    }

    // .register_btn{
    //     position:absolute;
    //     bottom: 10%;
    //     right: 5%;
    // }

    .header_container {
        width: 50%;
        margin: 0 auto;
        transform: translate(-25%, 0);
    }

    .register_box{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    #register header p {
        padding-right: 120px;
    }
    #register header p a{
        font-size: 0.8rem;
        color: #fff;
    }
    #register header p a:hover{
        color: orange;
    }
</style>