const pseudo = document.getElementById("pseudo").value;
const login_btn = document.getElementById("login");

const URL = "http://127.0.0.1:5000/login"

login_btn.addEventListener("click", () => {

            if(pseudo) {
                console.log(pseudo);
            
                //Envoi au serveur (url à changer)
                fetch('url',{
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({
                        pseudo: pseudo
                    })
                }).catch(console.error);
            }
        });