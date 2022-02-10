module.exports = {
    getDate: getDate(),
    getDay: getDay()
}

function getDate(){

    var  today =  new Date();

    var option = {
        weekday: 'long',  
        month: 'long', 
        day: 'numeric' 
    } 
    
    var day = today.toLocaleDateString("en-US", option)
    return day;
}

function getDay(){

    var  today =  new Date();

    var option = { 
        weekday: 'long' 
    } 
    
    var day = today.toLocaleDateString("en-US", option)
    return day;
}

// console.log(exports)