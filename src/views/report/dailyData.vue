<script>
import { ElMessage } from 'element-plus';
import axios from 'axios';
export default {
    data() {
        return {
            reportDate: '',
            uploadUrl: ''
        }
    },
    methods: {
        uploadGameList(){
            this.uploadUrl = axios.defaults.baseURL + '/report/uploadGameList'
        },
        uploadSuccess(respData) {
            if (respData.code === 'S') {
                ElMessage.success(respData.data)
            } else {
                ElMessage.error(respData.msg)
            }
        },
        pullReportData(){
            
        }
    },
    mounted() {
        this.reportDate = new Date()
    }
}
</script>

<template>
    <div class="reportBox">
        <el-row>
            <el-col :span="5">
                <div class="block">
                    <span class="font-label">统计当日</span>
                    <el-date-picker v-model="reportDate" type="date" placeholder="选择日期" size="small" />
                </div>
            </el-col>
            <el-col :span="2">
                <el-upload name="gameListFile" accept=".txt" limit="1" :show-file-list="false" :action="uploadUrl" :on-success="uploadSuccess">
                    <el-button type="primary" @click="uploadGameList">上传游戏列表</el-button>
                </el-upload>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="clickUpload">查看上传列表</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="pullReportData">拉取数据</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="less" scoped></style>