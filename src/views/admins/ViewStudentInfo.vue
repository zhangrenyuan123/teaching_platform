<template>
    <div class="viewStudentInfo">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../../assets/images/logo.png" alt="logo"></a>
            </div>
            <span class="exit" @click="exit">退出</span>
        </header>
        <div class="container">
            <div class="left_content">
                <img src="../../assets/images/head.png" alt="头像">
            </div>
            <div class="right_content">
                <div class="right_container">
                    <p><span>学号： </span>{{info.Student_num}}</p>
                    <p><span>姓名： </span>{{info.Student_name}}</p>
                    <p><span>性别： </span>{{info.Student_sex}}</p>
                    <p><span>班级： </span>{{info.Student_grade}}</p>
                    <p><span>专业： </span>{{info.Student_major}}</p>
                    <p><span>电话： </span>{{info.Student_tel}}</p>
                    <p><span>邮箱： </span>{{info.Student_email}}</p>
                    <p><span>QQ ： </span>{{info.Student_qq}}</p>
                    <p @click="back">返回~~</p>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    created(){
        this.getStudentId();
    },
    data() {
        return {
           //学生信息
            info:{},
            //学生id
            id:0
        }
    },
    methods: {
        //获取学生id
        getStudentId(){
            this.id = this.$router.history.current.query.id;
            this.getStudentInfo();
        },
        //获取学生信息
        async getStudentInfo(){
            let {data:result} = await this.$http.post('/getStudentInfo',{
                id:this.id
            });
            if(result.meta.status === 200){
                this.info = result.data;
            }
        },
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        back(){
            this.$router.push('/studentManagement');
        }
    },
}
</script>

<style lang="less" scoped>
    .header_container {
        width: 50%;
        transform: translate(-45%, 0);
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
    .container{
        margin-top: 45px;
        display: flex;
    }
    .left_content{
        height: 500px;
        width: 35%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 3px solid #777;
    }
    .left_content img{
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: #bbb;
    }
    .right_content{
        height: 500px;
        width: 65%;
        padding: 15px;
        display: flex;
        justify-items: center;
        align-items: center;
    }
    .right_container{
        width: 100%;
        padding-left: 120px;
    }
    .right_container p{
        margin: 15px;
        color: #333;
    }
    .right_container p span{
        margin-right: 15px;
        font-weight: 700;
        color: #000;
    }
    .right_container p:last-child{
        color: rgb(31, 75, 197);
        font-size: 20px;
        cursor: pointer;
        position: absolute;
        right: 150px;
        bottom: 50px;
        letter-spacing: 5px;
    }
    .right_container p:last-child:hover{
        color: rgb(223, 86, 223);
    }
</style>