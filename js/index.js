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
}