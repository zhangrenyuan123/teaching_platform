<template>
    <div class="step_2">
        <el-form :model="registerForm" :rules="registerRules" ref="registerRef" 
            label-width="100px"  class="register_form">
            <el-form-item label="学号" prop="stuNum" v-if="isStudent" inline-message>
                <el-input v-model="registerForm.stuNum"></el-input>
            </el-form-item>
            <el-form-item label="教师号" prop="teaNum" v-else>
                <el-input v-model="registerForm.teaNum"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="tel">
                <el-input  v-model="registerForm.tel"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input style="width:65%" v-model="registerForm.authCode" placeholder="验证码"></el-input>
                <el-button style="width:35%" type="success" class="authCode" plain @click="getAuthCode" :disabled="isShowAuthCode">
                    {{isShowTimes ? `${times} s` : '获取验证码'}}
                </el-button>
            </el-form-item>
            <el-form-item label="新密码" prop="pwd">
                <el-input type="password" v-model="registerForm.pwd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd">
                <el-input type="password" v-model="registerForm.confirmPwd"></el-input>
            </el-form-item>
            <el-button class="register_btn"  @click="next">下一步</el-button>
        </el-form>
    </div >
</template>

<script>
import { async } from 'q';
export default {
    props:{
        isStudent:Boolean,
    },
    data() {
        let verify_stuNum = (rule,value,callback) => {
            const exp = /^\d{10,}$/;
            if(!exp.test(value)){
                callback(new Error('请输入正确的学号'));
            }else{
                callback();
            }
        };
        let verify_teaNum = (rule,value,callback) => {
            const exp = /^\d{4,}$/;
            if(!exp.test(value)){
                callback(new Error('请输入正确的教师号'));
            }else{
                callback();
            }
        }
        let verify_pwd = (rule,value,callback) => {
            const exp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
            if(!exp.test(value)){
                callback(new Error('密码必须包含数字、大小写字母，大于8位、小于16位'));
            }else{
                callback();
            }
        };
        let verify_confirmPwd = (rule,value,callback) => {
            if(value !== this.registerForm.pwd){
                callback(new Error('密码不一致，请重新输入'));
            }else{
                callback();
            }
        };
        let verify_tel = (rule,value,callback) => {
            let exp = /^1[3456789]\d{9}$/;
            if(!exp.test(value)){
                callback(new Error('请输入正确的电话号码'));
            }else{
                callback();
            }
        };
        return {
            registerForm:{
                stuNum:'',
                teaNum:'',
                pwd:'',
                confirmPwd:'',
                tel:'',
                authCode:''
            },
            registerRules:{
                stuNum:[
                    {
                        required:true,message:'请输入您的学号',trigger:'blur'
                    },
                    {
                        validator:verify_stuNum,trigger:'blur'
                    }
                ],
                teaNum:[
                    {
                        required:true,message:'请输入您的教师号',trigger:'blur'
                    },
                    {
                        validator:verify_teaNum,trigger:'blur'
                    }
                ],
                pwd:[
                    {
                        required:true,message:'请输入密码',trigger:'blur'
                    },
                    {
                        validator:verify_pwd,trigger:'blur'
                    }
                ],
                confirmPwd:[
                    {
                        required:true,message:'请输入确认密码',trigger:'blur'
                    },
                    {
                        validator:verify_confirmPwd,trigger:'blur'
                    }
                ],
                tel:[
                    {
                        required:true,message:'请输入电话',trigger:'blur'
                    },
                    {
                        validator:verify_tel,trigger:'blur'
                    }
                ]
            },
            isShowAuthCode:false,
            isShowTimes:false,
            times:120
        }
    },
    methods: {
        //获取验证码
        async getAuthCode(){
            if(this.isStudent){
                const exp = /^\d{10,}$/;
                if(this.registerForm.stuNum === '' || !exp.test(this.registerForm.stuNum)){
                    this.$message({
                        type:'error',
                        message:'请输入正确的学号',
                        showClose:true
                    });
                }else{ 
                    let {data : result} =  await this.$http.post('/checkStudentTel',{
                        stuNum:this.registerForm.stuNum,
                        tel:this.registerForm.tel
                    });
                    if(result.meta.status === 200){
                        this.isShowAuthCode = true;
                        this.isShowTimes = true;
                        let intervalId = setInterval(() => {
                            this.times -= 1
                            if(this.times === 0){
                                this.isShowAuthCode = false;
                                this.isShowTimes = false;
                                this.times = 120;
                                clearInterval(intervalId);
                            }
                        }, 1000);
                        let {data : result1} = await this.$http.post('/sendSms',{
                            phoneNumber:this.registerForm.tel
                        });
                        if(result1.meta.status === 200){
                            window.sessionStorage.setItem("authCode",result1.data);
                        }
                    }else{
                        this.$message({
                            type:'error',
                            message:'当前手机号未和该学生进行绑定',
                            showClose:true
                        });
                    }
                }
            }else{
                const exp = /^\d{4,}$/;
                if(this.registerForm.teaNum === '' || !exp.test(this.registerForm.teaNum)){
                    this.$message({
                        type:'error',
                        message:'请输入正确的教师号',
                        showClose:true
                    });
                }else{ 
                    let {data : result} =  await this.$http.post('/checkTeacherTel',{
                        teaNum:this.registerForm.teaNum,
                        tel:this.registerForm.tel
                    });
                    if(result.meta.status === 200){
                        this.isShowAuthCode = true;
                        this.isShowTimes = true;
                        let intervalId = setInterval(() => {
                            this.times -= 1
                            if(this.times === 0){
                                this.isShowAuthCode = false;
                                this.isShowTimes = false;
                                this.times = 120;
                                clearInterval(intervalId);
                            }
                        }, 1000);
                        let {data : result1} = await this.$http.post('/sendSms',{
                            phoneNumber:this.registerForm.tel
                        });
                        if(result1.meta.status === 200){
                            window.sessionStorage.setItem("authCode",result1.data);
                        }
                    }else{
                        this.$message({
                            type:'error',
                            message:'当前手机号未和该教师进行绑定',
                            showClose:true
                        });
                    }
                }
            }
        },
        next(){
            //预验证
            this.$refs.registerRef.validate(async valid => {
                if(!valid) return;
                if(this.registerForm.authCode === window.sessionStorage.getItem('authCode')){
                    if(this.isStudent){
                        let {data : result} = await this.$http.post('/updateStudentPwd',{
                            num:this.registerForm.stuNum,
                            pwd:this.registerForm.pwd
                        });
                        if(result.meta.status === 200){
                            this.$message({
                                type:'success',
                                message:'密码修改成功',
                                showClose:true
                            });
                        }else{
                           this.$message({
                                type:'errpr',
                                message:'密码修改失败',
                                showClose:true
                            }); 
                        }
                    }else{
                        let {data : result} = await this.$http.post('/updateTeacherPwd',{
                            num:this.registerForm.teaNum,
                            pwd:this.registerForm.pwd
                        });
                        if(result.meta.status === 200){
                            this.$message({
                                type:'success',
                                message:'密码修改成功',
                                showClose:true
                            });
                        }else{
                            this.$message({
                                type:'errpr',
                                message:'密码修改失败',
                                showClose:true
                            });
                        }
                    }
                }else{
                    this.$message({
                        type:'error',
                        message:'验证码不正确，请重新获取',
                        showClose:true
                    });
                }
                this.$emit('clickDown');
                this.$emit('clickDown');
            }); 
        }
    },
}
</script>

<style lang="less" scoped>
    .register_form{
        margin-top: 30px;
        width: 400px;
    }
    .register_btn{
        position:absolute;
        bottom: 10%;
        right: 5%;
    }
</style>