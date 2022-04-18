window.driver = {
  onQueried: function (queryName, requestBody) {
    return new Promise((resolve) => {
      resolve({
        queryName,
        requestBody,
      });
    });
  },
  onSubscribed: function (subscriptionName, requestBody, listener) {
    const interval = setInterval(() => {
      listener(null, {
        subscriptionName,
        requestBody,
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  },
};

window.onClose = () => {};
