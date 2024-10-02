<template>
    <section>
        <div style="height: 100vh;" class="d-flex justify-content-center header align-items-center">
            <el-card style="width: 45vw">
                <div class="text-center">
                    <h2 class="fw-semibold">Sign In</h2>
                    <div class="fw-semibold text-secondary">Login to access the application.</div>
                </div>
                <el-form
                    ref="ruleFormRef"
                    :model="request"
                    :rules="rules"
                    label-width="auto"
                    class="demo-ruleForm"
                    status-icon
                >
                    <div class="mt-4">
                        <el-form-item prop="email">
                            <el-input type="gmail" size="large" v-model="request.email" placeholder="Email"/>
                        </el-form-item>
                    </div>
                    <div class="mt-4">
                        <el-form-item prop="password">
                            <el-input type="password" size="large" v-model="request.password" placeholder="Password"/>
                        </el-form-item>
                    </div>
                    <el-button type="primary" size="large" style="width: 100%; margin-top: 30px;" :loading="isLoading" @click="submitForm(ruleFormRef)">
                        {{ isLoading ? 'Please wait...' : 'Sign In' }}
                    </el-button>
                </el-form>
            </el-card>
        </div>

    </section>
</template>

<script setup lang="ts">
    import { ref,reactive } from 'vue'
    import { ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
    import { IAuthLoginRequest } from '../../stores/auth/auth-types';
    import { loginService } from '../../stores/auth/auth-store';
    import { setProfile, setToken } from '../../stores/global';
    import router from '../../router';

    const ruleFormRef = ref<FormInstance>();
    const request = ref({
        email: "user.test@bayarind.id",
        password: ""
    })
    const isLoading = ref<boolean>(false);

    const rules = reactive<FormRules<IAuthLoginRequest>>({
        email: [
            { required: true, message: 'Please input your email!', trigger: 'change' },
        ],
        password: [
            { required: true, message: 'Please input your password!', trigger: 'change' },
        ]
    })

    const submitForm = async(formEl: FormInstance | undefined) => {
        if(!formEl) return;
        await formEl.validate(async (valid) => {
            if (valid) {
                console.log('valid')
                try {
                    isLoading.value = true; 
                    const res = await loginService(request.value);
                    if(res?.status){
                        setToken(res.data.token);
                        setProfile(JSON.stringify(res.data.user_data))
                        ElMessageBox.confirm(
                            'Successfully to sign in!',
                            'Success',
                            {
                                confirmButtonText: 'OK',
                                type: 'success',
                                center: true,
                                showCancelButton: false,
                                showClose:false,
                                distinguishCancelAndClose: false
                            }
                        ).then(() => {
                            router.push('/Employee');
                        })
                    }
                } catch (error:any) {
                    ElMessageBox.confirm(
                        'Failed to sign in!',
                        error,
                        {
                            confirmButtonText: 'OK',
                            type: 'success',
                            center: true,
                            showCancelButton: false,
                            showClose:false,
                            distinguishCancelAndClose: false
                        }
                    )
                } finally {
                    isLoading.value = false;
                }
            } else {
                console.log('gak valid')
            }
        })
    }
</script>