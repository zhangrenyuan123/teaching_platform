<template>
    <div class="correctingJobList">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="backUrl">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>作业管理</el-breadcrumb-item>
            <el-breadcrumb-item>作业批改</el-breadcrumb-item>
            <el-breadcrumb-item>批改</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 下拉课程列表 -->
            <el-row>
                <el-col :span='8'>
                    <div>
                        <el-select v-model="queryInfo.workStatus" @change='updateWorksList'>
                            <el-option
                                label="已提交"
                                value="1"
                            >
                            </el-option>
                            <el-option
                                label="未提交"
                                value="0"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>

            <!-- 当前课程作业列表 -->
            <el-table
                :data="StudentWorksList"
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
                    prop="Student_status"
                    label="提交状态"
                    >
                </el-table-column>
                <el-table-column
                    prop="Teacher_status"
                    label="批改状态"
                    >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="120px"
                >
                   <template slot-scope="scope" >
                        <el-tooltip effect="dark" content="审批" placement="top" :enterable="false">
                            <!-- :disabled="Student_status === 1 ? true : false" -->
                                <el-button type="warning" icon="el-icon-edit-outline" :disabled="scope.row.Student_status === '已提交' ? false : true"  :enterable="false" @click="correctingJob(scope.row.Work_id,scope.row.Student_id)"></el-button>
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
        this.getWorkId();
    },
    data() {
        return {
            //返回URL
            backUrl:'',
            //查询信息
            queryInfo:{
                workStatus:'',
                currentPage:1,
                pageSize:6,
                //作业id
                work_id:'',
            },
            //学生作业列表
            StudentWorksList:[],
            //总条数
            total:0,
        }
    },
    methods: {
        getWorkId(){
            this.queryInfo.work_id = this.$router.history.current.query.id;
            // this.quertInfo.work_id = this.$router.history.current.query.id;
            let courseName = this.$router.history.current.query.courseName;
            if(courseName){
                this.backUrl = `/correctingJob?courseName=${courseName}`;
            }else{
                this.backUrl = `/correctingJob`;
            }
            this.getStudentWorksList();
        },
        async getStudentWorksList(){
            let { data : result} = await this.$http.post('/getStudentWorksList',this.queryInfo);
            if(result.meta.status === 200){
                this.total = result.total;
                this.StudentWorksList = result.data;
                this.getStatus();
            }
        },
        //下拉菜单内容发生改变时，重新获取课程作业列表
        updateWorksList(){
            this.getStudentWorksList();
        },
        //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getStudentWorksList();
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getStudentWorksList();
        },
        //获取学生提交和教师批改状态
        getStatus(){
            this.StudentWorksList.forEach(work => {
                if(work.Student_status === 0){
                    work.Student_status = '未提交';
                }else{
                    work.Student_status = '已提交';
                }
                if(work.Teacher_status === 0){
                    work.Teacher_status = '未审批';
                }else{
                    work.Teacher_status = '已审批';
                }
            });
        },
        correctingJob(workId,studentId){
           this.$router.push({
                path:'CorrectingJobInfo',
                query:{
                    workId,
                    studentId
                }
            });
        }
    },
}
</script>

<style lang="less" scoped>
    
</style>