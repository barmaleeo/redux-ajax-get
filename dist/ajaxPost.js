export default function (url, constant, params) {
  const tokens = constant.split('_');
  let key = '';

  if (tokens.length === 0) {
    console.error('Undefined token');
    return {};
  } else if (tokens.length === 1) {
    key = tokens[0];
  } else {
    for (let i = 0; i < tokens.length - 1; i++) {
      key += tokens[i] + '_';
    }
  }

  return (dispatch, getStore) => {
    dispatch({
      type: key + 'REQ',
      payload: {
        params: params
      }
    });
    $.post(url, params, r => {
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
    }, 'json').fail(e => {
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