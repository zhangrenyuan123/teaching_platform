<template>
    <div class="publishedJob">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>作业管理</el-breadcrumb-item>
            <el-breadcrumb-item>已发布作业</el-breadcrumb-item>
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
            <!-- 当前课程作业列表 -->
            <el-table
                :data="worksList"
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
                    label="截止状态"
                    >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="240px"
                >
                   <template slot-scope="scope" >
                        <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
                                <el-button type="success" icon="el-icon-view" :enterable="false" @click="viewJobsInfo(scope.row.Work_id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                           <el-button type="primary" icon="el-icon-edit" :enterable="false" @click="editWorks(scope.row.Work_id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top">
                           <el-button type="danger" icon="el-icon-delete" @click="deleteWorks(scope.row.Work_id)"></el-button>
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
    created(){
        this.getCourseList();
    },
    data() {
        return {
            //课程列表
            courseList: [],
            //课程名称
            // courseName: '',
            //作业列表
            worksList:[],
            //查询信息
            queryInfo:{
                pageSize:5,
                currentPage:1,
                courseName:''
            },
            //当前课程作业总条数
            total:0
        }
    },
    methods: {
        //获取课程名称
        async getCourseList(){
            let {data : result} = await this.$http.get('/getCourseList');
            this.courseList = result;
            let courseName = this.$router.history.current.query.courseName;
            if(!courseName){
                this.queryInfo.courseName = result[0].Course_name;
            }else{
                this.queryInfo.courseName = courseName;
            }
            this.getWorksList();
        },
        //获取当前课程作业列表
        async getWorksList(){
            let {data : result} = await this.$http.post('/getWorksList',this.queryInfo);
            // console.log(result);
            if(result.meta.status === 200){
                this.worksList = result.data;
                this.total = result.total;
                this.getStatus();
            }
        },
        //获取当前作业的状态
        getStatus(){
            this.worksList.forEach((work) => {
                let currentTime = new Date();
                let endTime = new Date(work.Work_endTime);
                if(currentTime > endTime){
                    work.Work_status = '已截止';
                }else{
                    work.Work_status = '未截止';
                }
            });
        },
        //下拉菜单内容发生改变时，重新获取课程作业列表
        updateWorksList(){
            this.getWorksList();
        },
        //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getWorksList();
            // console.log(newSize);
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            // console.log(newPage);
            this.queryInfo.currentPage = newPage;
            this.getWorksList();
        },
        //作业编辑
        editWorks(id){
            this.$router.push({
                path:'editJob',
                query:{
                    id,
                    courseName:this.queryInfo.courseName
                }
            });
        },
        //删除作业
        deleteWorks(id){
            this.$confirm('此操作将永久删除该作业, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {data : result} = await this.$http.post('/deleteWorks',{
                    id
                });
                if(result.meta.status === 200){
                    this.$message({
                        type:'success',
                        message:'删除成功',
                        showClose:true
                    });
                    this.getWorksList();
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //查看作业详情
        viewJobsInfo(id){
            this.$router.push({
                path:'jobInfo',
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
    .el-select{
        width: 100%;
    }
</style>