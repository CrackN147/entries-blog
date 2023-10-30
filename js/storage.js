const existsData = (key) => {
  return localStorage.getItem(key) !== null;
}

const getData = (key) => {
  if (existsData(key)) {
    return JSON.parse(localStorage.getItem(key));
  }
  return null;
}

const setData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
}