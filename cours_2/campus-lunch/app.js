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
    day: "Thursday",
    name: "Public holiday",
    price: 0,
    vegetarian: false,
    description: "No menu available.",
    closed: true
  },
  {
    day: "Friday",
    name: "Teriyaki burger",
    price: 7900,
    vegetarian: false,
    description: "Burger with teriyaki sauce, lettuce, and fries."
  },
  {
    day: "Friday",
    name: "Veggie wrap",
    price: 6200,
    vegetarian: true,
    description: "Fresh vegetables with hummus in a soft wrap."
  },
  {
    day: "Friday",
    name: "Rice bowl",
    price: 6800,
    vegetarian: false,
    description: "Rice bowl with grilled chicken and vegetables."
  },
  {
    day: "Saturday",
    name: "Brunch plate",
    price: 8200,
    vegetarian: true,
    description: "Eggs, toast, potatoes, and fresh fruit."
  },
  {
    day: "Saturday",
    name: "Chicken sandwich",
    price: 7600,
    vegetarian: false,
    description: "Crispy chicken sandwich with slaw and pickles."
  }
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const holidayDays = {
  Thursday: "Public holiday"
};

function setActiveTab(day) {
  document.querySelectorAll(".filter-tab").forEach(tab => {
    const isActive = tab.dataset.day === day;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

function renderMeals(day) {
  const meals = menu.filter(m => m.day === day && !m.closed);
  const holidayLabel = holidayDays[day];
  const mealsSection = document.getElementById("meals");
  const countDiv = document.getElementById("meal-count");
  if (holidayLabel) {
    countDiv.textContent = `${holidayLabel} — no menu listed`;
    mealsSection.innerHTML = `<div class="empty-state holiday-state">${day} is a public holiday. No menu is listed.</div>`;
    return;
  }
  countDiv.textContent = `${meals.length} meal${meals.length === 1 ? '' : 's'} available for ${day}`;
  if (meals.length === 0) {
    mealsSection.innerHTML = `<div class="empty-state">No meals available for ${day}.</div>`;
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