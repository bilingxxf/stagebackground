import XLSXs from 'xlsx'

const _this = XLSXs

function outputXlsxInArray(opt) {
  const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' }
  let workbook = _this.utils.book_new()
  const sheets = opt['SheetNames']
  const sheetsConfig = []
  workbook['SheetNames'] = sheets
  sheets.map((v, i) => {
    const sheet = opt['Sheets'][i]
    const { merger, headers, config } = sheet
    sheet.data.unshift(headers)
    if (merger) sheet.data.unshift(merger)
    const sheetConfig = _this.utils.aoa_to_sheet(sheet.data)
    if (config) {
      const keys = Object.keys(config)
      keys.map(v => {
        const a = sheetConfig[v]
        if (!a) sheetConfig[v] = config[v]
        else sheetConfig[v] = Object.assign(a, config[v])
      })
    }
    sheetsConfig[v] = sheetConfig
  })
  workbook['Sheets'] = sheetsConfig

  const xlsxName = `${opt.xslx || '报表'}.xlsx`
  var wbout = XLSX.write(workbook, wopts)
  var blob = new Blob([s2ab(wbout)], {type: ''})

  function saveAs (obj, fileName) {
    var tmpa = document.createElement('a')
    tmpa.download = fileName || '下载.xlsx'
    tmpa.href = URL.createObjectURL(obj)
    tmpa.click()
    setTimeout(function () {
      URL.revokeObjectURL(obj)
    }, 100)
  }

  function s2ab (s) {
    var buf
    if (typeof ArrayBuffer !== 'undefined') {
      buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    } else {
      buf = new Array(s.length)
      for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
      return buf
    }
  }

  saveAs(blob, xlsxName)
}

export default outputXlsxInArray

