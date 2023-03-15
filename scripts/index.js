var Hexo = require('hexo');
var hexo = new Hexo(process.cwd(), {});

// 自定义页面渲染数据
hexo.extend.generator.register('archive', function(locals){
  return {
    path: 'archives/index.html',
    data: locals.posts,
    layout: ['archive', 'index']
  }
});