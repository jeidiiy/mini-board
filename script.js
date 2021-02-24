import './style.scss';

const table = document.querySelector('.table');
const btnList = document.querySelector('.btn-list');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const url = 'http://localhost:3000/posts';

let currentPage = 1; // 현재 페이지 상태값. 기본값은 1
let fullPageNum;

const fetchDataAndReplaceList = async url => {
  const response = await fetch(url);
  const posts = await response.json();

  fullPageNum = posts.length;
  createList(posts);
};

const createList = data => {
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
};

const removeData = element => {
  // children은 Live DOM 객체기 때문에 객체로 변환하여 처리함
  const listArr = Array.from(element.children);
  for (let i = 1; i < listArr.length; i++) {
    // 첫 행 삭제 방지를 위해 1부터 시작
    element.removeChild(listArr[i]);
  }
};

const putRequest = e => {
  const target = e.target;
  if (
    target.className === 'btn-list' ||
    target.classList.contains('btn-prev') ||
    target.classList.contains('btn-next')
  )
    return;
  const pageNum = +target.textContent;
  if (pageNum === currentPage) return;
  removeData(table);
  currentPage = pageNum;
  fetchDataAndReplaceList(`${url}?_page=${pageNum}`);
  changeCurrentStyle(target);
};

// todo: 중복되는 부분 모듈화
const movePrevpage = () => {
  removeData(table);
  currentPage -= 1;
  if (currentPage < 1) currentPage = 1;
  const target = Array.from(btnList.children).find(
    item => item.textContent === currentPage + ''
  );
  fetchDataAndReplaceList(`${url}?_page=${currentPage}`);
  changeCurrentStyle(target);
};

const moveNextpage = () => {
  removeData(table);
  currentPage += 1;
  if (currentPage > fullPageNum) currentPage = fullPageNum - 1;
  const target = Array.from(btnList.children).find(
    item => item.textContent === `${currentPage}`
  );
  fetchDataAndReplaceList(`${url}?_page=${currentPage}`);
  changeCurrentStyle(target);
};

const changeCurrentStyle = target => {
  const listArr = Array.from(btnList.children);
  const prevPageBtn = listArr.find(item => item.classList.contains('current'));
  prevPageBtn.classList.remove('current');
  target.classList.add('current');
};

const init = () => {
  fetchDataAndReplaceList('http://localhost:3000/posts?_page=1');
  btnList.addEventListener('click', putRequest);
  btnPrev.addEventListener('click', movePrevpage);
  btnNext.addEventListener('click', moveNextpage);
};

init();
