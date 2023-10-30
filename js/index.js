const checkLang = () => {
  let defaultLang = "ka";
  let currentLang = getData("lang");
  if (!currentLang) {
    setData("lang", defaultLang);
    return defaultLang;
  }
  return currentLang;
}

const changeLang = () => {
  let currentLang = getData("lang");
  if (currentLang === "ka") {
    setData("lang", "en");
  } else {
    setData("lang", "ka");
  }
  generateLangs();
}

const addNewEntry = () => {
  let elementID = document.getElementById("elementID");
  let submitButton = document.getElementById("submitNewEntry");
  submitButton.innerText = elementID.value ? langs[checkLang()].editEntry : langs[checkLang()].submitNewEntry;
  let newEntryModal = document.getElementById("newEntryModal");
  document.body.classList.add("modal-open");
  newEntryModal.style.display = "flex";
}

const closeModal = () => {
  let newEntryModal = document.getElementById("newEntryModal");
  let newEntryTitle = document.getElementById("newEntryTitle");
  let newEntryContent = document.getElementById("newEntryContent");
  let elementID = document.getElementById("elementID");
  document.body.classList.remove("modal-open");
  newEntryModal.style.display = "none";
  newEntryTitle.value = "";
  newEntryContent.value = "";
  elementID.value = "";
}

const generateID = () => {
  let entries = getData("entries");
  if (entries && entries.length > 0) {
    entries = entries.sort((a, b) => {
      return a.id - b.id;
    });
    return entries[entries.length - 1].id + 1;
  }
  return 1;
}

const submitNewEntry = () => {
  let elementID = document.getElementById("elementID");
  if (elementID.value) {
    return submitEditedEntry();
  }
  let newEntryTitle = document.getElementById("newEntryTitle");
  let newEntryContent = document.getElementById("newEntryContent");
  let date = new Date();
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
  newEntryTitle.value = "";
  newEntryContent.value = "";
  closeModal();
}

const submitEditedEntry = () => {
  let entries = getData("entries");
  let elementID = document.getElementById("elementID");
  let newEntryTitle = document.getElementById("newEntryTitle");
  let newEntryContent = document.getElementById("newEntryContent");
  let date = new Date();
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
      let newEntryTitle = document.getElementById("newEntryTitle");
      let newEntryContent = document.getElementById("newEntryContent");
      let elementID = document.getElementById("elementID");
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
  let entriesContainer = document.getElementById("entries");
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
  let entries = getData("entries");
  let entriesContainer = document.getElementById("entries");
  if (entries) {
    entriesContainer.innerHTML = "";
    entries.forEach((entry) => {
      processHTMLForEntry(entry);
    });
  }
}

const generateLangs = () => {
  let lang = checkLang();
  let addNewEntry = document.getElementById("addNewEntry");
  let newEntryTitle = document.getElementById("newEntryTitle");
  let newEntryContent = document.getElementById("newEntryContent");
  let submitNewEntry = document.getElementById("submitNewEntry");
  let changeLang = document.getElementById("changeLang");
  let closeModal = document.getElementById("closeModal");

  addNewEntry.innerText = langs[lang].addNewEntry;
  newEntryTitle.setAttribute("placeholder", langs[lang].newEntryTitle);
  newEntryContent.setAttribute("placeholder", langs[lang].newEntryContent);
  submitNewEntry.innerText = langs[lang].submitNewEntry;
  changeLang.innerText = lang === "ka" ? "en" : "ka";
  closeModal.innerText = langs[lang].closeModal;
}
const general = () => {
  generateLangs();
  generateEntries();
}

general();