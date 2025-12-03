import { useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";

// hooks
import useWindowDimensions from "@/hooks/useWindowDimensions";

// components
import Row from "./Row";
import Stage from "./Stage";
import Legend from "./Legend";
import SelectSeat from "./SelectSeat";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import Cart from "../cart";

// variables
const defaultValues = {
  scale: 1,
  translation: { x: 20, y: 20 },
};

const Preview = ({ text, seatData, togglePreview, orderedData = [] }) => {
  const { event, session } = useSearch({ from: "/_auth/ticket-booking" });
  const { width, height } = useWindowDimensions();
  const queryClient = useQueryClient();

  const [props, setProps] = useState(defaultValues);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const total = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + Number(s.gia), 0);
  }, [selectedSeats]);

  const createOrderMutation = useMutation({
    mutationKey: ["create-order"],
    mutationFn: (data) => api.post("/orders", data),
    onSuccess: ({ data }) => {
      console.log(data);
    },
    onError: ({ response }) => {
      toast.error("Ghế đã được đặt");
      setSelectedSeats((prev) =>
        prev.filter((seat) => seat.id !== response.data.seatId)
      );

      queryClient.setQueryData(["ordered-seats"], (old) => {
        return [...old, response.data.seatId];
      });
    },
  });

  /**
   * Handles the selection of a seat by logging the seat data to the console.
   * Intended to be replaced with a callback function that performs the actual
   * logic for selecting a seat.
   *
   * @param {ISeat} seat - The seat object to be selected.
   */
  const handleSelect = (seat) => {
    setSelectedSeats((prev) => {
      const { id, hang_ghe, ma_ghe, gia: don_gia, loai_ghe: loai_ve } = seat;
      return prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, { id, hang_ghe, ma_ghe, don_gia, loai_ve, so_luong: 1 }];
    });
  };

  const rows = Array.from(seatData?.entries());

  return (
    <div className="grid grid-cols-12">
      <div
        className="canvas h-[calc(100vh-64px)] relative col-span-9"
        onContextMenu={(e) => e.preventDefault()}
      >
        <MapInteractionCSS
          showControls
          value={props}
          minScale={0.7}
          maxScale={1.5}
          controlsClass="controls"
          onChange={(val) => setProps(val)}
          btnClass="button circle flex flex-v-center flex-h-center"
          translationBounds={{ xMax: width - 50, yMax: height - 50 }}
          plusBtnContents={
            <span className="material-symbols-outlined">zoom_in</span>
          }
          minusBtnContents={
            <span className="material-symbols-outlined">zoom_out</span>
          }
        >
          <Stage preview={true} text={"STAGE"} />

          {rows?.map(([row, seatsInRow], index) => {
            return (
              <Row
                preview
                row={row}
                key={row}
                rowIndex={index}
                dragHandleProps={null}
                empty={row.startsWith("empty-")}
              >
                {seatsInRow.map((seat) => {
                  return (
                    <SelectSeat
                      seat={seat}
                      key={seat.id}
                      onSelect={() => handleSelect(seat)}
                      selected={selectedSeats.some((s) => s.id === seat.id)}
                      occupied={orderedData.includes(seat.id)}
                    />
                  );
                })}
              </Row>
            );
          })}
        </MapInteractionCSS>
        <Legend />
      </div>

      {/* <div className="col-span-3 p-4 border m-4 rounded-lg">
        <div className="flex-1">
          {selectedSeats.map((seat) => {
            return (
              <div key={seat.id} className="flex justify-between">
                <span>
                  {seat.hang_ghe}
                  {seat.ma_ghe}
                </span>
                <span>{seat.loai_ghe}</span>
                <span>{seat.gia}</span>
              </div>
            );
          })}
        </div>
        <div>Tổng cộng: {total}</div>
        <Button
          className={"w-full"}
          onClick={() => {
            createOrderMutation.mutate({
              event,
              total,
              session,
              selectedSeats,
            });
          }}
        >
          Tiếp tục
        </Button>
      </div> */}
      <div className="col-span-3">
        <Cart eventId={event} sessionId={session} items={selectedSeats} />
      </div>
    </div>
  );
};

export default Preview;
