// Menu data inlined for direct file use
const menu = [{
    day: "Monday",
    name: "Bibimbap",
    price: 6500,
    vegetarian: true,
    description: "Rice, vegetables, and gochujang."
  },
  {
    day: "Monday",
    name: "Chicken rice",
    price: 7000,
    vegetarian: false,
    description: "Grilled chicken with steamed rice."
  },
  {
    day: "Monday",
    name: "Tofu bowl",
    price: 6000,
    vegetarian: true,
    description: "Tofu, greens, and sesame dressing."
  },
  {
    day: "Tuesday",
    name: "Mushroom pasta",
    price: 7500,
    vegetarian: true,
    description: "Pasta with mushrooms and herbs."
  },
  {
    day: "Tuesday",
    name: "Beef noodles",
    price: 8000,
    vegetarian: false,
    description: "Noodles with beef and vegetables."
  },
  {
    day: "Tuesday",
    name: "Lentil soup",
    price: 5500,
    vegetarian: true,
    description: "Lentils with bread on the side."
  },
  {
    day: "Wednesday",
    name: "Fish rice",
    price: 7500,
    vegetarian: false,
    description: "Fish with rice and seasonal greens."
  },
  {
    day: "Wednesday",
    name: "Pork cutlet",
    price: 8000,
    vegetarian: false,
    description: "Breaded pork with cabbage salad."
  },
  {
    day: "Wednesday",
    name: "Chicken noodles",
    price: 7000,
    vegetarian: false,
    description: "Chicken and noodles in broth."
  }
];

function renderMeals(day) {
  const meals = menu.filter(m => m.day === day);
  const mealsSection = document.getElementById("meals");
  const countDiv = document.getElementById("meal-count");
  countDiv.textContent = `${meals.length} meal${meals.length === 1 ? '' : 's'} available`;
  if (meals.length === 0) {
    mealsSection.innerHTML = `<div style='text-align:center;color:#888;font-size:1.1rem;padding:1.5em 0;'>No meals available for ${day}.</div>`;
    return;
  }
  mealsSection.innerHTML = meals.map(meal => `
    <article class="meal-card">
      <div class="meal-title">${meal.name}
        ${meal.vegetarian ? '<span class=\"veg-label\">Vegetarian</span>' : ''}
      </div>
      <div class="meal-desc">${meal.description}</div>
      <div class="meal-info">
        <span>${meal.price.toLocaleString()} KRW</span>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("day-select");
  renderMeals(select.value);
  select.addEventListener("change", e => {
    renderMeals(e.target.value);
  });
});
