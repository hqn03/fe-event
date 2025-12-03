import { useState } from "react";

const Header = ({ seatMap, editMapName }) => {
  const [formValues, setFormValues] = useState({
    name: seatMap?.name || "",
  });
  const handleOnSubmit = (e) => {
    e.preventDefault();

    const { name } = formValues;

    if (!name || name.trim() === "") return;

    editMapName?.(name);
  };

  return (
    <header className="flex flex-space-between flex-v-center">
      <form
        noValidate
        className="flex flex-gap-medium"
        onSubmit={handleOnSubmit}
      >
        <input
          id="name"
          type="text"
          name="mapName"
          autoComplete="off"
          value={formValues.name}
          placeholder="Enter seat map name"
          onChange={(e) =>
            setFormValues({ ...formValues, name: e.target.value })
          }
        />
        <button type="submit" className="button black">
          Save
        </button>
      </form>
      <div>
        <button
          type="button"
          data-tooltip-id="description"
          className="flex flex-gap-small flex-v-center button gray"
          data-tooltip-html={`<p><strong>Venue name</strong><br />${seatMap?.venueName}</p><p>&nbsp;</p><p><strong>Block name</strong><br />${seatMap?.blockName}</p>`}
        >
          <span className="material-symbols-outlined">info</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
