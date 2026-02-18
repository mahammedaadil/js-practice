const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("name-filter-input");
let dropDown = document.getElementById("display-records");
const pagesDiv = document.getElementById("pages-btns");
let switchMode = 0;
let currentEditId = null;
let userData = [];
let currentPage = 1;
let recordsPerPage = 5;
let currentGenderEditIndex = null;

const setLocalStorage = (data) => {
  localStorage.setItem("userData", JSON.stringify(data));
};

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("userData"));
};

window.addEventListener("load", () => {
  userData = getLocalStorage() || [];
  displayData(userData);
  renderPages();
});

window.addEventListener("click", (e) => {
  if (!tableBody.contains(e.target)) {
    onGenderFocusOutEvent(currentGenderEditIndex);
  }
});

const displayData = (data) => {
  tableBody.innerHTML = "";
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  const pageData = data.slice(startIndex, endIndex);

  pageData.forEach((user, index) => {
    const actualIndex = startIndex + index;
    dataRawRendering(actualIndex, user);
  });
};

const dataRawRendering = (index, newUser) => {
  const dataRow = document.createElement("tr");
  dataRow.id = `dataRow:${index}`;
  const editableDataRaw = document.getElementById(
    `editable-input-row:${index}`,
  );
  const tdId = document.createElement("td");
  tdId.id = `td-id:${index}`;
  tdId.textContent = newUser.id;
  tdId.ondblclick = () => dblClickEdit(index, "id", "number");
  const tdName = document.createElement("td");
  tdName.id = `td-name:${index}`;
  tdName.textContent = newUser.name;
  tdName.ondblclick = () => dblClickEdit(index, "name", "text");

  const tdAge = document.createElement("td");
  tdAge.id = `td-age:${index}`;
  tdAge.textContent = newUser.age;
  tdAge.ondblclick = () => dblClickEdit(index, "age", "number");
  const tdGender = document.createElement("td");
  tdGender.ondblclick = () => onGenderDblClickEdit(index);
  tdGender.id = `td-gender:${index}`;
  tdGender.textContent = newUser.gender;
  const tdButtons = document.createElement("td");
  tdButtons.id = `td-buttons:${index}`;
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("btn", "btn-success", "btn-sm");
  editBtn.setAttribute("id", `editButton:${index}`);
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
  deleteBtn.setAttribute("id", `deleteBtn${index}`);
  tdButtons.append(editBtn, deleteBtn);
  dataRow.append(tdId, tdName, tdAge, tdGender, tdButtons);
  tableBody.appendChild(dataRow);
  deleteBtn.addEventListener("click", () => {
    addBtn.disabled = false;
    deleteData(index);
    displayData(userData);
    renderPages();
  });
  editBtn.onclick = () => {
    const newDataRow = document.getElementById("newDataRow");
    if (newDataRow) newDataRow.remove();
    editDataRow(newUser, index);
  };
  if (editableDataRaw) {
    editableDataRaw.replaceWith(dataRow);
  }
};

