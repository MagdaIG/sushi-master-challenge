// Variables del juego
const gameState = {
  playerName: "",
  score: 0,
  lives: 3,
  level: 1,
  EXTRA_LIFE_SCORE: 500,
  MAX_LEVEL: 5,
  isFirstOrder: true
};

// Tipos de sushi
const sushiRecipes = [
  {
    name: "Ebinigiri",
    image: "assets/img/ebinigiri.png",
    ingredients: ["arroz", "camarón", "algas"],
    points: 250
  },
  {
    name: "Nigiri de Salmón",
    image: "assets/img/sushi_salmon.png",
    ingredients: ["arroz", "salmón"],
    points: 200
  },
  {
    name: "Sushi de Aguacate",
    image: "assets/img/sushi_aguacate.png",
    ingredients: ["arroz", "aguacate", "algas"],
    points: 300
  },
  {
    name: "Sushi Especial",
    image: "assets/img/sushi_mayonesa.png",
    ingredients: ["arroz", "salmón", "mayonesa"],
    points: 400
  }
];

// Ingredientes con sus imágenes correspondientes
const allIngredients = [
  { name: "arroz", image: "assets/img/arroz.png" },
  { name: "salmón", image: "assets/img/salmon.png" },
  { name: "aguacate", image: "assets/img/aguacate.png" },
  { name: "algas", image: "assets/img/alga.png" },
  { name: "mayonesa", image: "assets/img/mayonesa.png" },
  { name: "camarón", image: "assets/img/camaron.png" }
];

// Elementos del DOM
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const playerInput = document.getElementById("player-input");
const startBtn = document.getElementById("start-btn");
const playerNameEl = document.getElementById("player-name");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const orderImage = document.getElementById("order-image");
const orderName = document.getElementById("order-name");
const ingredientsEl = document.getElementById("ingredients");
const prepareBtn = document.getElementById("prepare-btn");

// Elementos del modal
const feedbackModal = document.getElementById("feedback-modal");
const modalMessage = document.getElementById("modal-message");
const remainingLives = document.getElementById("remaining-lives");
const continueBtn = document.getElementById("continue-btn");
const gameoverModal = document.getElementById("gameover-modal");
const gameoverTitle = document.getElementById("gameover-title");
const gameoverMessage = document.getElementById("gameover-message");
const playAgainBtn = document.getElementById("play-again-btn");

// Iniciar juego
startBtn.addEventListener("click", () => {
  if (playerInput.value.trim() === "") {
    alert("Por favor ingresa tu nombre");
    return;
  }
  gameState.playerName = playerInput.value.trim();
  playerNameEl.textContent = gameState.playerName;
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  generateOrder();
  renderIngredients();
});

// Generar pedido
function generateOrder() {
  if (gameState.isFirstOrder) {
    currentOrder = sushiRecipes.find(recipe => recipe.name === "Ebinigiri");
    gameState.isFirstOrder = false;
  } else {
    const availableRecipes = sushiRecipes.filter(recipe => recipe.name !== "Ebinigiri");
    currentOrder = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
  }

  orderImage.src = currentOrder.image;
  orderName.textContent = currentOrder.name;
  selectedIngredients = [];
  updateIngredientsUI();
}

// Renderizar ingredientes
function renderIngredients() {
  ingredientsEl.innerHTML = "";

  allIngredients.forEach(ingredient => {
    const ingredientEl = document.createElement("div");
    ingredientEl.className = "ingredient";

    const imgEl = document.createElement("img");
    imgEl.src = ingredient.image;
    imgEl.alt = ingredient.name;

    const nameEl = document.createElement("p");
    nameEl.textContent = ingredient.name;

    ingredientEl.appendChild(imgEl);
    ingredientEl.appendChild(nameEl);

    ingredientEl.addEventListener("click", () => {
      toggleIngredient(ingredient.name, ingredientEl);
    });

    ingredientsEl.appendChild(ingredientEl);
  });
}

