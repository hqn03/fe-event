// types

const SelectSeat = ({ seat, selected, onSelect, occupied }) => {
  const isSeat = seat.loai === "seat";

  const title = isSeat ? `${seat.row} ${seat.label}` : "";

  const classNames = `${seat.loai} ${
    selected && isSeat ? "active" : "passive"
  } ${occupied && isSeat ? "occupied" : "passive"} `;

  /**
   * Handles the key down event for the seat element. If the 'Enter' or space key is pressed,
   * it prevents the default action and triggers the onSelect callback.
   *
   * @param {React.KeyboardEvent<HTMLDivElement>} event - The keyboard event object.
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      onSelect();
    }
  };

  return isSeat ? (
    <div
      tabIndex={0}
      role="button"
      title={title}
      onClick={onSelect}
      className={classNames}
      onKeyDown={handleKeyDown}
    >
      {seat.ma_ghe}
    </div>
  ) : (
    <div className={`preview space`} />
  );
};

export default SelectSeat;
