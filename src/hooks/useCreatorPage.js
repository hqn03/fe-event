import { useEffect } from "react";
import { useState } from "react";
import { v4 } from "uuid";
import { toast } from "sonner";
import axios from "axios";
import api from "@/services/api";
import { useParams } from "@tanstack/react-router";
// import { Droppable } from "@hello-pangea/dnd";
// import data from "@/data/data.json";

const useCreatorPage = () => {
  const { eventId } = useParams({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [seatMap, setSeatMap] = useState(null);
  const [seatData, setSeatData] = useState(new Map());

  const groupByRow = (seats) => {
    return seats.reduce((acc, seat) => {
      const currentRow = acc.get(seat.hang_ghe) || [];

      acc.set(seat.hang_ghe, [...currentRow, seat]);

      return acc;
    }, new Map());
  };

  useEffect(() => {
    // const { seatMapData, ...restData } = data;
    // setSeatMap(restData);
    const fetchSeatMap = async () => {
      const { data } = await api.get(`seats/${eventId}`);
      setSeatData(groupByRow(data));
    };
    fetchSeatMap();

    setLoading(false);
  }, []);

  const addSeatAction = (hang_ghe, seatId, loai, direction) => {
    setSeatData((prevSeatData) => {
      const data = new Map(prevSeatData);
      const seats = data.get(hang_ghe) || [];
      const index = seats.findIndex((seat) => seat.id === seatId);

      if (index === -1) return prevSeatData;

      const newSeat = {
        id: v4(),
        hang_ghe: hang_ghe,
        ma_ghe:
          loai === "seat"
            ? (
                Math.max(
                  ...seats
                    .filter((seat) => seat.loai === "seat")
                    .map((seat) => parseInt(seat.ma_ghe, 10)),
                  0
                ) + 1
              ).toString()
            : "0",
        loai_ghe: loai === "seat" ? seats[0].loai_ghe : "",
        gia: loai === "seat" ? seats[0].gia : 0,
        loai: loai,
      };

      seats.splice(index + (direction === "right" ? 1 : 0), 0, newSeat);

      data.set(hang_ghe, [...seats]);

      return data;
    });
  };

  const addSeat = (hang_ghe, seatId, loai, direction) => {
    addSeatAction(hang_ghe, seatId, loai, direction);
  };

  const addSeatToRow = (hang_ghe, loai, loai_ghe, gia) => {
    setSeatData((prev) => {
      const data = new Map(prev);
      const seats = data.get(hang_ghe) || [];

      const maxMaGhe = Math.max(
        0,
        ...seats.filter((s) => s.loai === "seat").map((s) => Number(s.ma_ghe))
      );

      const newSeat = {
        id: v4(),
        hang_ghe,
        ma_ghe: (maxMaGhe + 1).toString(),
        loai,
        loai_ghe: loai === "seat" ? loai_ghe : "",
        gia: loai === "seat" ? gia : 0,
      };

      data.set(hang_ghe, [...seats, newSeat]);
      return data;
    });
  };

  const addNewRow = (name) => {
    const normalizedInput = name.toLowerCase();

    const existingRow = Array.from(seatData.keys()).some(
      (hang_ghe) => hang_ghe.toLowerCase() === normalizedInput
    );

    if (existingRow) {
      return false;
    }

    setSeatData((prevSeatData) => {
      const data = new Map(prevSeatData);

      return data;
    });

    return true;
  };

  const editSeatName = (hang_ghe, seatId, name) => {
    setSeatData((prev) => {
      const updated = new Map(prev);

      const seats = updated.get(hang_ghe) || [];

      if (seats.some((seat) => seat.ma_so === name && seat.id !== seatId)) {
        toast.error(`Seat name ${name} already exists in hang_ghe ${hang_ghe}`);

        return prev;
      }

      updated.set(
        hang_ghe,
        seats.map((seat) =>
          seat.id === seatId ? { ...seat, ma_so: name } : seat
        )
      );

      return updated;
    });
  };

  const editSeat = (editingSeat) => {
    console.log(editingSeat);
    const { hang_ghe, id, ma_ghe } = editingSeat;
    setSeatData((prev) => {
      const updated = new Map(prev);

      const seats = updated.get(hang_ghe) || [];

      if (seats.some((seat) => seat.ma_ghe === ma_ghe && seat.id !== id)) {
        toast.error(
          `Seat name ${ma_ghe} already exists in hang_ghe ${hang_ghe}`
        );

        return prev;
      }

      updated.set(
        hang_ghe,
        seats.map((seat) => (seat.id === id ? editingSeat : seat))
      );

      toast.success("Cập nhật ghế thành công");

      return updated;
    });
  };

  const deleteSeat = (hang_ghe, seatId) => {
    setSeatData((prev) => {
      const updated = new Map(prev);

      const seats =
        updated.get(hang_ghe)?.filter((seat) => seat.id !== seatId) || [];

      if (seats.length === 0) {
        updated.delete(hang_ghe);
      } else {
        updated.set(hang_ghe, seats);
      }

      return updated;
    });
  };

  const addEmptyRow = () => {
    setSeatData((prevSeatData) => {
      const data = new Map(prevSeatData);

      const rowId = v4().replace(/-/g, "").slice(0, 12);

      const emptyRow = {
        id: v4(),
        hang_ghe: `empty-${rowId}`,
        ma_ghe: "0",
        loai_ghe: "",
        gia: 0,
        loai: "space",
      };

      data.set(emptyRow.hang_ghe, [emptyRow]);

      return data;
    });
  };

  const addSeatedRow = (name) => {
    const normalizedInput = name.toLowerCase();

    const existingRow = Array.from(seatData.keys()).some(
      (hang_ghe) => hang_ghe.toLowerCase() === normalizedInput
    );

    if (existingRow) {
      toast.error(`Row with name ${name} already exists`, {
        icon: "😮",
      });

      return false;
    }

    setSeatData((prevSeatData) => {
      const data = new Map(prevSeatData);

      const emptyRow = {
        id: v4(),
        hang_ghe: name,
        ma_ghe: "1",
        loai: "seat",
        loai_ghe: "",
        gia: 0,
      };

      data.set(emptyRow.hang_ghe, [emptyRow]);

      return data;
    });

    return true;
  };

  const editRowName = (name, oldName) => {
    const normalizedInput = name.toLowerCase();

    const existingRow = Array.from(seatData.keys()).some(
      (hang_ghe) => hang_ghe.toLowerCase() === normalizedInput
    );

    if (existingRow) {
      toast.error(`Row with name ${name} already exists`);
    } else {
      setSeatData((prevSeatData) => {
        const data = new Map();

        Array.from(prevSeatData.entries()).forEach(([hang_ghe, seats]) => {
          if (hang_ghe === oldName) {
            data.set(
              name,
              seats.map((seat) => ({ ...seat, hang_ghe: name }))
            );
          } else {
            data.set(hang_ghe, seats);
          }
        });

        toast.success(`Row ${name} edited successfully`, {
          position: "top-center",
        });

        return data;
      });
    }
  };

  const deleteRow = (hang_ghe) => {
    setSeatData((prevSeatData) => {
      const data = new Map(prevSeatData);

      if (!data.delete(hang_ghe)) {
        toast.error(`Row ${hang_ghe} does not exist`);

        return prevSeatData;
      }

      toast.success(`Row deleted successfully`);

      return data;
    });
  };

  const handleOnDragEnd = ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;

    const data = Array.from(seatData.keys());

    const [movedRow] = data.splice(source.index, 1);

    data.splice(destination.index, 0, movedRow);

    setSeatData(
      new Map(data.map((hang_ghe) => [hang_ghe, seatData.get(hang_ghe) ?? []]))
    );
  };

  // const editMapName = (name) => {
  //   setSeatMap({ ...seatMap, name });

  //   toast.success(`Map name edited successfully`);
  // };

  // const editStageName = (name) => {
  //   setSeatMap({ ...seatMap, stageText: name });

  //   toast.success(`Stage label edited successfully`);
  // };

  const getTotalSeats = () =>
    Array.from(seatData.values())
      .flat()
      .filter((seat) => seat.loai === "seat").length;

  const saveData = () => {
    const data = Array.from(seatData.values()).flat();

    toast.promise(api.put(`manager/events/${eventId}/seats`, data), {
      success: "Lưu sơ đồ ghế thành công",
      loading: "Đang lưu sơ đồ ghế",
      error: "Lưu sơ đồ ghế thất bại",
      position: "top-center",
    });
  };

  const resetData = () => setSeatData(groupByRow(data.seatMapData));

  const togglePreview = () => setPreview((prev) => !prev);

  const rows = Array.from(seatData?.entries());

  return {
    rows,
    loading,
    preview,
    // seatMap,
    seatData,
    getTotalSeats,
    addSeat,
    deleteSeat,
    editSeatName,
    deleteRow,
    editRowName,
    addEmptyRow,
    addSeatedRow,
    // editMapName,
    // editStageName,
    saveData,
    resetData,
    togglePreview,
    handleOnDragEnd,
    editSeat,
    addSeatToRow,
    addNewRow,
  };
};

export default useCreatorPage;