const createNewRow = () => {
  if (document.getElementById(`uid`)) return;
  const newDataRow = document.createElement("tr");
  newDataRow.id = "newDataRow";
  const idData = document.createElement("td");
  const idInput = document.createElement("input");
  idInput.classList.add("form-control");
  idData.appendChild(idInput);
  idInput.setAttribute("id", `uid`);
  idInput.setAttribute("type", "number");
  idInput.setAttribute("placeholder", "Enter Id");
  const nameData = document.createElement("td");
  const nameInput = document.createElement("input");
  nameInput.classList.add("form-control");
  nameData.appendChild(nameInput);
  nameInput.setAttribute("id", "name");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("placeholder", "Enter Name");
  const ageData = document.createElement("td");
  const ageInput = document.createElement("input");
  ageInput.classList.add("form-control");
  ageData.appendChild(ageInput);
  ageInput.setAttribute("id", "age");
  ageInput.setAttribute("type", "number");
  ageInput.setAttribute("placeholder", "Enter Age");
  const genderData = document.createElement("td");
  const genderMaleInput = document.createElement("input");
  const genderFemaleInput = document.createElement("input");
  genderData.innerHTML = `<label for="male">Male</label>`;
  genderMaleInput.setAttribute("id", "male");
  genderFemaleInput.setAttribute("id", "female");
  genderMaleInput.setAttribute("type", "radio");
  genderMaleInput.style.margin = "4px";
  genderFemaleInput.style.margin = "4px";
  genderFemaleInput.setAttribute("type", "radio");
  genderMaleInput.setAttribute("value", "male");
  genderFemaleInput.setAttribute("value", "female");
  genderMaleInput.setAttribute("name", "gender");
  genderFemaleInput.setAttribute("name", "gender");
  genderMaleInput.classList.add("form-check-input");
  genderFemaleInput.classList.add("form-check-input");
  genderData.appendChild(genderMaleInput);
  genderData.innerHTML += `<label for="female">Female</label>`;
  genderData.appendChild(genderFemaleInput);
  const buttonsColumn = document.createElement("td");
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.classList.add("btn", "btn-primary", "btn-sm");
  saveBtn.setAttribute("id", "saveBtn");
  buttonsColumn.appendChild(saveBtn);
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.marginLeft = "10px";
  cancelBtn.classList.add("btn", "btn-secondary", "btn-sm");
  cancelBtn.setAttribute("id", "cancelBtn");
  buttonsColumn.appendChild(cancelBtn);
  cancelBtn.addEventListener("click", () => {
    newDataRow.remove();
  });
  newDataRow.append(idData, nameData, ageData, genderData, buttonsColumn);
  tableBody.appendChild(newDataRow);
  const uid = document.getElementById(`uid`);
  const name = document.getElementById("name");
  const age = document.getElementById("age");
  saveBtn.addEventListener("click", () => {
    const newData = {
      id: uid.value,
      name: name.value,
      age: age.value,
      gender: document.querySelector("input[name=gender]:checked").value,
    };
    userData.push(newData);
    setLocalStorage(userData);
    displayData(userData);
    renderPages();
  });
};
const editDataRow = (funUser, index) => {
  if (currentEditId != null)
    dataRawRendering(currentEditId, userData[currentEditId]);
  currentEditId = index;
  const dataInputRow = document.createElement("tr");
  dataInputRow.id = `editable-input-row:${index}`;
  const dataRow = document.getElementById(`dataRow:${index}`);
  const tdId = document.createElement("td");
  const inputId = document.createElement("input");
  inputId.setAttribute("type", "number");
  inputId.value = funUser.id;
  inputId.classList.add("form-control");
  tdId.appendChild(inputId);
  const tdName = document.createElement("td");
  const inputName = document.createElement("input");
  inputName.value = funUser.name;
  inputName.classList.add("form-control");
  tdName.appendChild(inputName);
  const tdAge = document.createElement("td");
  const inputAge = document.createElement("input");
  inputAge.setAttribute("type", "number");
  inputAge.classList.add("form-control");
  inputAge.value = funUser.age;
  tdAge.appendChild(inputAge);

  const tdGender = document.createElement("td");
  const inputMaleGender = document.createElement("input");
  inputMaleGender.style.margin = "4px";
  inputMaleGender.setAttribute("type", "radio");
  inputMaleGender.classList.add("form-check-input");
  inputMaleGender.setAttribute("id", "male");
  inputMaleGender.setAttribute("name", `gender-${index}`);
  inputMaleGender.setAttribute("value", "male");

  const inputFemaleGender = document.createElement("input");
  inputFemaleGender.style.margin = "4px";
  inputFemaleGender.setAttribute("type", "radio");
  inputFemaleGender.classList.add("form-check-input");
  inputFemaleGender.setAttribute("id", "female");
  inputFemaleGender.setAttribute("name", `gender-${index}`);
  inputFemaleGender.setAttribute("value", "female");

  if (funUser.gender === "male") {
    inputMaleGender.checked = true;
  }
  if (funUser.gender === "female") {
    inputFemaleGender.checked = true;
  }

  const maleLabel = document.createElement("label");
  maleLabel.setAttribute("for", "male");
  maleLabel.textContent = "Male";
  tdGender.appendChild(maleLabel);
  tdGender.appendChild(inputMaleGender);
  const femaleLabel = document.createElement("label");
  femaleLabel.textContent = "Female";
  femaleLabel.setAttribute("for", "female");
  tdGender.appendChild(femaleLabel);
  tdGender.appendChild(inputFemaleGender);

  const tdAction = document.createElement("td");
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.classList.add("btn", "btn-primary", "btn-sm");
  saveBtn.setAttribute("id", `saveBtn:${index}`);
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.marginLeft = "10px";
  cancelBtn.classList.add("btn", "btn-secondary", "btn-sm");
  cancelBtn.setAttribute("id", `cancelBtn:${index}`);
  tdAction.append(saveBtn, cancelBtn);
  dataInputRow.append(tdId, tdName, tdAge, tdGender, tdAction);
  dataRow.replaceWith(dataInputRow);
  if (dataInputRow) {
    addBtn.disabled = true;
  }

  saveBtn.onclick = () => {
    addBtn.disabled = false;
    const updatadData = userData.map((data, idx) => {
      if (idx === index) {
        data.id = inputId.value;
        data.name = inputName.value;
        data.age = inputAge.value;
        data.gender = document.querySelector(
          `input[name=gender-${idx}]:checked`,
        ).value;
      }
      return data;
    });

    setLocalStorage(updatadData);
    userData = updatadData;
    currentEditId = null;
    displayData(userData);
    renderPages();
  };
  cancelBtn.addEventListener("click", () => {
    addBtn.disabled = false;
    currentEditId = null;
    displayData(userData);
    renderPages();
  });
};

