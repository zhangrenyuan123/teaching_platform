<template>
    <div id="teacher_home">
        <el-container>
            <el-header>
                <router-link to="/login"><img src="../assets/images/logo.png" alt="logo"></router-link>
                <!-- <router-link><router-link to="/login">已有账号？登入</router-link></P> -->
                <div class="right_header">
                    <img src="../assets/images/head.png" alt="头像" @click="getInfo">
                    <span><p>欢迎</p><p>{{info.Teacher_name}}{{info.Teacher_level ? info.Teacher_level:'讲师'}}</p></span>
                    <!-- <span @click="logout">退出</span> -->
                    <el-popover
                        ref="popover1"
                        placement="bottom"
                        width="150"
                        trigger="hover">
                        <p class="logout" @click="logout">退出</p>
                        <p class="myself" @click="getInfo">个人中心</p>
                    </el-popover>
                    <!-- <el-button v-popover:popover1><i class="el-icon-arrow-down"></i></el-button> -->
                    <span v-popover:popover1><i class="el-icon-arrow-down"></i></span>
                </div>
            </el-header>
            <el-container>
                <el-aside :width="menuWidth">
                    <!-- 折叠按钮 -->
                    <div class="togger-button" @click="toggerCollapse"> ||| </div>
                    <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409EFF"
                        unique-opened
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        router
                        :default-active="$router.history.current.path"
                        >
                        <el-submenu index="courses">
                            <template slot="title">
                                <i class="iconfont icon-kechengzhongxin"></i>
                                <span>课程管理</span>
                            </template>
                           <el-menu-item index="/publishedCourses">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>已发布课程</span>
                                </template>
                           </el-menu-item>
                           <el-menu-item index="/publishCourses">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>课程发布</span>
                                </template>
                           </el-menu-item>
                        </el-submenu>
                        <el-submenu index="jobs">
                            <template slot="title">
                                <i class="iconfont icon-wodezuoye"></i>
                                <span>作业管理</span>
                            </template>
                           <el-menu-item index="/publishedJob">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>已发布作业</span>
                                </template>
                           </el-menu-item>
                           <el-menu-item index="/correctingJob">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>作业批改</span>
                                </template>
                           </el-menu-item>
                           <el-menu-item index="/publishJob">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>作业发布</span>
                                </template>
                           </el-menu-item>
                        </el-submenu>
                        <el-submenu index="scoreManagement">
                            <template slot="title">
                                <i class="iconfont icon-wodechengjidan"></i>
                                <span>成绩管理</span>
                            </template>
                           <el-menu-item index="/scoreList">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>成绩列表</span>
                                </template>
                           </el-menu-item>
                           <el-menu-item index="/scorePublish">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>成绩发布</span>
                                </template>
                           </el-menu-item>
                           <el-menu-item index="/scoreView">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>成绩总览</span>
                                </template>
                           </el-menu-item>
                        </el-submenu>   
                        <el-menu-item index="/studentList">
                            <template>
                                <i class="iconfont icon-yonghu1"></i>
                                <span slot="title">学生信息</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/teacherInfo">
                            <template>
                                <i class="iconfont icon-yonghu"></i>
                                <span slot="title">个人中心</span>
                            </template>
                        </el-menu-item> 
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<script>



export default {
    created(){
        this.getTeacherInfo();
        this.getCourseInfo();
    },
    data() {
        return {
            //是否折叠
            isCollapse:false,
            menuWidth:'200px',
            //教师信息
            info:{},
        }
    },
    methods: {
        //退出
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        //获取教师信息
        async getTeacherInfo(){
            let {data:result} = await this.$http.get('/getTeacherInfo');
            this.info = result[0];
        },
        //跳转个人中心
        getInfo(){
            if(this.$router.history.current.path !== '/teacherInfo'){
                this.$router.push('/teacherInfo');
            }
        },
        //点击按钮实现，折叠效果
        toggerCollapse(){
            this.isCollapse = !this.isCollapse;
            if(this.isCollapse){
                this.menuWidth = '64px';
            }else{
                this.menuWidth = '200px';
            }
        },
        //更新课程成绩
        async getCourseInfo(){
            let { data : result} = await this.$http.get('/getCourseStatusList');
            if(result.meta.status === 200){
                let courseNameArr = result.data;
                courseNameArr.forEach(async courseObj => {
                    let { data : result1 } = await this.$http.post('/updateScoreList',{
                        courseName:courseObj.Course_name
                    });
                });
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .el-header{
        justify-content: flex-start;
        background: #2a2d38;
    }
    .el-aside{
        background: #333744;
        height: calc(100vh - 60px);
    }
    .el-main{
        background: #EAEDF1;
        height: calc(100vh - 60px);
    }
    .right_header{
        position: absolute;
        right: 30px;
        display: flex;
        align-items: center;
    }
    .right_header img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #bbb;
        cursor: pointer;
        margin-right: 15px;
    }
    .right_header span:last-child{
        margin: 0 15px;
        // color: red;
        color: #fff;
        cursor: pointer;
    }
    .right_header span:last-child:hover{
        color: red;
    }
    .right_header p{
        text-align: center;
        color: #fff;
        font-size: 12px;
        // color: rgb(201, 201, 40);
    }
    //图标
    .iconfont{
        margin-right: 15px;
    }
    .el-menu{
        border-right: none;
    }
    //折叠按钮
    .togger-button{
        background: #4A5064;
        font-size: 10px;
        color: #fff;
        text-align: center;
        line-height: 24px;
        letter-spacing: 3px;
        cursor: pointer;
    }
    //退出
    .logout,.myself{
        text-align: center;
        cursor: pointer;
        margin-top: 5px;
    }
    .logout:hover,.myself:hover{
        color:red;
    }
</style>