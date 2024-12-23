const calendar = document.getElementsByClassName("calendar"),
  date = document.getElementById("date"),
  daysContainer = document.getElementById("days"),
  prev = document.getElementById("prev"),
  nxt = document.getElementById("nxt");

let selectedDates = [];
let rangeElements = [];

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

  arr.forEach((ele) => {
    const newDate = {
      day: ele,
      month,
      year,
    };

    // Check if the exact date already exists
    const isDuplicate = selectedDates.some(
      (date) =>
        date.day.innerHTML === newDate.day.innerHTML &&
        date.month === newDate.month &&
        date.year === newDate.year
    );

    if (!isDuplicate) {
      selectedDates.push(newDate);
    }
  });
}

function addListner() {
  document.addEventListener("click", (e) => {
    const isnotvalidDay = ["tillCurrentDate", "holiday"].some((cls) =>
      e.target.classList.contains(cls)
    );
    if (isnotvalidDay) return;
    if (!e.target.classList.contains("day")) {
      return;
    }

    // Clear all previous selections if there are already two selected dates

    if (selectedDates.length >= 2) {
      console.log(selectedDates, "selectedDates");
      console.log(rangeElements, "rangeElements");
      selectedDates.forEach((ele) => {
        ele.day.classList.remove("selected");
      });
      rangeElements.forEach((ele) => {
        ele.day.classList.remove("in-range");
      });

      selectedDates = [];
      rangeElements = [];
    }
    // Add the 'selected' class to the clicked element
    e.target.classList.add("selected");
    updateSelectedDates();
    if (selectedDates.length == 2) {
      const firstDate = parseInt(selectedDates[0].day.innerHTML);
      const lastDate = parseInt(selectedDates[1].day.innerHTML);
      //here check year and month and day and alert you reverse days
      const firstFullDate = new Date(
        selectedDates[0].year,
        selectedDates[0].month,
        firstDate
      );
      const secondFullDate = new Date(
        selectedDates[1].year,
        selectedDates[1].month,
        lastDate
      );
      // Check if the second date is earlier than the first date
      if (secondFullDate < firstFullDate) {
        alert("You selected the dates in reverse order. Please correct them!");
        selectedDates[1].day.classList.remove("selected");
        selectedDates.pop(); // Remove the second date from the selection
        return; // Exit to allow the user to correct the selection
      }

      // Loop through the dates from startDate to endDate
      let currentDate = new Date(firstFullDate);
      while (currentDate <= secondFullDate) {
        // Find the corresponding DOM element for this current date
        const rangeElement = Array.from(daysContainer.children).find((el) => {
          const elDate = parseInt(el.innerHTML);
          const elMonth = currentDate.getMonth(); // Get month of currentDate
          const elYear = currentDate.getFullYear(); // Get year of currentDate

          return (
            elDate === currentDate.getDate() &&
            elMonth === currentDate.getMonth() &&
            elYear === currentDate.getFullYear() &&
            el.classList.contains("day")
          );
        });

        // Check if the date is a holiday
        const isICFAIHoliday = icfaiHolidays.some(
          (holiday) =>
            holiday.date === currentDate.getDate() &&
            holiday.month === currentDate.getMonth() &&
            holiday.year === currentDate.getFullYear()
        );
        const isHoliday =
          isICFAIHoliday ||
          currentDate.getDay() === 0 ||
          currentDate.getDay() === 6;

        // Add the 'in-range' class if the element exists and it's not a holiday
        if (rangeElement && !isHoliday) {
          rangeElement.classList.add("in-range");
          rangeElements.push({
            day: rangeElement,
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
          });
        }

        // Increment currentDate by 1 day
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
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

    if (isTillCurrentDate) {
      days += `<div class='day tillCurrentDate' data-date="${i}/${month}/${year}" >${i}</div>`;
    } else if (isToday && (currentDayOfWeek === 0 || currentDayOfWeek === 6)) {
      days += `<div class='day today holiday' data-date="${i}/${month}/${year}">${i}</div>`; // Add both `today` and `holiday` classes
    } else if (isToday) {
      days += `<div class='day today' data-date="${i}/${month}/${year}">${i}</div>`;
    } else if (isHoliday) {
      days += `<div class='day holiday' data-date="${i}/${month}/${year}">${i}</div>`;
    } else if (
      (month === new Date().getMonth() && year === new Date().getFullYear()) ||
      (month === nextMonthNumber && year === new Date().getFullYear())
    ) {
      days += `<div class="day" data-date="${i}/${month}/${year}">${i}</div>`;
    } else {
      days += `<div class="day futureDays" data-date="${i}/${month}/${year}">${i}</div>`;
    }
    const isSelected = selectedDates.some((ele) => ele.day.innerHTML === i);

    // compare the dates of selected ones with new calender and modify the dates
  }

  //nxt month days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class='day nxt-date' >${j}</div>`;
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
