<template>
    <div class="adminManagement">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../../assets/images/logo.png" alt="logo"></a>
            </div>
            <span class="exit" @click="exit">退出</span>
        </header>
         <div class="content">
           <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>管理员</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="add">添加</el-button>
                </div>
                <div class="item">
                    <span>账号</span>
                    <span>密码</span>
                    <span>权限</span>
                    <span>操作</span>
                </div>
                <div v-for="admin in adminList" :key="admin.id" class="item">
                    <p>
                        <span>{{admin.Admin_name}}</span>
                        <span>{{admin.Admin_pwd}}</span>
                        <span>{{admin.Admin_status === 0 ? '超级管理员' : '普通管理员'}}</span>
                        <span>
                            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                                <el-button type="primary" size="small" icon="el-icon-edit" :enterable="false" @click="editAdminInfo(admin.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" @click="deleteAdmin(admin.id)" placement="top">
                                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteAdmin(admin.id)"></el-button>
                            </el-tooltip>
                        </span>
                    </p>
                </div>
            </el-card>
            <div class="button">
                <el-button type="success" @click="back">返回主页面</el-button>
            </div>
        </div>
        <el-dialog title="添加管理员" :visible.sync="addAdminFormVisible">
            <el-form :model="adminInfo" ref="addAdminRef" :rules="AdminRules">
                    <el-form-item label="账号" prop="name">
                        <el-input  v-model="adminInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd">
                        <el-input  v-model="adminInfo.pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="权限">
                        <el-select v-model="adminInfo.status" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addAdmins">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改管理员信息" :visible.sync="editAdminFormVisible">
            <el-form :model="editadminInfo" ref="editAdminRef" :rules="AdminRules">
                    <el-form-item label="账号" prop="name">
                        <el-input  v-model="editadminInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd">
                        <el-input  v-model="editadminInfo.pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="权限">
                        <el-select v-model="editadminInfo.status" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveAdmins">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created() {
        this.getAdminList();
    },
    data() {
        return {
            //管理员信息列表
            adminList:[],
            //管理员信息
            adminInfo:{
                name:'',
                pwd:'',
                status:0
            },
            //编辑信息
            editadminInfo:{
                id:0,
                name:'',
                pwd:'',
                status:0
            },
            //添加管理员对话框是否显示
            addAdminFormVisible : false,
            //修改管理员信息对话框是否显示
            editAdminFormVisible:false,
            options:[
                {
                    label:'超级管理员',
                    value:0
                },
                {
                    label:'普通管理员',
                    value:1
                }
            ],
            //添加管理员的规则对象
            AdminRules:{
                name:[
                    {
                        required:true,message:'请输入账号名',trigger:'blur'
                    }
                ],
                pwd:[
                    {
                        required:true,message:'请输入密码',trigger:'blur'
                    }
                ]
            }
        }
    },
    methods: {
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        //获取管理员列表
        async getAdminList(){
            let {data : result} = await this.$http.get('/getAdminList');
            if(result.meta.status === 200){
                this.adminList = result.data;
            }
        },
        //返回主页面
        back(){
            this.$router.push('/adminHome');
        },
        add(){
            this.addAdminFormVisible = true;
        },
        //添加管理员
        addAdmins(){
            this.$refs.addAdminRef.validate(async valid => {
                if(!valid) return;
                let {data : result} = await this.$http.post('/addAdmins',this.adminInfo);
                if(result.meta.status === 200){
                    this.adminInfo.name = '';
                    this.adminInfo.pwd = '';
                    this.adminInfo.status = 0;
                    this.addAdminFormVisible = false;
                    this.$message({
                        type:'success',
                        message:'添加成功',
                        showClose:true
                    });
                    this.getAdminList();
                }else{
                    this.$message({
                        type:'error',
                        message:'添加失败',
                        showClose:true
                    }); 
                }
            });
        },
        //取消添加
        cancel(){
            this.adminInfo.name = '';
            this.adminInfo.pwd = '';
            this.adminInfo.status = 0;
            this.$refs.addAdminRef.clearValidate();
            this.addAdminFormVisible = false;
        },
        //修改管理员信息
        async editAdminInfo(id){
            let {data : result} = await this.$http.post('/getAdminInfo',{
                id
            });
            if(result.meta.status === 200){
                // this.editadminInfo = result.data; 
                this.editadminInfo.id = result.data.id;  
                this.editadminInfo.name = result.data.Admin_name;  
                this.editadminInfo.pwd = result.data.Admin_pwd;  
                this.editadminInfo.status = result.data.Admin_status;  
                this.editAdminFormVisible = true;
            }
        },
        //取消编辑
        cancelEdit(){
            this.editAdminFormVisible = false;
        },
        //保存编辑
        saveAdmins(){
             this.$refs.editAdminRef.validate(async valid => {
                if(!valid) return;
                let {data : result} = await this.$http.post('/editAdminInfo',this.editadminInfo);
                if(result.meta.status === 200){
                    this.editAdminFormVisible = false;
                    this.$message({
                        type:'success',
                        message:'修改成功',
                        showClose:true
                    });
                    this.getAdminList();
                }else{
                    this.$message({
                        type:'error',
                        message:'修改失败',
                        showClose:true
                    }); 
                }
             });
        },
        //删除管理员
        deleteAdmin(id){
            this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {data : result} = await this.$http.post('/deleteAdmin',{
                    id
                });
                if(result.meta.status === 200){
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                        showClose:true
                    });
                    this.getAdminList(); 
                }                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
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
    .item {
        margin-bottom: 18px;
    }
    .item span{
        width: 20%;
        display: inline-block;
        // text-align: center;
        // margin-left: 30px;
    }
    .item span:last-child{
        width: 30%;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        width: 680px;
        margin: 15px;
    }
    .button{
        margin: 15px;
    }
</style>