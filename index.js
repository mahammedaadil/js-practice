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
  displayData(pageIndexing(userData));
  renderPages();
});

window.addEventListener("click", (e) => {
  if (!tableBody.contains(e.target)) {
    onGenderFocusOutEvent(currentGenderEditIndex);
  }
});

const displayData = (users) => {
  tableBody.innerHTML = "";
  users.forEach((user, index) => {
    dataRawRendering(index, user);
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
  editBtn.setAttribute("id", `editButton:${index}`);
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("id", `deleteBtn${index}`);
  tdButtons.append(editBtn, deleteBtn);
  dataRow.append(tdId, tdName, tdAge, tdGender, tdButtons);
  tableBody.appendChild(dataRow);
  deleteBtn.addEventListener("click", () => {
    addBtn.disabled = false;
    deleteData(index);
    displayData(pageIndexing(userData));
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
  idData.appendChild(idInput);
  idInput.setAttribute("id", `uid`);
  idInput.setAttribute("type", "number");
  idInput.setAttribute("placeholder", "Enter Id");
  const nameData = document.createElement("td");
  const nameInput = document.createElement("input");
  nameData.appendChild(nameInput);
  nameInput.setAttribute("id", "name");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("placeholder", "Enter Name");
  const ageData = document.createElement("td");
  const ageInput = document.createElement("input");
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
  genderFemaleInput.setAttribute("type", "radio");
  genderMaleInput.setAttribute("value", "male");
  genderFemaleInput.setAttribute("value", "female");
  genderMaleInput.setAttribute("name", "gender");
  genderFemaleInput.setAttribute("name", "gender");
  genderData.appendChild(genderMaleInput);
  genderData.innerHTML += `<label for="female">Female</label>`;
  genderData.appendChild(genderFemaleInput);
  const buttonsColumn = document.createElement("td");
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.setAttribute("id", "saveBtn");
  buttonsColumn.appendChild(saveBtn);
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
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
    displayData(pageIndexing(userData));
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
  tdId.appendChild(inputId);
  const tdName = document.createElement("td");
  const inputName = document.createElement("input");
  inputName.value = funUser.name;
  tdName.appendChild(inputName);
  const tdAge = document.createElement("td");
  const inputAge = document.createElement("input");
  inputAge.setAttribute("type", "number");
  inputAge.value = funUser.age;
  tdAge.appendChild(inputAge);
  const tdGender = document.createElement("td");
  const inputMaleGender = document.createElement("input");
  inputMaleGender.setAttribute("type", "radio");
  inputMaleGender.setAttribute("id", "male");
  inputMaleGender.setAttribute("name", `gender-${index}`);
  inputMaleGender.setAttribute("value", "male");
  if (funUser.gender === "male") {
    inputMaleGender.checked = true;
  }
  const inputFemaleGender = document.createElement("input");
  inputFemaleGender.setAttribute("type", "radio");
  inputFemaleGender.setAttribute("id", "female");
  inputFemaleGender.setAttribute("name", `gender-${index}`);
  inputFemaleGender.setAttribute("value", "female");
  if (funUser.gender === "female") {
    inputFemaleGender.checked = true;
  }
  tdGender.innerHTML = `<label for="male">Male</label>`;
  tdGender.appendChild(inputMaleGender);
  tdGender.innerHTML += `<label for="female">Female</label>`;
  tdGender.appendChild(inputFemaleGender);
  const tdAction = document.createElement("td");
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.setAttribute("id", `saveBtn:${index}`);
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.setAttribute("id", `cancelBtn:${index}`);
  tdAction.append(saveBtn, cancelBtn);
  dataInputRow.append(tdId, tdName, tdAge, tdGender, tdAction);
  dataRow.replaceWith(dataInputRow);
  if (dataInputRow) {
    addBtn.disabled = true;
  }
  saveBtn.onclick = () => {
    addBtn.disabled = false;
    const data = getLocalStorage();
    const updatadData = data.map((userData, idx) => {
      if (idx === index) {
        userData.id = inputId.value;
        userData.name = inputName.value;
        userData.age = inputAge.value;
        userData.gender = document.querySelector(
          `input[name=gender-${idx}]:checked`,
        ).value;
      }
      return userData;
    });
    setLocalStorage(updatadData);
    userData = updatadData;
    currentEditId = null;
    displayData(pageIndexing(userData));
    renderPages();
  };
  cancelBtn.addEventListener("click", () => {
    addBtn.disabled = false;
    currentEditId = null;
    displayData(pageIndexing(userData));
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
    displayData(pageIndexing(dec));
    renderPages();
    switchMode += 1;
  } else if (switchMode === 1) {
    const asc = userData.toSorted(compare(key, type));
    displayData(pageIndexing(asc));
    renderPages();
    switchMode += 1;
  } else {
    displayData(pageIndexing(userData));
    switchMode = 0;
  }
};

const filterByName = () => {
  const toSearch = searchInput.value.toUpperCase();
  const filteredData = userData.filter((user) => {
    return user.name.toUpperCase().includes(toSearch);
  });
  displayData(pageIndexing(filteredData));
  renderPages();
};

const dataLimit = () => {
  const data = userData;
  const limit = parseInt(dropDown.value);
  recordsPerPage = limit;
  const topRecords = data.slice(0, limit);
  displayData(topRecords);
  renderPages();
  if (limit === 0) {
    displayData(pageIndexing(data));
  }
};

const pageIndexing = (data) => {
  let startIndex = (currentPage - 1) * recordsPerPage;
  let endIndex = startIndex + recordsPerPage;
  return data.slice(startIndex, endIndex);
};

const renderPages = () => {
  pagesDiv.innerHTML = "";
  let total = Math.ceil(userData.length / recordsPerPage);
  for (let i = 1; i <= total; i++) {
    let btn = document.createElement("button");
    btn.id = `page-btn`;
    btn.textContent = i;
    pagesDiv.appendChild(btn);
    btn.onclick = () => {
      pre.disabled = false;
      next.disabled = false;
      msg.innerHTML = "";
      currentPage = i;
      displayData(pageIndexing(userData));
    };
  }
  const pageBtn = document.getElementById(`page-btn`);
  const next = document.createElement("button");
  next.id = `next-btn`;
  next.textContent = "Next";
  pagesDiv.appendChild(next);

  const pre = document.createElement("button");
  pre.id = `prev-btn`;
  pre.textContent = "Prev";
  pagesDiv.insertBefore(pre, pageBtn);

  const msg = document.getElementById("alert-msg");

  const nextPrevBtns = (disBtnVal, btnVal, currentPageVal, condition) => {
    disBtnVal.disabled = false;
    msg.innerHTML = "";

    if (condition) {
      btnVal.disabled = true;
      msg.style.color = "red";
      msg.textContent = `No More Pages`;
      return;
    }
    currentPageVal;
    displayData(pageIndexing(userData));
  };
  next.onclick = () => {
    nextPrevBtns(pre, next, currentPage++, currentPage > total);
  };

  pre.onclick = () => {
    nextPrevBtns(next, pre, currentPage--, currentPage <= 0);
  };
  currentPage = 1;
};
