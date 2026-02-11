const tableBody = document.getElementById("table-body");
const addBtn = document.getElementById("addBtn");

let userData = [
  { id: 1, name: "aadil", age: 24, gender: "male" },
  { id: 2, name: "sahil", age: 24, gender: "male" },
];

const displayData = () => {
  displayData.innerHTML = "";
  userData = JSON.parse(localStorage.getItem("userData"));

  userData.forEach((user, index) => {
    createNewRow(user, index);
  });
};

const createNewRow = (myUser, index) => {
  const dataRow = document.createElement("tr");
  dataRow.id = `data-row:${index}`;

  const tdId = document.createElement("td");
  tdId.textContent = myUser.id;
  tdId.id = `td-id-row:${index}`;

  const tdName = document.createElement("td");
  tdName.textContent = myUser.name;
  tdName.id = `td-name-row:${index}`;

  const tdAge = document.createElement("td");
  tdAge.textContent = myUser.age;
  tdAge.id = `td-age-row:${index}`;

  const tdGender = document.createElement("td");
  tdGender.textContent = myUser.gender;
  tdGender.id = `td-gender-row:${index}`;

  const tdBtns = document.createElement("td");
  tdBtns.id = `td-btns-row:${index}`;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.id = `edit-btn:${index}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.id = `delete-btn:${index}`;
  tdBtns.append(editBtn, deleteBtn);
  dataRow.append(tdId, tdName, tdAge, tdGender, tdBtns);
  tableBody.append(dataRow);
};

displayData();

const addData = () => {
  const isExists = document.getElementById("id-input");

  if (!isExists) {
    const trInput = document.createElement("tr");
    trInput.id = `tr-input-row`;

    const tdIdInput = document.createElement("td");
    tdIdInput.id = `td-Id-data`;
    const idInput = document.createElement("input");
    idInput.setAttribute("type", "number");
    idInput.id = `id-input`;
    tdIdInput.append(idInput);

    const tdNameInput = document.createElement("td");
    tdNameInput.id = `td-name-data`;
    const nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.id = `name-input`;
    tdNameInput.append(nameInput);

    const tdAgeInput = document.createElement("td");
    tdAgeInput.id = `td-age-data`;
    const ageInput = document.createElement("input");
    ageInput.setAttribute("type", "number");
    ageInput.id = `age-input`;
    tdAgeInput.append(ageInput);

    const tdGenderInput = document.createElement("td");
    tdGenderInput.id = `td-gender-data`;
    tdGenderInput.innerHTML = "<span>male/female</span>";
    const genderMaleInput = document.createElement("input");
    genderMaleInput.setAttribute("type", "radio");
    genderMaleInput.setAttribute("name", "gender");
    genderMaleInput.setAttribute("value", "male");
    genderMaleInput.id = `gender-male-input-input`;
    const genderFemaleInput = document.createElement("input");
    genderFemaleInput.setAttribute("type", "radio");
    genderFemaleInput.setAttribute("name", "gender");
    genderFemaleInput.setAttribute("value", "female");
    genderFemaleInput.id = `gender-female-input-input`;
    tdGenderInput.append(genderMaleInput, genderFemaleInput);

    const tdActionButtons = document.createElement("td");
    tdActionButtons.id = `td-action-btns-data`;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.id = `save-button`;

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.id = `cancel-button`;
    tdActionButtons.append(saveBtn, cancelBtn);

    trInput.append(
      tdIdInput,
      tdNameInput,
      tdAgeInput,
      tdGenderInput,
      tdActionButtons,
    );

    tableBody.append(trInput);

    saveBtn.addEventListener("click", () => {
      const idInput = document.getElementById("id-input");
      const nameInput = document.getElementById("name-input");
      const ageInput = document.getElementById("age-input");

      const addNewData = {
        id: idInput.value,
        name: nameInput.value,
        age: ageInput.value,
        gender: document.querySelector("input[name=gender]:checked").value,
      };

      userData.push(addNewData);
      localStorage.setItem("userData", JSON.stringify(userData));
      displayData();
    });
  }
};

addBtn.onclick = () => {
  addData();
};
