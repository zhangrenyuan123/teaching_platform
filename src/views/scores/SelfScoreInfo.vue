<template>
    <div class="correctingJobInfo">
         <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="backUrl">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
            <el-breadcrumb-item>成绩列表</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
            <el-breadcrumb-item>查看详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div>{{studentWorksInfo.Work_name}}</div>
            <div class="fontSize-12px"><span>截止时间: </span>{{studentWorksInfo.Work_endTime}}</div>
            <div class="fontSize-12px"><span>审批时间: </span>{{studentWorksInfo.Correct_time ? studentWorksInfo.Correct_time : '暂未审批'}}</div>
            <div class="fontSize-12px"><span>提交时间: </span>{{studentWorksInfo.Submit_time}}</div>
            <div class="fontSize-12px">{{studentWorksInfo.Work_content}}</div>
            <div class="fontSize-12px fileIndex" @click="downloadFile" ><i class="el-icon-tickets"></i>{{studentWorksInfo.Student_url}}</div>
            <quill-editor v-model="studentWorksInfo.Student_language"></quill-editor>
            <el-form :model="selfWorksInfo" label-position="top">
                <el-form-item label="成绩">
                    <el-input style="width:100px" v-model="selfWorksInfo.score" type="number"></el-input>
                </el-form-item>
                 <el-form-item label="批语">
                    <el-input v-model="selfWorksInfo.language" rows="5" type="textarea"></el-input>
                </el-form-item>
                 <el-form-item size="large">
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getQuertInfo();
    },
    data() {
        return {
            id:{},
            // 学生作业的详情信息
            studentWorksInfo:{},
            backUrl:'',
            //批改信息
            selfWorksInfo:{
                score:'',
                language:''
            }
        }
    },
    methods: {
        getQuertInfo(){
            this.id.workId = this.$router.history.current.query.workId;
            this.id.studentId = this.$router.history.current.query.studentId;
            this.backUrl = `/selfScoreList?id=${this.id.workId}`;
            this.getStudentWorksInfo();
        },
        //获取批改作业的详情信息
        async getStudentWorksInfo(){
            let {data : result} = await this.$http.post('/getStudentWorksInfo',this.id);
            if(result.meta.status === 200){
                this.studentWorksInfo = result.data;
                this.selfWorksInfo.score = result.data.Student_score;
                this.selfWorksInfo.language = result.data.Teacher_language;
            }
        },
        async downloadFile(){
            let fileUrl = this.studentWorksInfo.Student_url;
            if(!fileUrl){
                return;
            }
            let {data : result} = await this.$http.post('/downloadFile',{
                fileUrl
            },{responseType: 'blob'});
            // let {data : result} = await this.$http.get('/downloadFile',{responseType: 'blob'});
            if(!result){
                return;
            }
            let url = window.URL.createObjectURL(new Blob([result]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download',fileUrl);
            document.body.appendChild(link);
            link.click();
        },
        //提交批改
        async onSubmit(){
            if(!this.selfWorksInfo.score){
                 this.$message({
                    type:'error',
                    message:'未正确给出分数',
                    showClose:true
                });
                return;
            }
            let {data : result} = await this.$http.post('/saveSelfWorksCorrection',{
                ...this.id,
                ...this.selfWorksInfo
            });
            if(result.meta.status === 200){
                this.$router.push({
                    path:'selfScoreList',
                    query:{
                      id:this.id.workId
                    }
                });
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .el-card div{
        margin: 15px;
    }
    .fontSize-12px{
        font-size: 12px;
    }
    .fontSize-12px span{
        margin-right: 15px;
    }
    .fileIndex{
        cursor: pointer;
        color: blueviolet;
    }
    .fileIndex:hover{
        color: red;
    }
    .el-form{
        width: 50%;
    }
</style>