import { createRouter, createWebHistory } from "vue-router";
import SignInView from '../views/SignInView.vue';
import SignUpView from '../views/SignUpView.vue';
import AuthView from '../views/AuthView.vue';
// Updated to use new EduShare HomeView
import HomeView from '../views/HomeView.vue';
//import TourDetailsView from '../views/TourDetailsView.vue';
// import BookingView from '../views/BookingView.vue'
import UserInfoView from '../views/UserInfoView.vue';
//import SearchResults from '../views/SearchResults.vue';
// Phần Article
import GioiThieu from '../views/Articles/GioiThieu.vue';
import ChinhSach from '../views/Articles/ChinhSach.vue';
import HotNews from '../views/Articles/HotNews.vue';
import DienDan from '../views/Articles/DienDan.vue';
import Blog from '../views/Articles/Blog.vue';
// New EduShare pages
import DocumentsView from '../views/DocumentsView.vue';
import CoursesView from '../views/CoursesView.vue';
import CourseIntroductionView from '../views/CourseIntroductionView.vue';
import CourseLearningView from '../views/CourseLearningView.vue';
import ClassRegisterView from '../views/ClassRegisterView.vue';
import MyClassesView from '../views/MyClassesView.vue';
import HelpView from '../views/HelpView.vue';

// test

const routes = [
    {path: '/auth', component: AuthView, name: 'Auth'},
    {path: '/signup', component: AuthView, query: { tab: 'signup' }},
    {path: '/signin', component: AuthView, query: { tab: 'signin' }},
    // Legacy routes for backward compatibility
    {path: '/signup-old', component: SignUpView},
    {path: '/signin-old', component: SignInView},
    {path: '/', component: HomeView},
   // {path: '/tour/booking/:tourId', component: BookingView},
   // {path: '/tour/:tourId', component: TourDetailsView},
   // {path: '/tour-details/:tourId', component: TourDetailsView},
    {path: '/userinfo', component: UserInfoView},
    {path: '/profile', component: () => import('../views/UserProfileView.vue'), name: 'Profile'},
    {path: '/profile/:id', component: () => import('../views/UserProfileView.vue'), name: 'UserProfile'},
  //  {path: '/search-results', name: 'SearchResults', component: SearchResults},
    {path: '/gioithieu', name: 'GioiThieu', component: GioiThieu},
    {path: '/chinhsach', name: 'ChinhSach', component: ChinhSach},
    {path: '/hotnews', name: 'HotNews', component: HotNews},
    {path: '/blog', name: 'Blog', component: Blog},
    {path: '/diendan', name: 'DienDan', component: DienDan},
    {path: '/tour-thuong', name: 'TourThuong', component: DocumentsView}, // Redirected to Documents
    {path: '/tour-theo-doan', name: 'TourTheoDoan', component: CoursesView}, // Redirected to Courses
    {path: '/tourtheodoan', name: 'TourTheoDoanAlias', component: CoursesView},
    {path: '/tourthuong', name: 'TourThuongAlias', component: DocumentsView},
    // New dedicated routes
    {path: '/documents', name: 'Documents', component: DocumentsView},
    {path: '/courses', name: 'Courses', component: CoursesView},
    {path: '/courses/upload', name: 'UploadCourse', component: () => import('../views/UploadCourseView.vue')},
    {path: '/courses/enroll', name: 'EnrollCourse', component: () => import('../views/ComingSoonView.vue')},
    {path: '/courses/mine', name: 'MyCourses', component: () => import('../views/MyCoursesView.vue')},
    {path: '/course/:id', name: 'CourseIntroduction', component: CourseIntroductionView},
    {path: '/course/:id/learn', name: 'CourseLearning', component: CourseLearningView},
    {path: '/classes/register', name: 'ClassRegister', component: ClassRegisterView},
    {path: '/classes/mine', name: 'MyClasses', component: MyClassesView},
    {path: '/help', name: 'Help', component: HelpView},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router