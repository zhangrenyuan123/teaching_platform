<template>
    <div class="usualScoreList">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="backUrl">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
            <el-breadcrumb-item>成绩发布</el-breadcrumb-item>
            <el-breadcrumb-item>平时成绩</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-table
                :data="usualScoreList"
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
                    label="操作"
                    align="center"
                    width="120px"
                >
                   <template slot-scope="scope" >
                        <el-tooltip effect="dark" content="上成绩" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-edit-outline"  :enterable="false" @click="editUsualScore(scope.row.Score_id,scope.row.Student_id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
             <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.currentPage"
                :page-sizes="[6, 8, 10,12]"
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
        this.getQueryInfo();
    },
    data() {
        return {
            queryInfo:{
                currentPage:1,
                pageSize:6,
                courseName:'',
            },
            backUrl:'',
            usualScoreList:[],
            total:0,
        }
    },
    methods: {
        getQueryInfo(){
            this.queryInfo.courseName = this.$router.history.current.query.courseName;
            this.backUrl = `/scorePublish?courseName=${this.queryInfo.courseName}`;
            this.getUsualScoreList();
        },
        //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getUsualScoreList();
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getUsualScoreList();
        },
        async getUsualScoreList(){
            let {data : result} = await this.$http.post('/getUsualScoreList',this.queryInfo);
            if(result.meta.status === 200){
                this.usualScoreList = result.data;
                this.total = result.total;
            }
        },
        editUsualScore(scoreId,studentId){
            this.$router.push({
                path:'editUsualScore',
                query:{
                    scoreId,
                    studentId,
                    courseName:this.queryInfo.courseName
                }
            });
        }
    },
}
</script>

<style lang="less" scoped>
    
</style>