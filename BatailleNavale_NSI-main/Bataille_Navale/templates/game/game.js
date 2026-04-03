const GRID = document.getElementById("grid")
const delete_btn = document.getElementById("delete");

const width = 15
const height = 15

let modifiable = true; // Permet de bloquer les modifications après le début de la partie
let is_deleting = false; // Permet de différencier le placement d'un bateau de sa suppression


// On utilise une variable CSS pour pouvoir la modifier facilement
GRID.style.setProperty("--cols", width);

const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

for (let i = 0; i < width * height; i++) {
    const cell = document.createElement("div")

    const x = i % width
    const y = Math.floor(i / width)

    if (y === 0) { // première ligne
        cell.classList.add("coo_cell")
        cell.innerHTML = letters[x] ?? ""
    } 
    else if (x === 0) { 
        // première colonne
        cell.classList.add("coo_cell")
        cell.innerHTML = y
    } 
    else {
        cell.classList.add("cell")

        // Coordonnées
        cell.dataset.x = x
        cell.dataset.y = y
    }

    GRID.appendChild(cell)
}

function get_cell(x, y) {
    return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`)
}

// -------- Patternes de bateau --------
let currentPattern = null;
let currentBoatName = null;

const emptyPattern = null;

const patterns = {
    "boat1": [[0, 0],[1, 0],[2, 0]],
    "boat2": [[0, 0],[1, 0]]
};

let boat_limit = {
    "boat1": 2,
    "boat2": 2
};

// -------- Placer un bateau --------
let boatID = 0; // ID pour identifier un bateau complet
let lastMouseX = 0; 
let lastMouseY = 0;

// Met à jour la position de la souris et le highlight
GRID.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    updateHover();
});

// Met à jour le highlight en fonction de la position de la souris et du pattern sélectionné
function updateHover() {
    if (!currentPattern || is_deleting || !modifiable) return;

    const cell = document.elementFromPoint(lastMouseX, lastMouseY);
    if (!cell || !cell.classList.contains("cell")) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    // Supprimer l'ancien highlight
    document.querySelectorAll(".highlighted, .forbidden")
        .forEach(c => c.classList.remove("highlighted", "forbidden"));

    // Vérifier si placement interdit
    const forbidden = currentPattern.some(([dx, dy]) => {
        const target = get_cell(x + dx, y + dy);
        return !target || target.classList.contains("boat") || boat_limit[currentBoatName] <= 0;
    });

    // Appliquer le highlight
    currentPattern.forEach(([dx, dy]) => {
        const target = get_cell(x + dx, y + dy);
        if (!target) return;
        target.classList.add(forbidden ? "forbidden" : "highlighted");
    });
}

// Placer ou supprimer un bateau au clic
GRID.addEventListener("click", (e) => {
    const cell = document.elementFromPoint(e.clientX, e.clientY);
    if (!cell || !cell.classList.contains("cell") || !modifiable) return;

    if (!is_deleting) {
        if (!currentPattern) return;

        const x = Number(cell.dataset.x);
        const y = Number(cell.dataset.y);

        // Vérifier toutes les cases du pattern
        const forbidden = currentPattern.some(([dx, dy]) => {
            const target = get_cell(x + dx, y + dy);
        return !target || target.classList.contains("boat") || boat_limit[currentBoatName] <= 0;
        });

        if (!forbidden) {
            currentPattern.forEach(([dx, dy]) => {
                const target = get_cell(x + dx, y + dy);
                if (target) {
                    target.classList.add("boat");
                    target.dataset.boatId = boatID;
                }
            });
            boatID++;
            boat_limit[currentBoatName]--;
            currentPattern = emptyPattern;
        }
    } else {
        // Suppression du bateau
        const boatIDToRemove = cell.dataset.boatId;
        if (!boatIDToRemove) return; // pas de bateau ici

        // Sélectionner toutes les cases avec le même boatID
        document.querySelectorAll(`.cell[data-boat-id="${boatIDToRemove}"]`)
            .forEach(c => {
                c.classList.remove("boat");
                c.classList.remove("highlighted");
                c.removeAttribute("data-boat-id");
            });
    }
});

delete_btn.addEventListener("click", () => {
    is_deleting = !is_deleting;
    delete_btn.textContent = is_deleting ? "Mode suppression (cliquer pour désactiver)" : "Supprimer";

    // Supprimer les highlights restants
    document.querySelectorAll(".cell")
        .forEach(c => {
            c.classList.remove("highlighted");
        });
});

// -------- Changer de patterne --------
document.addEventListener("DOMContentLoaded", () => {
    const pattern_buttons = document.querySelectorAll(".patternChanger");

    pattern_buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentPattern = patterns[btn.id];
            currentBoatName = btn.id;
        });
    });
});

// -------- Tourner un patterne --------
function rotatePattern(pattern) {
    return pattern.map(([dx, dy]) => [dy, dx]);
}

document.addEventListener("keydown", (e) => {
    if (!currentPattern) return;
    if (e.key === "r" || e.key === "R") {
        currentPattern = rotatePattern(currentPattern); 
        updateHover();   
    }
});


const validate_btn = document.getElementById("valider");
validate_btn.addEventListener("click", () => {
    startGame();
});

function startGame() {
    if (Object.values(boat_limit).every(value => value === 0)) {
        modifiable = false;

        // Masquer les boutons de patterne
        document.querySelectorAll(".patternChanger").forEach(btn => btn.style.display = "none");

        // Afficher un message de début de partie
        const message = document.createElement("div");
        message.id = "startMessage";
        message.textContent = "La partie commence !";
        document.body.appendChild(message);

        // Masquer le bouton de validation
        validate_btn.style.display = "none";
        delete_btn.style.display = "none";

        // Supprimer les highlights restants
        document.querySelectorAll(".cell")
            .forEach(c => {
                c.classList.remove("highlighted", "forbidden");
            });
    } else {
        window.alert("Veuillez placer tout vos bateaux");
    }
};