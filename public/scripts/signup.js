
document.getElementById("confirm_password").addEventListener("input",function () {
    const password = document.getElementById("password").value;
    if (this.value !== password){
        document.getElementById("signup").disabled = true
        document.getElementById("alertMessage").removeAttribute("hidden", false)
    }
    else {
        
        document.getElementById("signup").disabled = false
        document.getElementById("alertMessage").setAttribute("hidden" , true)
    }
})



