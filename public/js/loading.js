console.log('loading here in console')
let s = 0

setInterval(()=>{
    console.log(s);s++
},1000)

function loading(){
    document.getElementById("loding-div").style.display ="flex"
}