<template>
    <div class="studentInfo">
        <div class="left_content">
            <img src="../assets/images/head.png" alt="头像">
        </div>
        <div class="right_content">
            <div class="right_container">
                <p><span>学号： </span>{{info.num}}</p>
                <p><span>姓名： </span>{{info.name}}</p>
                <p><span>性别： </span>{{info.sex}}</p>
                <p><span>年级： </span>{{info.grade}}</p>
                <p><span>专业： </span>{{info.major}}</p>
                <p><span>电话： </span>{{info.tel}}</p>
                <p><span>邮箱： </span>{{info.email}}</p>
                <p><span>QQ ： </span>{{info.qq}}</p>
                <p><span>简介： </span>{{info.intro === '' ? '这个人很懒,什么都没留...' : info.intro}}</p>
                <el-button type="primary" @click="dialogFormVisible = true">编辑资料</el-button>
                <el-button type="success" @click="pwdFormVisible = true">修改密码</el-button>
            </div>
        </div>
        <el-dialog title="学生信息" :visible.sync="dialogFormVisible">
            <el-form :model="info" :rules="infoFormRules" ref="infoFromRef">
                <el-form-item label="学号" label-width="120px">
                    <el-input v-model="info.num" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名" label-width="120px" prop="name">
                    <el-input v-model="info.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" label-width="120px">
                    <el-radio label="男" v-model="info.sex"></el-radio>
                    <el-radio label="女" v-model="info.sex"></el-radio>
                </el-form-item>
                <el-form-item label="年级" label-width="120px">
                    <el-input v-model="info.grade" disabled></el-input>
                </el-form-item>
                <el-form-item label="专业" label-width="120px">
                    <el-input v-model="info.major" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="120px" prop="tel">
                    <el-input v-model="info.tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="120px" prop="email">
                    <el-input v-model="info.email" ></el-input>
                </el-form-item>
                 <el-form-item label="qq" label-width="120px">
                    <el-input v-model="info.qq" ></el-input>
                </el-form-item>
                <el-form-item label="简介" label-width="120px">
                    <el-input type="textarea" v-model="info.intro" placeholder="这个人很懒什么都没有留下"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="updateStudentInfo">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="pwdFormVisible">
            <el-form :model="pwd" :rules="pwdRules" ref="pwdRef">
                    <el-form-item label="当前密码" label-width="120px" prop="currentPwd">
                        <el-input type="password" v-model="pwd.currentPwd"></el-input>
                    </el-form-item>
                    <el-form-item label="修改密码" label-width="120px" prop="confirmPwd">
                            <el-input type="password" v-model="pwd.confirmPwd"></el-input>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEditPwd">取 消</el-button>
                <el-button type="primary" @click="editPwd">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import { async } from 'q';
