import React from "react";
import ReactLoading from "react-loading";

const Loader = () => {
  return (
    <div className="loader-container">
      <ReactLoading
        type={"bubbles"}
        color="#D2D2D2"
        width="80px"
        height="80px"
      />
    </div>
  );
};

export default Loader;
