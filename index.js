const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("name-filter-input");
let switchMode = 0;
let currentEditId = null;
let userData = [];

const setLocalStorage = (data) => {
  localStorage.setItem("userData", JSON.stringify(data));
};

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("userData"));
};

window.addEventListener("load", () => {
  userData = getLocalStorage() || [];
  displayData(userData);
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
  const tdName = document.createElement("td");
  tdName.id = `td-name:${index}`;
  tdName.textContent = newUser.name;
  const tdAge = document.createElement("td");
  tdAge.id = `td-age:${index}`;
  tdAge.textContent = newUser.age;
  const tdGender = document.createElement("td");
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
    displayData(userData);
  });
  editBtn.onclick = () => {
    const newDataRow = document.getElementById("newDataRow");
    if (newDataRow) newDataRow.remove();
    editDataRow(newUser, index);
  };
  if (editableDataRaw) {
    editableDataRaw.replaceWith(dataRow);
  }
  onDblClickEdit(index, newUser);
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
  genderData.innerHTML = `<label>Male/Female</label>`;
  genderMaleInput.setAttribute("id", "male");
  genderFemaleInput.setAttribute("id", "female");
  genderMaleInput.setAttribute("type", "radio");
  genderFemaleInput.setAttribute("type", "radio");
  genderMaleInput.setAttribute("value", "male");
  genderFemaleInput.setAttribute("value", "female");
  genderMaleInput.setAttribute("name", "gender");
  genderFemaleInput.setAttribute("name", "gender");
  genderData.appendChild(genderMaleInput);
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
    displayData(userData);
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
  inputMaleGender.setAttribute("name", `gender-${index}`);
  inputMaleGender.setAttribute("value", "male");
  if (funUser.gender === "male") {
    inputMaleGender.checked = true;
  }
  const inputFemaleGender = document.createElement("input");
  inputFemaleGender.setAttribute("type", "radio");
  inputFemaleGender.setAttribute("name", `gender-${index}`);
  inputFemaleGender.setAttribute("value", "female");
  if (funUser.gender === "female") {
    inputFemaleGender.checked = true;
  }
  tdGender.innerHTML = `<label>Male/Female</label>`;
  tdGender.append(inputMaleGender, inputFemaleGender);
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
    displayData(userData);
  };
  cancelBtn.addEventListener("click", () => {
    addBtn.disabled = false;
    currentEditId = null;
    displayData(userData);
  });
};

const deleteData = (index) => {
  const data = getLocalStorage();
  data.splice(index, 1);
  setLocalStorage(data);
  userData = data;
};

