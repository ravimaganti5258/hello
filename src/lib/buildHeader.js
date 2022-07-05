export const buildHeader = (headerParams = {}) => {
  var header = {
    // Accept: 'application/json',
    'Content-Type': 'application/json',
    // 'Cache-Control': 'no-cache',
  };
  header = Object.assign({}, header, headerParams);
  return header;
};

export const Header = (token) => {
  let header = {Authorization: `Bearer ${token}`};
  // header = Object.assign({}, header, headerParams);
  return header;
};
