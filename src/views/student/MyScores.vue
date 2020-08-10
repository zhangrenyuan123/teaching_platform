<template>
    <div class="myScores">
         <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>我的成绩</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
             <!-- 当前课程作业列表 -->
            <el-table
                :data="scoreList"
                style="width: 100%"
                border
                stripe
                >
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    prop="Course_name"
                    label="课程名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="Usual_score"
                    label="平时成绩"
                    >
                </el-table-column>
                <el-table-column
                    prop="Experimental_score"
                    label="实验成绩"
                    >
                </el-table-column>
                <el-table-column
                    prop="Total_score"
                    label="总成绩"
                    >
                </el-table-column>
                <el-table-column
                    prop="Score_status"
                    label="是否挂科"
                    >
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getGradeAndMajor();
    },
    data() {
        return {
            scoreList:[],
            gradeAndMajor:{}
        }
    },
    methods: {
        async getGradeAndMajor(){
            let {data : result} = await this.$http.get('/getGradeAndMajor');
            if(result.meta.status === 200){
                // this.gradeAndMajor = result.data;
                // console.log(this.gradeAndMajor);
                let {data : result1} = await this.$http.post('/getCourseScore',result.data);
                if(result1.meta.status === 200){
                    this.scoreList = result1.data;
                    this.getScoreStatus();
                }
            }
        },
        getScoreStatus(){
            this.scoreList.forEach(score => {
                if(!score.Total_score){
                    return;
                }
                if(score.Total_score < 60){
                    score.Score_status = '是';
                }else{
                    score.Score_status = '';
                }
            });
        }
    },
}
</script>

<style lang="less" scoped>
    
</style>