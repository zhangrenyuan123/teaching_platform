<template>
    <div class="myFinishedWorks">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>我的作业</el-breadcrumb-item>
            <el-breadcrumb-item>已完成作业</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 下拉课程列表 -->
            <el-row>
                <el-col :span='8'>
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
            </el-row>
            <!-- 当前未完成课程作业列表 -->
            <el-table
                :data="finishedWorksList"
                style="width: 100%"
                border
                stripe
                >
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    prop="Work_name"
                    label="名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="Work_startTime"
                    label="开始时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="Work_endTime"
                    label="截止时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="Work_status"
                    label="状态"
                    >
                </el-table-column>
                <el-table-column
                    prop="Student_score"
                    label="成绩"
                    >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="120px"
                >
                   <template slot-scope="scope" >
                        <el-tooltip effect="dark" content="查看" placement="top" :enterable="false">
                           <el-button type="success" icon="el-icon-view" :enterable="false" @click="viewWorks(scope.row.Work_id)"></el-button>
                        </el-tooltip>
                    </template>
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
                currentPage:1,
            },
            courseList:[],
            total:0,
            finishedWorksList:[]
        }
    },
    methods: {
        //获取课程名称
        async getCourseList(){
            let {data : result} = await this.$http.get('/getGradeAndMajor');
            if(result.meta.status === 200){
                let grade = result.data.Student_grade;
                let major = result.data.Student_major;
                let {data : allCourseList} = await this.$http.post('/getAllCoursesList',{
                    grade,
                    major
                });
                if(allCourseList.meta.status === 200){
                    this.courseList = allCourseList.data;
                    let courseName = this.$router.history.current.query.courseName;
                    if(courseName){
                        this.queryInfo.courseName = courseName;
                    }else{
                        this.queryInfo.courseName = allCourseList.data[0].Course_name;
                    }
                    this.getFinishedWorksList();
                }
            }
        },
        async getFinishedWorksList(){
            let {data : finishedWorksList} = await this.$http.post('/getFinishedWorksList',this.queryInfo);
            if(finishedWorksList.meta.status === 200){
                this.total = finishedWorksList.total;
                this.finishedWorksList = finishedWorksList.data;
                this.getStatus();
            }
        },
        getStatus(){
            this.finishedWorksList.forEach((work) => {
                work.Work_status = '已提交';
            });
        },
        updateWorksList(){
            this.getFinishedWorksList();
        },
         //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getFinishedWorksList();
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getFinishedWorksList();
        },
        viewWorks(id){
            this.$router.push({
                path:'/myFinishedWorksInfo',
                query:{
                    id,
                    courseName:this.queryInfo.courseName
                }
            });
        }
    },
}
</script>

<style lang="less" scoped>
    
</style>