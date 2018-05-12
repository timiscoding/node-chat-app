/**
 * jQuery.deparam - The oposite of jQuery param. Creates an object of query string parameters.
 *
 * Credits for the idea and Regex:
 * http://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
*/

/* eslint-disable no-param-reassign */

import jQuery from 'jquery';

(($) => {
  $.deparam = $.deparam || ((uri = window.location.search) => {
    const queryString = {};
    uri.replace(
      new RegExp('([^?=&]+)(=([^&#]*))?', 'g'),
      ($0, $1, $2, $3) => {
        queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
      },
    );
    return queryString;
  });
})(jQuery);
