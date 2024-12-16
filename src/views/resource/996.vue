<script setup>
import { ref, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import ItemEqSelect from '@/components/ItemEqSelect.vue'
import GameNameSelect from '@/components/GameNameSelect.vue'
import GameZoneSelect from '@/components/GameZoneSelect.vue'
import GameDesignSelect from '@/components/GameDesignSelect.vue'
import * as batchMailBy996 from '@/utils/batchMailBy996.js'
const globalProperties = getCurrentInstance().appContext.config.globalProperties
let gameName = ref({
    op: '',
    ops: []
})
let gameZone = ref({
    op: '',
    ops: [],
    serverRadio: '2',
    loading: false
})
let itemOrEq = ref({
    op: [],
    ops: [],
    loading: false
})
let gameDesign = ref({
    name: '',
    designSelect: {
        op: [],
        ops: [],
        loading: false
    },
    itemOrEq: {
        op: [],
        ops: [],
        loading: false
    },
    gameName: {
        op: '',
        ops: []
    },
    quantity: 1,
    dialogVisible: false,
    outputText: '',
})
let queryResult = ref({
    dialogVisible: false,
    code: '',
    tableData: [
        {
            date: '2016-05-03',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
        },
        {
            date: '2016-05-02',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
        },
        {
            date: '2016-05-04',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
        },
        {
            date: '2016-05-01',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
        }
    ]
})
let quantity = ref(1)
let bindRadio = ref('1')
let sender = ref('GM')
let mailTitle = ref('1')
let mailContent = ref('1')
let sendLable = ref('bug补偿')
let sendLableOps = ref([{ id: 1, value: 'bug补偿' }, { id: 2, value: '反馈问题奖励' }, { id: 3, value: '官方通知' }, { id: 4, value: '活动奖励' }])
let reason = ref('GS资源申请')
let uploadUrl = ref('')
let uploadParam = ref({
    gameName: ''
})
let uploadList = ref([])
let inputRoles = ref('')
let outputText = ref('')
let batchProcCode = ref('')
const outerItemEqDesignRef = ref(null)
const outerGameDesignRef = ref(null)
const outerItemEqRef = ref(null)
const outerGameZoneRef = ref(null)
function getDesignReqRow() {
    return {
        gameDesign: gameDesign.value.name,
        itemOrEq: gameDesign.value.itemOrEq.op,
        quantity: gameDesign.value.quantity,
        outputText: gameDesign.value.outputText
    }
}
function getDataReqRow() {
    return {
        gameName: gameName.value.op,
        gameZone: gameZone.value.op,
        bindRadio: bindRadio.value,
        itemOrEq: itemOrEq.value.op,
        designName: gameDesign.value.designSelect.op,
        sender: sender.value,
        mailTitle: mailTitle.value,
        mailContent: mailContent.value,
        sendLable: sendLable.value,
        reason: reason.value,
        quantity: quantity.value,
        inputRoles: inputRoles.value,
        outputText: outputText.value
    }
}
function searchZoneParam() {
    let returnParam = { gameName: '', gameId: '' }
    let paramNotNull = globalProperties.$commUtil.isNotEmpty(gameName.value.op)
    if (paramNotNull) {
        returnParam.gameName = gameName.value.op.split('-')[0]
        returnParam.gameId = gameName.value.op.split('-')[1]
    }
    return returnParam
}
function searchItemParam() {
    let returnParam = { gameName: '' }
    let paramNotNull = globalProperties.$commUtil.isNotEmpty(gameName.value.op)
    if (paramNotNull) returnParam.gameName = gameName.value.op.split('-')[0]
    return returnParam
}
function submitDesign() {
    if (globalProperties.$commUtil.isEmpty(gameDesign.value.outputText)) {
        ElMessage.info('没有可提交的方案行！')
        return
    }
    let brn = gameDesign.value.name
    let brt = gameDesign.value.outputText
    let gn = gameName.value.op.split('-')[0]
    globalProperties.$http.post(
        "/Jiu96/saveItemDesign",
        { gameName: gn, batchReqName: brn, batchReqText: brt }
    ).then((res) => {
        let respData = res.data
        if (respData.code === 'S') {
            ElMessage.success(respData.data)
        } else {
            ElMessage.error(respData.msg)
        }
    }).catch((error) => {
        console.error(error)
        ElMessage.error('意料之外的错误：' + error)
    })
    gameDesign.value.name = ''
    outerItemEqDesignRef.value.clearSelectVal()
    gameDesign.value.quantity = 1
    gameDesign.value.outputText = ''
    gameDesign.value.dialogVisible = false
}
function optimizeDesign() {
    gameDesign.value.outputText = batchMailBy996.optimizeDesign(getDesignReqRow())
}
function addData() {
    let dataReqRow = getDataReqRow()
    let { hasError, hasDesign, hasItemEq } = batchMailBy996.checkInputRowNotNull(dataReqRow)
    if (hasError) return
    if (hasItemEq) outputText.value = batchMailBy996.generateBatchRows(10, dataReqRow)
    if (hasDesign) outputText.value = batchMailBy996.generateDesignRows(dataReqRow)
    outerGameDesignRef.value.clearSelectVal()
    outerItemEqRef.value.clearSelectVal()
    ElMessage.success('添加数据成功！')
}
function addDesign() {
    let designReqRow = getDesignReqRow()
    if (batchMailBy996.checkDesignRowNotNull(designReqRow)) return
    gameDesign.value.outputText = batchMailBy996.genItemDesign(designReqRow)
    outerItemEqDesignRef.value.clearSelectVal()
}
function optimizeData() {
    outputText.value = batchMailBy996.optimizeData(getDataReqRow())
}
function clearAllItems() {
    let gn = gameName.value.op.split('-')[0];
    globalProperties.$http.get(
        `/Jiu96/clearAll?gameName=${gn}`
    ).then((res) => {
        let respData = res.data
        if (respData.code === 'S') {
            ElMessage.success(respData.data)
        } else {
            ElMessage.error(respData.msg)
        }
    }).catch((error) => {
        console.log(error)
        ElMessage.error('意料之外的错误：' + error)
    })
}
function clickUpload() {
    uploadParam.value.gameName = gameName.value.op.split('-')[0]
    uploadUrl.value = axios.defaults.baseURL + '/Jiu96/uploadItems'
}
function uploadSuccess(respData) {
    if (respData.code === 'S') {
        ElMessage.success(respData.data)
    } else {
        ElMessage.error(respData.msg)
    }
}
function submitBatchData() {
    if (globalProperties.$commUtil.isEmpty(outputText.value)) {
        ElMessage.info('没有可供提交的数据行！')
        return
    }
    let gn = gameName.value.op.split('-')[0];
    let brt = outputText.value;
    globalProperties.$http.post(
        "/Jiu96/batchItemSend",
        { gameName: gn, batchReqText: brt }
    ).then((res) => {
        let respData = res.data
        if (respData.code === 'S') {
            let code = respData.data
            batchProcCode.value = code
            outerGameZoneRef.value.clearSelectVal()
            outerItemEqRef.value.clearSelectVal()
            quantity.value = 1
            inputRoles.value = ''
            outputText.value = ''
            ElMessage.success('邮件申请已经发送，点击<处理结果>按钮查询最近的邮件申请处理进度(' + code + ')')
        } else {
            ElMessage.error(respData.msg)
        }
    }).catch((error) => {
        console.error(error)
        ElMessage.error('意料之外的错误：' + error)
    })
}
function queryBatchResult() {
    queryResult.value.dialogVisible = true
    if (globalProperties.$commUtil.isEmpty(batchProcCode.value)) {
        ElMessage.info('该页面暂无批量申请记录！')
        return
    }
    let gn = gameName.value.op.split('-')[0];
    let code = batchProcCode.value
    globalProperties.$http.get(
        `/Jiu96/queryBatchMailStatus?gameName=${gn}&code=${code}`
    ).then((res) => {
        let respData = res.data
        if (respData.code === 'S') {
            let data = respData.data
            ElMessage.success(`处理码:${batchProcCode.value}，总数:${data.total}，成功数:${data.successCount}，失败数:${data.errorCount}`)
        } else {
            ElMessage.error(respData.msg)
        }
    }).catch((error) => {
        console.log(error)
        ElMessage.error('意料之外的错误：' + error)
    })
}
function copyOutput() {
    let copyText = outputText.value
    let rows = copyText.split('\n')
    rows.splice(rows.length - 1, 1)
    let newCopyText = ''
    rows.forEach(row => {
        let cols = row.split('\t')
        cols.splice(3, 0, ' ')
        newCopyText += (cols.join('\t') + '\n')
    })
    //调用复制方法
    globalProperties.$commUtil.copy(newCopyText)
}
function gameZoneOpChange(newGameZone) {
    gameZone.value = newGameZone
}
function gameNameOpChange(newGameName) {
    gameName.value = newGameName
}
function gameNameOpChanDesign(newGameName) {
    gameDesign.value.gameName = newGameName
}
function itemOrEqOpChange(newItemOrEq) {
    itemOrEq.value = newItemOrEq
}
function itemOrEqOpChanDesign(newItemOrEq) {
    gameDesign.value.itemOrEq = newItemOrEq
}
function itemDesignOpChange(newDesignSelect) {
    gameDesign.value.designSelect = newDesignSelect
}
</script>
<template>
    <div class="mailReqBox">
        <el-row>
            <el-col :span="5">
                <span class="font-label">游戏名称</span>
                <GameNameSelect @gameNameOpChange="gameNameOpChange" />
            </el-col>
            <el-col :span="6">
                <span class="font-label">区服名称</span>
                <GameZoneSelect ref="outerGameZoneRef" :search-zone-param="searchZoneParam()"
                    @gameZoneOpChange="gameZoneOpChange" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">装备道具</span>
                <ItemEqSelect ref="outerItemEqRef" :search-item-param="searchItemParam()"
                    @itemOrEqOpChange="itemOrEqOpChange" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">方案</span>
                <GameDesignSelect ref="outerGameDesignRef" :search-design-param="searchItemParam()"
                    @itemDesignOpChange="itemDesignOpChange" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">数量</span>
                <el-input v-model="quantity" type="number" style="width: 172px" size="small" />
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3">
                <el-radio-group v-model="bindRadio">
                    <el-radio value="1" size="small">绑定</el-radio>
                    <el-radio value="0" size="small">不绑定</el-radio>
                </el-radio-group>
            </el-col>
            <el-col :span="4">
                <span class="font-label">发件人</span>
                <el-input v-model="sender" style="width: 150px" size="small" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">邮标</span>
                <el-input v-model="mailTitle" style="width: 150px" size="small" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">内容</span>
                <el-input v-model="mailContent" style="width: 150px" size="small" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">标签</span>
                <el-select v-model="sendLable" size="small" style="width: 150px">
                    <el-option v-for="sendLableOp in sendLableOps" :key="sendLableOp.id" :label="sendLableOp.value"
                        :value="sendLableOp.id" />
                </el-select>
            </el-col>
            <el-col :span="5">
                <span class="font-label">理由</span>
                <el-input v-model="reason" style="width: 172px" size="small" />
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5">
                <el-input v-model="inputRoles" style="width: 275px" :rows="5" type="textarea" resize="none"
                    placeholder="<游戏角色列表格式>&#10;角色名称A&#10;角色名称B&#10;角色名称C&#10;......" />
            </el-col>
            <el-col :span="5">
                <el-button class="clearAllItemsBtn" type="primary" @click="clearAllItems">清空旧道具表</el-button>
                <el-upload name="uploadFile" accept=".xlsx,.xls" multiple limit="2" :file-list="uploadList"
                    :action="uploadUrl" :data="uploadParam" :on-success="uploadSuccess">
                    <el-button type="primary" @click="clickUpload">上传新道具表</el-button>
                    <template #tip>
                        <div class="el-upload__tip">
                            <span style="color: red;">先清理旧数据表，再多选上传道具+装备ID表</span>
                        </div>
                    </template>
                </el-upload>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="addData">添加数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="optimizeData">压缩数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="copyOutput">复制输出</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="submitBatchData">提交数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="queryBatchResult">处理结果</el-button>
                <el-dialog v-model="queryResult.dialogVisible" width="80%" title="处理结果">
                    <div class="queryResultBox">
                        <el-row>
                            <el-col :span="6">
                                <span class="font-label">处理码</span>
                                <el-input v-model="queryResult.code" style="width: 200px" size="small" disabled />
                            </el-col>
                            <el-col :span="6">
                                <span class="font-label">总条数</span>
                                <el-input v-model="queryResult.code" style="width: 200px" size="small" disabled />
                            </el-col>
                            <el-col :span="6">
                                <span class="font-label">成功数</span>
                                <el-input v-model="queryResult.code" style="width: 200px" size="small" disabled />
                            </el-col>
                            <el-col :span="6">
                                <span class="font-label">失败数</span>
                                <el-input v-model="queryResult.code" style="width: 200px" size="small" disabled />
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-table :data="queryResult.tableData" style="width: 100%">
                                    <el-table-column prop="date" label="Date" width="180" />
                                    <el-table-column prop="name" label="Name" width="180" />
                                    <el-table-column prop="address" label="Address" />
                                </el-table>
                            </el-col>
                        </el-row>
                    </div>
                </el-dialog>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="gameDesign.dialogVisible = true">新建方案</el-button>
                <el-dialog v-model="gameDesign.dialogVisible" width="80%" title="新建方案">
                    <div class="createDesignBox">
                        <el-row>
                            <el-col :span="6">
                                <span class="font-label">游戏名称</span>
                                <GameNameSelect @gameNameOpChange="gameNameOpChanDesign" />
                            </el-col>
                            <el-col :span="5">
                                <span class="font-label">方案名称</span>
                                <el-input v-model="gameDesign.name" placeholder="请输入方案名" style="width: 200px"
                                    size="small" />
                            </el-col>
                            <el-col :span="5">
                                <span class="font-label">装备道具</span>
                                <ItemEqSelect ref="outerItemEqDesignRef" :search-item-param="searchItemParam()"
                                    @itemOrEqOpChange="itemOrEqOpChanDesign" />
                            </el-col>
                            <el-col :span="4">
                                <span class="font-label">数量</span>
                                <el-input v-model="gameDesign.quantity" type="number" style="width: 100px"
                                    size="small" />
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" size="small" @click="addDesign">添加</el-button>
                                <el-button type="primary" size="small" @click="optimizeDesign">压缩</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-input v-model="gameDesign.outputText" style="width: 1350px" :rows="10"
                                    type="textarea" resize="none" placeholder="输出预设方案道具行" />
                            </el-col>
                        </el-row>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="gameDesign.dialogVisible = false" size="small">取 消</el-button>
                        <el-button type="primary" @click="submitDesign" size="small">确 定</el-button>
                    </div>
                </el-dialog>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-input v-model="outputText" style="width: 1500px" :rows="30" type="textarea" resize="none"
                    placeholder="输出批量申请行" />
            </el-col>
        </el-row>
    </div>
</template>

<style lang="less" scoped>
.mailReqBox {
    padding: 15px;
}

.clearAllItemsBtn {
    margin-bottom: 5px;
}
</style>