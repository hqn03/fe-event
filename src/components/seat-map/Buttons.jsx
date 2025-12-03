import React from "react";

function Buttons({ totals, save, reset, toggle }) {
  return (
    <div className="flex flex-space-between flex-v-center buttons">
      <div className="totals">
        Total seats: <strong>{totals}</strong>
      </div>
      <div className="flex flex-gap-medium">
        {/* <button type="button" className="button gray" onClick={() => toggle()}>
          Preview
        </button> */}
        {/* <button type="button" className="button gray" onClick={() => reset()}>
          Reset
        </button> */}
        <button type="button" className="button black" onClick={() => save()}>
          Save seat map
        </button>
      </div>
    </div>
  );
}

export default Buttons;
