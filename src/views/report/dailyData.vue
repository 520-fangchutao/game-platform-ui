<script>
import { ElMessage } from 'element-plus';
import axios from 'axios';
export default {
    data() {
        return {
            reportDate: '',
            uploadUrl: '',
            pullBtnStatus: false,
            dialogVisible: false,
            fileName: '',
            uploadDate: '',
            outputText: ''
        }
    },
    methods: {
        uploadGameList() {
            this.uploadUrl = axios.defaults.baseURL + '/report/uploadGameList'
        },
        uploadSuccess(respData) {
            if (respData.code === 'S') {
                ElMessage.success(respData.data)
            } else {
                ElMessage.error(respData.msg)
            }
        },
        queryUpload(){
            this.dialogVisible = true
            this.$http.get('/report/queryUploadGameList').then((res) => {
                let respData = res.data
                if (respData.code === 'S') {
                    let data = respData.data
                    this.fileName = data.fileName
                    this.uploadDate = data.uploadDate
                    this.outputText = data.text
                } else {
                    ElMessage.error(respData.msg)
                }
            }).catch((error) => {
                console.log(error)
                ElMessage.error('意料之外的错误：' + error)
            })
        },
        pullReportData() {
            this.pullBtnStatus = true
            const formData = new FormData();
            let date = this.$moment(this.reportDate).format('YYYY-MM-DD')
            formData.append('date', date)
            this.$http.post(
                "/report/generateReport",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then((res) => {
                this.pullBtnStatus = false
                let respData = res.data
                if (respData.code === 'S') {
                    this.$copyText(respData.data).then(
                        function (e) {
                            ElMessage.success('数据已经复制到剪切板！')
                        },
                        function (e) {
                            ElMessage.error('复制失败!')
                        }
                    )
                } else {
                    ElMessage.error(respData.msg)
                }
            }).catch((error) => {
                console.error(error)
                ElMessage.error('意料之外的错误：' + error)
            })
            ElMessage.success('拉取数据请求已经发出，请耐心等待处理结果！')
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
                <el-upload name="gameListFile" accept=".txt" limit="1" :show-file-list="false" :action="uploadUrl"
                    :on-success="uploadSuccess">
                    <el-button type="primary" @click="uploadGameList">上传游戏列表</el-button>
                </el-upload>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="queryUpload">查看上传列表</el-button>
                <el-dialog v-model="dialogVisible" width="80%" title="查看上传">
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
                                <el-input v-model="outputText" style="width: 1350px" :rows="30"
                                    type="textarea" resize="none" disabled />
                            </el-col>
                        </el-row>
                    </div>
                </el-dialog>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" :disabled="pullBtnStatus" @click="pullReportData">拉取数据</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="less" scoped></style>