<template>
    <div class="studentManagement">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../../assets/images/logo.png" alt="logo"></a>
            </div>
            <span class="exit" @click="exit">退出</span>
        </header>
        <div class="content">
            <el-card>
                <el-row>
                    <el-col :span='8'>
                        <div>
                            <el-input placeholder="请输入名称" v-model="queryInfo.query">
                                <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
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
                        label="专业">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="280px"
                        >
                        <template slot-scope="scope" >
                            <el-tooltip effect="dark" content="查看学生" placement="top" :enterable="false">
                                <el-button type="success" icon="el-icon-view" :enterable="false" @click="viewStudentInfo(scope.row.Student_id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="修改信息" placement="top" :enterable="false">
                                <el-button type="primary" icon="el-icon-edit" :enterable="false" @click="editStudentInfo(scope.row.Student_id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteStudent(scope.row.Student_id)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页功能 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.currentPage"
                    :page-sizes="[6, 8, 10, 12]"
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </el-card>
            <div class="button">
                <el-button type="primary" @click="createStudents">创建学生</el-button>
                <el-button type="success" @click="back">返回主页面</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    created(){
        this.getStudentList();
    },
    data() {
        return {
            //学生信息列表
            studentList:[],
            //查询信息
            queryInfo:{
                pageSize:6,
                currentPage:1,
                query:''
            },
            total:0,
        }
    }, 
    methods: {
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        //获取学生信息列表
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
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getStudentList();
        },
        //创建学生
        createStudents(){
            this.$router.push('/createStudents');
        },
        //返回主页面
        back(){
            this.$router.push('/adminHome');
        },
        //查看学生信息
        viewStudentInfo(id){
            this.$router.push({
                path:'/viewStudentInfo',
                query:{
                    id
                }
            });
        },
        //编辑学生信息
        editStudentInfo(id){
            this.$router.push({
                path:'/editStudentInfo',
                query:{
                    id
                }
            });
        },
        deleteStudent(id){
            this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {data : result} = await this.$http.post('/deleteStudent',{
                    id
                });
                if(result.meta.status === 200){
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                        showClose:true
                    });
                    this.getStudentList(); 
                }                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    },
}
</script>


<style lang="less" scoped>
    .header_container {
        width: 50%;
        transform: translate(-45%, 0);
    }
    .exit{
        color: #fff;
        // line-height: 70px;
        position: absolute;
        right: 100px;
        letter-spacing: 15px;
        cursor: pointer;
    }
    .exit:hover{
        color: red;
    }
    .content{
        width: 100%;
        // height: calc(100vh - 120px);
        // background:#2b4b6b;
        min-width: 1200px;
        padding: 15px;
        background: #EAEDF1;
        overflow: auto;
        min-height: calc(100vh - 70px);
    }
    .button button{
        margin: 15px;
    }   
</style>