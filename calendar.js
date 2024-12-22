const calendar = document.getElementsByClassName("calendar"),
  date = document.getElementById("date"),
  daysContainer = document.getElementById("days"),
  prev = document.getElementById("prev"),
  nxt = document.getElementById("nxt");

let selectedDates = [];

let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let tdate = today.getDate();
today.setMonth(today.getMonth() + 1);
let nextMonthNumber = today.getMonth();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const icfaiHolidays = [
  { date: 1, month: 0, year: 2025 }, // New Year Day (01.01.2025)
  { date: 13, month: 0, year: 2025 }, // Bhogi (13.01.2025)
  { date: 14, month: 0, year: 2025 }, // Sankranti (14.01.2025)
  { date: 31, month: 2, year: 2025 }, // Ramzan (31.03.2025)
  { date: 8, month: 7, year: 2025 }, // Varalakshmi Vratham (08.08.2025)
  { date: 15, month: 7, year: 2025 }, // Independence Day (15.08.2025)
  { date: 27, month: 7, year: 2025 }, // Ganesh Chaturthi (27.08.2025)
  { date: 2, month: 9, year: 2025 }, // Mahatma Gandhi Jayanthi / Vijaya Dasami (02.10.2025)
  { date: 20, month: 9, year: 2025 }, // Deepavali (20.10.2025)
  { date: 25, month: 11, year: 2024 }, // Christmas (25.12.2025)
];

function getSundaysAndSaturdays(year, month) {
  const holidays = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (date.getDay() === 0 || date.getDay() === 6) {
      holidays.push(date.getDate());
    }
    date.setDate(date.getDate() + 1);
  }
  return holidays;
}

function updateSelectedDates() {
  let arr = document.querySelectorAll(".selected");
  // get month

  selectedDates.push({
    day: arr[arr.length - 1],
    month,
    year,
  });
}

function addListner() {
  document.addEventListener("click", (e) => {
    const isnotvalidDay = ["tillCurrentDate", "holiday"].some((cls) =>
      e.target.classList.contains(cls)
    );
    if (isnotvalidDay) return;
    if (!e.target.classList.contains("day")) {
      console.log("clicked diff ele");
      return;
    }

    const rangeElements = document.querySelectorAll(".in-range");

    // Clear all previous selections if there are already two selected dates

    if (selectedDates.length >= 2) {
      selectedDates.forEach((ele) => {
        console.log(ele.day);
      });

      selectedDates.forEach((ele) => {
        ele.day.classList.remove("selected");
      });
      selectedDates = [];

      rangeElements.forEach((date) => {
        date.classList.remove("in-range");
      });
    }
    // Add the 'selected' class to the clicked element
    e.target.classList.add("selected");
    updateSelectedDates();
    if (selectedDates.length == 2) {
      const firstElement = selectedDates[0];
      const lastElement = selectedDates[1];

      // console.log([...firstElement], [...lastElement], ":selectedDates");
      // for (i = firstElement.textContent; i <= lastElement.textContent; i++) {
      //   console.log(i);
      // }
    }
  });
}

//function to add days
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();

  const nextDays = 7 - lastDay.getDay() - 1;
  console.log(nextDays);

  //update date top of calendar
  date.innerHTML = months[month] + " " + year;

  const holidays = getSundaysAndSaturdays(year, month);

  //adding days on dom
  let days = "";

  //prev month days
  for (let x = day; x > 0; x--) {
    days += `<div class='day prev-date'>${prevDays - x + 1}</div>`;
  }

  //current month days
  for (let i = 1; i <= lastDate; i++) {
    const currentDayOfWeek = new Date(year, month, i).getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)

    const isToday =
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth();

    const isTillCurrentDate =
      i < new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth();

    const isICFAIHoliday = icfaiHolidays.some(
      (holiday) =>
        holiday.date === i && holiday.month === month && holiday.year === year
    );
    const isHoliday =
      isICFAIHoliday ||
      holidays.includes(i) ||
      (isToday && (currentDayOfWeek === 0 || currentDayOfWeek === 6)); // Add `holiday` if today is Saturday or Sunday

    // if (isTillCurrentDate) {
    //   days += `<div class='day tillCurrentDate'>${i}</div>`;
    // } else if (isToday && (currentDayOfWeek === 0 || currentDayOfWeek === 6)) {
    //   days += `<div class='day today holiday'>${i}</div>`; // Add both `today` and `holiday` classes
    // } else if (isToday) {
    //   days += `<div class='day today'>${i}</div>`;
    // } else if (isHoliday) {
    //   days += `<div class='day holiday'>${i}</div>`;
    // } else if (
    //   (month === new Date().getMonth() && year === new Date().getFullYear()) ||
    //   (month === nextMonthNumber && year === new Date().getFullYear())
    // ) {
    //   days += `<div class="day">${i}</div>`;
    // } else {
    //   days += `<div class="day futureDays">${i}</div>`;
    // }
    const isSelected = selectedDates.some((ele) => ele.day.innerHTML === i);

    if (isTillCurrentDate) {
      days += `<div class='day tillCurrentDate${
        isSelected ? " selected" : ""
      }'>${i}</div>`;
    } else if (isToday && (currentDayOfWeek === 0 || currentDayOfWeek === 6)) {
      days += `<div class='day today holiday'>${i}</div>`;
    } else if (isToday) {
      days += `<div class='day today${
        isSelected ? " selected" : ""
      }'>${i}</div>`;
    } else if (isHoliday) {
      days += `<div class='day holiday'>${i}</div>`;
    } else if (
      (month === new Date().getMonth() && year === new Date().getFullYear()) ||
      (month === nextMonthNumber && year === new Date().getFullYear())
    ) {
      days += `<div class="day${isSelected ? " selected" : ""}">${i}</div>`;
    } else {
      days += `<div class="day futureDays${
        isSelected ? " selected" : ""
      }">${i}</div>`;
    }

    // compare the dates of selected ones with new calender and modify the dates
    selectedDates.forEach((ele) => {
      console.log(ele.day.innerText, ":ele.day.textcontent");
      if (i === ele.day.innerText) {
        console.log(i);
        days += `<div class="day selected">${i}</div>`;
        console.log(days);
      }
    });
  }

  //nxt month days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class='day nxt-date'>${j}</div>`;
  }
  daysContainer.innerHTML = days;
  //add listner after calender initialized
}

initCalendar();
addListner();
// updateSelectedDates();

//prev month
prev.addEventListener("click", () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
});

//next month
nxt.addEventListener("click", () => {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
});
