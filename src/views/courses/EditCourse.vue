<template>
    <div class="editCourse">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link to="/publishedCourses">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            <el-breadcrumb-item>已发布课程</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 警告信息 -->
            <el-alert
                title="添加课程信息"
                type="info"
                center
                show-icon
                :closable="false">
            </el-alert>
            <!-- 添加课程步骤 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="必要信息"></el-step>
                <el-step title="基本信息"></el-step>
                <el-step title="课程简介"></el-step>
                <el-step title="实验目的与要求"></el-step>
                <el-step title="考核方法"></el-step>
            </el-steps>
            <!-- tab栏 -->
            <el-form ref="addCoursesFormRef" 
                    :model="courseInfoModel"
                    :rules="courseInfoRules"
                    label-position="top"
                    label-width="80px">
                <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeLeave">
                    <el-tab-pane label="必要信息" name="0">
                        <el-form-item label="课程名称" prop="courseName">
                            <el-input v-model="courseInfoModel.courseName"></el-input>
                        </el-form-item>
                        <el-form-item label="面向年级">
                            <el-select v-model="courseInfoModel.courseGrade" placeholder="请选择年级">
                                <el-option v-for="grade in gradeList" 
                                    :key="grade" :label="grade" :value="grade"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="面向专业">
                            <el-select v-model="courseInfoModel.courseMajor" placeholder="请选择专业">
                                <el-option v-for="major in majorList" 
                                    :key="major" :label="major" :value="major"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="基本信息" name="1">
                        <el-form-item label="课程类别">
                            <el-input v-model="courseInfoModel.courseClasses"></el-input>
                        </el-form-item>
                        <el-form-item label="课程要求">
                            <el-input v-model="courseInfoModel.courseRequire"></el-input>
                        </el-form-item>
                        <el-form-item label="适用专业">
                            <el-input v-model="courseInfoModel.courseSuitableMajor"></el-input>
                        </el-form-item>
                        <el-form-item label="总学时">
                            <el-input type="number" v-model="courseInfoModel.courseTotalTime"></el-input>
                        </el-form-item>
                        <el-form-item label="总学分">
                            <el-input type="number" v-model="courseInfoModel.courseTotalScore"></el-input>
                        </el-form-item>
                        <el-form-item label="实验室名称">
                            <el-input  v-model="courseInfoModel.courseLaboratoryName"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="课程简介" name="2">
                        <el-form-item label="课程简介">
                            <el-input rows="10" type="textarea" v-model="courseInfoModel.courseIntro"></el-input>
                            <!-- <quill-editor v-model="courseInfoModel.courseIntro"></quill-editor> -->
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="实验目的与要求" name="3">
                        <el-form-item label="课程要求与目的">
                            <el-input rows="10" type="textarea" v-model="courseInfoModel.courseGoal"></el-input>
                            <!-- <quill-editor v-model="courseInfoModel.courseGoal"></quill-editor> -->
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="考核方法" name="4">
                        <el-form-item label="考核方法">
                            <!-- <el-input rows="10" type="textarea" v-model="courseInfoModel.courseMethods"></el-input> -->
                            <!-- 富文本编辑器 -->
                            <quill-editor v-model="courseInfoModel.courseMethods"></quill-editor>
                            <el-button type="primary" @click="saveCourseEdit">保存</el-button>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getCourseId();
        this.getCurrentGrade();
    },
    data() {
        return {
            //当前课程Id
            id:'',
            oldCourseName:'',
            //当前激活的步骤索引
            activeIndex:'0',
            courseInfoModel:{
                courseName:'',
                courseGrade:'',
                courseMajor:'',
                courseClasses:'',
                courseRequire:'',
                courseSuitableMajor:'数字媒体技术、计算机科学与技术',
                courseTotalTime:0,
                courseTotalScore:0,
                courseIntro:'',
                courseLaboratoryName:'',
                courseGoal:'',
                courseMethods:''
            },
            //课程信息表单验证规则对象
            courseInfoRules:{
                courseName:[
                    {required:true,message:'请输入课程名称',trigger:'blur'}
                ]
            },
            //年级列表
            gradeList:[],
            //专业列表  
            majorList:['数字媒体技术','计算机科学与技术'],
        }
    },
    methods: {
        beforeLeave(activeName,oldActiveName){
            if(oldActiveName === '0' && this.courseInfoModel.courseName === ''){
                this.$message({
                    type:'error',
                    message:'请完善必要信息',
                    showClose:true
                });
                return false;
            }
        },
        getCourseId(){
            this.id = this.$router.history.current.query.id;
            this.getCourseInfo();
        },
        async getCourseInfo(){
            let {data : result} = await this.$http.post('/getCourseInfo',{
                id:this.id
            });
            if(result.meta.status === 200){
                this.courseInfoModel.courseName = result.data[0].Course_name;
                this.courseInfoModel.courseGrade = result.data[0].Course_grade;
                this.courseInfoModel.courseMajor = result.data[0].Course_major;
            }
            let {data : result1} = await this.$http.post('/mongo/getCourseInfo',{
                courseName:this.courseInfoModel.courseName
            });
            if(result.meta.status === 200){
                this.courseInfoModel.courseClasses = result1.data.courseClasses;
                this.courseInfoModel.courseRequire = result1.data.courseRequire;
                this.courseInfoModel.courseSuitableMajor = result1.data.courseSuitableMajor;
                this.courseInfoModel.courseTotalTime = result1.data.courseTotalTime;
                this.courseInfoModel.courseTotalScore = result1.data.courseTotalScore;
                this.courseInfoModel.courseIntro = result1.data.courseIntro;
                this.courseInfoModel.courseLaboratoryName = result1.data.courseLaboratoryName;
                this.courseInfoModel.courseGoal = result1.data.courseGoal;
                this.courseInfoModel.courseMethods = result1.data.courseMethods;
                this.oldCourseName = result1.data.courseName;
            }
        },
        //保存课程信息修改
        async saveCourseEdit(){
            let {data : result} = await this.$http.post('/saveCourseEdit',{
                id:this.id,
                courseName:this.courseInfoModel.courseName,
                courseGrade:this.courseInfoModel.courseGrade,
                courseMajor:this.courseInfoModel.courseMajor
            });
            let {data : result1} = await this.$http.post('/mongo/saveCourseEdit',{
                oldCourseName:this.oldCourseName,
                ...this.courseInfoModel
            });
            // console.log(result1);
            if(result.meta.status === 200 && result1.meta.status === 200){
                this.$message({
                    type:'success',
                    message:'修改成功',
                    showClose:true
                });
                this.$router.push('/publishedCourses');
            }
        },
        getCurrentGrade(){
            let year = new Date().getFullYear();
            for(let i=0; i<=4; i++){
                this.gradeList.push(year - i);
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .el-steps{
        margin: 15px 0;
    }
    .quill-editor{
        margin-bottom: 15px;
    }
</style>