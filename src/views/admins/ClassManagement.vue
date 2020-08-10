<template>
    <div class="classManagement">
         <header>
            <div class="header_container">
                <a href="/login"><img src="../../assets/images/logo.png" alt="logo"></a>
            </div>
            <span class="exit" @click="exit">退出</span>
        </header>
        <div class="content">
            <el-card>
                <el-table
                    :data="classList"
                    border
                    stripe
                    >
                    <el-table-column type="index"></el-table-column>
                    <el-table-column
                        prop="Class_grade"
                        label="年级"
                        width="180px"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="Class_major"
                        label="专业"
                        width="180px"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="380px"
                        >
                        <template slot-scope="scope" >
                            <el-tooltip effect="dark" content="查看班级学生" placement="top" :enterable="false">
                                <el-button type="success" icon="el-icon-view" :enterable="false" @click="viewStudentInfo(scope.row.Class_grade,scope.row.Class_major)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="添加删除班级学生" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-plus" :enterable="false" @click="addOrDeleteStudent(scope.row.Class_grade,scope.row.Class_major)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="修改班级信息" placement="top" :enterable="false">
                                <el-button type="primary" icon="el-icon-edit" :enterable="false" @click="getClassInfo(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除班级" placement="top">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteClass(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <div class="button">
                <el-button type="primary" @click="create">创建班级</el-button>
                <el-button type="success" @click="back">返回主页面</el-button>
            </div>
        </div>
        <el-dialog title="添加班级" :visible.sync="addClassFormVisible">
            <el-form :model="classInfo" ref="addClassRef" :rules="classRules">
                    <el-form-item label="年级">
                        <el-select v-model="classInfo.grade" placeholder="请选择">
                            <el-option
                                v-for="item in gradeList"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业" prop="major">
                        <el-input  v-model="classInfo.major"></el-input>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="createClasses">确 定</el-button>
            </div>
        </el-dialog>
         <el-dialog title="修改班级信息" :visible.sync="editClassFormVisible">
            <el-form :model="editClassInfo" ref="editClassRef" :rules="classRules">
                    <el-form-item label="年级">
                        <el-select v-model="editClassInfo.grade" placeholder="请选择">
                            <el-option
                                v-for="item in gradeList"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业" prop="major">
                        <el-input  v-model="editClassInfo.major"></el-input>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveClasses">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created() {
        this.getClassList();
        this.getGradeInfo();
    },
    data() {
        return {
            //班级列表
            classList:[],
            //添加班级对话框是否显示
            addClassFormVisible:false,
            //班级信息
            classInfo:{
                grade:'',
                major:''
            },
            //年级列表
            gradeList:[],
            //验证规则对象
            classRules:{
               major:[
                    {
                        required:true,message:'请输入专业',trigger:'blur'
                    }
                ]
            },
            //编辑班级信息
            editClassInfo:{
                id:0,
                grade:'',
                major:''
            },
            oldEditClassInfo:{
                oldGrade:'',
                oldMajor:''
            },
            //编辑班级对话框是否显示
            editClassFormVisible:false
        }
    },
    methods: {
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        //获取班级列表
        async getClassList(){
            let {data : result} = await this.$http.get('/getClassList');
            if(result.meta.status === 200){
                this.classList = result.data;
            }
        },
        //返回主页面
        back(){
            this.$router.push('/adminHome');
        },
        //弹出创建班级对话框
        create(){
            this.addClassFormVisible = true;
        },
        //创建班级
        createClasses(){
            this.$refs.addClassRef.validate(async valid => {
                if(!valid) return;
                let {data : result} = await this.$http.post('/addClasses',this.classInfo);
                if(result.meta.status === 200){
                    this.classInfo.grade = this.gradeList[0];
                    this.classInfo.major = '';
                    this.addClassFormVisible = false;
                    this.$message({
                        type:'success',
                        message:'创建班级成功',
                        showClose:true
                    });
                    this.getClassList();
                }else{
                    this.$message({
                        type:'error',
                        message:'创建失败，班级已存在',
                        showClose:true
                    }); 
                }
            });
        },
        //获取最新年级信息
        getGradeInfo(){
            let year = new Date().getFullYear();
            this.classInfo.grade = year;
            for(let i = 0;i<=4;i++){
                this.gradeList.push(year-i);
            }
        },
        //取消添加
        cancel(){
            this.classInfo.grade = this.gradeList[0];
            this.classInfo.major = '';
            this.$refs.addClassRef.clearValidate();
            this.addClassFormVisible = false;
        },
        //取消编辑
        cancelEdit(){
            this.editClassFormVisible = false;
        },
        //查看当前班级学生
        viewStudentInfo(grade,major){
            this.$router.push({
                path:'/viewClassStudentList',
                query:{
                    grade,
                    major
                }
            });
        },
        //添加或者删除班级学生
        addOrDeleteStudent(grade,major){
            this.$router.push({
                path:'addOrDeleteClassStudent',
                query:{
                    grade,
                    major
                }
            });
        },
        //修改班级信息
        getClassInfo(classObj){
            // console.log(classObj);
            this.editClassInfo.id = classObj.Class_id;
            this.editClassInfo.grade = classObj.Class_grade;
            this.editClassInfo.major = classObj.Class_major;
            this.oldEditClassInfo.oldGrade = classObj.Class_grade;
            this.oldEditClassInfo.oldMajor = classObj.Class_major;
            // this.oldEditClassInfo = classObj;
            this.editClassFormVisible = true;
        },
        //保存当前班级信息
        saveClasses(){
            this.$refs.editClassRef.validate(async valid => {
                if(!valid) return;
                if(this.editClassInfo.grade === this.oldEditClassInfo.oldGrade && this.editClassInfo.major === this.oldEditClassInfo.oldMajor){
                    this.editClassFormVisible = false;
                    this.$message({
                        type:'success',
                        message:'修改成功',
                        showClose:true
                    });
                }else{
                    let {data : result} = await this.$http.post('/saveClassInfo',{
                        ...this.editClassInfo,
                        ...this.oldEditClassInfo
                    });
                    if(result.meta.status === 200){
                        this.editClassFormVisible = false;
                        this.$message({
                            type:'success',
                            message:'修改成功',
                            showClose:true
                        });
                        this.getClassList();
                    }else{
                        this.$message({
                            type:'error',
                            message:'修改失败',
                            showClose:true
                        });
                    }
                }
                
            });
        },
        //删除班级
        deleteClass(classObj){
            this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {data : result3} = await this.$http.post('/getClassCourseList',{
                        id:classObj.Class_id
                });
                if(result3.meta.status === 200){
                    let courseArr = result3.data;
                    courseArr.forEach(async courseObj => {
                        let {data : result4} = await this.$http.post('/deleteCourseInfo',{
                            id:courseObj.Course_id
                        });
                    });
                }
                let {data : result} = await this.$http.post('/deleteClass',{
                    id:classObj.Class_id
                });
                if(result.meta.status === 200){
                    this.$confirm('班级删除成功, 是否继续删除该班级下的所有学生?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        let {data : result1} = await this.$http.post('/getAllStudentList',{
                            grade:classObj.Class_grade,
                            major:classObj.Class_major
                        });
                        if(result1.meta.status === 200){
                            let studentArr = result1.data.classStudentArr;
                            studentArr.forEach(async v => {
                                let {data : result2} = await this.$http.post('/deleteStudent',{
                                    id:v.Student_id
                                });
                            });
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            }); 
                            this.getClassList();
                        }       
                    }).catch(async () => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                        let {data : result} = await this.$http.post('/updateClassAllStudentStatus',{
                            grade:classObj.Class_grade,
                            major:classObj.Class_major
                        });
                        this.getClassList();
                    });
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
    .el-card{
        width: 870px;
        margin: 15px;
        padding: 15px;
    }
    .button{
        margin: 15px;
    }
</style>