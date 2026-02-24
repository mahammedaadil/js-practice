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

const pageWiseDisplay = (data) => {
  tableBody.innerHTML = "";

  data.forEach((user, index) => {
    dataRawRendering(index, user);
  });
};

const findIndexedData = (data) => {
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  return data.slice(startIndex, endIndex);
};

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
  dropDown.disabled = false;
};

const dataRawRendering = (index, user) => {
  const dataRow = document.createElement("tr");
  dataRow.id = `dataRow:${index}`;
  const editableDataRaw = document.getElementById(
    `editable-input-row:${index}`,
  );
  const tdId = document.createElement("td");
  tdId.id = `td-id:${index}`;
  tdId.textContent = user.id;
  tdId.ondblclick = () => dblClickEdit(index, "id", "number");
  const tdName = document.createElement("td");
  tdName.id = `td-name:${index}`;
  tdName.textContent = user.name;
  tdName.ondblclick = () => dblClickEdit(index, "name", "text");

  const tdAge = document.createElement("td");
  tdAge.id = `td-age:${index}`;
  tdAge.textContent = user.age;
  tdAge.ondblclick = () => dblClickEdit(index, "age", "number");
  const tdGender = document.createElement("td");
  tdGender.ondblclick = () => onGenderDblClickEdit(index);
  tdGender.id = `td-gender:${index}`;
  tdGender.textContent = user.gender;
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
    editDataRow(user, index);
  };
  if (editableDataRaw) {
    editableDataRaw.replaceWith(dataRow);
  }
};

const createNewRow = () => {
  dropDown.disabled = true;
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

const editDataRow = (user, index) => {
  if (currentEditId != null)
    dataRawRendering(currentEditId, userData[currentEditId]);
  currentEditId = index;
  const dataInputRow = document.createElement("tr");
  dataInputRow.id = `editable-input-row:${index}`;
  const dataRow = document.getElementById(`dataRow:${index}`);
  const tdId = document.createElement("td");
  const inputId = document.createElement("input");
  inputId.setAttribute("type", "number");
  inputId.value = user.id;
  inputId.classList.add("form-control");
  tdId.appendChild(inputId);
  const tdName = document.createElement("td");
  const inputName = document.createElement("input");
  inputName.value = user.name;
  inputName.classList.add("form-control");
  tdName.appendChild(inputName);
  const tdAge = document.createElement("td");
  const inputAge = document.createElement("input");
  inputAge.setAttribute("type", "number");
  inputAge.classList.add("form-control");
  inputAge.value = user.age;
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

  if (user.gender === "male") {
    inputMaleGender.checked = true;
  }
  if (user.gender === "female") {
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
  const orderedPageWise = findIndexedData(userData);
  if (switchMode === 0) {
    document.body.style.background = "red";
    const dec = orderedPageWise.toSorted(compare(key, type));
    pageWiseDisplay(dec);
    renderPages();
    switchMode += 1;
  } else if (switchMode === 1) {
    document.body.style.background = "blue";
    const asc = orderedPageWise.toSorted(compare(key, type));
    pageWiseDisplay(asc);
    renderPages();
    switchMode += 1;
  } else {
    document.body.style.background = "green";
    displayData(userData);
    switchMode = 0;
  }
};

const filterByName = () => {
  const pageWiseFilter = findIndexedData(userData);
  const toSearch = searchInput.value.toUpperCase();
  const filteredData = pageWiseFilter.filter((user) => {
    return user.name.toUpperCase().includes(toSearch);
  });
  renderPages();
  pageWiseDisplay(filteredData);
};

const dataLimit = () => {
  currentPage = 1;
  const data = userData;
  let limit = parseInt(dropDown.value);
  recordsPerPage = limit;
  if (limit === 0) limit = 5;
  const topRecords = data.slice(0, limit);
  displayData(topRecords);
  renderPages();
};

const renderPages = () => {
  pagesDiv.innerHTML = "";
  let total = Math.ceil(userData.length / recordsPerPage);
  const firstBtn = document.createElement("button");
  firstBtn.id = `first-btn`;
  firstBtn.style.marginLeft = "15px";
  firstBtn.style.marginRight = "15px";
  firstBtn.textContent = "First";
  firstBtn.classList.add("btn", "btn-primary", "btn-sm");
  const lastBtn = document.createElement("button");
  lastBtn.id = `last-btn`;
  lastBtn.textContent = "Last";
  lastBtn.style.marginLeft = "15px";
  lastBtn.classList.add("btn", "btn-primary", "btn-sm");

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    let btn = document.createElement("button");
    btn.style.display = "inline-block";
    btn.style.marginRight = "10px";
    btn.id = `page-btn:${i}`;
    btn.textContent = i;
    btn.classList.add(
      "btn",
      "btn-secondary",
      "btn-sm",
      "page-item",
      "page-link",
    );
    if (currentPage === i) btn.style.background = "silver";
    btn.onclick = () => {
      currentPage = i;
      renderPages();
      displayData(userData);
      searchInput.value = "";
    };
    pagesDiv.appendChild(btn);
  }
  pagesDiv.appendChild(lastBtn);
  pagesDiv.prepend(firstBtn);

  lastBtn.onclick = () => {
    currentPage = total;
    displayData(userData);
    renderPages();
    searchInput.value = "";
  };

  firstBtn.onclick = () => {
    firstBtn.disabled = true;
    currentPage = 1;
    displayData(userData);
    renderPages();
    searchInput.value = "";
  };
};
