'use strict';

/**
 * blog example
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function () {

  // 当前项目对象
  const $p = this;
  // mysql 客户端
  const mysql = $p.get('mysql.client');

  $p.set('service.blog.getList', blogGetList);
  $p.set('service.blog.getById', blogGetById);

  // 取博客列表
  function blogGetList(query, callback) {
    // eslint-disable-next-line
    query = Object.assign({
      offset: 0,
      limit: $p.config.get('site.pageSize'),
    }, query);
    mysql.query('SELECT * FROM `blog` WHERE `is_show`=1 LIMIT ?,?', [ query.offset, query.limit ], callback);
  }

  // 取指定 ID 的博客内容
  function blogGetById(id, callback) {
    mysql.query('SELECT * FROM `blog` WHERE `id`=?', [ id ], (err, list) => {
      if (err) return callback(err);
      if (list.length < 1) return callback(null);
      const blog = list[0];
      mysql.query('SELECT * FROM `blog_contents` WHERE `id`=?', [ id ], (err, list) => {
        if (err) return callback(err);
        blog.content = list.length > 0 && list[0].content || '';
        callback(null, blog);
      });
    });
  }

};