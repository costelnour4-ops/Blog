const username="costea";
const parola="costea123";
let username_holder=document.getElementById("uname");
let parola_holder=document.getElementById("pass");
let button=document.getElementById("submit");
const container=document.querySelector(".container");
button.onclick=function(){
    if(username===username_holder.value && parola===parola_holder.value){ console.log("success");
container.style.display="none";
window.location.href = "admin2.html";
    }
        else console.log("gresit");

}