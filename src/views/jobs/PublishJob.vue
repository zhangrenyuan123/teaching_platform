<template>
    <div class="publishJob">
        <!-- 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>作业管理</el-breadcrumb-item>
            <el-breadcrumb-item>作业发布</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-form ref="worksFormRef" :model="worksFormModel" label-width="80px" :rules="worksFormRules">
                <el-form-item label="作业名称" prop="name">
                    <el-input v-model="worksFormModel.name"></el-input>
                </el-form-item>
                <el-form-item label="所属课程">
                    <el-select v-model="worksFormModel.courseName" placeholder="请选择课程">
                        <el-option v-for="course in courseList" 
                            :key="course.Course_name" :label="course.Course_name" :value="course.Course_name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="截止时间">
                    <el-date-picker
                        v-model="worksFormModel.endTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="作业内容">
                    <el-input type="textarea" v-model="worksFormModel.content" rows="5"></el-input>
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
                        :on-remove='removeFiles'
                        >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
                        <div slot="tip" class="el-upload__tip">点击上传后,出现绿色对勾表示上传成功！</div>
                    </el-upload>
                </el-form-item>
                 <el-form-item label="教学视频">
                    <!-- 上传教学视频 -->
                    <el-upload
                        action="http://zhangry.cn:3000/uploadFiles"
                        ref="uploadVideo"
                        :on-success="uploadVideoSuccess"
                        :on-error="uploadError"
                        :auto-upload="false"
                        :limit="1"
                        :on-remove='removeVideoFiles'
                        >
                        <el-button slot="trigger" size="small" type="primary">选取视频</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitVideoUpload">上传</el-button>
                        <div slot="tip" class="el-upload__tip">点击上传后,出现绿色对勾表示上传成功！</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onPublish">发布</el-button>
                    <el-button type="info" @click="onReset('worksFormRef')">重置</el-button>
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
            worksFormModel:{
                name:'',
                courseName:'',
                endTime:'',
                content:'',
                fileName:'',
                videoFileName:''
            },
            //规则对象
            worksFormRules:{
                name:[
                    {
                        required:true,message:'请输入作业名称',trigger:'blur'
                    }
                ]
            },
            //课程列表
            courseList:[],
        }
    },
    methods: {
        //文件上传
        submitUpload() {
            this.$refs.upload.submit();
        },
        submitVideoUpload(){
            this.$refs.uploadVideo.submit();
        },
        //发布作业 
        onPublish(){
            this.$refs.worksFormRef.validate(async valid => {
                if(valid){
                    if(!this.worksFormModel.endTime){
                        let date1 = new Date();
                        let date2 = new Date(date1);
                        date2.setDate(date1.getDate()+7);
                        this.worksFormModel.endTime = date2;
                    }
                    let {data:result} = await this.$http.post('/addWorks',this.worksFormModel);
                    if(result.meta.status === 200){
                        this.$message({
                                type:'success',
                                message:'作业添加成功！',
                                showClose:true
                        });
                        this.$router.push({
                            path:'/publishedJob',
                            query:{
                                courseName:this.worksFormModel.courseName
                            }
                        });
                    }
                }
            });
        },
        //文件上传成功时触发
        uploadSuccess(response){
            this.worksFormModel.fileName = response.filename;
        },
        uploadVideoSuccess(response){
            this.worksFormModel.videoFileName = response.filename;
        },
        //文件上传失败时触发
        uploadError(err){
            throw err;
        },
        //获取课程名称
        async getCourseList(){
            let {data : result} = await this.$http.get('/getCourseStatusList');
            if(result.meta.status === 200){
                this.courseList = result.data;
                this.worksFormModel.courseName = result.data[0].Course_name;
            }
        },
        //重置作业编写信息
        onReset(worksFormRef){
            this.$refs[worksFormRef].resetFields();
            this.worksFormModel.endTime='';
            this.worksFormModel.content='';
            this.worksFormModel.fileName='';
            this.worksFormModel.videoFileName='';
            this.$refs.upload.clearFiles();
            this.$refs.uploadVideo.clearFiles();
        },
        //删除文件
        async removeFiles(file){
            let {data : result} = await this.$http.post('/removeWorksFiles',{
                fileName:this.worksFormModel.fileName,
                worksId:0
            });
            if(result.meta.status === 400){
                this.$message({
                    type:'error',
                    message:'文件删除失败',
                    showClose:true
                });
                return;
            }
            this.worksFormModel.fileName = '';
        },
        async removeVideoFiles(file){
            let {data : result} = await this.$http.post('/removeWorksFiles',{
                fileName:this.worksFormModel.videoFileName,
                worksId:0
            });
            if(result.meta.status === 400){
                this.$message({
                    type:'error',
                    message:'视频删除失败',
                    showClose:true
                });
                return;
            }
            this.worksFormModel.videoFileName = '';
        },
    },
}
</script>

<style lang="less" scoped>
    .el-form{
        width: 60%;
    }
</style>