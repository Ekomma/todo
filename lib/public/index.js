const list = document.querySelector('.list'),
  addItem = document.querySelector('.addItem'),
  search = document.querySelector('.search'),
  textLines = document.querySelectorAll('.text-filled'),
  add = document.querySelector('.add'),
  posts = document.querySelectorAll('.post_details'),
  template = document.querySelector('#item'),
  itemForm = document.querySelector('.addText'),
  listItems = document.querySelectorAll('.list-item'),
  prev1 = document.querySelector('.prev'),
  next1 = document.querySelector('.next'),
  pageNum = document.querySelector('.pageNum'),
  home = document.querySelector('.home'),
  logout = document.querySelector('.logout'),
  last = document.querySelector('.last');
let pageUrl, lastPage;
let pageupdated;
if (window.localStorage.getItem('pageUpdated')) {
  pageUrl = `/user-todos/api?page=${window.localStorage.getItem(
    'pageUpdated',
  )}`;
}
const prevP = prev1.parentElement;
const nextP = next1.parentElement;
const lastP = last.parentElement;
let todos = [];

function renderList(...todos) {
  const listFrag = document.createDocumentFragment();
  todos.forEach((item) => {
    const cloneNode = document.importNode(template.content, true);
    const listItem = cloneNode.querySelector('.list-item');
    const itemText = cloneNode.querySelector('.text-filled');
    const itemDate = cloneNode.querySelector('.date');
    const itemEdit = cloneNode.querySelector('.edit');
    const itemCopy = cloneNode.querySelector('.copy');
    const itemDelete = cloneNode.querySelector('.delete');
    listItem.dataset.itemId = item.id;
    itemText.textContent = item.text;
    itemDate.textContent = formatDate(item.created);
    itemEdit.addEventListener('click', editItem.bind(null, item.id));
    itemDelete.addEventListener('click', deleteItem.bind(null, item.id));
    itemCopy.addEventListener('click', copyItem.bind(null, item.id));
    listFrag.appendChild(cloneNode);
  });
  list.appendChild(listFrag);
}

function editItem(itemID) {
  const item = list.querySelector(`[data-item-id="${itemID}"]`);
  const itemText = item.querySelector('p').textContent;
  addItem.textContent = 'Update item';
  add.value = itemText;
  itemForm.dataset.itemId = itemID;
}

function copyItem(itemID) {
  const listItem = list.querySelector(`[data-item-id="${itemID}"]`);
  const text = listItem.querySelector('.text-filled').textContent;
  navigator.permissions
    .query({ name: 'clipboard-write' })
    .then((result) => {
      if (result.state === 'granted') {
        const type = 'text/plain';
        const blob = new Blob([text], { type });
        let data = [new ClipboardItem({ [type]: blob })];
        navigator.clipboard.write(data).then(
          function () {
            alert('copied successfully');
          },
          function () {
            alert('copy failed');
          },
        );
      }
    })
    .catch(() => {
      alert('You need to grant permission to copy');
    });
}

async function deleteItem(itemID) {
  const itemIndex = todos.findIndex((item) => item.id === itemID);
  const response = await apiResquest('DELETE', itemID);
  const msg = `Data with id: ${itemID} has been removed`;
  if (response.message === msg) {
    todos.splice(itemIndex, 1);
    list.querySelector(`[data-item-id="${itemID}"]`).remove();
    if (todos.length === 0) {
      pageUrl = `/user-todos/api?page=${pageupdated - 1}`;
    }
  }
  renderPage();
}

