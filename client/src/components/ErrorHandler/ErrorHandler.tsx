const ErrorHandler = () => {
  return (
    <div id="error-page" style={{ textAlign: "center" }}>
      <h1>Опа</h1>
      <h2>Страницата не е намерена.</h2>
      <p>
        <i>Страницата, която търсете не е намерена.</i>
      </p>
    </div>
  );
};

ErrorHandler.propTypes = {};

export default ErrorHandler;
