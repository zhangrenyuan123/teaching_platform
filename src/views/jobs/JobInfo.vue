<template>
    <div class="jobInfo">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="backUrl">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>作业管理</el-breadcrumb-item>
            <el-breadcrumb-item>已发布作业</el-breadcrumb-item>
            <el-breadcrumb-item>查看详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <div>{{worksInfo.Work_name}}</div>
            <div class="fontSize-12px"><span>截止时间:</span>{{worksInfo.Work_endTime}}</div>
            <div class="fontSize-12px">{{worksInfo.Work_content}}</div>
            <!--  @click="downloadFile" -->
            <div class="fontSize-12px fileIndex" @click="downloadFile" ><i class="el-icon-tickets"></i>{{worksInfo.Work_url}}</div>
            <div class="fontSize-12px">教学视频</div>
            <div class="fontSize-12px fileIndex" @click="openVideo" >{{worksInfo.Work_videoUrl}}</div>
            <quill-editor></quill-editor>
            <el-button type="primary" class="upload" disabled>上传<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-card>
        <el-dialog
            title="教学视频"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            >
            <video id="video" controls width="100%">
                <source :src="videoUrl" type="video/mp4">
                <source :src="videoUrl" type="video/webm">
                <source :src="videoUrl" type="video/ogg">
                Your browser does not support the video tag.
            </video>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created() {
        this.getJobId();
    },
    data() {
        return {
            //作业id
            id:'',
            //作业信息
            worksInfo:{},
            backUrl:'',
            //默认对话框是隐藏的
            dialogVisible: false,
            //视频地址
            videoUrl:''
        }
    },
    methods: {
        getJobId(){
            this.id = this.$router.history.current.query.id;
            let courseName = this.$router.history.current.query.courseName;
            this.backUrl = `/publishedJob?courseName=${courseName}`;
            this.getJobsInfo();
        },
        async getJobsInfo(){
            let {data : result} = await this.$http.post('/getWorksInfo',{id:this.id});
            if(result.meta.status === 200){
                this.worksInfo = result.data[0];
            }
        },
        //下载文件
        // https://blog.csdn.net/mibi8840/article/details/86741982
        async downloadFile(){
            let fileUrl = this.worksInfo.Work_url;
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
            // this.url = window.URL.createObjectURL(new Blob([result]))+'.mp4';
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download',fileUrl);
            document.body.appendChild(link); 
            link.click();
        },
        openVideo(){
            // console.log(`http://localhost:3000/api/downloadFile?videoUrl=${this.worksInfo.Work_videoUrl}`);
            this.videoUrl = `http://zhangry.cn:3000/api/downloadFile?videoUrl=${this.worksInfo.Work_videoUrl}`;
            if(this.videoUrl){
                this.dialogVisible = true;
            }
        },
        handleClose(done) {
            document.querySelector('#video').pause();
            if(document.querySelector('#video').paused){
                done();
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
    .upload{
        margin: 15px;
    }
    #video{
        outline: none;
    }
</style>