import './style.scss';

const table = document.querySelector('.table');

async function fetchData(url) {
  const response = await fetch(url);
  const posts = await response.json();

  createList(posts);
}

function createList(data) {
  const dataName = ['id', 'title', 'name', 'date', ' views'];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < data.length; i++) {
    const info = data[i];
    const { id, title, name, date, views } = info;
    const dataArr = [id, title, name, date, views];

    const tr = document.createElement('tr');

    for (let i = 0; i < dataName.length; i++) {
      const td = document.createElement('td');
      td.className = dataName[i];
      td.textContent = dataArr[i];
      tr.appendChild(td);
    }

    fragment.appendChild(tr);
  }

  table.appendChild(fragment);
}

const post = fetchData('http://localhost:3000/posts?_page=1');
