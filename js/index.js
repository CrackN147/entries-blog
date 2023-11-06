//I put all the repatable variables outside of Functions
let entries = getData("entries");
let entriesContainer = document.getElementById("entries");
let elementID = document.getElementById("elementID");
let submitButton = document.getElementById("submitNewEntry");
let newEntryModal = document.getElementById("newEntryModal");
let newEntryTitle = document.getElementById("newEntryTitle");
let newEntryContent = document.getElementById("newEntryContent");
let date = new Date();
let lang = "ka";

const addNewEntry = () => {
  submitButton.innerText = elementID.value ? langs[lang].editEntry : langs[lang].submitNewEntry;
  document.body.classList.add("modal-open");
  newEntryModal.style.display = "flex";
}

const closeModal = () => {
  document.body.classList.remove("modal-open");
  newEntryModal.style.display = "none";
  newEntryTitle.value = "";
  newEntryContent.value = "";
  elementID.value = "";
  newEntryTitle.classList.remove("invalid");
}

const generateID = () => {
  if (entries && entries.length > 0) {
    entries = entries.sort((a, b) => {
      return a.id - b.id;
    });
    return entries[entries.length - 1].id + 1;
  }
  return 1;
}

const submitNewEntry = () => {
  if (elementID.value) {
    return submitEditedEntry();
  }
    //new feature-if title imput is empty does not allow you to add a new entry
  if (newEntryTitle.value.trim() === "") {
    newEntryTitle.classList.add("invalid");
    newEntryTitle.placeholder = "Name field is empty"; }
    else {
  let data = {
    id: generateID(),
    date: (date.getTime() / 1000) + "/" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
    title: newEntryTitle.value,
    content: newEntryContent.value,
  }
  let entries = [];
  if (existsData("entries")) {
    entries = getData("entries");
  }
  entries.push(data);
  setData("entries", entries);
  processHTMLForEntry(data);
  closeModal();
}
}

const submitEditedEntry = () => {
   //new feature-if title imput is empty does not allow you to edit entry
  if (newEntryTitle.value.trim() === "") {
    newEntryTitle.classList.add("invalid");
    newEntryTitle.placeholder = "Name field is empty"; }
    else {
  let data = {
    id: parseInt(elementID.value),
    date: (date.getTime() / 1000) + "/" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
    title: newEntryTitle.value,
    content: newEntryContent.value,
  }
  let newEntries = entries.map((entry) => {
    if (entry.id === data.id) {
      return data;
    }
    return entry;
  });
  setData("entries", newEntries);
  let entryContainer = document.getElementById("entry-" + data.id);
  let entryTitle = entryContainer.getElementsByClassName("entry-title")[0];
  let entryContent = entryContainer.getElementsByClassName("entry-content")[0];
  entryTitle.innerText = data.title;
  entryContent.innerText = data.content;
  elementID.value = "";
  newEntryTitle.value = "";
  newEntryContent.value = "";
  closeModal();
}
}

const deleteEntry = (id) => {
  let entries = getData("entries");
  let newEntries = entries.filter((entry) => entry.id !== id);
  setData("entries", newEntries);
  let entryContainer = document.getElementById("entry-" + id);
  entryContainer.remove();
}

const editEntry = (id) => {
  let entries = getData("entries");
  if (entries) {
    let entry = entries.find((entry) => entry.id === id);
    if (entry) {
      newEntryTitle.value = entry.title;
      newEntryContent.value = entry.content;
      elementID.value = id;
      addNewEntry();
    }
  }
}

const processHTMLElement = (typeOf, className, params) => {
  let HTMlelement = document.createElement(typeOf);
  HTMlelement.classList.add(className);
  if (params) {
    if (params.id) {
      HTMlelement.id = params.id;
    }
    if (params.innerText) {
      HTMlelement.innerText = params.innerText;
    }
    if (params.src) {
      HTMlelement.src = params.src;
    }
    if (params.onclick) {
      HTMlelement.setAttribute("onclick", params.onclick);
    }
  }
  return HTMlelement;
}

const processHTMLForEntry = (entry) => {
  let entryContainer = processHTMLElement("div", "entry", {
    id: "entry-" + entry.id
  });
  let entryWrapper = processHTMLElement("div", "entry-wrapper");
  let entryTitle = processHTMLElement("div", "entry-title", {
    innerText: entry.title
  });
  let entryContent = processHTMLElement("div", "entry-content", {
    innerText: entry.content
  });
  let entryActions = processHTMLElement("div", "entry-actions");
  let entryDelete = processHTMLElement("img", "entry-delete", {
    src: "images/delete.svg",
    onclick: "deleteEntry(" + entry.id + ")"
  });
  let entryEdit = processHTMLElement("img", "entry-edit", {
    src: "images/edit.svg",
    onclick: "editEntry(" + entry.id + ")"
  });
  entryActions.appendChild(entryDelete);
  entryActions.appendChild(entryEdit);
  entryWrapper.appendChild(entryTitle);
  entryWrapper.appendChild(entryContent);
  entryContainer.appendChild(entryWrapper);
  entryContainer.appendChild(entryActions);
  entriesContainer.appendChild(entryContainer);
}

const generateEntries = () => {
  if (entries) {
    entriesContainer.innerHTML = "";
    entries.forEach((entry) => {
      processHTMLForEntry(entry);
    });
  }
}

const generateLangs = () => {
  // changes every element content according to their id
  document.getElementById("addNewEntry").textContent = langs[lang].addNewEntry;
  document.getElementById("changeLang").textContent = langs[lang].changeLang;
  document.getElementById("closeModal").textContent = langs[lang].closeModal;
  document.getElementById("submitNewEntry").textContent = langs[lang].submitNewEntry;
  document.getElementById("newEntryTitle").placeholder = langs[lang].newEntryTitle;
  document.getElementById("newEntryContent").placeholder = langs[lang].newEntryContent;
}
// Initialize the language to "ka"
generateLangs(lang);
// Add event listener to handle language change
document.getElementById("changeLang").addEventListener("click", function() {
  lang = lang === "ka" ? "en" : "ka";
  generateLangs(lang);
});

const general = () => {
  processHTMLElement();
  generateLangs();
  generateEntries();
}

general();

