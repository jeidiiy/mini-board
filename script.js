import './style.scss';
// import 'regenerator-runtime/runtime';

async function fetchData(url) {
  const response = await fetch(url);
  const posts = await response.json();
  console.log(posts);
}

fetchData('http://localhost:3000/posts');
