import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../pages/auth/Login.vue'
import Employee from '../pages/screen/Employee.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'SignIn',
        component: Login
    },
    {
        path: '/Employee',
        name: 'Employee',
        component: Employee
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