const deleteData = (index) => {
  const data = getLocalStorage();
  data.splice(index, 1);
  setLocalStorage(data);
  userData = data;
};

const dblClickEdit = (index, field, type) => {
  if (currentGenderEditIndex != null) {
    onGenderFocusOutEvent(currentGenderEditIndex);
  }
  const changeUser = userData[index];
  const cell = document.getElementById(`td-${field}:${index}`);
  const changedCell = document.createElement("td");
  changedCell.id = `td-change-${field}:${index}`;
  const changeInput = document.createElement("input");
  changeInput.classList.add("form-control", "w-50");
  changeInput.oninput = () => {
    changeUser[field] = changeInput.value;
    setLocalStorage(userData);
  };
  changeInput.setAttribute("type", type);
  changeInput.id = `change-${field}:${index}`;
  changeInput.value = changeUser[field];
  changedCell.append(changeInput);
  cell.replaceWith(changedCell);
  changeInput.focus();
  changeInput.addEventListener("focusout", () => {
    let newCell = document.createElement("td");
    newCell.id = `td-${field}:${index}`;
    newCell.textContent = changeUser[field];
    changedCell.replaceWith(newCell);
    newCell.ondblclick = () => dblClickEdit(index, field, type);
  });
};

const onGenderFocusOutEvent = (idx) => {
  const tdGenderChange = document.getElementById(`td-gender-change:${idx}`);
  const user = userData[idx];
  let tdGender = document.createElement("td");
  tdGender.id = `td-gender:${idx}`;
  tdGender.textContent = user.gender;
  tdGenderChange.replaceWith(tdGender);
  tdGender.ondblclick = () => onGenderDblClickEdit(idx);
  currentGenderEditIndex = null;
};

const onGenderDblClickEdit = (index) => {
  const changeUser = userData[index];
  const tdGender = document.getElementById(`td-gender:${index}`);
  const tdGenderChange = document.createElement("td");
  tdGenderChange.id = `td-gender-change:${index}`;

  if (currentGenderEditIndex != null) {
    onGenderFocusOutEvent(currentGenderEditIndex);
  }
  currentGenderEditIndex = index;

  const changeGenderFemale = document.createElement("input");
  changeGenderFemale.setAttribute("type", "radio");
  changeGenderFemale.style.margin = "4px";
  changeGenderFemale.classList.add("form-check-input");
  changeGenderFemale.setAttribute("name", `gender-${index}`);
  changeGenderFemale.id = `change-female:${index}`;
  changeGenderFemale.value = "female";
  if (changeUser.gender == "female") {
    changeGenderFemale.checked = true;
  }
  changeGenderFemale.addEventListener("click", () => {
    changeUser.gender = changeGenderFemale.value;
    setLocalStorage(userData);
    onGenderFocusOutEvent(index);
  });

  const changeGenderMale = document.createElement("input");
  changeGenderMale.setAttribute("type", "radio");
  changeGenderMale.style.margin = "4px";
  changeGenderMale.classList.add("form-check-input");
  changeGenderMale.setAttribute("name", `gender-${index}`);
  changeGenderMale.id = `change-male:${index}`;
  changeGenderMale.value = "male";
  if (changeUser.gender == "male") {
    changeGenderMale.checked = true;
  }
  changeGenderMale.addEventListener("click", () => {
    changeUser.gender = changeGenderMale.value;
    setLocalStorage(userData);
    onGenderFocusOutEvent(index);
  });
  tdGenderChange.innerHTML = `<label for="change-male:${index}">Male</label>`;
  tdGenderChange.appendChild(changeGenderMale);
  const changeGenderFemaleLabel = document.createElement("label");
  changeGenderFemaleLabel.innerText = "Female";
  changeGenderFemaleLabel.setAttribute("for", `change-female:${index}`);
  tdGenderChange.append(changeGenderFemaleLabel, changeGenderFemale);
  tdGender.replaceWith(tdGenderChange);
};

