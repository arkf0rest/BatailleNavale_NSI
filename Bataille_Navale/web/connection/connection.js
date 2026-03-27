const pseudo = document.getElementById("pseudo").value;
const login_btn = document.getElementById("login");

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