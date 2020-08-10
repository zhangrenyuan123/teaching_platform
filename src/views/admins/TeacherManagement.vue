<template>
    <div class="teacherManagement">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../../assets/images/logo.png" alt="logo"></a>
            </div>
            <span class="exit" @click="exit">退出</span>
        </header>
        <div class="content">
            <!-- 教师列表卡片 -->
            <el-card>
                <el-row>
                    <el-col :span='8'>
                        <div>
                            <el-input placeholder="请输入名称" v-model="queryInfo.query">
                                <el-button slot="append" icon="el-icon-search" @click="getTeacherList"></el-button>
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
                <!-- 教师列表 -->
                <el-table
                    :data="teacherList"
                    style="width: 100%"
                    border
                    stripe
                    >
                    <el-table-column type="index"></el-table-column>
                    <el-table-column
                        prop="Teacher_num"
                        label="教师号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="Teacher_name"
                        label="姓名"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="Teacher_sex"
                        label="性别"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="Teacher_level"
                        label="职位">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        >
                        <template slot-scope="scope" >
                            <el-tooltip effect="dark" content="查看教师" placement="top" :enterable="false">
                                <el-button type="success" icon="el-icon-view" :enterable="false" @click="viewTeacherInfo(scope.row.Teacher_id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="修改信息" placement="top" :enterable="false">
                                <el-button type="primary" icon="el-icon-edit" :enterable="false" @click="editTeacherInfo(scope.row.Teacher_id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteTeacher(scope.row.Teacher_id)"></el-button>
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
                <el-button type="primary" @click="createTeachers">创建教师</el-button>
                <el-button type="success" @click="back">返回主页面</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    created(){
        this.getTeacherList();
    },
    data() {
        return {
            //教师信息列表
            teacherList:[],
            //查询信息
            queryInfo:{
                pageSize:6,
                currentPage:1,
                query:''
            },
            //教师信息总条数
            total:0,
        }
    },
    methods: {
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        //获取教师信息列表
        async getTeacherList(){
            let {data : result} = await this.$http.post('/getTeacherList',this.queryInfo);
            if(result.meta.status === 200){
                // console.log(result);
                this.teacherList = result.data;
                this.total = result.total;
            }
        },
        //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getTeacherList();
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getTeacherList();
        },
        //跳转到教师创建页面
        createTeachers(){
            this.$router.push('/createTeachers');
        },
        //返回主页面
        back(){
            this.$router.push('/adminHome');
        },
        //查看教师信息
        viewTeacherInfo(id){
            this.$router.push({
                path:'/viewTeacherInfo',
                query:{
                    id
                }
            });
        },
        //编辑教师信息
        editTeacherInfo(id){
            this.$router.push({
                path:'/editTeacherInfo',
                query:{
                    id
                }
            });
        },
        deleteTeacher(id){
            this.$confirm('此操作将永久删除该教师, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {data : result} = await this.$http.post('/getCourseId',{
                    id
                });
                if(result.meta.status === 200){
                    if(result.data.length !== 0){
                        result.data.forEach(async (v) => {
                            let {data : result1} = await this.$http.post('/deleteCourseInfo',{
                                id:v.Course_id
                            });
                        });
                    }
                    let {data : result2} = await this.$http.post('/deleteTeacher',{
                        id
                    });
                    if(result2.meta.status === 200){
                        this.$message({
                            type:'success',
                            message:'删除成功',
                            showClose:true
                        });
                        this.getTeacherList();
                    }
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
        min-height: calc(100vh - 70px);
        min-width: 1200px;
        padding: 15px;
        background: #EAEDF1;
        overflow: auto;
    }
    .button button{
        margin: 15px;
    }
</style>