import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import StudentHome from '../views/StudentHome.vue'
import TeacherHome from '../views/TeacherHome.vue'
import StudentInfo from '../views/StudentInfo.vue'
import AdminLogin from '../views/AdminLogin.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'login',
        component: Login
    }, {
        path: '/',
        redirect: '/login'
    }, {
        path: '/studentHome',
        name: 'studentHome',
        component: StudentHome,
        children: [{
                path: '/studentInfo',
                component: StudentInfo
            },
            {
                path: '/teacherList',
                component: () =>
                    import ('../views/TeacherList.vue')
            },
            {
                path: '/myCourses',
                component: () =>
                    import ('../views/student/MyCourses.vue')
            },
            {
                path: '/myNoFinishWorks',
                component: () =>
                    import ('../views/student/MyNoFinishWorks.vue')
            },
            {
                path: '/myFinishedWorks',
                component: () =>
                    import ('../views/student/MyFinishedWorks.vue')
            },
            {
                path: '/myCoursesInfo',
                component: () =>
                    import ('../views/student/MyCoursesInfo.vue')
            },
            {
                path: '/myWorksInfo',
                component: () =>
                    import ('../views/student/MyWorksInfo.vue')
            }, {
                path: '/myFinishedWorksInfo',
                component: () =>
                    import ('../views/student/MyFinishedWorksInfo.vue')
            },
            {
                path: '/myScores',
                component: () =>
                    import ('../views/student/MyScores.vue')
            },
        ]
    }, {
        path: '/teacherHome',
        name: 'teacherHome',
        component: TeacherHome,
        children: [{
                path: '/teacherInfo',
                component: () =>
                    import ('../views/TeacherInfo.vue')
            },
            {
                path: '/studentList',
                component: () =>
                    import ('../views/StudentList.vue')
            },
            {
                path: '/publishedJob',
                component: () =>
                    import ('../views/jobs/PublishedJob.vue')
            },
            {
                path: '/publishJob',
                component: () =>
                    import ('../views/jobs/PublishJob.vue')
            },
            {
                path: '/correctingJob',
                component: () =>
                    import ('../views/jobs/CorrectingJob.vue')
            },
            {
                path: '/editJob',
                component: () =>
                    import ('../views/jobs/EditJob.vue')
            },
            {
                path: '/publishedCourses',
                component: () =>
                    import ('../views/courses/PublishedCourses.vue')
            },
            {
                path: '/publishCourses',
                component: () =>
                    import ('../views/courses/PublishCourses.vue')
            },
            {
                path: '/editCourse',
                component: () =>
                    import ('../views/courses/EditCourse.vue')
            },
            {
                path: '/courseInfo',
                component: () =>
                    import ('../views/courses/CourseInfo.vue')
            },
            {
                path: '/jobInfo',
                component: () =>
                    import ('../views/jobs/JobInfo.vue')
            }, {
                path: '/correctingJobList',
                component: () =>
                    import ('../views/jobs/CorrectingJobList.vue')
            },
            {
                path: '/correctingJobInfo',
                component: () =>
                    import ('../views/jobs/CorrectingJobInfo.vue')
            }, {
                path: '/scoreList',
                component: () =>
                    import ('../views/scores/ScoreList.vue')
            }, {
                path: '/scoreView',
                component: () =>
                    import ('../views/scores/ScoreView.vue')
            }, {
                path: '/selfScoreList',
                component: () =>
                    import ('../views/scores/SelfScoreList.vue')
            }, {
                path: '/selfScoreInfo',
                component: () =>
                    import ('../views/scores/SelfScoreInfo.vue')
            }, {
                path: '/scorePublish',
                component: () =>
                    import ('../views/scores/ScorePublish.vue')
            }, {
                path: '/usualScoreList',
                component: () =>
                    import ('../views/scores/UsualScoreList.vue')
            }, {
                path: '/editUsualScore',
                component: () =>
                    import ('../views/scores/EditUsualScore.vue')
            }
        ]
    },
    {
        path: '/adminLogin',
        component: AdminLogin
    },
    {
        path: '/adminHome',
        component: () =>
            import ('../views/admins/AdminHome.vue')
    },
    {
        path: '/teacherManagement',
        component: () =>
            import ('../views/admins/TeacherManagement.vue')
    },
    {
        path: '/studentManagement',
        component: () =>
            import ('../views/admins/StudentManagement.vue')
    },
    {
        path: '/classManagement',
        component: () =>
            import ('../views/admins/ClassManagement.vue')
    },
    {
        path: '/adminManagement',
        component: () =>
            import ('../views/admins/AdminManagement.vue')
    },
    {
        path: '/createTeachers',
        component: () =>
            import ('../views/admins/CreateTeachers.vue')
    },
    {
        path: '/viewTeacherInfo',
        component: () =>
            import ('../views/admins/ViewTeaherInfo.vue')
    },
    {
        path: '/editTeacherInfo',
        component: () =>
            import ('../views/admins/EditTeacherInfo.vue')
    },
    {
        path: '/createStudents',
        component: () =>
            import ('../views/admins/CreateStudents.vue')
    },
    {
        path: '/viewStudentInfo',
        component: () =>
            import ('../views/admins/ViewStudentInfo.vue')
    },
    {
        path: '/editStudentInfo',
        component: () =>
            import ('../views/admins/EditStudentInfo.vue')
    },
    {
        path: '/viewClassStudentList',
        component: () =>
            import ('../views/admins/ViewClassStudentList.vue')
    },
    {
        path: '/addOrDeleteClassStudent',
        component: () =>
            import ('../views/admins/AddOrDeleteClassStudent.vue')
    },
    {
        path: '/forgetPwd',
        component: () =>
            import ('../views/ForgetPwd.vue')
    }
]

const router = new VueRouter({
    routes
});

//设置全局前置守卫，判断用户是否登入，如果没有登入则跳转到登入页
router.beforeEach((to, from, next) => {
    if (to.path === '/' || to.path === '/login' || to.path === '/forgetPwd' || to.path === '/adminLogin')
        return next();
    let token = window.sessionStorage.getItem('token');
    if (!token) {
        if (from.path === '/adminLogin') {
            next('/adminLogin');
        } else {
            next('/login');
        }
    } else {
        next();
    }
});

export default router;