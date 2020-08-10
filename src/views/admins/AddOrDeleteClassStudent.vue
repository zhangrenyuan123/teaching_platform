<template>
    <div class="addOrDeleteClassStudent">
        <header>
            <div class="header_container">
                <a href="/login"><img src="../../assets/images/logo.png" alt="logo"></a>
            </div>
            <span class="exit" @click="exit">退出</span>
        </header>
        <div class="content">
            <el-transfer 
                v-model="classStudentList" 
                :data="studentList"
                :titles="['未分配班级学生列表', '当前班级学生列表']"
                >
            </el-transfer>
        </div>
        <div class="button">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="success" @click="back">返回</el-button>
        </div>
        <div class="tip">
            <p>可以通过将未分配班级学生列表中的学生移到当前班级列表中，便将学生分配到该班级</p>
            <p>通过将当前班级学生列表中的学生移到未分配班级列表中，便将学生移除该班级</p>
        </div>
    </div>
</template>

<script>
export default {
    created() {
         this.getGradeAndMajor();
    },
    data() {
        return {
            //未分配班级学生和当前班级学生列表
            studentList:[],
            //当前班级学生列表
            classStudentList:[],
            //当前班级学生备份
            oldClassStudentList:[],
            //未分配班级学生列表
            notClassStudentList:[],
            //班级信息
            classInfo:{
                grade:'',
                major:''
            },
            arr:[1,4]
        }
    },
    methods: {
        //退出登入
        exit(){
            this.$router.push('/adminLogin');
        },
        //获取年级和专业
        getGradeAndMajor(){
            this.classInfo.grade = this.$router.history.current.query.grade;
            this.classInfo.major = this.$router.history.current.query.major;
            this.getStudentList();
        },
        //获取学生列表信息
        async getStudentList(){
            let {data : result} = await this.$http.post('/getAllStudentList',this.classInfo);
            // console.log(result);
            if(result.meta.status === 200){
                this.studentList = result.data.allStudentArr;
                this.classStudentList = result.data.classStudentArr;
                this.notClassStudentList = result.data.notClassStudentArr;
                this.format();
            }
        },
        //格式化学生信息
        format(){
            this.studentList = this.studentList.map(v => {
                return {
                    key:v.Student_id,
                    label:`${v.Student_num} - ${v.Student_name}`
                }
            });
            this.classStudentList = this.classStudentList.map(v => {
                return v.Student_id
            });
            this.oldClassStudentList = this.classStudentList;
            this.notClassStudentList = this.notClassStudentList.map(v => {
                return v.Student_id
            });
        },
        //保存当前编辑
        save(){
            let saveClassStudentList = this.classStudentList.filter(v => {
                return this.notClassStudentList.includes(v);
            });
            saveClassStudentList.forEach(async id => {
                let {data : result} = await this.$http.post('/updateClassStudent',{
                    ...this.classInfo,
                    id
                });
                if(result.meta.status !== 200){
                    this.$message({
                        type:'error',
                        message:'保存失败'
                    });
                    return;
                }
            });
            let cancelClassStudentList = this.oldClassStudentList.filter(v => {
                return !this.classStudentList.includes(v);
            });
            // console.log(cancelClassStudentList,saveClassStudentList);
            cancelClassStudentList.forEach(async id => {
                let {data : result1} = await this.$http.post('/updateNotClassStudent',{
                    id
                });
                if(result1.meta.status !== 200){
                    this.$message({
                        type:'error',
                        message:'保存失败'
                    });
                    return;
                }
            });
            this.$router.push('/classManagement');
        },
        //返回
        back(){
            this.$router.push('/classManagement');
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
    .button{
        position: absolute;
        right: 105px;
        bottom: 15px;
    }
    .button button{
        margin: 15px;
    }
    .tip{
        position: absolute;
        right: 45px;
        top: 85px;
        width: 20%;
    }
    .tip p {
        font-size: 12px;
        color: #555;
        margin-top: 15px;
    }
</style>