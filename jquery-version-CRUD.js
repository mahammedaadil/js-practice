const $tableBody = $("#table-body");
const searchInput = document.getElementById("name-filter-input");
let dropDown = document.getElementById("display-records");
const pagesDiv = document.getElementById("pages-btns");
let switchMode = 0;
let currentEditId = null;
let userData = [];
let currentPage = 1;
let recordsPerPage = 5;

const pageWiseDisplay = (data) => {
  $tableBody.html("");
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

$(window).on("load", () => {
  userData = getLocalStorage() || [];
  displayData(userData);
  renderPages();
});

const displayData = (data) => {
  $tableBody.html("");
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
  const editableDataRaw = document.getElementById(
    `editable-input-row:${index}`,
  );
  const $dataRow = $(`<tr id="dataRow:${index}"></tr>`);
  const $tdId = $(`<td id="td-id:${index}">${user.id}</td>`);
  const $tdName = $(`<td id="td-name:${index}">${user.name}</td>`);
  const $tdAge = $(`<td id="td-age:${index}">${user.age}</td>`);
  const $tdGender = $(`<td id="td-gender:${index}">${user.gender}</td>`);
  const $tdButtons = $(
    `<td id="td-buttons:${index}"><button id="editBtn:${index}" class="btn btn-success btn-sm">Edit</button>
    <button id="deleteBtn:${index}" class="btn btn-danger btn-sm">Delete</button></td>`,
  );
  $dataRow.append($tdId, $tdName, $tdAge, $tdGender, $tdButtons);
  $tableBody.append($dataRow);

  const tdIdDblClick = document.getElementById(`td-id:${index}`);
  $(tdIdDblClick).on("dblclick", () => {
    dblClickEdit(index, "id", "number");
  });
  const tdNameDblClick = document.getElementById(`td-name:${index}`);
  $(tdNameDblClick).on("dblclick", () => {
    dblClickEdit(index, "name", "text");
  });
  const tdAgeDblClick = document.getElementById(`td-age:${index}`);
  $(tdAgeDblClick).on("dblclick", () => {
    dblClickEdit(index, "age", "number");
  });
  const tdGenderDblClick = document.getElementById(`td-gender:${index}`);
  $(tdGenderDblClick).on("dblclick", () => {
    onGenderDblClickEdit(index);
  });

  const editBtn = document.getElementById(`editBtn:${index}`);
  $(editBtn).on("click", () => {
    const newDataRow = document.getElementById("newDataRow");
    if (newDataRow) newDataRow.remove();
    editDataRow(user, index);
  });

  if (editableDataRaw) {
    const dataRow = document.getElementById(`dataRow:${index}`);
    editableDataRaw.replaceWith(dataRow);
  }

  const deleteBtn = document.getElementById(`deleteBtn:${index}`);
  $(deleteBtn).on("click", () => {
    addBtn.disabled = false;
    deleteData(index);
    displayData(userData);
    renderPages();
  });
};

const createNewRow = () => {
  dropDown.disabled = true;
  if (document.getElementById(`uid`)) return;
  const $newDataRow = $(`<tr id="newDataRow"></tr>`);
  const $idData = $(
    `<td><input type="number" id="uid" class="form-control" placeholder="Enter Id"></td>`,
  );
  const $nameData = $(
    `<td><input type="text" id="name" class="form-control" placeholder="Enter Name"></td>`,
  );
  const $ageData = $(
    `<td><input type="number" id="age" class="form-control" placeholder="Enter Age"></td>`,
  );
  const $genderData = $(
    `<td><label for="male">Male</label><input type="radio" id="male" value="male" class="form-check-input" name="gender">
    <label for="female">Female</label><input type="radio" id="female" value="female" class="form-check-input" name="gender"></td>`,
  );
  const $buttonsColumn = $(
    `<td>
    <button id="saveBtn" class="btn btn-primary btn-sm">Save</button>
      <button id="cancelBtn" class="btn btn-secondary btn-sm">Cancel</button>
      </td>`,
  );
  $newDataRow.append($idData, $nameData, $ageData, $genderData, $buttonsColumn);
  $tableBody.append($newDataRow);

  const saveBtn = document.getElementById(`saveBtn`);
  $(saveBtn).on("click", () => {
    const newData = {
      id: document.getElementById(`uid`).value,
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      gender: document.querySelector("input[name=gender]:checked").value,
    };
    userData.push(newData);
    setLocalStorage(userData);
    displayData(userData);
    renderPages();
  });

  const cancelBtn = document.getElementById(`cancelBtn`);
  $(cancelBtn).on("click", () => {
    document.getElementById(`newDataRow`).remove();
    displayData(userData);
    renderPages();
  });
};

const editDataRow = (user, index) => {
  if (currentEditId != null)
    dataRawRendering(currentEditId, userData[currentEditId]);
  currentEditId = index;

  const $editableRow = $(`<tr id="editable-input-row:${index}"></tr>`);
  const $editableTdId = $(
    `<td><input type="number" id="editable-id-cell:${index}" class="form-control" value="${user.id}"></td>`,
  );
  const $editableTdName = $(
    `<td><input type="text" id="editable-name-cell:${index}" class="form-control"  value="${user.name}"></td>`,
  );
  const $editableTdAge = $(
    `<td><input type="text" id="editable-age-cell:${index}" class="form-control"  value="${user.age}"></td>`,
  );
  const $editableTdGender = $(
    `<td><label for="male">Male</label><input type="radio" id="male" value="male" class="form-check-input" name="gender-${index}">
    <label for="female">Female</label><input type="radio" id="female" value="female" class="form-check-input" name="gender-${index}"></td>`,
  );
  const $editableTdButtons = $(
    `<td>
      <button id="saveBtn:${index}" class="btn btn-primary btn-sm">Save</button>
      <button id="cancelBtn:${index}" class="btn btn-secondary btn-sm">Cancel</button>
      </td>`,
  );
  $editableRow.append(
    $editableTdId,
    $editableTdName,
    $editableTdAge,
    $editableTdGender,
    $editableTdButtons,
  );

  $(document.getElementById(`dataRow:${index}`)).replaceWith($editableRow);
  if (user.gender === "male") {
    document.getElementById("male").checked = true;
  } else {
    document.getElementById("female").checked = true;
  }
  if (document.getElementById(`editable-input-row:${index}`)) {
    addBtn.disabled = true;
  }

  $(document.getElementById(`saveBtn:${index}`)).on("click", () => {
    addBtn.disabled = false;
    const updatadData = userData.map((data, idx) => {
      if (idx === index) {
        data.id = document.getElementById(`editable-id-cell:${index}`).value;
        data.name = document.getElementById(
          `editable-name-cell:${index}`,
        ).value;
        data.age = document.getElementById(`editable-age-cell:${index}`).value;
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
  });

  $(document.getElementById(`cancelBtn:${index}`)).on("click", () => {
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
  const mainDataCell = document.getElementById(`td-${field}:${index}`);
  const changeUser = userData[index];
  const $changedCell = $(
    `<td id="td-change-${field}:${index}"><input type="${type}" id="change-${field}:${index}" class="form-control w-50" value="${changeUser[field]}"></td>`,
  );
  $(mainDataCell).replaceWith($changedCell);

  const inputElement = document.getElementById(`change-${field}:${index}`);
  $(inputElement).on("input", () => {
    changeUser[field] = document.getElementById(
      `change-${field}:${index}`,
    ).value;
    setLocalStorage(userData);
  });

  $(inputElement).on("mouseleave", () => {
    const $newcell = $(
      `<td id="td-${field}:${index}">${changeUser[field]}</td>`,
    );
    $changedCell.replaceWith($newcell);
    $(document.getElementById(`td-${field}:${index}`)).on("dblclick", () => {
      dblClickEdit(index, field, type);
    });
  });
};

const onGenderDblClickEdit = (index) => {
  const changeUser = userData[index];
  const mainGenderCell = document.getElementById(`td-gender:${index}`);
  const $changeGenderCell = $(`<td id="td-gender-change:${index}">
      <label for="change-male:${index}">Male</label>
      <input type="radio" id="change-male:${index}" value="male" class="form-check-input" name="gender-${index}">
      <label for="female:${index}">Female</label>
      <input type="radio" id="change-female:${index}" value="female" class="form-check-input" name="gender-${index}">
      </td>`);
  $(mainGenderCell).replaceWith($changeGenderCell);
  const maleGender = document.getElementById(`change-male:${index}`);
  const femaleGender = document.getElementById(`change-female:${index}`);
  const changeGenderCell = document.getElementById(`td-gender-change:${index}`);

  if (changeUser.gender == "male") {
    maleGender.checked = true;
  } else {
    femaleGender.checked = true;
  }
  $(maleGender).on("click", () => {
    changeUser.gender = maleGender.value;
    setLocalStorage(userData);
  });

  $(femaleGender).on("click", () => {
    changeUser.gender = femaleGender.value;
    setLocalStorage(userData);
  });

  $(changeGenderCell).on("mouseleave", () => {
    const $newcell = $(`<td id="td-gender:${index}">${changeUser.gender}</td>`);
    $changeGenderCell.replaceWith($newcell);
    $(document.getElementById(`td-gender:${index}`)).on("dblclick", () => {
      onGenderDblClickEdit(index);
    });
  });
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
  const $firstBtn = $(
    `<button id="first-btn" style="margin-left:20px;margin-right:30px;" class="btn btn-primary btn-sm">First</button>`,
  );
  const $lastBtn = $(
    `<button id="last-btn" style="margin-left:15px;" class="btn btn-primary btn-sm">Last</button>`,
  );
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    let $btn = $(
      `<button id="page-btn:${i}" style="margin-right:10px;" class="btn btn-secondary btn-sm page-link">${i}</button>`,
    );
    $(pagesDiv).append($btn);
    let btn = document.getElementById(`page-btn:${i}`);
    if (currentPage === i) btn.style.background = "silver";
    $(btn).on("click", () => {
      currentPage = i;
      renderPages();
      displayData(userData);
      searchInput.value = "";
    });
  }
  $(pagesDiv).prepend($firstBtn);
  $(pagesDiv).append($lastBtn);

  const firstBtn = document.getElementById(`first-btn`);
  const lastBtn = document.getElementById(`last-btn`);
  $(lastBtn).on("click", () => {
    currentPage = total;
    displayData(userData);
    renderPages();
    searchInput.value = "";
  });

  $(firstBtn).on("click", () => {
    currentPage = 1;
    displayData(userData);
    renderPages();
    searchInput.value = "";
  });
};
