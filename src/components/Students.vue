<template>
    <div id="student">
            <el-form class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef" @keypress.enter.native="activeSubmit">
                <el-form-item prop="stunum">
                    <el-input placeholder="学生号" prefix-icon="iconfont icon-yonghu2" 
                        v-model="loginForm.stunum"></el-input>
                </el-form-item>
                <el-form-item prop="stupwd">
                    <el-input type="password" placeholder="密码" prefix-icon="iconfont icon-mima"
                        v-model="loginForm.stupwd" show-password></el-input>
                </el-form-item>
                <el-form-item >
                    <p class="pwdBox">
                        <router-link to="/forgetPwd">忘记密码?</router-link>
                    </p>
                </el-form-item>
                <el-button type="primary" @click="login">登入</el-button>
            </el-form>
    </div>
</template>

<script>
export default {
    data() {
        let verify_num = (rule,value,callback) => {
            let exp = /^\d+$/;
            if(!exp.test(value)){
                callback(new Error('请输入正确的账号!'));
            }else{
                callback();
            }
        };
        return {
            //表单数据绑定
            loginForm:{
                stunum:'', //学号
                stupwd:''  //密码
            },
            //登入表单的验证规则对象
            loginFormRules:{
                //学生号的验证规则对象
                stunum:[
                   { required: true, message: '请输入学生号', trigger: 'blur' },
                   {
                       validator:verify_num,trigger:'blur'
                   }
                ],
                //学生密码的验证规则对象
                stupwd:[
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
                let {data : result} = await this.$http.post('/students/login',{
                    studentNum:this.loginForm.stunum,
                    studentPwd:this.loginForm.stupwd
                });
                // console.log(result);
                if(result.meta.status === 200){
                    window.sessionStorage.setItem("token",result.token);
                    this.$message({
                        type:'success',
                        message:'登入成功！',
                        showClose:true
                    });
                    this.$router.push('/myCourses');
                }else{
                    this.$message({
                        type:'error',
                        message:'登入失败，密码或账号错误！',
                        showClose:true
                    });
                }
            });
        },
        activeSubmit(){
            this.login();
        }
    },
}
</script>

<style lang="less" scoped>
    .login_form{
        padding: 20px;
    }
    .login_form button{
        width: 100%;
    }
    .pwdBox{
        text-align: right;
    }
    .pwdBox a{
        color: #fff;
        font-size: 12px;
        padding-right: 15px;
        letter-spacing: 2px;
    }
    .pwdBox a:hover{
        color: red;
    }
</style>