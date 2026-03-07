const GRID = document.getElementById("grid")

const width = 15
const height = 15

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

bateau1_btn = document.getElementById("bateau1")
bateau1_btn.addEventListener("click", () => {
    add_bateau1()
})

function get_cell(x, y) {
    return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`)
}

// -------- Paternes de bateau --------
let currentPatern = []

const emptyPatern = []

const patern1 = [
    [0, 0],
    [1, 0],
    [2, 0]
]

const patern2 = [
    [0, 0],
    [1, 0]
]

// -------- Placer un bateau --------
GRID.addEventListener("mouseover", (e) => {
    const cell = e.target;
    if (!cell.classList.contains("cell")) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    currentPatern.forEach(([dx, dy]) => {
        const target = get_cell(x + dx, y + dy)
        if (target) {
            target.classList.add("highlighted");
        }
    })
});

GRID.addEventListener("mouseout", (e) => {
    const cell = e.target;
    if (!cell.classList.contains("cell")) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    currentPatern.forEach(([dx, dy]) => {
        const target = get_cell(x + dx, y + dy)
        if (target) {
            target.classList.remove("highlighted")
        }
    })
});

GRID.addEventListener("click", (e) => {
    const cell = e.target;
    if (!cell.classList.contains("cell")) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    currentPatern.forEach(([dx, dy]) => {
        const target = get_cell(x + dx, y + dy)
        if (target) {
            target.classList.add("boat")
            currentPatern = emptyPatern;
        }
    })
});

// -------- Changer de paterne --------
const patern1_btn = document.getElementById("bateau1")

bateau1_btn.addEventListener("click", () => {
    currentPatern = patern1;
})