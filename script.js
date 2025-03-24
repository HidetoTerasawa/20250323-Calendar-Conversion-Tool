document.addEventListener("DOMContentLoaded", () => {
  const eraRadios = document.querySelectorAll("input[name='era']");
  const yearInput = document.getElementById("japaneseYearInput");
  const errorMessage = document.getElementById("error-message");
  const errorMessage2 = document.getElementById("error-message-2");
  const gregorianInput = document.getElementById("gregorian-input");
  const japaneseEraOutput = document.getElementById("japanese-era-output");

  const ranges = {
    令和: { min: 1, max: new Date().getFullYear() - 2018 },
    平成: { min: 1, max: 31 },
    昭和: { min: 1, max: 64 },
    大正: { min: 1, max: 15 },
    明治: { min: 1, max: 45 },
  };

  eraRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const selectedEra = radio.value;
      yearInput.placeholder =
        `${ranges[selectedEra]?.min}~${ranges[selectedEra]?.max}` || "";
      errorMessage.textContent = "";
    });
  });

  yearInput.addEventListener("input", () => {
    const selectedEra = document.querySelector(
      "input[name='era']:checked"
    )?.value;
    const inputValue = parseInt(yearInput.value, 10);

    if (selectedEra && ranges[selectedEra]) {
      const { min, max } = ranges[selectedEra];
      if (inputValue < min || inputValue > max) {
        errorMessage.textContent = "有効な数を入力してください";
      } else {
        errorMessage.textContent = "";
      }
    }
  });

  function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `<p>${message}</p><button class="close-btn">閉じる</button>`;
    document.body.appendChild(popup);
    popup.style.display = "block";

    // Add event listener to the close button
    popup.querySelector(".close-btn").addEventListener("click", () => {
      closePopup(popup);
    });
  }

  function closePopup(popup) {
    popup.style.display = "none";
    document.body.removeChild(popup);
  }

  function showError(message, errorElement) {
    alert(message); // エラーメッセージをalertで表示
    setTimeout(() => {
      errorElement.style.display = "none";
    }, 3000);
  }

  document
    .getElementById("to-gregorian")
    .addEventListener("click", function () {
      const era = document.querySelector('input[name="era"]:checked')?.value;
      if (!era) {
        showError("和暦のいずれかを選択してください", errorMessage);
        return;
      }
      const yearInputValue = document.getElementById("japaneseYearInput").value;
      if (yearInputValue === "") {
        alert("値を入力してください");
        document.getElementById("gregorian-output").textContent = "";
        return;
      }
      const year = parseInt(yearInputValue);
      let gregorianYear;
      let isValid = true;

      switch (era) {
        case "令和":
          if (year < 1 || year > new Date().getFullYear() - 2018)
            isValid = false;
          gregorianYear = year + 2018;
          break;
        case "平成":
          if (year < 1 || year > 31) isValid = false;
          gregorianYear = year + 1988;
          break;
        case "昭和":
          if (year < 1 || year > 64) isValid = false;
          gregorianYear = year + 1925;
          break;
        case "大正":
          if (year < 1 || year > 15) isValid = false;
          gregorianYear = year + 1911;
          break;
        case "明治":
          if (year < 1 || year > 45) isValid = false;
          gregorianYear = year + 1867;
          break;
        default:
          gregorianYear = "不明";
      }

      if (!isValid) {
        showError("適切な値を入力してください", errorMessage);
        document.getElementById("gregorian-output").textContent = "";
      } else {
        errorMessage.textContent = "";
        document.getElementById(
          "gregorian-output"
        ).textContent = `${era}${year}年は西暦${gregorianYear}年です。`;
        showPopup(`西暦: ${gregorianYear}`);
      }
    });

  document.getElementById("to-japanese-era").addEventListener("click", () => {
    const selectedYear = parseInt(gregorianInput.value);
    if (isNaN(selectedYear)) {
      showError("プルダウンから西暦を選択してください", errorMessage2);
      japaneseEraOutput.textContent = "";
      return;
    }
    if (selectedYear < 1868 || selectedYear > new Date().getFullYear()) {
      showError("適切な値を入力してください", errorMessage2);
      japaneseEraOutput.textContent = "";
    } else {
      errorMessage2.textContent = "";
      let era = "";
      let eraYear = 0;

      if (selectedYear >= 2019) {
        era = "令和";
        eraYear = selectedYear - 2018;
      } else if (selectedYear >= 1989) {
        era = "平成";
        eraYear = selectedYear - 1988;
      } else if (selectedYear >= 1926) {
        era = "昭和";
        eraYear = selectedYear - 1925;
      } else if (selectedYear >= 1912) {
        era = "大正";
        eraYear = selectedYear - 1911;
      } else if (selectedYear >= 1868) {
        era = "明治";
        eraYear = selectedYear - 1867;
      }

      japaneseEraOutput.textContent = `${era} ${eraYear}年`;
      showPopup(`和暦: ${era} ${eraYear}年`);
      japaneseEraOutput.textContent = `西暦"${selectedYear}"年は"${era} ${eraYear}年"です。`;
    }
  });

  function setJapaneseYearRange() {
    const era = document.querySelector('input[name="era"]:checked').value;
    switch (era) {
      case "令和":
        yearInput.max = new Date().getFullYear() - 2018;
        break;
      case "平成":
        yearInput.max = 31;
        break;
      case "昭和":
        yearInput.max = 64;
        break;
      case "大正":
        yearInput.max = 15;
        break;
      case "明治":
        yearInput.max = 45;
        break;
      default:
        yearInput.max = 1;
    }
  }

  eraRadios.forEach((radio) => {
    radio.addEventListener("change", setJapaneseYearRange);
  });

  window.addEventListener("load", setJapaneseYearRange);

  // プレースホルダーの色を一致させる
  yearInput.style.color = window.getComputedStyle(gregorianInput).color;
  yearInput.style.setProperty("--placeholder-color", "white");
  yearInput.addEventListener("input", () => {
    if (yearInput.value === "") {
      yearInput.style.color = "white";
    } else {
      yearInput.style.color = window.getComputedStyle(gregorianInput).color;
    }
  });
});
