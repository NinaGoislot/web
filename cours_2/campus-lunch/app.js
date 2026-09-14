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
  },
  {
    day: "Friday",
    name: "Classic burger",
    price: 7800,
    vegetarian: false,
    description: "Beef burger with lettuce, tomato, and fries."
  },
  {
    day: "Friday",
    name: "Veggie wrap",
    price: 6200,
    vegetarian: true,
    description: "Roasted vegetables with hummus in a soft wrap."
  },
  {
    day: "Friday",
    name: "Chicken bowl",
    price: 7600,
    vegetarian: false,
    description: "Seasoned chicken, rice, and crunchy vegetables."
  },
  {
    day: "Saturday",
    name: "Pasta salad",
    price: 5900,
    vegetarian: true,
    description: "Cold pasta with tomatoes, olives, and herbs."
  },
  {
    day: "Saturday",
    name: "Grilled chicken plate",
    price: 7900,
    vegetarian: false,
    description: "Grilled chicken with potatoes and greens."
  }
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const holidayDays = new Set(["Thursday"]);

function setActiveTab(day) {
  document.querySelectorAll(".filter-tab").forEach(tab => {
    const isActive = tab.dataset.day === day;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

function renderMeals(day) {
  const meals = menu.filter(m => m.day === day);
  const mealsSection = document.getElementById("meals");
  const countDiv = document.getElementById("meal-count");
  countDiv.textContent = `${meals.length} meal${meals.length === 1 ? '' : 's'} available for ${day}`;
  if (meals.length === 0) {
    mealsSection.innerHTML = holidayDays.has(day) ?
      `<div class="empty-state is-holiday">${day} is a public holiday. No menu is listed.</div>` :
      `<div class="empty-state">No meals available for ${day}.</div>`;
    return;
  }
  mealsSection.innerHTML = meals.map(meal => `
    <article class="meal-card">
      <div class="meal-title-row">
        <div class="meal-title">${meal.name}</div>
        ${meal.vegetarian ? '<span class="veg-label">Vegetarian</span>' : ''}
      </div>
      <div class="meal-desc">${meal.description}</div>
      <div class="meal-info">
        <span>${meal.price.toLocaleString()} KRW</span>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".filter-tab");
  const initialDay = days[0];

  renderMeals(initialDay);
  setActiveTab(initialDay);

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const {
        day
      } = tab.dataset;
      setActiveTab(day);
      renderMeals(day);
    });
  });
});