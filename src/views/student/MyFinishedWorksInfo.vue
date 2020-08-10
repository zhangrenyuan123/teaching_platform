<template>
    <div class="myFinishedWorksInfo">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="backUrl">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>我的作业</el-breadcrumb-item>
            <el-breadcrumb-item>已完成作业</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div>{{worksInfo.Work_name}}</div>
            <div class="fontSize-12px"><span>截止时间: </span>{{worksInfo.Work_endTime}}</div>
            <div class="fontSize-12px"><span>提交时间: </span>{{worksInfo.Submit_time}}</div>
            <div class="fontSize-12px">{{worksInfo.Work_content}}</div>
            <div class="fontSize-12px"><span>成绩: </span>{{worksInfo.Student_score}}</div>
            <div class="fontSize-12px fileIndex" @click="downloadFile" ><i class="el-icon-tickets"></i>{{worksInfo.Student_url}}</div>
            <quill-editor v-model="worksInfo.Student_language"></quill-editor>
            <div class="fontSize-12px"><span>教师评语: </span>{{worksInfo.Teacher_language}}</div>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getQueryInfo();
    },
    data() {
        return {
            id:'',
            backUrl:'',
            worksInfo:{}
        }
    },
    methods: {
        getQueryInfo(){
            this.id = this.$router.history.current.query.id;
            let courseName = this.$router.history.current.query.courseName;
            this.backUrl = `/myFinishedWorks?courseName=${courseName}`;
            this.getFinishedWorksInfo();
        },
        async getFinishedWorksInfo(){
            let {data : result} = await this.$http.post('/getFinishedWorksInfo',{
                id:this.id
            });
            if(result.meta.status === 200){
                this.worksInfo = result.data;
                // if(!this.worksInfo.Student_score){
                //     this.worksInfo.Student_score = '暂无';
                // }
                // if(this.worksInfo.Student_score === -1){
                //     this.worksInfo.Student_score = 0;
                // }
            }
        },
        //下载文件
        // https://blog.csdn.net/mibi8840/article/details/86741982
        async downloadFile(){
            let fileUrl = this.worksInfo.Student_url;
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
</style>