<template>
    <div class="adminHome">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../../assets/images/logo.png" alt="logo"></a>
            </div>
            <span class="exit" @click="exit">退出</span>
        </header>
        <div id="container">
            <div class='box_container'>
                <div @click="toTeacherManage">
                    <img src="../../assets/images/teacher.png" alt="教师">
                    <p>教师管理</p>
                </div>
                <div @click="toStudentManage">
                    <img src="../../assets/images/student.png" alt="学生">
                    <p>学生管理</p>
                </div>
                <div @click="toClassManage">
                    <img src="../../assets/images/class.png" alt="班级">
                    <p>班级管理</p>
                </div>
                <div @click="toAdminManage">
                    <img src="../../assets/images/admin.png" alt="管理员">
                    <p>管理员管理</p>
                </div>
            </div>
        </div>
        <footer>
            <p>copyright 2019-2020 延边大学2020毕业设计 版权所有</p>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        //跳转到教师管理界面
        toTeacherManage(){
            this.$router.push('/teacherManagement');
        },
        //跳转到学生挂管理界面
        toStudentManage(){
            this.$router.push('/studentManagement');
        },
        //跳转到班级管理界面
        toClassManage(){
            this.$router.push('/classManagement');
        },
        //跳转到管理员管理界面
        async toAdminManage(){
            let {data : result} = await this.$http.get('/checkAdminRight');
            if(result.meta.status === 200){
                this.$router.push('/adminManagement');
            }else{
                this.$message({
                    type:'error',
                    message:'您没有权限操作这部分',
                    showClose:true
                });
            }
            
        }
    },
}
</script>


<style lang="less" scoped>
    .header_container {
        width: 50%;
        transform: translate(-25%, 0);
    }
    #container{
        width: 100%;
        height: calc(100vh - 120px);
        // background:#2b4b6b;
        min-width: 1200px;
    }
    .exit{
        color: #fff;
        // line-height: 70px;
        position: absolute;
        right: 100px;
        letter-spacing: 15px;
        cursor: pointer;
    }
    .exit:hover{
        color: red;
    }
    .box_container{
        width: 800px;
        display: flex;
        // justify-content: center;
        // align-items: center;
        align-content: center;
        height: 100%;
        margin: 0 auto;
        flex-wrap: wrap;
    }
    .box_container div{
        width: 200px;
        height: 200px;
        background: #86b4e2;
        margin: 15px;
        border-radius: 5px;
        cursor: pointer;
    }
    .box_container div:hover{
        background: #9dc8f3;
    }
    .box_container div img{
        margin: 30px 68px;
    }
    .box_container div p {
        text-align: center;
        color: #fff;
        font-size: 16px;
        letter-spacing: 5px;
    }
</style>