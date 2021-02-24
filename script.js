import './style.scss';

const table = document.querySelector('.table');
const btnList = document.querySelector('.btn-number');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const url = 'http://localhost:3000/posts';

let currentPage = 1; // 현재 페이지 상태값. 기본값은 1
let fullpageNum; // 전체 페이지 수
const pageShowed = 5; // 보여질 페이지 수

const fetchDataAndReplaceList = async url => {
  const response = await fetch(url);
  const posts = await response.json();

  fullpageNum = posts.length;
  createList(posts);
};

const createList = data => {
  const dataName = Object.keys(data[0]);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < data.length; i++) {
    const info = data[i];
    const dataArr = Object.values(info);

    const tr = document.createElement('tr');

    for (let i = 0; i < dataName.length; i++) {
      const td = document.createElement('td');
      td.className = dataName[i];
      td.textContent = dataArr[i];
      tr.append(td);
    }

    fragment.appendChild(tr);
  }

  table.appendChild(fragment);
};

const createBtnList = () => {
  const fragment = document.createDocumentFragment();

  if (currentPage === 1 || currentPage === pageShowed) {
    // 맨 처음 로딩됐을 때 or 6~10 페이지에서 prev으로 뒤돌아왔을 때
    for (let i = 0; i < pageShowed; i++) {
      const btn = document.createElement('button');
      btn.textContent = i + 1;
      btn.classList.add('btn');
      fragment.appendChild(btn);
    }
    btnList.appendChild(fragment);
    btnList.firstChild.classList.add('current');
  } else if (currentPage === 6) {
    for (let i = 0; i < pageShowed; i++) {
      const btn = document.createElement('button');
      btn.textContent = currentPage + i;
      btn.classList.add('btn');
      fragment.appendChild(btn);
    }
    btnList.appendChild(fragment);
    btnList.firstChild.classList.add('current');
  }
};

const removeItems = (element, start) => {
  const listArr = Array.from(element.children);
  for (let i = start; i < listArr.length; i++) {
    element.removeChild(listArr[i]);
  }
};

const putRequest = e => {
  const target = e.target;
  if (target.className === 'btn-number') return;
  const pageNum = +target.textContent;
  if (pageNum === currentPage) return;
  removeItems(table, 1);
  currentPage = pageNum;
  fetchDataAndReplaceList(`${url}?_page=${pageNum}`);
  changeCurrentStyle(target);
};

// todo: 중복되는 부분 모듈화
const movePrevpage = () => {
  currentPage -= 1;
  if (currentPage < 1) {
    currentPage = 1;
    return;
  }
  if (currentPage === pageShowed) {
    removeItems(btnList, 0);
    createBtnList();
  }
  removeItems(table, 1);
  const target = Array.from(btnList.children).find(
    item => item.textContent === currentPage + ''
  );
  fetchDataAndReplaceList(`${url}?_page=${currentPage}`);
  changeCurrentStyle(target);
};

const moveNextpage = () => {
  currentPage += 1;
  if (currentPage > fullpageNum) {
    currentPage = fullpageNum;
    return;
  }
  if (currentPage === pageShowed + 1) {
    removeItems(btnList, 0);
    createBtnList();
  }
  const target = Array.from(btnList.children).find(
    item => item.textContent === `${currentPage}`
  );
  removeItems(table, 1);
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
  // 첫 렌더링
  fetchDataAndReplaceList(`${url}?_page=1`);
  createBtnList();

  // 이벤트 등록
  btnList.addEventListener('click', putRequest);
  btnPrev.addEventListener('click', movePrevpage);
  btnNext.addEventListener('click', moveNextpage);
};

init();
