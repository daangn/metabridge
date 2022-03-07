window.driver = {
  onCalled: function (type, requestBody) {
    return new Promise((resolve) => {
      resolve({
        type,
        requestBody,
      });
    });
  },
};

window.onClose = () => {};
