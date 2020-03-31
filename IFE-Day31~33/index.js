// 封装 checkbox 组件
function Checkbox(idName = '', option = []) {
    const container = document.getElementById(idName)

    // 生成全选按钮
    const checkboxAll = document.createElement('input')
    checkboxAll.type = 'checkbox'
    checkboxAll.name = 'checkbox-all'
    checkboxAll.setAttribute('checkbox-type', 'all')
    const checkboxText = document.createElement('span')
    checkboxText.innerHTML = '全选'

    container.appendChild(checkboxAll)
    container.appendChild(checkboxText)

    // 遍历参数生成子 checkbox
    if (option && Object.prototype.toString.call(option) === '[object Array]' && option.length > 0) {
        option.forEach(item => {
            const checkboxItem = document.createElement('input')
            checkboxItem.type = 'checkbox'
            checkboxItem.name = 'checkbox-child'
            checkboxItem.value = item.value
            checkboxItem.setAttribute('checkbox-type', 'child')
            const checkboxText = document.createElement('span')
            checkboxText.innerHTML = item.text

            container.appendChild(checkboxItem)
            container.appendChild(checkboxText)
        })
    }

    // checkbox 绑定事件
    container.addEventListener('change', function (e) {
        if (e.target.type === 'checkbox') {
            const checkboxAll = container.firstChild
            const checkboxItemList = [...container.getElementsByTagName('input')]
            checkboxItemList.shift()
            checkboxType = e.target.getAttribute('checkbox-type')

            if (checkboxType === 'all') {
                if (e.target.checked) {
                    checkboxItemList.forEach(item => {
                        item.checked = true
                    })
                } else {
                    checkboxItemList.forEach(item => {
                        item.checked = false
                    })
                }
            } else {
                const noChecked = checkboxItemList.filter((item => {
                    return !item.checked
                }))
                if (noChecked && noChecked.length > 0) {
                    checkboxAll.checked = false
                } else {
                    checkboxAll.checked = true
                }
            }
        }
    })
    return container
}

// 创建表头
function createTableHeader() {
    const {productListValue, regionListValue} = getCheckBoxValue()

    let tableHeader = ["产品", "区域", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

    if(productListValue.length !== regionListValue.length && regionListValue.length === 1) {
        tableHeader[0] = '区域'
        tableHeader[1] = '产品'
    }

    return tableHeader
}

// 渲染表格内容
function renderTable(data = [], tableHeader) {
    const tableWrapper = document.getElementById("tableWrapper")
    const table = document.createElement("table")
    const tRow1 = document.createElement("tr")
    const {productListValue, regionListValue} = getCheckBoxValue()

    // 清除数据变更前的旧表格
    if (tableWrapper.getElementsByTagName('table').length > 0) {
        tableWrapper.removeChild(tableWrapper.getElementsByTagName('table')[0])
    }

    table.appendChild(tRow1)

    // 生成表头
    tableHeader.forEach(item => {
        const tHead = document.createElement("th")

        tHead.innerHTML = item
        tRow1.appendChild(tHead)
    })

    // 生成表格每行数据
    data.forEach(item => {
        const row = document.createElement('tr')
        const productDataTd = document.createElement("td")
        const regionDataTd = document.createElement("td")

        productDataTd.innerHTML = item.product
        regionDataTd.innerHTML = item.region

        if(productListValue.length !== regionListValue.length && regionListValue.length === 1) {
            row.appendChild(regionDataTd)
            row.appendChild(productDataTd)
        } else {
            row.appendChild(productDataTd)
            row.appendChild(regionDataTd)
        }

        item.sale.forEach(saleItem => {
            const saleItemTd = document.createElement("td")
            saleItemTd.innerHTML = saleItem
            row.appendChild(saleItemTd)
        })

        table.appendChild(row)
    })

    tableWrapper.appendChild(table)
}

// 获取 checkbox 的值
function getCheckBoxValue() {
    // 初始化变量
    let productList = []
    let regionList = []
    let productListValue = []
    let regionListValue = []

    // 获取选中 checkbox 的值
    productList = [...document.getElementById("productCheckbox").getElementsByTagName("input")]
    productList.shift()
    regionList = [...document.getElementById("regionCheckbox").getElementsByTagName("input")]
    regionList.shift()

    productListValue = productList.map(item => {
        if (item.checked) {
            return item.value
        } else {
            return;
        }
    }).filter(item => item)
    regionListValue = regionList.map(item => {
        if (item.checked) {
            return item.value
        } else {
            return;
        }
    }).filter(item => item)

    return {
        productListValue,
        regionListValue
    }
}

// 获取数据
function getSelectValue() {
    
    const {productListValue, regionListValue} = getCheckBoxValue()

    let data = [] // 最终筛选出的数据

    // 条件判断
    const filterResult = (item) => {
        const existProduct = productListValue.filter(i => i === item.product).length > 0
        const existRegion = regionListValue.filter(i => i === item.region).length > 0

        if (productListValue.length > 0) {
            if (regionListValue.length > 0) {
                return existProduct && existRegion
            }
            return existProduct
        } else if (regionListValue.length > 0) {
            return existRegion
        }
    }

    // 筛选出符合条件的数据
    if (productListValue.length > 0 || regionListValue.length > 0) {
        data = sourceData.filter(filterResult)
    } else {
        data = []
    }

    return data
}

// 添加事件
const checkboxList = document.getElementsByClassName("checkboxList")[0]
checkboxList.addEventListener("change", function (e) {
    const tableHeader = createTableHeader()
    renderTable(getSelectValue(), tableHeader)
})

// 生成 checkbox 按钮
Checkbox('productCheckbox', [
    { value: '手机', text: '手机' },
    { value: '笔记本', text: '笔记本' },
    { value: '智能音箱', text: '智能音箱' }
])
Checkbox('regionCheckbox', [
    { value: '华东', text: '华东' },
    { value: '华北', text: '华北' },
    { value: '华南', text: '华南' }
])

// 初始化表格
const tableHeader = createTableHeader()
renderTable([],tableHeader)