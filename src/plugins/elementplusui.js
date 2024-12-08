import {
    ElContainer,
    ElHeader,
    ElAside,
    ElMain,
    ElMenu,
    ElMenuItem,
    ElSubMenu,
    ElRow,
    ElCol,
    ElSelect,
    ElOption,
    ElSelectV2,
    ElRadioGroup,
    ElRadio,
    ElButton,
    ElInput,
    ElUpload,
    ElMessage,
    ElDialog,
    ElDatePicker
} from "element-plus"

export default (app) => {
    app.use(ElContainer)
    app.use(ElHeader)
    app.use(ElAside)
    app.use(ElMain)
    app.use(ElMenu)
    app.use(ElMenuItem)
    app.use(ElSubMenu)
    app.use(ElRow)
    app.use(ElCol)
    app.use(ElSelect)
    app.use(ElOption)
    app.use(ElSelectV2)
    app.use(ElRadioGroup)
    app.use(ElRadio)
    app.use(ElButton)
    app.use(ElInput)
    app.use(ElUpload)
    app.use(ElMessage)
    app.use(ElDialog)
    app.use(ElDatePicker)
}