<template>
    <div class="courseInfo">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link to="/publishedCourses">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            <el-breadcrumb-item>已发布课程</el-breadcrumb-item>
            <el-breadcrumb-item>查看详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 警告信息 -->
            <el-alert
                title="查看课程信息"
                type="success"
                center
                show-icon
                :closable="false">
            </el-alert>
            <!-- 课程信息 -->
            <el-collapse v-model="activeName">
                <el-collapse-item title="课程大纲" name="1">
                    <div><span>课程名称:</span>{{courseInfo.Course_name}}</div>
                    <div><span>授课年级:</span>{{courseInfo.Course_grade}}</div>
                    <div><span>面向专业:</span>{{courseInfo.Course_major}}</div>
                    <div><span>课程类别:</span>{{courseBaseInfo.courseClasses}}</div>
                    <div><span>课程要求:</span>{{courseBaseInfo.courseRequire}}</div>
                    <div><span>学时学分:</span><span>学时:</span>{{courseBaseInfo.courseTotalTime}}<span class="marginLeft">学分:</span>{{courseBaseInfo.courseTotalScore}}</div>
                    <div><span>适用专业:</span>{{courseBaseInfo.courseSuitableMajor}}</div>
                    <div><span>实验室名称:</span>{{courseBaseInfo.courseLaboratoryName}}</div>
                </el-collapse-item>
                <el-collapse-item title="课程简介" name="2">
                    <div>{{courseBaseInfo.courseIntro}}</div>
                </el-collapse-item>
                <el-collapse-item title="实验目的与要求" name="3">
                    <div>{{courseBaseInfo.courseGoal}}</div>
                </el-collapse-item>
                <el-collapse-item title="考核方法" name="4" >
                    <div id="methods"></div>
                </el-collapse-item>
            </el-collapse>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getQueryValue();
    },
    data() {
        return {
            //当前激活的目标向
            activeName:'1',
            //课程id
            id:'',
            //课程必要信息
            courseInfo:{},
            //课程基本信息
            courseBaseInfo:{
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
            }
        }
    },
    methods: {
        //获取id
        getQueryValue(){
             this.id = this.$router.history.current.query.id;
             this.getCourseInfo();
        },
        async getCourseInfo(){
            let { data : result} = await this.$http.post('/getCourseInfo',{id : this.id});
            if(result.meta.status === 200){
                this.courseInfo = result.data[0];
                let {data : result1} = await this.$http.post('/mongo/getCourseInfo',{
                    courseName:this.courseInfo.Course_name
                });
                if(result1.meta.status === 200){
                    if(!result1.data){
                        return;
                    }
                    this.courseBaseInfo = result1.data;
                    document.getElementById('methods').innerHTML = result1.data.courseMethods;
                }
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .el-collapse{
        margin-top: 30px;
        width: 95%;
    }
    .el-collapse-item span{
        margin-right: 15px;
    }
    .el-collapse-item div{
        margin: 15px 0;
    }
    .marginLeft{
        margin-left: 15px;
    }
</style>