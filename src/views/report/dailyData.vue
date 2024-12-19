<script setup>
import { ref, getCurrentInstance,onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import moment from 'moment';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const globalProperties = getCurrentInstance().appContext.config.globalProperties
let reportDate = ref('')
let uploadUrl = ref('')
let pullBtnStatus = ref(false)
let dialogVisible = ref(false)
let fileName = ref('')
let uploadDate = ref('')
let outputText = ref('')
let outputRes = ref('')
let downloadExcelUrl = ref('')
let downloadExcelPicUrl = ref('')
function uploadGameList() {
    uploadUrl.value = axios.defaults.baseURL + '/report/uploadGameList'
}
function uploadSuccess(respData) {
    if (respData.code === 'S') {
        ElMessage.success(respData.data)
    } else {
        ElMessage.error(respData.msg)
    }
}
function queryUpload() {
    dialogVisible.value = true
    globalProperties.$http.get('/report/queryUploadGameList').then((res) => {
        let respData = res.data
        if (respData.code === 'S') {
            let data = respData.data
            fileName.value = data.fileName
            uploadDate.value = data.uploadDate
            outputText.value = data.text
        } else {
            ElMessage.error(respData.msg)
        }
    }).catch((error) => {
        console.log(error)
        ElMessage.error('意料之外的错误：' + error)
    })
}
function pullReportData() {
    pullBtnStatus.value = true
    const formData = new FormData();
    let date = moment(reportDate.value).format('YYYY-MM-DD')
    formData.append('date', date)
    globalProperties.$http.post(
        "/report/generateReport",
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    ).then((res) => {
        pullBtnStatus.value = false
        let respData = res.data
        if (respData.code === 'S') {
            if(respData.data.includes('http')){
                downloadExcelPicUrl.value = respData.data.split('\n')[0]
                downloadExcelUrl.value = respData.data.split('\n')[1]
            }else{
                outputRes.value = respData.data
            }
        } else {
            ElMessage.error(respData.msg)
        }
    }).catch((error) => {
        console.error(error)
        ElMessage.error('意料之外的错误：' + error)
    })
    ElMessage.success('拉取数据请求已经发出，请耐心等待处理结果！')
}
function copyResult() {
    globalProperties.$commUtil.copy(outputRes.value)
}
function copyTemplateSign(){
    globalProperties.$commUtil.copy('{.zcNum}	{.active}	{.payMoney}	{.payUsers}	{.rate}	{.newMoney}	{.arpu}	{.arppu}	{.regPay}')
}
function lookPicture(){
    window.open(downloadExcelPicUrl.value, '_blank')
}
function downloadExcel(){
    window.open(downloadExcelUrl.value, '_blank')
}
onMounted(() => {
    reportDate.value = new Date()
})
</script>
<template>
    <div class="reportBox">
        <el-row>
            <el-col :span="5">
                <div class="block">
                    <span class="font-label">统计当日</span>
                    <el-config-provider :locale="zhCn">
                        <el-date-picker v-model="reportDate" type="date" placeholder="选择日期" size="small" />
                    </el-config-provider>
                </div>
            </el-col>
            <el-col :span="2">
                <el-upload name="gameListFile" accept=".txt,.xlsx" limit="1" :show-file-list="false" :action="uploadUrl"
                    :on-success="uploadSuccess">
                    <el-button type="primary" size="small" @click="uploadGameList">上传游戏列表</el-button>
                </el-upload>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" size="small" @click="queryUpload">查看上传列表</el-button>
                <el-dialog v-model="dialogVisible" width="75%" title="查看上传">
                    <div class="queryGameListBox">
                        <el-row>
                            <el-col :span="5">
                                <span class="font-label">上传文件</span>
                                <el-input v-model="fileName" disabled style="width: 200px" size="small" />
                            </el-col>
                            <el-col :span="5">
                                <span class="font-label">上传时间</span>
                                <el-input v-model="uploadDate" disabled style="width: 200px" size="small" />
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-input v-model="outputText" style="width: 1350px" :rows="30" type="textarea"
                                    resize="none" disabled />
                            </el-col>
                        </el-row>
                    </div>
                </el-dialog>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" size="small" :disabled="pullBtnStatus" @click="pullReportData">拉取数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" size="small" @click="copyResult">复制结果</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" size="small" @click="copyTemplateSign">模板占位符</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="9">
                <el-input v-model="downloadExcelPicUrl" style="width: 600px" size="small" />
            </el-col>
            <el-col :span="4">
                <el-button type="primary" size="small" @click="lookPicture">查看图片</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="9">
                <el-input v-model="downloadExcelUrl" style="width: 600px" size="small" />
            </el-col>
            <el-col :span="4">
                <el-button type="primary" size="small" @click="downloadExcel">下载文件</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-input v-model="outputRes" style="width: 726px" :rows="30" type="textarea" resize="none" disabled />
            </el-col>
        </el-row>
    </div>
</template>

<style lang="less" scoped>
.reportBox {
    padding: 15px;
}
</style>