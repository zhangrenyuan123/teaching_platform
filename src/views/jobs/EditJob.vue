<template>
    <div class="editJob">
         <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <router-link :to="backUrl">返回</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>作业管理</el-breadcrumb-item>
            <el-breadcrumb-item>已发布作业</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-form ref="worksInfoFromRef" :model="worksInfo" label-width="80px" :rules="worksInfoFormRules">
                <el-form-item label="作业名称" prop="Work_name">
                    <el-input v-model="worksInfo.Work_name"></el-input>
                </el-form-item>
                <el-form-item label="所属课程">
                    <el-select v-model="worksInfo.Work_courseName" placeholder="请选择课程">
                        <el-option v-for="course in courseList" 
                            :key="course.Course_name" :label="course.Course_name" :value="course.Course_name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="面向年级">
                    <el-input v-model="worksInfo.Work_grade" disabled></el-input>
                </el-form-item>
                <el-form-item label="面向专业">
                    <el-input v-model="worksInfo.Work_major" disabled></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-input v-model="worksInfo.Work_startTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="截止时间">
                    <el-date-picker
                        v-model="worksInfo.Work_endTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="作业内容">
                    <el-input type="textarea" v-model="worksInfo.Work_content" rows="5"></el-input>
                </el-form-item>
                <el-form-item label="作业资料">
                    <!-- 上传资料文件 -->
                    <el-upload
                        action="http://zhangry.cn:3000/uploadFiles"
                        ref="upload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :auto-upload="false"
                        :limit="1"
                        :file-list="fileList"
                        :on-remove='removeFiles'
                        >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
                        <div slot="tip" class="el-upload__tip">要重新上传资料前先删除原先资料</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="教学视频">
                    <!-- 上传资料文件 -->
                    <el-upload
                        action="http://zhangry.cn:3000/uploadFiles"
                        ref="uploadVideo"
                        :on-success="uploadVideoSuccess"
                        :on-error="uploadError"
                        :auto-upload="false"
                        :limit="1"
                        :file-list="videoList"
                        :on-remove='removeVideoFiles'
                        >
                        <el-button slot="trigger" size="small" type="primary">选取视频</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitVideoUpload">上传</el-button>
                        <div slot="tip" class="el-upload__tip">要重新上传视频前先删除原先视频</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSave">保存</el-button>
                    <el-button type="info" @click="onReset('worksInfoFromRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getId();
        this.getCourseList();
    },
    data() {
        return {
            //快捷选项数据
            pickerOptions1: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '明天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() + 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周后',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            //作业Id
            id:'',
            //返回地址
            backUrl:'',
            //作业信息
            worksInfo:{},
            worksInfoFormRules:{
                Work_name:[
                    {
                        required:true,message:'请输入作业名称',trigger:'blur'
                    }
                ]
            },
            //课程列表
            courseList:[],
            //文件列表
            fileList:[],
            //视频列表
            videoList:[],
            courseName:''
        }
    },
    methods: {
        //获取作业Id
        getId(){
            this.id = this.$router.history.current.query.id;
            this.courseName = this.$router.history.current.query.courseName;
            this.backUrl = `/publishedJob?courseName=${this.courseName}`;
            this.getWorksInfo();
        },
        //获取作业信息
        async getWorksInfo(){
            let {data:result} = await this.$http.post('/getWorksInfo',{
                id:this.id
            });
            if(result.meta.status === 200){
                this.worksInfo = result.data[0];
                if(result.data[0].Work_url){
                    this.fileList.push({
                        name:result.data[0].Work_url,
                    });
                }
                if(result.data[0].Work_videoUrl){
                    this.videoList.push({
                        name:result.data[0].Work_videoUrl,
                    });
                }
            }
        },
        //获取课程列表
        async getCourseList(){
            let {data : result} = await this.$http.get('/getCourseList');
            this.courseList = result;
        },
        //文件上传成功时触发
        uploadSuccess(response){
            this.worksInfo.Work_url = response.filename;
        },
        uploadVideoSuccess(response){
            this.worksInfo.Work_videoUrl = response.filename;
        },
        //文件上传失败时触发
        uploadError(err){
            throw err;
        },
        //重置作业编写信息
        onReset(worksInfoFromRef){
            this.$refs[worksInfoFromRef].resetFields();
            this.worksInfo.Work_endTime='';
            this.worksInfo.Work_content='';
            // this.worksInfo.Work_fileName='';
            this.worksInfo.Work_grade = '';
            this.worksInfo.Work_major = '';
            this.$refs.upload.clearFiles();
            this.$refs.uploadVideo.clearFiles();
        },
        //上传文件
        submitUpload() {
            this.$refs.upload.submit();
        },
        //上传视频
        submitVideoUpload(){
            this.$refs.uploadVideo.submit();
        },
        //保存编辑
        async onSave(){
            let {data : result} = await this.$http.post('/editWorksInfo',this.worksInfo);
            // console.log(result);
            if(result.meta.status === 200){
                this.$message({
                    type:'success',
                    message:'修改成功',
                    showClose:true
                });
                this.$router.push({
                    path:'/publishedJob',
                    query:{
                        courseName:this.courseName
                    }
                });
            }
        },
        //删除文件
        async removeFiles(file){
            let {data : result} = await this.$http.post('/removeWorksFiles',{
                fileName:this.worksInfo.Work_url,
                worksId:this.id
            });
            if(result.meta.status === 400){
                this.$message({
                    type:'error',
                    message:'文件删除失败',
                    showClose:true
                });
                return;
            }
            this.worksInfo.Work_url = '';
        },
        //删除视频
        async removeVideoFiles(file){
            let {data : result} = await this.$http.post('/removeWorksFiles',{
                fileName:this.worksInfo.Work_videoUrl,
                worksId:this.id
            });
            if(result.meta.status === 400){
                this.$message({
                    type:'error',
                    message:'视频删除失败',
                    showClose:true
                });
                return;
            }
            this.worksInfo.Work_videoUrl = '';
        },
    },
}
</script>

<style lang="less" scoped>
    .el-form{
        width: 60%;
    }
</style>