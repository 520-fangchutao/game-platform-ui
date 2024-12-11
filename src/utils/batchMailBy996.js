import { isEmpty, isNotEmpty,recursionIndex,distinctArr,countChar } from '@/utils/common.js'
import { ElMessage } from 'element-plus'

export function checkDesignRowNotNull(designReqRow) {
    let hasError = false
    if (isEmpty(designReqRow.gameDesign)) {
        ElMessage.error('方案名称不能为空！')
        hasError = true
    }
    if (isEmpty(designReqRow.itemOrEq)) {
        ElMessage.error('道具不能为空！')
        hasError = true
    }
    return hasError
}

export function checkInputRowNotNull(dataReqRow) {
    let hasError = false
    if (isEmpty(dataReqRow.gameName)) {
        ElMessage.error('游戏名称不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.gameZone)) {
        ElMessage.error('游戏区服不能为空！')
        hasError = true
    }
    let hasDesign = false
    let hasItemEq = false
    if (isNotEmpty(dataReqRow.itemOrEq)) {
        hasItemEq = true
    }
    if (isNotEmpty(dataReqRow.designName)) {
        hasDesign = true
    }
    if (!hasDesign && !hasItemEq) {
        ElMessage.error('道具装备与预设方案不能都为空！')
        hasError = true
    }
    if (hasDesign && hasItemEq) {
        ElMessage.error('道具装备与预设方案只能二选一！')
        hasError = true
    }

    if (isEmpty(dataReqRow.sender)) {
        ElMessage.error('发件人不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.mailTitle)) {
        ElMessage.error('邮件标题不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.mailContent)) {
        ElMessage.error('邮件内容不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.reason)) {
        ElMessage.error('申请理由不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.inputRoles)) {
        ElMessage.error('角色列表不能为空！')
        hasError = true
    }
    return { hasError: hasError, hasDesign: hasDesign, hasItemEq: hasItemEq }
}

export function generateBatchRows(itemThreshold, dataReqRow) {
    //开始生成数据输出行方法
    let gameId = dataReqRow.gameName.split('-')[1]
    let zoneId = dataReqRow.gameZone.split('-')[1]
    //此处角色名
    let bindStatus = dataReqRow.bindRadio
    let sender = dataReqRow.sender
    let mailTitle = dataReqRow.mailTitle
    let mailContent = dataReqRow.mailContent
    let sendLable = dataReqRow.sendLable
    let reason = dataReqRow.reason
    let itemArr = dataReqRow.itemOrEq
    let itemQty = dataReqRow.quantity

    //let itemThreshold = 10
    let itemRow = []
    let itemRows = []
    itemArr.forEach(i => {
        let kv = i.split('-')
        let itemId = kv[1]
        let item = itemId + '#' + itemQty
        if (itemRow.length >= itemThreshold) {
            itemRows.push(itemRow)
            itemRow = []
        }
        itemRow.push(item)
    })
    itemRows.push(itemRow)

    let outputRow = [bindStatus, sender, mailTitle, mailContent, sendLable, reason]
    let outputRowStr = outputRow.join('\t')
    let outputRowStrs = []
    itemRows.forEach(itemRow => {
        let itemRowStr = itemRow.join(';')
        outputRowStrs.push(outputRowStr + '\t' + itemRowStr)
    })
    let roleNames = dataReqRow.inputRoles.split('\n')
    roleNames.forEach(roleName => {
        let gzr = gameId + '\t' + zoneId + '\t' + roleName
        outputRowStrs.forEach(row => {
            dataReqRow.outputText += (gzr + '\t' + row + '\n')
        })
    })
    return dataReqRow.outputText
}

export function generateDesignRows(dataReqRow) {
    //开始生成数据输出行方法
    let gameId = dataReqRow.gameName.split('-')[1]
    let zoneId = dataReqRow.gameZone.split('-')[1]
    let roleNames = dataReqRow.inputRoles.split('\n')
    let bindStatus = dataReqRow.bindRadio
    let sender = dataReqRow.sender
    let mailTitle = dataReqRow.mailTitle
    let mailContent = dataReqRow.mailContent
    let sendLable = dataReqRow.sendLable
    let reason = dataReqRow.reason
    let designOp = dataReqRow.designName
    let items = designOp.substring(0, designOp.length - 1).split('\n')
    let headers = []
    roleNames.forEach(roleName => {
        let header = gameId + '\t' +
            zoneId + '\t' +
            roleName + '\t' +
            bindStatus + '\t' +
            sender + '\t' +
            mailTitle + '\t' +
            mailContent + '\t' +
            sendLable + '\t' +
            reason
        headers.push(header)
    })
    let outputDesignText = ''
    headers.forEach(header => {
        items.forEach(item => {
            outputDesignText += header + '\t' + item + '\n'
        })
    })
    dataReqRow.outputText += outputDesignText
    return dataReqRow.outputText
}

export function genItemDesign(designReqRow) {
    let itemQty = designReqRow.quantity
    let selectedItems = designReqRow.itemOrEq
    let itemRow = []
    let itemRows = []
    selectedItems.forEach(i => {
        let itemId = i.split('-')[1]
        let item = itemId + '#' + itemQty
        if (itemRow.length >= 10) {
            itemRows.push(itemRow)
            itemRow = []
        }
        itemRow.push(item)
    })
    itemRows.push(itemRow)
    let outputText = ''
    itemRows.forEach(itemRow => {
        let itemRowStr = itemRow.join(';')
        outputText = outputText + itemRowStr + '\n'
    })
    designReqRow.outputText += outputText
    return designReqRow.outputText
}

export function splitItems(splitStr, splitStrs, divisor, separator) {
    let count = countChar(splitStr, separator) + 1
    let splitCount = Math.floor(count / divisor)
    if (count % divisor === 0) {
        splitCount = splitCount - 1
    }
    for (let i = 0; i < splitCount; i++) {
        let splitIdx = recursionIndex(splitStr, 0, divisor, separator) + 1
        let splitPart = splitStr.substring(0, splitIdx)
        splitStrs.push(splitPart)
        splitStr = splitStr.substring(splitIdx)
    }
    splitStrs.push(splitStr)
}

export function procExceedPart(e) {
    let headIdx = recursionIndex(e, 0, 9, '\t')
    let headStr = e.substring(0, headIdx + 1)
    let splitStr = e.substring(headIdx + 1)
    let splitStrs = []
    splitItems(splitStr, splitStrs, 10, ';')
    splitStrs.push(headStr)
    return splitStrs
}

export function optimizeData(dataReqRow) {
    if (isEmpty(dataReqRow.outputText)) {
        ElMessage.info('没有可压缩的数据行！')
        return
    }
    let rows = dataReqRow.outputText.substring(0,dataReqRow.outputText.length - 1).split('\n')
    let sourceRows = []
    let distinctRows = []
    rows.forEach(row => {
        let index = recursionIndex(row, 0, 9, '\t')
        let key = row.substring(0, index + 1)
        sourceRows.push(key)
    })
    let rowStrs = []
    distinctArr(sourceRows, distinctRows)

    //合并同类项
    distinctRows.forEach((key, keyIdx) => {
        let first = true
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].includes(key)) {
                let value = rows[i].substring(key.length)
                if (first) {
                    rowStrs.push(key + value)
                    first = false
                } else {
                    rowStrs[keyIdx] = rowStrs[keyIdx] + ';' + value
                }
                rows.splice(i, 1)
                i--
            }
        }
    })

    //分离超长数据，跟正常数据
    let exceedLenStrs = []
    for (let i = 0; i < rowStrs.length; i++) {
        let count = countChar(rowStrs[i], '#')
        if (count > 10) {
            exceedLenStrs.push(rowStrs[i])
            rowStrs.splice(i, 1)
            i--
        }
    }
    //处理超长数据为正常数据
    exceedLenStrs.forEach(e => {
        let splitStrs = procExceedPart(e)
        let pos = splitStrs.length - 1
        let headStr = splitStrs[pos]
        splitStrs.splice(pos, 1)
        pos = splitStrs.length - 1
        splitStrs.forEach((sp, idx) => {
            if (idx === pos) {
                rowStrs.push(headStr + sp)
            } else {
                rowStrs.push(headStr + sp.substring(0, sp.length - 1))
            }
        })
    })
    ElMessage.success('压缩数据成功！')
    return rowStrs.join('\n') + '\n'
}

export function optimizeDesign(designReqRow) {
    if (isEmpty(designReqRow.outputText)) {
        ElMessage.info('没有可压缩的数据行！')
        return
    }
    let outputText = designReqRow.outputText.split('\n').join(';')
    let count = countChar(outputText, '#')
    let splitStrs = []
    if (count > 10) {
        splitItems(outputText, splitStrs, 10, ';')
        splitStrs = splitStrs.map(row => row.substring(0, row.length - 1))
        designReqRow.outputText = splitStrs.join('\n') + '\n'
    } else {
        designReqRow.outputText = outputText.substring(0, outputText.length - 1) + '\n'
    }
    ElMessage.success('压缩数据成功！')
    return designReqRow.outputText
}