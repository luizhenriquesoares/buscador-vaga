exports.endpointGitHub = req => {
  const url = `https://github.com/search?p=0&q=language%3A${
    req.params.technology
  }+location%3A${req.params.location}&type=Users&utf8=%E2%9C%93`;
  return url;
};
