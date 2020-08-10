<template>
    <div class="myNoFinishWorks">
         <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>我的作业</el-breadcrumb-item>
            <el-breadcrumb-item>未完成作业</el-breadcrumb-item>
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
                :data="notFinishWorksList"
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
                    label="操作"
                    align="center"
                    width="120px"
                >
                   <template slot-scope="scope" >
                        <el-tooltip effect="dark" content="提交" placement="top" :enterable="false">
                           <el-button type="primary" icon="el-icon-edit" :enterable="false" @click="submitWorks(scope.row.Work_id)"></el-button>
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
            //未完成课程作业列表
            notFinishWorksList:[],
            //当前课程作业总条数
            total:0
        }
    },
    methods: {
        //获取课程名称
        async getCourseList(){
            let {data : result} = await this.$http.get('/getGradeAndMajor');
            if(result.meta.status === 200){
                let grade = result.data.Student_grade;
                let major = result.data.Student_major;
                let {data : notEndCourseList} = await this.$http.post('/getNotEndCourseList',{
                    grade,
                    major
                });
                if(notEndCourseList.meta.status === 200){
                    this.courseList = notEndCourseList.data;
                    let courseName = this.$router.history.current.query.courseName;
                    if(!courseName){
                        this.queryInfo.courseName = notEndCourseList.data[0].Course_name
                    }else{
                        this.queryInfo.courseName = courseName;
                    }
                    this.getNotFinishWorksList();
                }
            }
        },
        //获取未完成作业列表
        async getNotFinishWorksList(){
            let {data : notFinishWorksList} = await this.$http.post('/getnotFinishWorksList',this.queryInfo);
            if(notFinishWorksList.meta.status === 200){
                this.total = notFinishWorksList.total;
                this.notFinishWorksList = notFinishWorksList.data;
                this.getStatus();
            }
            // console.log(notFinishWorksList);
        },
        updateWorksList(){
            this.getNotFinishWorksList();
        },
         //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getNotFinishWorksList();
            // console.log(newSize);
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            // console.log(newPage);
            this.queryInfo.currentPage = newPage;
            this.getNotFinishWorksList();
        },
        getStatus(){
            this.notFinishWorksList.forEach((work) => {
                work.Work_status = '未提交';
            });
        },
        //提交作业
        submitWorks(id){
            this.$router.push({
                path:'myWorksInfo',
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