const compare = (key, type) => {
  switch (type) {
    case "number":
      return switchMode === 0
        ? (a, b) => b[key] - a[key]
        : (a, b) => a[key] - b[key];
    case "string":
      return switchMode === 0
        ? (a, b) => b[key].localeCompare(a[key])
        : (a, b) => a[key].localeCompare(b[key]);
    default:
      break;
  }
};

const ascDecNormal = (key, type) => {
  if (switchMode === 0) {
    const dec = userData.toSorted(compare(key, type));
    displayData(dec);
    renderPages();
    switchMode += 1;
  } else if (switchMode === 1) {
    const asc = userData.toSorted(compare(key, type));
    displayData(asc);
    renderPages();
    switchMode += 1;
  } else {
    displayData(userData);
    switchMode = 0;
  }
};

const filterByName = () => {
  const toSearch = searchInput.value.toUpperCase();
  const filteredData = userData.filter((user) => {
    return user.name.toUpperCase().includes(toSearch);
  });
  displayData(filteredData);
  renderPages();
};

const dataLimit = () => {
  const data = userData;
  const limit = parseInt(dropDown.value);
  recordsPerPage = limit;
  const topRecords = data.slice(0, limit);
  displayData(topRecords);
  renderPages();
};

const renderPages = (index) => {
  pagesDiv.innerHTML = "";
  let total = Math.ceil(userData.length / recordsPerPage);
  for (let i = 1; i <= total; i++) {
    let btn = document.createElement("button");
    btn.style.display = "inline-block";
    btn.style.marginRight = "10px";
    btn.id = `page-btn:${index}`;
    btn.textContent = i;
    btn.classList.add("btn", "btn-secondary", "btn-sm");
    pagesDiv.appendChild(btn);
    btn.onclick = () => {
      btnPrevious.disabled = false;
      btnNext.disabled = false;
      msg.innerHTML = "";
      currentPage = i;
      displayData(userData);
    };
  }
  const pageBtn = document.getElementById(`page-btn:${index}`);
  const btnNext = document.createElement("button");
  btnNext.id = `next-btn`;
  btnNext.textContent = "Next";
  btnNext.style.marginLeft = "15px";
  btnNext.classList.add("btn", "btn-primary", "btn-sm");
  pagesDiv.appendChild(btnNext);

  const btnPrevious = document.createElement("button");
  btnPrevious.id = `prev-btn`;
  btnPrevious.style.marginLeft = "15px";
  btnPrevious.style.marginRight = "15px";
  btnPrevious.textContent = "Prev";
  btnPrevious.classList.add("btn", "btn-primary", "btn-sm");
  pagesDiv.insertBefore(btnPrevious, pageBtn);

  const msg = document.getElementById("alert-msg");

  const nextPrevBtns = (disBtnVal, btnVal, currentPageVal, condition) => {
    disBtnVal.disabled = false;
    msg.innerHTML = "";

    if (condition) {
      btnVal.disabled = true;
      msg.textContent = `No More Pages`;
      return;
    }
    currentPageVal;
    displayData(userData);
  };
  btnNext.onclick = () => {
    nextPrevBtns(btnPrevious, btnNext, currentPage++, currentPage > total);
  };

  btnPrevious.onclick = () => {
    nextPrevBtns(btnNext, btnPrevious, currentPage--, currentPage <= 0);
  };
  currentPage = 1;
};