// Seleccionar ingrediente
function toggleIngredient(ingredient, element) {
  const index = selectedIngredients.indexOf(ingredient);
  if (index > -1) {
    selectedIngredients.splice(index, 1);
    element.classList.remove("selected");
  } else {
    selectedIngredients.push(ingredient);
    element.classList.add("selected");
  }
}

// Actualizar UI de ingredientes
function updateIngredientsUI() {
  document.querySelectorAll(".ingredient").forEach(el => {
    el.classList.remove("selected");
  });
}

// Preparar sushi
prepareBtn.addEventListener("click", () => {
  if (selectedIngredients.length === 0) {
    showFeedback(false, "¡Debes seleccionar al menos un ingrediente!");
    return;
  }

  const isCorrect = arraysEqual([...selectedIngredients].sort(), [...currentOrder.ingredients].sort());

  if (isCorrect) {
    gameState.score += currentOrder.points;
    checkExtraLife();
    checkLevelUp();
    showFeedback(true, `¡Correcto! +${currentOrder.points} puntos`);
  } else {
    gameState.lives--;
    if (gameState.lives <= 0) {
      endGame();
      return;
    }
    showFeedback(false, "Incorrecto. ¡Inténtalo otra vez!");
  }

  updateGameUI();
});

// Comparar arrays
function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}
//mostrar modal
function showFeedback(isCorrect, message) {
  const modal = document.getElementById("feedback-modal");
  modal.style.display = "flex"; // Mostrar modal usando flex para centrar

  if (isCorrect) {
    modalMessage.innerHTML = `<div class="correct-message">${message}</div>`;
    remainingLives.innerHTML = "";
  } else {
    modalMessage.innerHTML = `<div class="incorrect-message">${message}</div>`;
    remainingLives.innerHTML = `<div class="remaining-lives">Te quedan ${gameState.lives} vidas</div>`;
  }
}

// Continuar juego
continueBtn.addEventListener("click", () => {
  const modal = document.getElementById("feedback-modal");
  modal.style.display = "none";
  generateOrder();
});

// Actualizar UI del juego
function updateGameUI() {
  scoreEl.textContent = gameState.score;
  livesEl.textContent = gameState.lives;
  levelEl.textContent = gameState.level;
}

// Verificar vida extra
function checkExtraLife() {
  if (gameState.score >= gameState.EXTRA_LIFE_SCORE && gameState.lives < 5) {
    gameState.lives++;
    showFeedback(true, `¡Vida extra ganada!`);
  }
}

// Subir de nivel
function checkLevelUp() {
  const newLevel = Math.floor(gameState.score / 1000) + 1;
  if (newLevel > gameState.level && newLevel <= gameState.MAX_LEVEL) {
    gameState.level = newLevel;
    showFeedback(true, `¡Nivel ${gameState.level} desbloqueado!`);
  }
}

// Terminar juego
function endGame() {
  gameoverTitle.textContent = "¡Game Over!";
  gameoverMessage.innerHTML = `
    <p>Puntuación final: ${gameState.score}</p>
    <p>Nivel alcanzado: ${gameState.level}</p>
  `;
  gameoverModal.classList.remove("hidden");
  gameoverModal.classList.add("modal-show");
  prepareBtn.disabled = true;
}

// Botón Salir
const quitBtn = document.getElementById("quit-btn");

quitBtn.addEventListener("click", () => {
  location.reload();
});

// Botón Jugar de nuevo
playAgainBtn.addEventListener("click", () => {
  resetGame();
  gameoverModal.classList.add("hidden");
});

// Reiniciar juego
function resetGame() {
  gameState.score = 0;
  gameState.lives = 3;
  gameState.level = 1;
  gameState.isFirstOrder = true;
  updateGameUI();
  prepareBtn.disabled = false;
  generateOrder();
}

// Cerrar modales al hacer click fuera
window.addEventListener("click", (event) => {
  if (event.target === feedbackModal) {
    feedbackModal.classList.add("hidden");
  }
  if (event.target === gameoverModal) {
    gameoverModal.classList.add("hidden");
  }
});

// Cerrar modal al hacer clic en la X
document.querySelectorAll('.close-modal').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    feedbackModal.style.display = "none";
  });
});
