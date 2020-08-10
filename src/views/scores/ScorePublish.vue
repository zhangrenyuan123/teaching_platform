<template>
    <div class="scorePublish">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
            <el-breadcrumb-item>成绩发布</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-form  :model="scoreModel">
                <el-form-item label="课程名称">
                    <el-select v-model="scoreModel.courseName" placeholder="请选择" @change="updatePercent">
                        <el-option
                            v-for="item in courseList"
                            :key="item.Course_name"
                            :label="item.Course_name"
                            :value="item.Course_name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平时占比">
                    <el-input type="number" step="0.1" max="1" min="0" v-model="scoreModel.usualPercent"></el-input>
                </el-form-item>
                <el-form-item label="实验占比">
                    <el-input type="number" step="0.1" max="1" min="0" v-model="scoreModel.testPercent"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">下一步</el-button>
                </el-form-item>
            </el-form>
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
            //成绩发布表达数据
            scoreModel:{
               courseName:'',
               usualPercent:'',
               testPercent:''
            },
            //课程列表
            courseList:[],
            scorePercent:null
        }
    },
    methods: {
        //获取课程名称列表
        async getCourseList(){
            let {data : result} = await this.$http.get('/getCourseStatusList');
            if(result.meta.status === 200){
                this.courseList = result.data;
            }
            let courseName = this.$router.history.current.query.courseName;
            if(courseName){
                this.scoreModel.courseName = courseName;
            }else{
                this.scoreModel.courseName = result.data[0].Course_name;
            }
            this.getScorePercent();
        },
        //获取课程占比
        async getScorePercent(){
            let { data :result } = await this.$http.post('/getScorePercent',{
                courseName:this.scoreModel.courseName
            });
            if(result.meta.status === 200){
                this.scoreModel.usualPercent = result.data.Usual_percent;
                this.scoreModel.testPercent = result.data.Experimental_percent;
                this.scorePercent = result.data;
            }else{
                this.scoreModel.usualPercent = '';
                this.scoreModel.testPercent = '';
                this.scorePercent = null;
            }
        },
        //单击下一步时所触发的事件
        async onSubmit(){
            if(Number(this.scoreModel.usualPercent) + Number(this.scoreModel.testPercent) !== 1){
                this.$message({
                    type:'error',
                    message:'平时占比和实验占比相加必须等于1！'
                });
                return;
            }
            let {data : result} = await this.$http.post('/checkWorksStatus',{
                courseName:this.scoreModel.courseName
            });
            if(result.meta.status === 200){
                if(!this.scorePercent){
                    let { data : result } = await this.$http.post('/addCourseScore',this.scoreModel);
                    if(result.meta.status === 200){
                        this.$router.push({
                            path:'usualScoreList',
                            query:{
                                courseName:this.scoreModel.courseName
                            }
                        });
                    }
                }else{
                    let {data : result } = await this.$http.post('/updateCourseScore',this.scoreModel);
                    if(result.meta.status === 200){
                        this.$router.push({
                            path:'usualScoreList',
                            query:{
                                courseName:this.scoreModel.courseName
                            }
                        });
                    }
                }
            }else{
               this.$message({
                    type:'error',
                    message:'课程作业未批改完成！'
                }); 
            }
            
        },
        //更新下拉列表
        updatePercent(){
            this.getScorePercent();
        }
    },
}
</script>

<style lang="less" scoped>
    .el-form{
        width: 50%;
    }
    .el-input{
        width: 100px;
    }
    .el-button{
        margin: 20px 0;
    }
</style>