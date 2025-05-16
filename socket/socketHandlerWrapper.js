module.exports = function handleSocketEvent(callback) {
  return async function (...args) {
    try {
      await callback(...args);
    } catch (error) {
      console.error("Socket Event Error:", error.message);
      // Optional: log full stack
      // console.error(error);
    }
  };
};
