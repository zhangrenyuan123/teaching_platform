<template>
    <div class="viewClassStudentInfo">
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
                                <el-button slot="append" icon="el-icon-search" @click="getClassStudentList"></el-button>
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-table
                    :data="classStudentList"
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
            <el-button class="button" type="success" @click="back">返回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    created(){
        // this.getClassStudentList();
        this.getGradeAndMajor();
    },
    data() {
        return {
            //班级学生信息列表
            classStudentList:[],
            //查询信息
            queryInfo:{
                pageSize:6,
                currentPage:1,
                query:'',
                grade:'',
                major:''
            },
            total:0,
        }
    }, 
    methods: {
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        //获取年级和专业
        getGradeAndMajor(){
            this.queryInfo.grade = this.$router.history.current.query.grade;
            this.queryInfo.major = this.$router.history.current.query.major;
            this.getClassStudentList()
        },
        //获取班级学生信息列表
        async getClassStudentList(){
            let {data : result} = await this.$http.post('/getClassStudentList',this.queryInfo);
            if(result.meta.status === 200){
                this.classStudentList = result.data;
                this.total = result.total;
            }
        },
        //当前分页条数改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getClassStudentList();
        },
        //当前页码发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.currentPage = newPage;
            this.getClassStudentList();
        },
        //返回
        back(){
            this.$router.push('/classManagement');
        }
    }
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
    .button{
        margin: 15px;
    }   
</style>