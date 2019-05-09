function downloadXLS(src) {
	var download_file = {}
	if(typeof(download_file.iframe) === 'undefined') {
		var iframe = document.createElement('iframe')
		download_file.iframe = iframe
		document.body.appendChild(download_file.iframe)
	}
	download_file.iframe.src = src
	download_file.iframe.style.display = 'none'
}

function defaultDate(range) {
	var date1 = new Date(),
		time1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()
	var date2 = new Date(date1)
	date2.setDate(date1.getDate() + range)
	var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
	let defaultDateArr = []
	defaultDateArr.push(time2, time1)
	return defaultDateArr
}
module.exports = {
	downloadXLS: downloadXLS,
	defaultDate: defaultDate
}