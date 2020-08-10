<template>
    <div class="scoreView">
         <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
            <el-breadcrumb-item>成绩总览</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
             <!-- 下拉课程列表 -->
            <el-row>
                <el-col :span='6'>
                    <div>
                        <el-select v-model="queryInfo.courseName" @change='updateWorksList'>
                            <el-option
                                v-for="item in courseList"
                                :key="item.Course_name"
                                :label="item.Course_name"
                                :value="item.Course_name"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div>
                       <el-button type="success" round @click="courseFinish">结课</el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- 当前课程作业列表 -->
            <el-table
                :data="scoreList"
                style="width: 100%"
                border
                stripe
                >
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    prop="Student_num"
                    label="学号"
                    >
                </el-table-column>
                <el-table-column
                    prop="Student_name"
                    label="姓名"
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
             <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.currentPage"
                :page-sizes="[5, 6, 8, 10]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
         this.getCourseList();
    },
    data() {
        return {
            queryInfo:{
                courseName:'',
                pageSize:5,
                currentPage:1
            },
            //当前课程作业总条数
            total:0,
            //课程列表
            courseList:[],
            scoreList:[]
        }
    },
    methods: {
         //获取课程名称列表
        async getCourseList(){
            let {data : result} = await this.$http.get('/getCourseList');
            this.courseList = result;
            this.queryInfo.courseName = result[0].Course_name;
            this.getScoreList();
        },
         //下拉菜单内容发生改变时，重新获取课程作业列表
        updateWorksList(){
            this.getScoreList();
        },
        //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getScoreList();
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getScoreList();
        },
        
        //获取成绩列表
        async getScoreList(){
            let {data : result} = await this.$http.post('/getUsualScoreList',this.queryInfo);
            if(result.meta.status === 200){
                this.scoreList = result.data;
                this.total = result.total;
                this.getScoreStatus();
            }
        },
        //获取成绩状态
        getScoreStatus(){
            this.scoreList.forEach(score => {
                if(score.Total_score < 60){
                    score.Score_status = '是';
                }else{
                    score.Score_status = '';
                }
            });
        },
        //结课
        async courseFinish(){
            let {data : result} = await this.$http.post('/courseFinish',{
                courseName:this.queryInfo.courseName
            });
            if(result.meta.status === 200){
                this.$message({
                    type:'success',
                    message:'结课成功'
                });
            }else{
                this.$message({
                    type:'error',
                    message:'结课失败'
                });
            }
        },
    },
}
</script>

<style lang="less" scoped>
    
</style>