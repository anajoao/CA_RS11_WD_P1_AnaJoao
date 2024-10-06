// Variáveis principais
let url = "http://localhost:3000/utilizadores";
let hamburgerMenu = document.getElementById("hamburger");
let searchIcon = document.getElementById("search");
let searchInput = document.getElementById("campo");
let modal = document.getElementById('modal');
let closeModalButton = document.getElementById('btClose');
let loginIcon = document.querySelector('.fa-arrow-right-to-bracket');
let registerIcon = document.querySelector('.fa-user-plus');
let profileIcon = document.querySelector('.fa-user');
let logoutIcon = document.querySelector('.fa-arrow-right-from-bracket');
let errorMsg = document.getElementById('errorMsg');
let welcomeMessage = document.getElementById('welcomeMessage');
let validarButton = document.getElementById('validar');

// menu de hambúrguer
hamburgerMenu.addEventListener("click", function() {
    let menu = document.getElementById("mainMenu");
    menu.classList.toggle("show");
});

// icon pesquisa
searchIcon.addEventListener("click", function(){
    searchInput.classList.add("show");
});

// fechar pesquisa
document.addEventListener("click", function(e){
    if (!searchInput.contains(e.target) && !searchIcon.contains(e.target)) {
        searchInput.classList.remove("show");
    }
});

// botão login
loginIcon.addEventListener("click", function () {
    modal.style.display = "block";
    document.documentElement.style.overflow = "hidden";
});

// botão x
closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
    document.documentElement.style.overflow = "auto";
});

// botão valodar
validarButton.addEventListener("click", function() {
    login();
});

// Login
async function login() {
    let email = document.getElementById("emailInput").value;
    let senha = document.getElementById("senha").value;

    
    errorMsg.textContent = "";
    
    if (!email || !senha) {
        errorMsg.textContent = "Por favor, preencha ambos os campos.";
        errorMsg.style.display = "block";
        return;
    }

    // Verificar formato de e-mail (regex: https://pt.stackoverflow.com/questions/1386/express%C3%A3o-regular-para-valida%C3%A7%C3%A3o-de-e-mail)
    let emailFormat = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    if (!emailFormat.test(email)) {
        errorMsg.textContent = "Formato de e-mail inválido.";
        errorMsg.style.display = "block";
        return;
    }

    try {
        let response = await fetch(url);
        let data = await response.json();

        let user = data.find(user => user.email === email && user.senha === senha);

        if (user) {
            // Guardar ID no sessionStorage
            sessionStorage.setItem("userID", user.id);
            console.log("UserID stored in sessionStorage:", sessionStorage.getItem('userID'));
            userLoged(user.nome);
        } else {
            errorMsg.textContent = "Email ou senha inválidos.";
            errorMsg.style.display = "block";
        }
    } catch (error) {
        console.error(error);
    }
}

function userLoged(userName) {
    // Trocar icons
    registerIcon.style.display = "none";
    loginIcon.style.display = "none";
    
    profileIcon.style.display = "block";
    logoutIcon.style.display = "block";

    // Mensagem
    welcomeMessage.textContent = `Bem-vindo(a), ${userName}`;
    welcomeMessage.style.display = "block";

    // Modal
    modal.style.display = "none";
    document.documentElement.style.overflow = "auto";
}

// verificar se o user está logado em caso de refreash
async function verification() {
    let userId = sessionStorage.getItem("userID");
    
    if (userId) {
        try {
            let response = await fetch(url);
            let data = await response.json();
            let user = data.find(user => user.id === parseInt(userId));

            if (user) {
                userLoged(user.nome);
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        welcomeMessage.style.display = "none";
        profileIcon.style.display = "none";
        logoutIcon.style.display = "none";
        registerIcon.style.display = "block";
        loginIcon.style.display = "block";
    }
}

verification();


// Logout
logoutIcon.addEventListener("click", function () {

    sessionStorage.removeItem("userID");
    
    if (window.location.pathname !== "/index.html") {
        window.location.href = "index.html";
    } else {
        welcomeMessage.style.display = "none";
        registerIcon.style.display = "block";
        loginIcon.style.display = "block";
        profileIcon.style.display = "none";
        logoutIcon.style.display = "none";
    }
});