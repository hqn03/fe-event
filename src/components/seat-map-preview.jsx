import { useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";

// hooks
import useWindowDimensions from "@/hooks/useWindowDimensions";

// components
import Row from "@/components/seat-map/Row";
import Stage from "@/components/seat-map/Stage";
import Legend from "@/components/seat-map/Legend";
import SelectSeat from "@/components/seat-map/SelectSeat";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";

// variables
const defaultValues = {
  scale: 1,
  translation: { x: 20, y: 20 },
};

const SeatMapPreview = ({ seatData, phiens }) => {
  const [selectedPhien, setSelectPhien] = useState(phiens[0].id_phien_su_kien);
  const [orderedData, setOrderedData] = useState([]);

  const handleChangePhien = (e) => {
    setSelectPhien(e.target.value);
  };
  const { occupiedSeats, bookedSeats } = useMemo(() => {
    const occupiedSeats = new Map();
    const bookedSeats = [];

    orderedData.forEach((item) => {
      item.trang_thai === "GIU_CHO"
        ? occupiedSeats.set(item.id_ghe, item.het_han)
        : bookedSeats.push(item.id_ghe);
    });

    return { occupiedSeats, bookedSeats };
  }, [orderedData]);

  const { width, height } = useWindowDimensions();
  const queryClient = useQueryClient();

  const [props, setProps] = useState(defaultValues);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const total = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + Number(s.gia), 0);
  }, [selectedSeats]);

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

  const handleSameSeat = (seatId) => {
    console.log(seatData);
    setSelectedSeats((prev) => {
      return prev.filter((s) => s.id !== seatId);
    });
  };

  const rows = Array.from(seatData?.entries());
  const onExpire = (id) => {
    occupiedSeats.delete(id);
  };

  const orderedSeatsQuery = useQuery({
    queryKey: ["ordered-seats-session", selectedPhien],
    queryFn: () =>
      api
        .get(`/sessions/${selectedPhien}/ordered-seats`)
        .then((res) => setOrderedData(res.data)),
  });

  return (
    <div className="mt-6">
      <label>
        Chọn phiên sự kiện
        <select
          value={selectedPhien}
          onChange={handleChangePhien}
          className="ml-4 p-2 border-2"
        >
          {phiens.map((phien) => (
            <option value={phien.id_phien_su_kien}>
              {formatDateTime(phien.thoi_gian_bat_dau) +
                " - " +
                formatDateTime(phien.thoi_gian_ket_thuc)}
            </option>
          ))}
        </select>
      </label>
      <></>
      <div
        className="canvas h-[calc(100vh-150px)] relative"
        onContextMenu={(e) => e.preventDefault()}
      >
        <MapInteractionCSS
          showControls
          value={props}
          minScale={0.7}
          maxScale={1.5}
          // controlsClass="controls"
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
                      //   onSelect={() => handleSelect(seat)}
                      selected={selectedSeats.some((s) => s.id === seat.id)}
                      occupied={occupiedSeats.has(seat.id)}
                      booked={bookedSeats.includes(seat.id)}
                      expiredAt={occupiedSeats.get(seat.id)}
                      onExpire={onExpire}
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
    </div>
  );
};

export default SeatMapPreview;
