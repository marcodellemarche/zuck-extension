
function formatDateToday(d) {
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function convertTime(timeStr, today) {
    if (!timeStr || !timeStr.includes(':')) throw ('Time is not in the correct format: ' + timeStr);
    const [hours, minutes] = timeStr.split(':').map(el => +el);

    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);
}

function minutesDifference(start, end) {
    return Math.ceil((end - start) / (1000 * 60));
}

function computeExit(dates) {
    if (dates.length < 3) throw ('3 dates are required, only ' + dates.length + ' provided');

    const minJobTime = 8 * 60;
    const today = new Date();
    const todayStr = formatDateToday(today);

    const jobStart = convertTime(dates[0], today);
    if (jobStart.getHours() > 8 && jobStart.getMinutes() > 0) jobStart.setMinutes(jobStart.getMinutes() < 30 ? 30 : 60);
    

    console.log('todayStr  ', todayStr);
    console.log('jobStart  ', dates[0], jobStart.toLocaleString());

    let lunchDuration = 0;
    if (!!dates[1]) {
        const lunchStart = convertTime(dates[1], today);
        const lunchEnd = convertTime(dates[2], today);
        console.log('lunchStart', dates[1], lunchStart.toLocaleString());
        console.log('lunchEnd  ', dates[2], lunchEnd.toLocaleString());
        lunchDuration = Math.max(30, minutesDifference(lunchStart, lunchEnd));
    }

    const jobEnd = new Date(jobStart.getTime() + (lunchDuration * 60 * 1000) + (minJobTime * 60 * 1000));
    console.log('jobEnd    ', jobEnd.toLocaleString());

    const timeLeft = minutesDifference(today, jobEnd);
    console.log('timeLeft:  ' + timeLeft + ' minutes');

    return [jobEnd, timeLeft];
}
