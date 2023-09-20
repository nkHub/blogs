window.onload = function(){
  if (window.innerWidth > 600) {
    // 添加返回顶部按钮
    let btn = document.createElement("button");
    btn.innerHTML = "TOP";
    btn.style.position = "fixed";
    btn.style.bottom = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = "9999";
    btn.style.backgroundColor = "#363636";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.padding = "5px 10px";
    btn.style.cursor = "pointer";
    btn.style.display = "none";
    document.body.appendChild(btn);
    window.onscroll = function () {
      let top = Math.floor(document.documentElement.scrollTop)
      if (top > 100) {
        btn.style.display = "block";
      } else {
        btn.style.display = "none";
      }
    }
    btn.onclick = function () {
      document.documentElement.scrollTop = 0
    }
  }
  // 词云
  const words = document.getElementById('word-cloud')
  if(WordCloud && words){
    const list = []
    for(let k in words.children){
      const v = words.children[k]
      if(v.href && v.innerText){
        const heat = parseInt(v.style.fontSize) + 2
        list.push([v.innerText, heat, v.href])
      }
    }
    WordCloud(words, {
      backgroundColor: 'transparent',
      list,
      click(item){
        window.location.href = item[2]
      }
    })
  }
  // 菜单
  const links = document.querySelectorAll('.menu-link')
  for(let i=0; i < links.length;i++){
    const id = decodeURIComponent(links[i].hash).replace('#', '');
    links[i].href = 'javascript:void(0);';
    links[i].addEventListener('click', function(){
      const target = document.getElementById(id)
      document.documentElement.scrollTop = target.offsetTop - 16;
    })
  }
  // 搜索部分
  const modal = Bulma('#modal-search').modal({
    style: 'content'
  });
  const input = modal.root.querySelector('input');
  document.getElementById('header-search-input').addEventListener('click', function(){
    modal.open();
  });
  modal.on('open', function(){
    input.focus();
  });
  modal.on('close', function(){
    input.blur();
    input.value = '';
    handleInputChange();
  });
  // 本地搜索
  const localSearch = new LocalSearch({
    path: '/search.xml',
    top_n_per_article: 1,
    unescape: false
  });
  const box = modal.root.querySelector('.panel .panel-box');
  // 预加载数据
  localSearch.fetchData();
  function handleInputChange(){
    const searchText = input.value.trim().toLowerCase();
    const keywords = searchText.split(/[-\s]+/);
    const items = localSearch.getResultItems(keywords);
    if(items.length > 0){
      const list = items.reduce((t, v) => t + v.item, '<ul>') + '</ul>';
      box.innerHTML = list;
    }else{
      box.innerHTML = '<div class="search-result-icon"><i class="far fa-file fa-3x"></i><p class="search-result-tips">找不到匹配数据！</p></div>'
    }
  }
  input.addEventListener('input', handleInputChange);
}