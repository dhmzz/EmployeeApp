<template>
    <section class="d-flex justify-content-center align-items-center w-100">
        <div style="width: 90%;">
            <div class="d-flex justify-content-end gap-2 mt-4">
                <el-dropdown placement="bottom-start">
                <el-button circle :icon="User" size="large"></el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item class="text-center">{{ profileData?.name || '-' }}</el-dropdown-item>
                            <el-dropdown-item class="text-center">{{ profileData?.email || '-' }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-tooltip
                    class="box-item"
                    content="Click and look at the last row of the table!"
                    placement="bottom"
                >
                    <el-popconfirm 
                        title="Are you sure you want to quit from application"
                        width="300"
                        @confirm="handleLogOut"
                    >
                    <template #reference>
                        <el-button circle :icon="CloseBold" size="large"></el-button>
                    </template>
                    </el-popconfirm>
                </el-tooltip>
            </div>
            <el-card class="w-100 mt-4">
                <el-input placeholder="Enter to search the data" v-model="EmployeeStore.inquiryRequest.search" @keyup.enter="EmployeeStore.getEmployee"/>
                <div class="d-flex justify-content-start gap mt-4">
                    <el-tooltip
                        class="box-item"
                        content="Click and look at the last row of the table!"
                        placement="top-start"
                    >
                        <el-button type="primary" :icon="Plus" @click="onAddData()" :disabled="(EmployeeStore.table.addMode || EmployeeStore.table.editMode)"> 
                            Add Row
                        </el-button>
                    </el-tooltip>
                    <el-tooltip
                        class="box-item"
                        content="Please select data by clicking on the row table to edit the data"
                        placement="top-start"
                    >
                    <el-button type="warning" :icon="Edit" :disabled="EmployeeStore.table.employeeSelected == null || (EmployeeStore.table.addMode || EmployeeStore.table.editMode)" @click="onEditData()"> 
                        Edit
                    </el-button>
                    </el-tooltip>
                    <el-tooltip
                        class="box-item"
                        content="Please select data by clicking on the row table to delete the data"
                        placement="top-start"
                    >
                        <el-popconfirm 
                            :title="'Are you sure you will delete the employee data with the name ' + EmployeeStore.table.employeeSelected?.name"
                            width="300"
                            @confirm="handleDeleteData"
                        >
                            <template #reference>
                            <el-button type="danger" :icon="Delete" :disabled="EmployeeStore.table.employeeSelected == null || (EmployeeStore.table.addMode || EmployeeStore.table.editMode)"> 
                                Delete
                            </el-button>
                            </template>
                        </el-popconfirm>
                    </el-tooltip>
                </div>
            </el-card>

            <el-card class="w-100 mt-4">
                <el-form
                    ref="ruleFormRef"
                    :model="EmployeeStore.formRequest"
                    :rules="rules"
                    label-width="auto"
                    class="demo-ruleForm"
                    status-icon
                >
                    <el-text size="small">{{tableInfo()}}</el-text>
                    <el-table 
                        :data="EmployeeStore.table.employeeDatas" 
                        size="small"
                        :hover="false"
                        border
                        :highlight-current-row="!EmployeeStore.table.addMode && !EmployeeStore.table.editMode"
                        @current-change="handleCurrentChange"
                        ref="singleTableRef"
                        max-height="60vh"
                        :row-class-name="tableRowClassName"
                        v-loading="EmployeeStore.table.isLoading"
                    >
                        <el-table-column header-align="center" label="No" type="index" :index="indexMethod"fixed align="center"/>
                        <el-table-column header-align="center" label="Name" width="200" fixed>
                            <template #default="{row}">
                                <div class="d-flex justify-content-center align-items-center my-0" v-if="(EmployeeStore.table.addMode && row.id == 0) || (EmployeeStore.table.editMode && row.id == EmployeeStore.table.employeeSelected?.id)">
                                    <el-form-item class="mt-3" prop="name" required>
                                        <el-input placeholder="Employee Name" v-model="EmployeeStore.formRequest.name"/>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    {{ row.name }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="Email" width="200">
                            <template #default="{row}">
                                <div class="d-flex justify-content-center align-items-center my-0" v-if="(EmployeeStore.table.addMode && row.id == 0) || (EmployeeStore.table.editMode && row.id == EmployeeStore.table.employeeSelected?.id)">
                                    <el-form-item class="mt-3" prop="email" required>
                                        <el-input placeholder="Email" v-model="EmployeeStore.formRequest.email"/>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    {{ row.email }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="Address" width="400"> 
                            <template #default="{row}">
                                <div class="d-flex justify-content-center align-items-center my-0" v-if="(EmployeeStore.table.addMode && row.id == 0) || (EmployeeStore.table.editMode && row.id == EmployeeStore.table.employeeSelected?.id)">
                                    <el-form-item class="mt-3" prop="email" required style="width: 100% !important;">
                                        <el-input placeholder="Address" v-model="EmployeeStore.formRequest.address"/>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    {{ row.address }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="Gender" width="100" align="center">
                            <template #default="{row}">
                                <div class="d-flex justify-content-center align-items-center my-0" v-if="(EmployeeStore.table.addMode && row.id == 0) || (EmployeeStore.table.editMode && row.id == EmployeeStore.table.employeeSelected?.id)">
                                    <el-form-item class="mt-3" prop="gender" style="width: 100% !important;">
                                        <el-select v-model="EmployeeStore.formRequest.gender" placeholder="Gender"> 
                                            <el-option label="Male" value="male"/>
                                            <el-option label="Female" value="female"/>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    <el-tooltip
                                        class="box-item"
                                        :content="row.gender == 'male' ? 'Male' : 'Female'"
                                        placement="top-start"
                                    >
                                        <el-icon v-if="row.gender == 'male'" size="large" color="#4298f5">
                                            <Male />
                                        </el-icon>
                                        <el-icon v-else-if="row.gender == 'female'" size="large" color="#f26183">
                                            <Female />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="Phone" width="200" align="center">
                            <template #default="{row}">
                                <div class="d-flex justify-content-center align-items-center my-0" v-if="(EmployeeStore.table.addMode && row.id == 0) || (EmployeeStore.table.editMode && row.id == EmployeeStore.table.employeeSelected?.id)">
                                    <el-form-item class="mt-3" prop="phone" required style="width: 100%;">
                                        <el-input type="text" placeholder="Phone number" @input="handleInputPhone" v-model="EmployeeStore.formRequest.phone" maxlength="10"/>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    {{ row.phone }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="Date of Birth" width="200" align="center">
                            <template #default="{row}">
                                <div class="d-flex justify-content-center align-items-center my-0" v-if="(EmployeeStore.table.addMode && row.id == 0) || (EmployeeStore.table.editMode && row.id == EmployeeStore.table.employeeSelected?.id)">
                                    <el-form-item class="mt-3" prop="date_of_birth" style="width: 100%;">
                                        <el-date-picker value-format="YYYY-MM-DD" format="DD MMM YYYY" placeholder="Date of Birth" v-model="EmployeeStore.formRequest.date_of_birth"/>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    {{ row.date_of_birth != null ? dateFormatted(row.date_of_birth) : '-' }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="Departement" width="150" align="center">
                            <template #default="{row}">
                                <div class="d-flex justify-content-center align-items-center my-0" v-if="(EmployeeStore.table.addMode && row.id == 0) || (EmployeeStore.table.editMode && row.id == EmployeeStore.table.employeeSelected?.id)">
                                    <el-form-item class="mt-3" prop="department_id" style="width:100%;" required>
                                        <el-select v-model="EmployeeStore.formRequest.department_id" placeholder="Departement">
                                            <el-option 
                                                v-for="item in EmployeeStore.table.departementOptions"
                                                :label="item.title"
                                                :value="item.id.toString()"
                                                :key="item.id"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    {{ row.departement }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="Position" width="150" align="center">
                            <template #default="{row}">
                                <div class="d-flex justify-content-center align-items-center my-0" v-if="(EmployeeStore.table.addMode && row.id == 0) || (EmployeeStore.table.editMode && row.id == EmployeeStore.table.employeeSelected?.id)">
                                    <el-form-item class="mt-3" prop="job_position_id" style="width:100%;" required>
                                        <el-select v-model="EmployeeStore.formRequest.job_position_id" placeholder="Departement">
                                            <el-option 
                                                v-for="item in EmployeeStore.table.positionOptions"
                                                :label="item.title"
                                                :value="item.id.toString()"
                                                :key="item.id"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div v-else> 
                                    {{ row.position }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="Status" width="150" align="center">
                            <template #default="{row}">
                                <el-tag type="success" v-if="row.status == 'active'">Active</el-tag>
                                <el-tag type="warning" v-else-if="row.status == 'inactive'">Inactive</el-tag>
                                <el-tag v-else>?</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>

                <div class="d-flex justify-content-between mt-2">
                    <div v-if="EmployeeStore.table.addMode || EmployeeStore.table.editMode" class="mt-4">
                        <el-button @click="handleCancelActionMode">Cancel</el-button>
                        <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="EmployeeStore.table.isSaveLoading">{{ EmployeeStore.table.isSaveLoading ? 'Please wait...' : 'Save' }}</el-button>
                    </div>
                    <div v-else></div>
                    <el-pagination
                        v-model:current-page="EmployeeStore.inquiryRequest.page"
                        v-model:page-size="EmployeeStore.inquiryRequest.limit"
                        :page-sizes="[10, 20, 50, 100]"
                        :disabled="EmployeeStore.table.addMode || EmployeeStore.table.editMode"
                        :total="EmployeeStore.table.dataCount"
                        layout="sizes, prev, pager, next, jumper"
                        background
                        @size-change="() => EmployeeStore.getEmployee()"
                        @current-change="EmployeeStore.getEmployee()"
                        size="small"
                    />
                </div>
            </el-card>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { onMounted, reactive, ref } from 'vue'; 
    import { useEmployeeStore } from '../../stores/employee/employee-store';
    import { CloseBold, Delete, Edit, Female, Plus, User } from '@element-plus/icons-vue'
    import { IEmployee, IEmployeeRequest } from '../../stores/employee/employee-types';
    import { ElMessage, ElTable, FormInstance, FormRules } from 'element-plus';
    import { logoutService } from '../../stores/auth/auth-store';
    import { getProfile } from '../../stores/global';
    import { IAuthUserData } from '../../stores/auth/auth-types';

    const EmployeeStore = useEmployeeStore();
    const ruleFormRef = ref<FormInstance>();
    const singleTableRef = ref<InstanceType<typeof ElTable>>()
    const profileData = ref<IAuthUserData>()

    const dateFormatted = (dateString:string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).replace(/ /g, '-');
    }

    const indexMethod = (index: number) => {
      return (EmployeeStore.inquiryRequest.page - 1) * EmployeeStore.inquiryRequest.limit + index + 1;
    };

    const handleCurrentChange = (val: IEmployee | undefined) => {
        if(val && !EmployeeStore.table.addMode && !EmployeeStore.table.editMode)
        EmployeeStore.table.employeeSelected = val
    }

    const onAddData = () => {
        const placeholder:IEmployee = {
            id: 0,
            address: '',
            name: 'ADDMODE',
            date_of_birth: '',
            departement: '',
            email: '',
            gender: '',
            phone: '',
            position: '',
            status: ''
        };
        EmployeeStore.table.employeeDatas.push(placeholder);
        EmployeeStore.table.addMode = true;
    }

    const onEditData = () => {
        EmployeeStore.table.editMode = true;

        // set data selected to form 
        const data = EmployeeStore.table.employeeSelected;
        if(data && data.id){
            EmployeeStore.formRequest.id = data?.id;
            EmployeeStore.formRequest.name = data?.name;
            EmployeeStore.formRequest.address = data?.address;
            EmployeeStore.formRequest.email = data?.email;
            EmployeeStore.formRequest.gender = data?.gender;
            EmployeeStore.formRequest.job_position_id = EmployeeStore.table.positionOptions.find(item => item.title == data.position)?.id.toString() || '' ;
            EmployeeStore.formRequest.department_id = EmployeeStore.table.departementOptions.find(item => item.title == data.departement)?.id.toString() || '' ;
            EmployeeStore.formRequest.date_of_birth = data.date_of_birth;
            EmployeeStore.formRequest.phone = data.phone;
        }
    }

    const rules = reactive<FormRules<IEmployeeRequest>>({
        name: [
            { required: true, message: 'Name is required!', trigger: 'blur' },
        ],
        address: [
            { required: true, message: 'Address is required!', trigger: 'blur' },
        ],
        date_of_birth: [
            { required: true, message: 'Date of birth is required!', trigger: 'blur' },
        ],
        department_id: [
            { required: true, message: 'Departement is required!', trigger: 'change' },
        ],
        email: [
            { required: true, message: 'Email is required!', trigger: 'blur' },
            { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'],
        },
        ], 
        gender: [
            { required: true, message: 'Gender is required!', trigger: 'change' },
        ],
        phone: [
            { required: true, message: 'Phone number is required!', trigger: 'blur' },
        ],
        job_position_id: [
            { required: true, message: 'Position number is required!', trigger: 'change' },
        ]
    })

    const handleInputPhone = () => {
        const formatted = EmployeeStore.formRequest.phone.replace(/\D/g, '');
        EmployeeStore.formRequest.phone = formatted;
    }

    const handleCancelActionMode = () => {
        if(EmployeeStore.table.addMode){
            EmployeeStore.table.employeeDatas.pop();
            EmployeeStore.refreshForm()

            EmployeeStore.table.addMode = false;
        } else {
            EmployeeStore.refreshForm()

            EmployeeStore.table.editMode = false;
        }
    }

    const submitForm = async(formEl: FormInstance | undefined) => {
        if(!formEl) return;
        await formEl.validate(async (valid, fields:any) => {
            if (valid) {
                try {
                    await EmployeeStore.saveEmployee();
                    handleCancelActionMode();
                } catch (error:any) {
                } finally {
                }
            } else {
                Object.keys(fields).forEach((key) => {
                    const errorDetails = fields[key];
                    errorDetails.forEach((error:any) => {
                        ElMessage({
                            message: error.message,
                            type: 'warning',
                        })
                    });
                });
            }
        })
    }

    const handleDeleteData = async() => {
        EmployeeStore.formRequest.id = EmployeeStore.table.employeeSelected?.id || 0
        await EmployeeStore.deleteEmployee();
    }

    const tableRowClassName = ({
        row
    }:{
        row: IEmployee
    }) => {
        if (EmployeeStore.table.addMode && row.id != 0) {
            return 'secondary-row'
        } else if (EmployeeStore.table.editMode && row.id != EmployeeStore.formRequest.id) {
            return 'secondary-row'
        }
        return ''
    }

    const tableInfo = (): string => {
        const start = (EmployeeStore.inquiryRequest.page - 1) * EmployeeStore.inquiryRequest.limit + 1;
        const end = Math.min(EmployeeStore.inquiryRequest.page * EmployeeStore.inquiryRequest.limit, EmployeeStore.table.dataCount);
        
        return `Show ${start} - ${end} of ${EmployeeStore.table.dataCount} rows`;
    }

    const handleLogOut = async() => {
        await logoutService();
    }

    onMounted(async() => {
        // set profile 
        const profileString = getProfile();
        profileData.value = JSON.parse(profileString || '');

        await EmployeeStore.getEmployee();
        await EmployeeStore.getDepartement();
        await EmployeeStore.getJobPosition();
    })
</script>

<style>
    .secondary-row {
        background-color: #c9c5c5 !important;
        transition: 0.5s;
    }
    .secondary-row:hover > td{
        background-color: #c9c5c5 !important;
    }
</style>