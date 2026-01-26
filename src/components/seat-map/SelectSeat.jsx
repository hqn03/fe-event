// import Countdown from "react-countdown";
import Countdown from "react-countdown";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const SelectSeat = ({
  seat,
  selected,
  onSelect,
  occupied,
  booked,
  expiredAt,
  onExpire,
}) => {
  const isSeat = seat.loai === "seat";

  // const title = isSeat ? `${seat.row} ${seat.label}` : "";

  // const classNames = `${seat.loai} ${
  //   selected && isSeat ? "active" : "passive"
  // } ${occupied && isSeat ? "occupied" : "passive"} ${booked && isSeat ? "occupied" : "passive"} `;

  const classNames = [
    seat.loai,
    isSeat && selected && "active",
    isSeat && occupied && "occupied",
    isSeat && booked && "booked",
  ]
    .filter(Boolean)
    .join(" ");

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
    <Tooltip>
      <TooltipTrigger>
        <div
          tabIndex={0}
          role="button"
          // title={title}
          onClick={booked || occupied ? undefined : onSelect}
          className={classNames}
          onKeyDown={handleKeyDown}
        >
          {seat.ma_ghe}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {expiredAt ? (
          <Countdown date={expiredAt} onComplete={onExpire} />
        ) : (
          <p>
            {seat.hang_ghe}-{seat.ma_ghe}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  ) : (
    <div className={`preview space`} />
  );
};

export default SelectSeat;