const onDblClickEdit = (index, changeUser) => {
  const tdId = document.getElementById(`td-id:${index}`);
  const tdName = document.getElementById(`td-name:${index}`);
  const tdAge = document.getElementById(`td-age:${index}`);
  const tdGender = document.getElementById(`td-gender:${index}`);
  const trDblClickEdit = document.createElement("tr");
  trDblClickEdit.id = `tr-dbl-click-edit-id:${index}`;
  const tdChangeId = document.createElement("td");
  tdChangeId.id = `tr-change-id:${index}`;
  const tdChangeName = document.createElement("td");
  tdChangeName.id = `td-change-name:${index}`;
  const tdChangeAge = document.createElement("td");
  tdChangeAge.id = `td-change-age:${index}`;
  const tdGenderChange = document.createElement("td");
  tdGenderChange.id = `td-gender-change:${index}`;
  trDblClickEdit.append(tdChangeId, tdChangeName, tdChangeAge, tdGenderChange);
  tdId.ondblclick = () => {
    const changeId = document.createElement("input");
    changeId.setAttribute("type", "number");
    changeId.id = `change-id:${index}`;
    changeId.value = changeUser.id;
    tdChangeId.append(changeId);
    tdId.replaceWith(tdChangeId);
    changeId.addEventListener("input", () => {
      changeUser.id = changeId.value;
      setLocalStorage(userData);
    });
    changeId.addEventListener("focusout", () => {
      let tdId = document.createElement("td");
      tdId.id = `td-id:${index}`;
      tdId.textContent = changeUser.id;
      tdChangeId.replaceWith(tdId);
      tdId.ondblclick = () => {
        tdId.replaceWith(tdChangeId);
      };
    });
  };

  tdName.ondblclick = () => {
    const changeName = document.createElement("input");
    changeName.setAttribute("type", "text");
    changeName.id = `change-name:${index}`;
    changeName.value = changeUser.name;
    tdChangeName.append(changeName);
    tdName.replaceWith(tdChangeName);
    changeName.addEventListener("input", () => {
      changeUser.name = changeName.value;
      setLocalStorage(userData);
    });
    changeName.addEventListener("focusout", () => {
      let tdName = document.createElement("td");
      tdName.id = `td-name:${index}`;
      tdName.textContent = changeUser.name;
      tdChangeName.replaceWith(tdName);
      tdName.ondblclick = () => {
        tdName.replaceWith(tdChangeName);
      };
    });
  };

  tdAge.ondblclick = () => {
    const changeAge = document.createElement("input");
    changeAge.setAttribute("type", "number");
    changeAge.id = `change-age:${index}`;
    changeAge.value = changeUser.age;
    tdChangeAge.append(changeAge);
    tdAge.replaceWith(tdChangeAge);
    changeAge.addEventListener("input", () => {
      changeUser.age = changeAge.value;
      setLocalStorage(userData);
    });
    changeAge.addEventListener("focusout", () => {
      let tdAge = document.createElement("td");
      tdAge.id = `td-age:${index}`;
      tdAge.textContent = changeUser.age;
      tdChangeAge.replaceWith(tdAge);
      tdAge.ondblclick = () => {
        tdAge.replaceWith(tdChangeAge);
      };
    });
  };

  tdGender.ondblclick = () => {
    const spanChange = document.createElement("span");
    spanChange.textContent = "Male/Female";
    const changeGenderMale = document.createElement("input");
    changeGenderMale.setAttribute("type", "radio");
    changeGenderMale.setAttribute("name", "gender");
    changeGenderMale.id = `change-male:${index}`;
    changeGenderMale.value = "male";
    if (changeUser.gender == "male") {
      changeGenderMale.checked = true;
    }
    changeGenderMale.addEventListener("click", () => {
      changeUser.gender = changeGenderMale.value;
      setLocalStorage(userData);
    });
    changeGenderMale.addEventListener("focusout", () => {
      let tdGender = document.createElement("td");
      tdGender.id = `td-gender:${index}`;
      tdGender.textContent = changeUser.gender;
      tdGenderChange.replaceWith(tdGender);
      tdGender.ondblclick = () => {
        tdGender.replaceWith(tdGenderChange);
      };
    });

    const changeGenderFemale = document.createElement("input");
    changeGenderFemale.setAttribute("type", "radio");
    changeGenderFemale.setAttribute("name", "gender");
    changeGenderFemale.id = `change-female:${index}`;
    changeGenderFemale.value = "female";
    if (changeUser.gender == "female") {
      changeGenderFemale.checked = true;
    }
    changeGenderFemale.addEventListener("click", () => {
      changeUser.gender = changeGenderFemale.value;
      setLocalStorage(userData);
    });
    changeGenderFemale.addEventListener("focusout", () => {
      let tdGender = document.createElement("td");
      tdGender.id = `td-gender:${index}`;
      tdGender.textContent = changeUser.gender;
      tdGenderChange.replaceWith(tdGender);
      tdGender.ondblclick = () => {
        tdGender.replaceWith(tdGenderChange);
      };
    });
    tdGenderChange.append(spanChange, changeGenderMale, changeGenderFemale);
    tdGender.replaceWith(tdGenderChange);
  };
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
    switchMode += 1;
  } else if (switchMode === 1) {
    const asc = userData.toSorted(compare(key, type));
    displayData(asc);
    switchMode += 1;
  } else {
    displayData(userData);
    switchMode = 0;
  }
};

const filterByName = () => {
  const toSearch = searchInput.value.toUpperCase();
  const filteredData = userData.filter((d) => {
    return d.name.toUpperCase().includes(toSearch);
  });
  displayData(filteredData);
};
