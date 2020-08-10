<template>
    <div class="adminLogin">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../assets/images/logo.png" alt="logo"></a>
            </div>
        </header>
        <div id="login_container">
             <div class="login_box">
                <div>
                    <p class="login_box_tips">管理员登入</p>
                </div>
                <el-form class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef" @keypress.enter.native="activeSubmit">
                    <el-form-item prop="adminName">
                        <el-input placeholder="账号" prefix-icon="iconfont icon-yonghu2" 
                            v-model="loginForm.adminName"></el-input>
                    </el-form-item>
                    <el-form-item prop="adminPwd">
                        <el-input type="password" placeholder="密码" prefix-icon="iconfont icon-mima"
                            v-model="loginForm.adminPwd" show-password></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="login">登入</el-button>
                </el-form>
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
            loginForm:{
                adminName:'',
                adminPwd:''
            },
            //登入表单的验证规则对象
            loginFormRules:{
                //账号的验证规则对象
                adminName:[
                   { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                //密码的验证规则对象
                adminPwd:[
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        login(){
            //对整个表单进行预验证，验证不通过时不让提交
            this.$refs.loginFormRef.validate(async valid=> {
                if(!valid)  return;
                let {data : result} = await this.$http.post('/adminLogin',this.loginForm);
                // console.log(result);
                if(result.meta.status === 400){
                    this.$message({
                        type:'error',
                        message:'登入失败，密码或账号错误！',
                        showClose:true
                    });
                }else{
                    window.sessionStorage.setItem("token",result.token);
                    this.$message({
                        type:'success',
                        message:'登入成功',
                        showClose:true
                    });
                    this.$router.push('/adminHome');
                }
            })
        },
        //当按回车时提交表单
        activeSubmit(){
            this.login();
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
        width: 100%;
        height: calc(100vh - 120px);
        background:#2b4b6b;
        min-width: 1200px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login_box{
        width: 400px;
        background:rgba(0, 0, 0, 0.2);
        border-radius: 15px 300px;
        padding: 15px;
        box-shadow: 0 0 15px rgba(0,0,0,0.1);
    }
    .login_box_tips{
        height: 50px;
        line-height: 50px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        font-size: 20px;
        margin-bottom: 15px;
    }
    .el-button{
        width: 100%;
        margin: 15px 0;
        letter-spacing: 10px;
        // word-spacing: 15px;
    }
</style>