async function getTodos() {
  const receivedTodos = await apiResquest('GET');
  let { allTodos, prev, next, page, totalPages } = receivedTodos;
  lastPage = totalPages;
  pageupdated = page;
  window.localStorage.setItem('pageUpdated', page);

  if (!prev) {
    prev1.classList.add('inactive');
    home.classList.add('inactive');
    prevP.href = '#pr';
  } else {
    prev1.classList.remove('inactive');
    home.classList.remove('inactive');
    prevP.dataset.link = prev;
  }
  if (!next) {
    next1.classList.add('inactive');
    nextP.href = '#ne';
    last.classList.add('inactive');
    nextP.href = '#ls';
  } else {
    last.classList.remove('inactive');
    next1.classList.remove('inactive');
    nextP.dataset.link = next;
    lastP.dataset.link = `/user-todos/api?page=${totalPages}`;
  }
  pageNum.textContent = `Page: ${page}`;

  if (!allTodos) {
    return;
  }
  try {
    todos.push(...allTodos);
    renderList(...todos);
  } catch (e) {
    console.error(e, 'todos not recieved');
  }
}

function resetForm() {
  addItem.textContent = 'Add Item';
  add.value = '';
  itemForm.removeAttribute('data-item-id');
}

async function createOrUpdateItem(e) {
  e.preventDefault();
  const itemText = add.value.trim();
  if (itemText === '') {
    window.alert('Enter some text');
    return;
  }
  const itemID = itemForm.dataset.itemId;
  if (!itemID) {
    createItem(itemText);
    return;
  }

  const date = new Date();
  const fDate = date.toISOString();
  const updatedItem = { text: itemText, created: fDate };
  const response = await apiResquest('PUT', itemID, updatedItem);
  updateItem(response);
}

function updateItem(item) {
  const listItem = list.querySelector(`[data-item-id="${item.id}"]`);
  if (!listItem) {
    console.log('could not find item in the DOM');
    return;
  }
  const itemIndex = todos.findIndex((itemFind) => itemFind.id === item.id);
  todos.splice(itemIndex, 1, item);
  const updatedDate = formatDate(item.created);
  listItem.querySelector('.text-filled').textContent = item.text;
  listItem.querySelector('.date').textContent = updatedDate;
  resetForm();
}

async function createItem(text) {
  const createdDate = new Date();
  const item = {
    text,
    created: createdDate.toISOString(),
  };

  const response = await apiResquest('POST', '', item);
  if (todos.length === 5 && pageupdated === lastPage) {
    pageUrl = `/user-todos/api?page=${lastPage + 1}`;
  }
   if (todos.length === 5 && pageupdated !== lastPage) {
     pageUrl = `/user-todos/api?page=${lastPage}`;
   }
  renderPage();
  console.log(pageUrl);
  add.value = '';
}

function searchItem(e) {
  const input = e.target.value;
  const regex = new RegExp(input, 'gi');
  const todoIDs = todos
    .filter((item) => item.text.search(regex) !== -1)
    .map((item) => item.id);
  list.querySelectorAll('li').forEach((item) => {
    const todoID = item.dataset.itemId;
    const match = todoIDs.indexOf(todoID) !== -1;
    if (!match) {
      item.classList.add('d-none');
      return;
    }
    item.classList.remove('d-none');
  });
}

function formatDate(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(date).toLocaleString('en-gb', options);
}

function pageUpdate(e) {
  e.preventDefault();
  pageUrl = e.parentElement.dataset.link;
  renderPage();
}

function homePage(e) {
  pageUrl = undefined;
  renderPage();
}

function logoutPage(e) {
  window.localStorage.clear();
}

function renderPage() {
  list.textContent = '';
  todos = [];
  getTodos();
}

async function apiResquest(method, id, data) {
  try {
    id = id || '';
    let URL;
    if (method === 'GET') {
      URL = pageUrl || `user-todos/api/${id}`;
    } else {
      URL = `user-todos/api/${id}`;
    }

    const res = await fetch(URL, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    });
    return await res.json();
  } catch (e) {
    console.log(e);
  }
}

window.addEventListener('DOMContentLoaded', getTodos);
itemForm.addEventListener('submit', createOrUpdateItem);
search.addEventListener('input', searchItem);
prevP.addEventListener('click', pageUpdate);
nextP.addEventListener('click', pageUpdate);
lastP.addEventListener('click', pageUpdate);
home.addEventListener('click', homePage);
logout.addEventListener('click', logoutPage);
