import './style.scss';

const table = document.querySelector('.table');
const btnList = document.querySelector('.btn-number');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const url = 'https://github.com/wscrg/mini-board/blob/main/db.json';

let isInit = true; // 초기화 여부 체크
let currentPage = 1; // 현재 페이지 상태값. 기본값은 1
let lastPageNum; // 전체 페이지 수
let lastPageArea; // 마지막 페이지 구역.
let btnPosition = 1; // 버튼의 위치. 기본값은 1
let pagePosition = 0; // 페이지의 위치. 기본값은 0. 1~5까지는 0, 6~10까지는 1 ...
let numOfData; // 데이터의 개수. 데이터를 받을 때 지정됨.
let numOfBtn; // 버튼의 개수.
const pageShowed = 5; // 보여질 페이지 수
const itemShowed = 10; // 보여질 아이템 수

const fetchDataAndReplaceBoard = async url => {
  const response = await fetch(url);
  const posts = await response.json();

  if (isInit) {
    lastPageNum = Math.ceil(posts.length / itemShowed);
    lastPageArea = Math.floor(lastPageNum / pageShowed);
  }

  createList(posts);
  createBtnList();
};

const createList = data => {
  const dataName = Object.keys(data[0]);
  const fragment = document.createDocumentFragment();
  numOfData = data.length;

  if (isInit) {
    numOfData = numOfData > 10 ? 10 : numOfData;
  }

  for (let i = 0; i < numOfData; i++) {
    const info = data[i];
    const dataArr = Object.values(info);
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

const createBtnList = () => {
  const fragment = document.createDocumentFragment();

  if (lastPageArea === pagePosition) {
    // 마지막 페이지 구역이라면,
    numOfBtn = lastPageNum % pageShowed === 0 ? 5 : lastPageNum % pageShowed;
  } else {
    numOfBtn = pageShowed;
  }

  if (currentPage === 1 && isInit) {
    // 맨 처음 로딩됐을 때,
    for (let i = 1; i <= numOfBtn; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.classList.add('btn');
      fragment.appendChild(btn);
    }
    btnList.appendChild(fragment);
    btnList.firstChild.classList.add('current');

    isInit = false;
  } else if (btnPosition === 0) {
    // 이전 페이지 구역으로 돌아온 상황이면,
    for (let i = 1; i <= numOfBtn; i++) {
      const btn = document.createElement('button');
      btn.textContent = btnPosition + i + pagePosition * pageShowed;
      btn.classList.add('btn');
      fragment.appendChild(btn);
    }
    btnList.appendChild(fragment);
    btnList.lastChild.classList.add('current');
    btnPosition = 5;
  } else if (btnPosition === pageShowed + 1) {
    // 다음 페이지 구역으로 넘어간 상황이면,
    btnPosition -= 1;
    for (let i = 1; i <= numOfBtn; i++) {
      const btn = document.createElement('button');
      btn.textContent = btnPosition + i + (pagePosition - 1) * pageShowed;
      btn.classList.add('btn');
      fragment.appendChild(btn);
    }
    btnList.appendChild(fragment);
    btnList.firstChild.classList.add('current');
    btnPosition = 1;
  }
};

// 모든 자식 노드를 삭제하는 함수
const removeItems = (element, start) => {
  const listArr = Array.from(element.children);
  for (let i = start; i < listArr.length; i++) {
    element.removeChild(listArr[i]);
  }
};

// 페이지 버튼을 직접 클릭 시 get 요청을 보내는 함수
const requestGet = e => {
  const target = e.target;
  if (target.className === 'btn-number') return;
  const pageNum = +target.textContent;
  if (pageNum === lastPageNum) return;
  removeItems(table, 1);
  currentPage = pageNum;
  fetchDataAndReplaceBoard(`${url}?_page=${pageNum}`).then(() => {
    changeCurrentStyle(target);
    btnPosition = currentPage % 5 === 0 ? 5 : currentPage % 5;
  });
};

// todo: 중복되는 부분 모듈화
const movePrevpage = () => {
  currentPage -= 1;
  btnPosition -= 1;
  if (currentPage < 1) {
    // 1페이지에서 prev 버튼 클릭 시 상태 변화 방지
    currentPage = 1;
    btnPosition = 1;
    return;
  }
  if (btnPosition === 0) {
    // 이전 페이지 구역으로 돌아가면,
    pagePosition -= 1;
    removeItems(btnList, 0);
  }
  removeItems(table, 1);
  fetchDataAndReplaceBoard(`${url}?_page=${currentPage}`).then(() => {
    const target = Array.from(btnList.children).find(
      item => item.textContent === currentPage + ''
    );
    changeCurrentStyle(target);
  });
};

const moveNextpage = () => {
  currentPage += 1;
  btnPosition += 1;
  if (currentPage > lastPageNum) {
    // 마지막 페이지에서 next 버튼 클릭 시 상태 변화 방지
    currentPage = lastPageNum;
    btnPosition = numOfBtn;
    return;
  }
  if (btnPosition === pageShowed + 1) {
    // 다음 페이지로 넘어가면,
    pagePosition += 1;
    removeItems(btnList, 0);
  }
  removeItems(table, 1);
  fetchDataAndReplaceBoard(`${url}?_page=${currentPage}`).then(() => {
    const target = Array.from(btnList.children).find(
      item => item.textContent === currentPage + ''
    );
    changeCurrentStyle(target);
  });
};

// 현재 페이지에 강조 스타일을 적용하는 함수
const changeCurrentStyle = target => {
  const listArr = Array.from(btnList.children);
  const prevPageBtn = listArr.find(item => item.classList.contains('current'));
  prevPageBtn.classList.remove('current');
  target.classList.add('current');
};

// 초기화 함수
const init = () => {
  // 첫 렌더링
  fetchDataAndReplaceBoard(url);

  // 이벤트 등록
  btnList.addEventListener('click', requestGet);
  btnPrev.addEventListener('click', movePrevpage);
  btnNext.addEventListener('click', moveNextpage);
};

init();
