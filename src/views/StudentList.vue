<template>
    <div class="studentList">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>学生信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 教师列表卡片 -->
        <el-card>
            <el-row>
                <el-col :span='8'>
                    <div>
                        <el-input placeholder="请输入姓名" v-model="queryInfo.query">
                            <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>
                        </el-input>
                    </div>
                </el-col>
            </el-row>
            <!-- 学生列表 -->
            <el-table
                :data="studentList"
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
                    prop="Student_sex"
                    label="性别"
                    >
                </el-table-column>
                <el-table-column
                    prop="Student_grade"
                    label="年级">
                </el-table-column>
                <el-table-column
                    prop="Student_major"
                    label="专业"
                >
                </el-table-column>
                 <el-table-column
                    prop="Student_tel"
                    label="电话"
                >
                </el-table-column>
                <el-table-column
                    prop="Student_email"
                    label="邮箱"
                    width="240"
                >
                </el-table-column>
                <el-table-column
                    prop="Student_qq"
                    label="QQ"
                >
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
    created(){
        this.getStudentList();
    },
    data() {
        return {
            //教师信息列表
            studentList:[],
            //查询信息
            queryInfo:{
                pageSize:5,
                currentPage:1,
                query:''
            },
            //教师信息总条数
            total:0,
        }
    },
    methods: {
        //获取教师信息列表
        async getStudentList(){
            let {data : result} = await this.$http.post('/getStudentList',this.queryInfo);
            if(result.meta.status === 200){
                this.studentList = result.data;
                this.total = result.total;
            }
        },
        //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getStudentList();
            // console.log(newSize);
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            // console.log(newPage);
            this.queryInfo.currentPage = newPage;
            this.getStudentList();
        }
    },
}
</script>

<style lang="less" scoped>
    
</style>