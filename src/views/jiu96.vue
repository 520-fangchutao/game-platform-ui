<script>
import GameNameSelect from '@/components/GameNameSelect.vue'
import GameZoneSelect from '@/components/GameZoneSelect.vue'
import ItemEqSelect from '@/components/ItemEqSelect.vue'
import GameDesignSelect from '@/components/GameDesignSelect.vue'
export default {
    components: {
        ItemEqSelect,
        GameNameSelect,
        GameZoneSelect,
        GameDesignSelect
    },
    data() {
        return {
            gameName: {
                op: '',
                ops: []
            },
            gameZone: {
                op: '',
                ops: [],
                serverRadio: '2',
                loading: false
            },
            itemOrEq: {
                op: [],
                ops: [],
                loading: false
            },
            gameDesign: {
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
            },
            quantity: 1,
            bindRadio: '1',
            sender: 'GM',
            mailTitle: '1',
            mailContent: '1',
            sendLable: 'bug补偿',
            sendLableOps: [{ id: 1, value: 'bug补偿' }, { id: 2, value: '反馈问题奖励' }, { id: 3, value: '官方通知' }, { id: 4, value: '活动奖励' }],
            reason: 'GS资源申请',
            uploadUrl: '',
            uploadParam: {
                gameName: ''
            },
            uploadList: [],
            inputRoles: '',
            outputText: '',
            batchProcCode: ''
        }
    },
    methods: {
        getDesignReqRow(){
            return {
                gameDesign: this.gameDesign.name,
                itemOrEq: this.gameDesign.itemOrEq.op,
                quantity: this.gameDesign.quantity,
                outputText: this.gameDesign.outputText
            }
        },
        getDataReqRow() {
            return {
                gameName: this.gameName.op,
                gameZone: this.gameZone.op,
                bindRadio: this.bindRadio,
                itemOrEq: this.itemOrEq.op,
                designName: this.gameDesign.designSelect.op,
                sender: this.sender,
                mailTitle: this.mailTitle,
                mailContent: this.mailContent,
                sendLable: this.sendLable,
                reason: this.reason,
                quantity: this.quantity,
                inputRoles: this.inputRoles,
                outputText: this.outputText
            }
        },
        searchZoneParam() {
            return {
                gameName: (this.gameName.op === undefined) ? '' : this.gameName.op.split('-')[0],
                gameId: (this.gameName.op === undefined) ? '' : this.gameName.op.split('-')[1]
            }
        },
        searchItemParam() {
            return { gameName: (this.gameName.op === undefined) ? '' : this.gameName.op.split('-')[0] }
        },
        submitDesign() {
            if (this.gameDesign.outputText.trim().length === 0) {
                ElMessage.info('没有可提交的方案行！')
                return
            }
            let batchReqName = this.gameDesign.name
            let batchReqText = this.gameDesign.outputText
            let gameName = this.gameName.op.split('-')[0]
            this.$http.post(
                "/Jiu96/saveItemDesign",
                { gameName: gameName, batchReqName: batchReqName, batchReqText: batchReqText }
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
            this.gameDesign.name = ''
            this.$refs.outerItemEqDesignRef.clearSelectVal()
            this.gameDesign.quantity = 1
            this.gameDesign.outputText = ''
            this.gameDesign.dialogVisible = false
        },
        optimizeDesign(){
            this.gameDesign.outputText = batchMailBy996.optimizeDesign(this.getDesignReqRow())
        },
        addDesign() {
            let designReqRow = this.getDesignReqRow()
            if(batchMailBy996.checkDesignRowNotNull(designReqRow)) return
            this.gameDesign.outputText = batchMailBy996.genItemDesign(designReqRow)
            this.$refs.outerItemEqDesignRef.clearSelectVal()
        },
        gameZoneOpChange(gameZone) {
            this.gameZone = gameZone
        },
        gameNameOpChange(gameName) {
            this.gameName = gameName
        },
        gameNameOpChanDesign(gameName) {
            this.gameDesign.gameName = gameName
        },
        itemOrEqOpChange(itemOrEq) {
            this.itemOrEq = itemOrEq
        },
        itemOrEqOpChanDesign(itemOrEq) {
            this.gameDesign.itemOrEq = itemOrEq
        },
        itemDesignOpChange(designSelect) {
            this.gameDesign.designSelect = designSelect
        },
        clearAllItems() {
            let gameName = this.gameName.op.split('-')[0];
            this.$http.get(
                `/Jiu96/clearAll?gameName=${gameName}`
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
        },
        clickUpload() {
            //上传提交参数
            this.uploadParam.gameName = this.gameName.op.split('-')[0]
            this.uploadUrl = axios.defaults.baseURL + '/Jiu96/uploadItems'
        },
        uploadSuccess(respData) {
            if (respData.code === 'S') {
                ElMessage.success(respData.data)
            } else {
                ElMessage.error(respData.msg)
            }
        },
        addData() {
            let dataReqRow = this.getDataReqRow()
            let {hasError,hasDesign,hasItemEq} = batchMailBy996.checkInputRowNotNull(dataReqRow)
            if (hasError) return
            if (hasItemEq) this.outputText = batchMailBy996.generateBatchRows(10,dataReqRow)
            if (hasDesign) this.outputText = batchMailBy996.generateDesignRows(dataReqRow)
            this.$refs.outerGameDesignRef.clearSelectVal()
            this.$refs.outerItemEqRef.clearSelectVal()
            ElMessage.success('添加数据成功！')
        },
        optimizeData(){
            this.outputText = batchMailBy996.optimizeData(this.getDataReqRow())
        },
        submitBatchData() {
            if (this.outputText.trim().length === 0) {
                ElMessage.info('没有可供提交的数据行！')
                return
            }
            let gameName = this.gameName.op.split('-')[0];
            let batchReqText = this.outputText;
            this.$http.post(
                "/Jiu96/batchItemSend",
                { gameName: gameName, batchReqText: batchReqText }
            ).then((res) => {
                let respData = res.data
                if (respData.code === 'S') {
                    let code = respData.data
                    this.batchProcCode = code
                    this.$refs.outerGameZoneRef.clearSelectVal()
                    this.$refs.outerItemEqRef.clearSelectVal()
                    this.quantity = 1
                    this.inputRoles = ''
                    this.outputText = ''
                    ElMessage.success('邮件申请已经发送，点击<处理结果>按钮查询最近的邮件申请处理进度(' + code + ')')
                } else {
                    ElMessage.error(respData.msg)
                }
            }).catch((error) => {
                console.error(error)
                ElMessage.error('意料之外的错误：' + error)
            })
        },
        queryBatchResult() {
            if (this.batchProcCode.length === 0) {
                ElMessage.info('该页面暂无批量申请记录！')
                return
            }
            let gameName = this.gameName.op.split('-')[0];
            let code = this.batchProcCode
            this.$http.get(
                `/Jiu96/queryBatchMailStatus?gameName=${gameName}&code=${code}`
            ).then((res) => {
                let respData = res.data
                if (respData.code === 'S') {
                    let data = respData.data
                    ElMessage.success(`处理码:${this.batchProcCode}，总数:${data.total}，成功数:${data.successCount}，失败数:${data.errorCount}`)
                } else {
                    ElMessage.error(respData.msg)
                }
            }).catch((error) => {
                console.log(error)
                ElMessage.error('意料之外的错误：' + error)
            })
        },
        copyOutput() {
            let copyText = this.outputText
            let rows = copyText.split('\n')
            rows.splice(rows.length-1,1)
            let newCopyText = ''
            rows.forEach(row => {
                let cols = row.split('\t')
                cols.splice(3,0,' ')
                newCopyText+=(cols.join('\t')+'\n')
            })
            this.$copyText(newCopyText).then(
                function (e) {
                    ElMessage.success('复制成功!')
                },
                function (e) {
                    ElMessage.error('复制失败!')
                }
            )
        }
    }
}
</script>
<template>
    <div class="mailReqBox">
        <el-row>
            <el-col :span="5">
                <span class="font-label">游戏名称</span>
                <GameNameSelect @gameNameOpChange="gameNameOpChange" />
            </el-col>
            <!-- <el-col :span="6">
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
            </el-col> -->
        </el-row>
    </div>
</template>