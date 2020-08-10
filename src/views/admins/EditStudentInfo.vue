<template>
    <div class="editStudentInfo">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../../assets/images/logo.png" alt="logo"></a>
            </div>
            <span class="exit" @click="exit">退出</span>
        </header>
        <section>
            <el-form :model="info" :rules="registerRules" ref="registerRef" 
                label-width="100px"  class="register_form">
                <el-form-item label="学号" prop="stuNum">
                    <el-input v-model="info.stuNum"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="info.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="info.pwd"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="info.sex" label="男">男</el-radio>
                    <el-radio v-model="info.sex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="年级">
                    <el-select v-model="info.grade" placeholder="请选择年级">
                        <el-option v-for="grade in gradeList" 
                            :key="grade" :label="grade" :value="grade"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业">
                    <el-select v-model="info.major" placeholder="请选择专业">
                        <el-option v-for="major in majorList" 
                            :key="major" :label="major" :value="major"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="info.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="info.tel"></el-input>
                </el-form-item>
                <el-form-item label="qq">
                    <el-input v-model="info.qq"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="warning" class="register_btn"  @click="save">保存</el-button>
                </el-form-item>
            </el-form>
        </section>
         <p class="back" @click="back">返回～～</p>
    </div>
</template>

<script>
export default {
    created() {
        this.getStudentId();
    },
    data() {
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
        let verify_name = (rule,value,callback) => {
            const exp = /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/;
            if(!exp.test(value)){
                callback(new Error('请输入正确的姓名'));
            }else{
                callback();
            }
        };
        let verify_email = (rule,value,callback) => {
            let exp = /^[a-zA-Z0-9][a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-z]{2,}$/
            if(!exp.test(value)){
                callback(new Error('请输入正确的邮箱'));
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
            //学生id
            id:0,
            //学生信息
            info:{
                stuNum:'',
                name:'',
                pwd:'123456aA',
                sex:'男',
                grade:'',
                major:'',
                email:'123456@qq.com',
                tel:'13456789102',
                qq:''
            },
            //验证规则对象
            registerRules:{
                teaNum:[
                    {
                        required:true,message:'请输入您的教师号',trigger:'blur'
                    },
                    {
                        validator:verify_teaNum,trigger:'blur'
                    }
                ],
                name:[
                    {
                        required:true,message:'请输入您的姓名',trigger:'blur'
                    },
                    {
                        validator:verify_name,trigger:'blur'
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
                email:[
                    {
                        required:true,message:'请输入邮箱',trigger:'blur'
                    },
                    {
                        validator:verify_email,trigger:'blur'
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
            //年级列表
            gradeList:['2015','2016','2017','2018','2019','2020'],
            //专业列表  
            majorList:['数字媒体技术','计算机科学与技术'],
        }
    },
    methods: {
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        back(){
            this.$router.push('/studentManagement');
        },
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
                this.info.stuNum = result.data.Student_num;
                this.info.name = result.data.Student_name;
                this.info.pwd = result.data.Student_pwd;
                this.info.sex = result.data.Student_sex;
                this.info.grade = result.data.Student_grade;
                this.info.major = result.data.Student_major;
                this.info.tel = result.data.Student_tel;
                this.info.email = result.data.Student_email;
                this.info.qq = result.data.Student_qq;
            }
        },
        save(){
            this.$refs.registerRef.validate(async valid => {
                if(!valid) return;
                let {data : result} = await this.$http.post('/editStudentInfo',{
                    ...this.info,
                    id:this.id
                });
                if(result.meta.status === 200){
                    this.$message({
                        type:'success',
                        message:'保存修改成功',
                        showClose:true
                    });
                    this.$router.push('/studentManagement');
                }else{
                    this.$message({
                        type:'error',
                        message:'保存修改失败',
                        showClose:true
                    });
                }
            });
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
     .register_form{
        width: 400px;
        // margin: 0 auto;
        margin-top: 15px;
    }
    .register_btn{
        width: 100%;
    }
    section{
        overflow: auto;
        position: relative;
        width: 500px;
        margin-left: 200px;
    }
    .teaNum{
        position: absolute;
        right: 0;
        top: 15px;
    }
    .back{
        position: absolute;
        right: 150px;
        bottom: 50px;
        letter-spacing: 5px;
        color: rgb(31, 75, 197);
        font-size: 20px;
        cursor: pointer;
    }
    .back:hover{
       color: rgb(223, 86, 223);
    }
</style>