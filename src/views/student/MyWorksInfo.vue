<template>
    <div class="jobInfo">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="backUrl">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>我的作业</el-breadcrumb-item>
            <el-breadcrumb-item>未完成作业</el-breadcrumb-item>
            <el-breadcrumb-item>提交</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <div>{{worksInfo.Work_name}}</div>
            <div class="fontSize-12px"><span>截止时间:</span>{{worksInfo.Work_endTime}}</div>
            <div class="fontSize-12px">{{worksInfo.Work_content}}</div>
            <div class="fontSize-12px fileIndex" @click="downloadFile" ><i class="el-icon-tickets"></i>{{worksInfo.Work_url}}</div>
            <div class="fontSize-12px">教学视频</div>
            <div class="fontSize-12px fileIndex" @click="openVideo" >{{worksInfo.Work_videoUrl}}</div>
            <quill-editor v-model="content"></quill-editor>
            <el-upload
                action="http://zhangry.cn:3000/uploadFiles"
                ref="upload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :limit="1"
                :file-list="fileList"
                :on-remove='removeFiles'
                >
                <el-button type="primary" class="upload">上传<i class="el-icon-upload el-icon--right"></i></el-button>
                <div slot="tip" class="el-upload__tip">点击上传后,出现绿色对勾表示上传成功,重新提交请先将原文件进行删除！</div>
            </el-upload>
            <el-button type="warning" @click="submitWorks" class="submit">提交</el-button>
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
            //文件列表
            fileList:[],
            //学生留言内容
            content:'',
            backUrl:'',
            courseName:'',
            //默认对话框是隐藏的
            dialogVisible: false,
            //视频地址
            videoUrl:''
        }
    },
    methods: {
        getJobId(){
            this.id = this.$router.history.current.query.id;
            this.courseName = this.$router.history.current.query.courseName;
            this.backUrl = `/myNoFinishWorks?courseName=${this.courseName}`;
            this.getJobsInfo();
        },
        async getJobsInfo(){
            let {data : result} = await this.$http.post('/getWorksInfo',{id:this.id});
            if(result.meta.status === 200){
                this.worksInfo = result.data[0];
                this.getFileName();
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
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download',fileUrl);
            document.body.appendChild(link);
            link.click();
        },
        //文件上传成功时触发
        async uploadSuccess(response){
            let {data : result} = await this.$http.post('/saveFilename',{
                fileName:response.filename,
                worksId:this.id
            });
            if(result.meta.status !== 200){
                this.$message({
                    type:'error',
                    message:'文件上传失败',
                    showClose:true
                });
            }
        },
        //文件上传失败时触发
        uploadError(err){
            throw err;
        },
        //获取文件名
        async getFileName(){
            let {data : result} = await this.$http.post('/getFileName',{
                id:this.id
            });
            if(result.meta.status === 200){
                this.fileList.push({
                    name:result.data
                });
            }
        },
        //删除文件
        async removeFiles(file){
            let {data : result} = await this.$http.post('/removeFiles',{
                fileName:file.name,
                worksId:this.id
            });
            if(result.meta.status === 400){
                this.$message({
                    type:'error',
                    message:'文件删除失败',
                    showClose:true
                });
            }
        },
        //提交作业
        async submitWorks(){
            let { data : result } = await this.$http.post('/submitWorks',{
                content:this.content,
                id:this.id
            });
            if(result.meta.status === 200){
                this.$message({
                    type:'success',
                    message:'提交成功',
                    showClose:true
                });
                this.$router.push({
                    path:'/myFinishedWorks',
                    query:{
                        courseName:this.courseName
                    }
                });
            }
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
    .submit{
        margin: 15px  25px;
    }
    #video{
        outline: none;
    }
</style>