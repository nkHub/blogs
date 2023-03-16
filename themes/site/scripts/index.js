var Hexo = require('hexo');
var hexo = new Hexo(process.cwd(), {});

hexo.extend.generator.register('index', function(locals){
  return {
    path: '/index.html',
    data: locals.posts.slice(0, 4),
    layout: ['index']
  }
});

hexo.load().then(function(){
  console.log('load')
});