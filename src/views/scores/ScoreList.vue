<template>
    <div class="scoreList">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
            <el-breadcrumb-item>成绩列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
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
                    prop="Work_endTime"
                    label="截止时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="Work_status"
                    label="批改状态"
                    >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="120px"
                >
                   <template slot-scope="scope" >
                        <el-tooltip effect="dark" content="查看" placement="top" :enterable="false">
                                <el-button type="success" icon="el-icon-view" :enterable="false" @click="viewJob(scope.row.Work_id)"></el-button>
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
            //查询信息
            queryInfo:{
                courseName:'',
                pageSize:5,
                currentPage:1
            },
            //课程列表
            courseList:[],
            //作业列表
            worksList:[],
            //当前课程作业总条数
            total:0,
        }
    },
    methods: {
        //获取课程名称列表
        async getCourseList(){
            let {data : result} = await this.$http.get('/getCourseList');
            this.courseList = result;
            if(this.$router.history.current.query.courseName){
                this.queryInfo.courseName = this.$router.history.current.query.courseName;
            }else{
                this.queryInfo.courseName = result[0].Course_name;
            }
            this.getWorksList();
        },
        //获取当前课程中为批改的作业列表
        async getWorksList(){
            let {data:result} = await this.$http.post('/getCorrectedWorks',this.queryInfo);
            if(result.meta.status === 200){
                this.total = result.total;
                this.worksList = result.data;
                if(this.total === 0){
                    return;
                }
                this.getStatus();
            }
        },
        //批改当前作业
        viewJob(id){
            this.$router.push({
                path:'selfScoreList',
                query:{
                    id,
                    courseName:this.queryInfo.courseName
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
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getWorksList();
        },
        //获取当前作业的状态
         // 0 => 待审批 1=> 已审批 2=> 审批中
        getStatus(){
            this.worksList.forEach((work) => {
                if(work.Work_status === 0){
                    work.Work_status = '待审批';
                }else if(work.Work_status === 1){
                    work.Work_status = '已审批';
                }else{
                    work.Work_status = '审批中';
                }
            });
        },
    },
}
</script>