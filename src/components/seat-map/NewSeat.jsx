import { useRef, useState } from "react";

// hooks
import useClickOutside from "@/hooks/useClickOutside";

// types

// interfaces

const NewSeat = ({ seat, rowIndex, addSeat }) => {
  const ref = useRef(null);

  const [menuOpened, setMenuOpened] = useState(false);

  useClickOutside(ref, () => setMenuOpened(false));

  /**
   * Handles the click event on the button by calling the callback function if it exists
   * and toggling the menuOpened state.
   *
   * @param {() => void} [callback] - The callback function to call when the button is clicked.
   * @param {IDirection} direction - The direction to pass to the callback function.
   */
  const handleSeatAction = (direction, loai, callback) => {
    if (callback) callback(seat.hang_ghe, seat.id, loai, direction);

    setMenuOpened(false);
  };

  /**
   * Handles the right-click event on the seat to toggle the menuOpened state.
   *
   * @param {React.MouseEvent} event - The event object from the right-click action.
   */
  const handleRightClick = (event) => {
    event.preventDefault();

    setMenuOpened((prev) => !prev);
  };

  return (
    <div ref={ref} className="relative seat-buttons">
      <button
        type="button"
        onContextMenu={handleRightClick}
        onClick={() => setMenuOpened((prev) => !prev)}
        className={`mini-button ${menuOpened ? "active" : ""}`}
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      {menuOpened && (
        <div
          className={
            rowIndex > 5
              ? "flex flex-gap flex-column dropdown top-left"
              : "flex flex-gap flex-column dropdown bottom-left"
          }
        >
          <button
            type="button"
            onClick={() => handleSeatAction("right", "seat", addSeat)}
          >
            <span className="material-symbols-outlined">event_seat</span>
            Add new seat
          </button>
          <button
            type="button"
            onClick={() => handleSeatAction("right", "space", addSeat)}
          >
            <span className="material-symbols-outlined">
              check_box_outline_blank
            </span>
            Add new space
          </button>
        </div>
      )}
    </div>
  );
};

export default NewSeat;
