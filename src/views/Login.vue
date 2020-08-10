<template>
    <div id="login">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../assets/images/logo.png" alt="logo"></a>
            </div>
        </header>
        <div id="login_container">
            <div class="login_img">
                <img src="../assets/images/img1.png">
            </div>
            <div class="login_box">
                <div class="login_header">
                    <span @click="changeStu" :class="{active:isactiveStu}">学生</span>
                    <span @click="changeTea" :class="{active:isactiveTea}">教师</span>
                </div>
                <div class="login_body">
                    <keep-alive>
                        <component :is="componentId"></component>
                    </keep-alive>
                </div>
            </div>    
        </div>
        <footer>
            <p>copyright 2019-2020 延边大学2020毕业设计 版权所有</p>
        </footer>
    </div>
</template>

<script>
import Students from '../components/Students'
import Teachers from '../components/Teachers'

export default {
    data(){
        return {
            componentId:Students,
            isactiveStu:true,  //表示学生组件是否激活
            isactiveTea:false //表示教师组件是否激活
        }
    },
    methods:{
        changeStu(){
            this.componentId=Students;
            this.isactiveStu = true;
            this.isactiveTea = false;
        },
        changeTea(){
            this.componentId=Teachers;
            this.isactiveStu = false;
            this.isactiveTea = true;
        }
    },
    beforeRouteEnter (to, from, next) {
        window.sessionStorage.clear();
        next();
    }
}

</script>

<style lang="less" scoped>
    
    .header_container {
        width: 50%;
        margin: 0 auto;
        transform: translate(-25%, 0);
    }
    
    #login_container{
        position: relative;
        width: 100%;
        height: calc(100vh - 120px);
        background:#2b4b6b;
        min-width: 1200px;
    }
    .login_box{
        width: 300px;
        background:rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        position: absolute;
        right: 20%;
        top:50%;
        transform: translate(0,-50%);
    }
    .login_img{
        position: absolute;
        left:15%;
        top: 50%;
        transform: translate(0,-35%);
    }

    .login_header{
        margin-bottom: 15px;
        border-bottom: 1px solid #fff;
        padding: 15px;
    }

    .login_header span{
        display: inline-block;
        width: 50%;
        text-align: center;
        cursor: pointer;
        color: #fff;
        font-size: 20px;
        font-weight: 700;
    }

    .login_header span.active{
        color: #ff7400;
    }
</style>