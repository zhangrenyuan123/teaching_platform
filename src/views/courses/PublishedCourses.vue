<template>
    <div class="publishedCourses">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            <el-breadcrumb-item>已发布课程</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 课程搜索框 -->
            <el-row>
                <el-col :span='8'>
                    <div>
                        <el-input placeholder="请输入课程名" v-model="queryInfo.query">
                            <el-button slot="append" icon="el-icon-search" @click="getCoursesList"></el-button>
                        </el-input>
                    </div>
                </el-col>
            </el-row>
            <!-- 课程列表 -->
            <el-table
                :data="courseList"
                style="width: 100%"
                border
                stripe
                >
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    prop="Course_name"
                    label="课程名"
                >
                </el-table-column>
                <el-table-column
                    prop="Course_grade"
                    label="班级"
                >
                </el-table-column>
                <el-table-column
                    prop="Course_major"
                    label="专业"
                >
                </el-table-column>
                <el-table-column
                    prop="Course_startTime"
                    label="发布时间">
                </el-table-column>
                <el-table-column
                    prop="Course_status"
                    label="课程状态"
                >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="240px"
                >
                    <template slot-scope="scope" >
                            <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
                                <el-button type="success" icon="el-icon-view" :enterable="false" @click="viewCoursesInfo(scope.row.Course_id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                                <el-button type="primary" icon="el-icon-edit" :enterable="false" @click="editCourses(scope.row.Course_id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteCourses(scope.row.Course_id,scope.row.Course_name)"></el-button>
                            </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.currentPage"
                :page-sizes="[3, 6, 8, 10]"
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
        this.getCoursesList();
    },
    data() {
        return {
            //课程列表
            courseList:[],
            //课程查询信息
            queryInfo:{
                query:'',
                pageSize:3,
                currentPage:1,
            },
            //课程总数
            total:0,
        }
    },
    methods: {
        //获取课程列表
        async getCoursesList(){
            let {data : result} = await this.$http.post('/getCourseList',this.queryInfo);
            if(result.meta.status === 200){
                this.courseList = result.data;
                this.total = result.total;
                this.getCourseStatus();
            }
        },
        //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getCoursesList();
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getCoursesList();
        },
        //获取课程状态
        getCourseStatus(){
            for(let i = 0;i<this.courseList.length;i++){
                if(this.courseList[i].Course_status === 0){
                    this.courseList[i].Course_status = '正在进行';
                }else{
                    this.courseList[i].Course_status = '已结束';
                }
            }
        },
        //修改课程信息
        editCourses(id){
            this.$router.push({
                path:'editCourse',
                query:{
                    id
                }
            });
        },
        //删除课程
        deleteCourses(id,courseName){
            this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {data : result} = await this.$http.post('/deleteCourseInfo',{
                    id
                });
                if(result.meta.status === 200){
                    let {data : result1} = await this.$http.post('/mongo/deleteCourseInfo',{
                        courseName
                    });
                    if(result1.meta.status === 200){
                        this.$message({
                            type:'success',
                            message:'删除成功',
                            showClose:true
                        });
                        this.getCoursesList();
                    }
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //查看课程详情
        viewCoursesInfo(id){
            this.$router.push({
                path:'courseInfo',
                query:{
                    id
                }
            });
        }
    },
}
</script>

<style lang="less" scoped>
    
</style>