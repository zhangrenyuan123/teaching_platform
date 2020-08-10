<template>
    <div class="editUsualScore">
         <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="backUrl">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
            <el-breadcrumb-item>成绩发布</el-breadcrumb-item>
            <el-breadcrumb-item>平时成绩</el-breadcrumb-item>
            <el-breadcrumb-item>发布成绩</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div class="fontSize-12px"><span>学号: </span>{{studentUsualScoreInfo.Student_num}}</div>
            <div class="fontSize-12px"><span>姓名: </span>{{studentUsualScoreInfo.Student_name}}</div>
            <div class="fontSize-12px"><span>发布时间: </span>{{studentUsualScoreInfo.Publish_time ? studentUsualScoreInfo.Publish_time : '暂未发布'}}</div>
            <div class="fontSize-12px"><span>平时占比: </span>{{studentUsualScoreInfo.Usual_percent}}</div>
            <div class="fontSize-12px"><span>平时成绩: </span>{{studentUsualScoreInfo.Usual_score ? studentUsualScoreInfo.Usual_score : '暂无'}}</div>
            <el-form :model="queryInfo" label-position="left">
                <el-form-item label="平时成绩 :">
                    <el-input type='number' max='100' min='0' v-model="queryInfo.usualScore"></el-input>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getQueryInfo();
    },
    data() {
        return {
           queryInfo:{
                scoreId:'',
                studentId:'',
                usualScore:''
           },
           backUrl:'',
           studentUsualScoreInfo:{},
           courseName:''
        }
    },
    methods: {
        getQueryInfo(){
            this.courseName = this.$router.history.current.query.courseName;
            this.queryInfo.scoreId = this.$router.history.current.query.scoreId;
            this.queryInfo.studentId = this.$router.history.current.query.studentId;
            this.backUrl = `/usualScoreList?courseName=${this.courseName}`;
            this.getStudentUsualScoreInfo();
        },
        async getStudentUsualScoreInfo(){
            let {data : result} = await this.$http.post('/getStudentUsualScoreInfo',this.queryInfo);
            if(result.meta.status === 200){
                this.studentUsualScoreInfo = result.data;
                this.queryInfo.usualScore = result.data.Usual_score;
            }
        },
        //更新平时成绩
        async onSubmit(){
            if(!this.queryInfo.usualScore || this.queryInfo.usualScore > 100 || this.queryInfo.usualScore < 0){
                this.$message({
                    type:'error',
                    message:'请提交正确的平时成绩！'
                });
                return;
            }
            let {data : result} = await this.$http.post('/updateStudentUsualScore',this.queryInfo);
            if(result.meta.status === 200){
                this.$message({
                    type:'success',
                    message:'提交成功'
                });
                this.$router.push({
                    path:'usualScoreList',
                    query:{
                        courseName:this.courseName
                    }
                });
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .el-card div{
        margin: 15px;
    }
    .fontSize-12px{
        font-size: 12px;
    }
    .fontSize-12px span{
        margin-right: 15px;
    }
    .el-form{
        margin-top: 50px;
        width: 150px;
    }
    .el-input{
        margin: 0;
    }
</style>