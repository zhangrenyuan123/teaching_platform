<template>
    <div class="createStudents">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../../assets/images/logo.png" alt="logo"></a>
            </div>
            <span class="exit" @click="exit">退出</span>
        </header>
         <section>
            <el-form :model="registerForm" :rules="registerRules" ref="registerRef" 
                label-width="100px"  class="register_form">
                <el-form-item label="学号" prop="stuNum">
                    <el-input v-model="registerForm.stuNum"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="registerForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="registerForm.pwd"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="registerForm.sex" label="男">男</el-radio>
                    <el-radio v-model="registerForm.sex" label="女">女</el-radio>
                </el-form-item>                
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="registerForm.tel"></el-input>
                </el-form-item>
                <el-form-item label="qq">
                    <el-input v-model="registerForm.qq"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="warning" class="register_btn"  @click="next">立即创建</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" class="stuNum" @click="getStuNum">获取</el-button>
        </section>
         <p class="back" @click="back">返回～～</p>
    </div>
</template>


<script>
export default {
    created() {
        this.getStudentNum()
    },
    data() {
        let verify_stuNum = (rule,value,callback) => {
            const exp = /^\d{10,}$/;
            if(!exp.test(value)){
                callback(new Error('请输入10位数字的学号'));
            }else{
                callback();
            }
        };
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
            //注册表单数据对象
            registerForm:{
                stuNum:'',
                name:'',
                pwd:'123456aA',
                sex:'男',
                email:'123456@qq.com',
                tel:'13456789102',
                qq:''
            },
            //最大的学号
            maxNum:2020000000,
            //验证规则对象
            registerRules:{
                stuNum:[
                    {
                        required:true,message:'请输入学号',trigger:'blur'
                    },
                    {
                        validator:verify_stuNum,trigger:'blur'
                    }
                ],
                name:[
                    {
                        required:true,message:'请输入姓名',trigger:'blur'
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
        }
    },
    methods: {
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        async getStudentNum(){
            let { data : result} = await this.$http.get('/getStudentNum');
            if(result.meta.status = 200){
                this.maxNum = result.data;
            }
        },
        getStuNum(){
            this.registerForm.stuNum = this.maxNum+1;
        },
        next(){
            this.$refs.registerRef.validate(async valid => {
                if(!valid) return;
                let {data : result} = await this.$http.post('/addStudent',this.registerForm);
                if(result.meta.status === 200){
                    this.$message({
                        type:'success',
                        message:'学生创建成功',
                        showClose:true
                    });
                    this.$router.push('/studentManagement');
                }else{
                    this.$message({
                        type:'error',
                        message:'该账户已存在',
                        showClose:true
                    });
                }
            });
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
    .stuNum{
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