function convertdate(str) {
    var date = new Date(str),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), month, day].join("-");
    // 2020-06-06T14:00
}

function convertTime(str){
    var date = new Date(str)
    var hour = ("0" + date.getHours()).slice(-2)
    var minute = ("0" + date.getMinutes()).slice(-2)
    // var time = date.toLocaleTimeString()
    return [hour, minute].join(":")
}

function inputTime(str){
    return `${convertdate(str)}T${convertTime(str)}`
}

module.exports = {
    convertdate,
    convertTime,
    inputTime
}