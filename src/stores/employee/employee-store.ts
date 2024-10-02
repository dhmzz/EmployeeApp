import { defineStore } from 'pinia'
import { IEmployee, IEmployeeRequest, IEmployeeResponse, ISelect } from './employee-types'
import apiClient from '../../utils/apiClient';
import { ElNotification } from 'element-plus';

export const useEmployeeStore = defineStore('useEmployeeStore', {
    state: () => ({
        table: {
            employeeDatas: [] as IEmployee[],
            departementOptions: [] as ISelect[],
            positionOptions: [] as ISelect[],
            isLoading: false,
            addMode: false,
            editMode: false,
            dataCount: 0,
            dataFilteredCount: 0,
            employeeSelected: null as IEmployee | null,
            isSaveLoading: false
        }, 
        inquiryRequest: {
            page: 1,
            limit: 10,
            search: ''
        },
        formRequest:{
            id: 0,
            name: '',
            gender: '',
            email: '',
            phone: '',
            date_of_birth: '',
            address: '',
            department_id: '',
            job_position_id: '' 
        }
    }),

    getters:{
        R_AddRequest(state):IEmployeeRequest {
            return {
                name: state.formRequest.name,
                gender: state.formRequest.gender,
                email: state.formRequest.email,
                phone: state.formRequest.phone,
                date_of_birth: state.formRequest.date_of_birth,
                address: state.formRequest.address,
                department_id: parseInt(state.formRequest.department_id),
                job_position_id: parseInt(state.formRequest.job_position_id) 
            }
        },
        R_UpdateRequest(state):IEmployeeRequest {
            return {
                id: state.formRequest.id,
                name: state.formRequest.name,
                gender: state.formRequest.gender,
                email: state.formRequest.email,
                phone: state.formRequest.phone,
                date_of_birth: state.formRequest.date_of_birth,
                address: state.formRequest.address,
                department_id: parseInt(state.formRequest.department_id),
                job_position_id: parseInt(state.formRequest.job_position_id) 
            }
        },
        R_DeleteRequest(state){
            return {
                id: state.formRequest.id
            }
        }
    },

    actions:{
        async getDepartement(){
            try{
                const url:string = '/departement/list';
                const res = apiClient.get(url);
                this.table.departementOptions = (await res).data.data;
            } catch(error:any){

            }
        },

        async getJobPosition(){
            try{
                const url:string = '/position/list';
                const res = apiClient.get(url);
                this.table.positionOptions = (await res).data.data;
            } catch(error:any){
                
            }
        },

        async getEmployee(){
            try {
                this.table.isLoading = true;
                
                const url:string = `/employee?page=${this.inquiryRequest.page}&limit=${this.inquiryRequest.limit}&search=${this.inquiryRequest.search}`;
                const res = await apiClient.get(url);

                const data:IEmployeeResponse = (await res).data;
                this.table.employeeDatas = data.data.list;   
                this.table.dataCount = data.data.total;             

            } catch (error) {
                
            } finally {
                this.table.isLoading = false;
            }
        },

        async saveEmployee(){
            try {
                this.table.isSaveLoading = true;
                const url:string = '/employee'
                if (this.table.addMode) {
                    const res = await apiClient.post(url, this.R_AddRequest);
                    if(res.status == 200){
                        ElNotification({
                            message: res.data.message,
                            type: 'success',
                        })
                    } else {
                        ElNotification({
                            message: res.data.message,
                            type: 'info',
                        })
                    }
                } else {
                    const res = await apiClient.put(url, this.R_UpdateRequest);
                    if(res.status == 200){
                        ElNotification({
                            message: res.data.message,
                            type: 'success',
                        })
                    } else {
                        ElNotification({
                            message: res.data.message,
                            type: 'info',
                        })
                    }
                }
            } catch (error:any) {
                ElNotification({
                    message: error,
                    type: 'error',
                })
            } finally {
                this.getEmployee();
                this.table.isSaveLoading = false;
                this.refreshForm();
            }
        },

        async deleteEmployee(){
            try {
                const url:string = `/employee`
                const res = await apiClient.delete(url, {data:this.R_DeleteRequest});
                if(res.status == 200){
                    ElNotification({
                        message: res.data.message,
                        type: 'success',
                    })
                } else {
                    ElNotification({
                        message: res.data.message,
                        type: 'info',
                    })
                }
            } catch (error:any) {
                ElNotification({
                    message: error,
                    type: 'error',
                })
            } finally {
                this.getEmployee();
                this.refreshForm();
            }
        },

        refreshForm(){
            this.formRequest.id = 0,
            this.formRequest.name = '',
            this.formRequest.gender = '',
            this.formRequest.email = '',
            this.formRequest.phone = '',
            this.formRequest.date_of_birth = '',
            this.formRequest.address = '',
            this.formRequest.department_id = '',
            this.formRequest.job_position_id = '' 
        }
    }
})