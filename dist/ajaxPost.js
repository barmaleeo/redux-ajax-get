"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(url, constant, params) {
  var tokens = constant.split('_');
  var key = '';

  if (tokens.length === 0) {
    console.error('Undefined token');
    return {};
  } else if (tokens.length === 1) {
    key = tokens[0];
  } else {
    for (var i = 0; i < tokens.length - 1; i++) {
      key += tokens[i] + '_';
    }
  }

  return function (dispatch, getStore) {
    dispatch({
      type: key + 'REQ',
      payload: {
        params: params
      }
    });
    $.post(url, params, function (r) {
      if (r.status === 'ok') {
        dispatch({
          type: key + 'DONE',
          payload: {
            params: params,
            response: r
          }
        });
      } else {
        dispatch({
          type: key + 'ERR',
          payload: {
            params: params,
            response: r.msg ? r.msg : r
          }
        });
      }
    }, 'json').fail(function (e) {
      console.error(url, key, e);
      dispatch({
        type: key + 'ERR',
        payload: {
          params: params,
          response: e.responseText
        }
      });
    });
  };
}