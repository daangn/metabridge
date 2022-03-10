window.driver = {
  onQueried: function (queryName, requestBody) {
    return new Promise((resolve) => {
      resolve({
        queryName,
        requestBody,
      });
    });
  },
};

window.onClose = () => {};