export default {
    created(){
        this.getStudentInfo();
    },
    data() {
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
        let verify_confirmPwd = (rule,value,callback) => {
            const exp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
            if(!exp.test(value)){
                callback(new Error('密码必须包含数字、大小写字母，大于8位、小于16位'));
            }else{
                callback();
            }
        };
        return {
            //学生信息
            info:{
                num:'',
                name:'',
                sex:'',
                grade:'',
                mojor:'',
                tel:'',
                email:'',
                qq:'',
                intro:''
            },
            //备份信息
            backupInfo:{
                name:'',
                sex:'',
                tel:'',
                email:'',
                qq:'',
                intro:''
            },
            //密码信息
            pwd:{
                currentPwd:'',
                confirmPwd:''
            },
            //是否显示修改信息对话框
            dialogFormVisible:false,
            //是否显示修改密码对话框
            pwdFormVisible:false,
            //信息框规则对象
            infoFormRules:{
                name:[
                    {
                        required:true,message:'请输入您的姓名',trigger:'blur'
                    },
                    {
                        validator:verify_name,trigger:'blur'
                    }
                ],
                tel:[
                    {
                        required:true,message:'请输入电话',trigger:'blur'
                    },
                    {
                        validator:verify_tel,trigger:'blur'
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
            },
            //密码框规则对象
            pwdRules:{
                currentPwd:[
                    {
                        required:true,message:'请输入当前密码',trigger:'blur'
                    }
                ],
                confirmPwd:[
                    {
                        required:true,message:'请输入修改后密码',trigger:'blur'
                    },
                    {
                        validator:verify_confirmPwd,trigger:'blur'
                    }
                ]
            }
        }
    },
    methods: {
        //获取学生信息
        async getStudentInfo(){
            let {data:result} = await this.$http.get('/getStudentInfo');
            this.info.num = result[0].Student_num;
            this.info.name = result[0].Student_name;
            this.info.sex = result[0].Student_sex;
            this.info.grade = result[0].Student_grade;
            this.info.major = result[0].Student_major;
            this.info.tel = result[0].Student_tel;
            this.info.email = result[0].Student_email;
            this.info.qq = result[0].Student_qq;
            this.info.intro = result[0].Student_intro;
            this.backupInfo.name = this.info.name;
            this.backupInfo.sex = this.info.sex;
            this.backupInfo.tel = this.info.tel;
            this.backupInfo.email = this.info.email;
            this.backupInfo.qq = this.info.qq;
            this.backupInfo.intro = this.info.intro;
        },
        //更新学生信息
        updateStudentInfo(){
            //预检验
            this.$refs.infoFromRef.validate(async valid => {
                if(!valid) return;
                let {data : result} = await this.$http.post('/updateStudentInfo',this.info);
                if(result.meta.status === 200){
                    this.$message({
                        type:'success',
                        message:'信息修改成功',
                        showClose:true
                    });
                }else{
                    this.$message({
                        type:'error',
                        message:'信息修改失败',
                        showClose:true
                    })
                }
                this.dialogFormVisible = false;
            })
        },
        //取消更新
        cancel(){
            this.info.name = this.backupInfo.name;
            this.info.sex = this.backupInfo.sex;
            this.info.tel = this.backupInfo.tel;
            this.info.email = this.backupInfo.email;
            this.info.qq = this.backupInfo.qq;
            this.info.intro = this.backupInfo.intro;
            this.$refs.infoFromRef.clearValidate(); //取消检验效果
            this.dialogFormVisible = false;
        },
        //取消修改密码
        cancelEditPwd(){
            this.pwd.currentPwd = '';
            this.pwd.confirmPwd = '';
            this.$refs.pwdRef.clearValidate();
            this.pwdFormVisible = false;
        },
        //修改密码
        editPwd(){
            this.$refs.pwdRef.validate(async valid => {
                if(valid){
                    let {data : queryResult} = await this.$http.post('/checkPwd',{
                        currentPwd:this.pwd.currentPwd,
                        num:this.info.num,
                        isStudent:true
                    });
                    if(queryResult.meta.status === 200){
                        let {data : updatePwd} = await this.$http.post('/updatePwd',{
                            editPwd:this.pwd.confirmPwd,
                            num:this.info.num,
                            isStudent:true
                        });
                        if(updatePwd.meta.status === 200){
                            this.$message({
                                type:'success',
                                message:'密码修改成功,请重新登入',
                                showClose:true
                            });
                            this.$router.push('/login');
                        }else{
                           this.$message({
                                type:'error',
                                message:'修改密码失败',
                                showClose:true
                            });
                        }
                    }else{
                        this.$message({
                            type:'error',
                            message:'当前密码不正确',
                            showClose:true
                        }); 
                    }
                    this.pwdFormVisible = false;
                }
            })
            
        }
    },
}
</script>

<style lang="less" scoped>
    .studentInfo{
        height: 100%;
        display: flex;
    }
    .left_content{
        // background: red;
        height: 100%;
        width: 35%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 3px solid #777;
    }
    // .head_container{
    //     width: 150px;
    //     height: 150px;
    //     border-radius: 50%;
    //     background: #bbb;
    // }
    .left_content img{
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: #bbb;
    }
    .right_content{
        height: 100%;
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
    .right_container p:last-of-type{
        font-size: 14px;
        color: #777;
    }
    .right_container p span{
        margin-right: 15px;
        font-weight: 700;
        color: #000;
    }
    .right_container button{
        margin:30px 15px;
    }
</style>