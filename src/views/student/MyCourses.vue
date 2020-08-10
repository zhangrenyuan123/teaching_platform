<template>
    <div class="myCourses">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>我的课程</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
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
                    prop="Course_author"
                    label="教师"
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
                    width="120px"
                >
                    <template slot-scope="scope" >
                            <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
                                <el-button type="success" icon="el-icon-view" :enterable="false" @click="viewCoursesInfo(scope.row.Course_id)"></el-button>
                            </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能 -->
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
        this.getGradeAndMahor();
    },
    data() {
        return {
            //查询信息
            queryInfo:{
                pageSize:5,
                currentPage:1,
                grade:'',
                major:''
            },
            //课程列表
            courseList:[],
            total:0
        }
    },
    methods: {
        //获取当前学生的年级和专业
        async getGradeAndMahor(){
            let {data : result} = await this.$http.get('/getGradeAndMajor');
            if(result.meta.status === 200){
                this.queryInfo.grade = result.data.Student_grade;
                this.queryInfo.major = result.data.Student_major;
                this.getCourseList();
            }
        },
        //获取学生所拥有的课程
        async getCourseList(){
            let {data : result} = await this.$http.post('/getStudentCourseList',this.queryInfo);
            if(result.meta.status === 200){
                this.courseList = result.data;
                // this.courseList.sort((courseA,courseB) => {
                //     // return new Date(courseA.Course_startTime) -new Date(courseB.Course_startTime);
                //     return courseA.Course_status - courseB.Course_status;
                // })
                this.total = result.total;
                this.getCourseStatus();
            }
        },
        //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getCourseList();
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getCourseList();
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
         //查看课程详情
        viewCoursesInfo(id){
            this.$router.push({
                path:'myCoursesInfo',
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