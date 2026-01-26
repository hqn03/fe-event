import { Tooltip } from "react-tooltip";
// import { Toaster } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// styles
import "../styles/creator.css";

// hooks
import useCreatorPage from "@/hooks/useCreatorPage";

// components
import Row from "@/components/seat-map/Row";
import Seat from "@/components/seat-map/Seat";
import Stage from "@/components/seat-map/Stage";
import Header from "@/components/seat-map/Header";
import NewRow from "@/components/seat-map/NewRow";
import NewSeat from "@/components/seat-map/NewSeat";
import Preview from "@/components/seat-map/Preview";
import Buttons from "@/components/seat-map/Buttons";
import SeatEditingForm from "./seat-editing-form";
import { Button } from "./ui/button";
import { create } from "zustand";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";

const CreatorPage = () => {
  const {
    rows,
    loading,
    // preview,
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
    editMapName,
    editStageName,
    saveData,
    resetData,
    togglePreview,
    handleOnDragEnd,
    editSeat,
    addSeatToRow,
    addNewRow,
  } = useCreatorPage();

  const [hang, setHang] = useState("");
  const [cot, setCot] = useState("");
  const [batDau, setBatDau] = useState("");
  const [oTrong, setOTrong] = useState(false);
  const [loaiVe, setLoaiVe] = useState("");
  const [gia, setGia] = useState("");
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="container">Loading... Please wait.</div>;
  }

  // if (preview) {
  //   return (
  //     <Preview
  //       seatData={seatData}
  //       // text={seatMap?.stageText}
  //       togglePreview={togglePreview}
  //     />
  //   );
  // }

  const generateSeats = (m, n, batDau, oTrong, loaiGhe, gia) => {
    const startCharCode = batDau.charCodeAt(0);

    for (let i = 0; i < m; i++) {
      const row = String.fromCharCode(startCharCode + i);

      addNewRow(row);
      // Thêm
      if (oTrong) {
        addSeatToRow(row, "space", loaiGhe, gia);
      }
      for (let j = 0; j < n; j++) {
        addSeatToRow(row, "seat", loaiGhe, gia);
      }
    }
  };
  const handleCreateSeats = () => {
    generateSeats(hang, cot, batDau, oTrong, loaiVe, gia);
    setOpen(false);
    resetForm();
  };
  const resetForm = () => {
    setHang("");
    setCot("");
    setBatDau("");
    setOTrong(false);
    setLoaiVe("");
    setGia("");
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <form
            onSubmit={() => {
              console.log("test");
            }}
          >
            <DialogTrigger asChild>
              <Button>Tạo ghế nhanh</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[375px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex items-center gap-2">
                  <Label htmlFor="hang">Ma trận</Label>
                  <Input
                    id="hang"
                    className="max-w-24"
                    type="number"
                    placeholder="Số hàng"
                    value={hang}
                    onChange={(e) => setHang(e.target.value)}
                  />
                  x
                  <Input
                    id="cot"
                    className="max-w-24"
                    name="name"
                    type="number"
                    placeholder="Số cột"
                    value={cot}
                    onChange={(e) => setCot(e.target.value)}
                  />
                </div>
                <div className="flex items-center  gap-2">
                  <Label htmlFor="username-1">Bắt đầu</Label>
                  <Input
                    className="max-w-20"
                    value={batDau}
                    placeholder="A"
                    onChange={(e) => setBatDau(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="space"
                    checked={oTrong}
                    onCheckedChange={(value) => setOTrong(!!value)}
                  />
                  <Label htmlFor="space">Thêm cột trống </Label>
                </div>
                <div className="col-span-2 flex items-center  gap-2">
                  <Label className="min-w-16" htmlFor="loai_ve">
                    Loại vé
                  </Label>
                  <Input
                    id="loai_ve"
                    className=""
                    placeholder="VIP, thường..."
                    value={loaiVe}
                    onChange={(e) => setLoaiVe(e.target.value)}
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Label className="min-w-16" htmlFor="gia">
                    Giá
                  </Label>
                  <Input
                    id="gia"
                    className=""
                    type="number"
                    value={gia}
                    onChange={(e) => setGia(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateSeats}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
        {/* <Button onClick={handleCreateSeats}>Tạo ghế nhanh</Button> */}
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-4">
          {/* <Header seatMap={seatMap} editMapName={editMapName} /> */}

          <Stage text={"STAGE"} />

          {/* <div className="seatmap" onContextMenu={(e) => e.preventDefault()}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="rows" direction="vertical">
              {(droppableProvided) => (
                <div
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  {rows?.map(([row, seatsInRow], index) => {
                    return (
                      <Draggable key={row} index={index} draggableId={row}>
                        {(draggableProvided) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                          >
                            <Row
                              row={row}
                              rowIndex={index}
                              deleteRow={deleteRow}
                              editRowName={editRowName}
                              empty={row.startsWith("empty-")}
                              dragHandleProps={
                                draggableProvided.dragHandleProps
                              }
                            >
                              {seatsInRow.map((seat) => (
                                <Seat
                                  seat={seat}
                                  key={seat.id}
                                  rowIndex={index}
                                  addSpace={addSeat}
                                  deleteSeat={deleteSeat}
                                  editSeatName={editSeatName}
                                />
                              ))}
                              <NewSeat
                                rowIndex={index}
                                addSeat={addSeat}
                                seat={seatsInRow[seatsInRow.length - 1]}
                              />
                            </Row>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div> */}

          {rows?.map(([row, seatsInRow], index) => {
            return (
              <Row
                key={index}
                row={row}
                rowIndex={index}
                deleteRow={deleteRow}
                editRowName={editRowName}
                empty={row.startsWith("empty-")}
              >
                {seatsInRow.map((seat) => (
                  <Seat
                    seat={seat}
                    key={seat.id}
                    rowIndex={index}
                    addSpace={addSeat}
                    deleteSeat={deleteSeat}
                    editSeatName={editSeatName}
                  />
                ))}
                <NewSeat
                  rowIndex={index}
                  addSeat={addSeat}
                  seat={seatsInRow[seatsInRow.length - 1]}
                />
              </Row>
            );
          })}

          <Tooltip id="description" />

          <NewRow addEmptyRow={addEmptyRow} addSeatedRow={addSeatedRow} />
        </div>
        <div className="col-span-1 border rounded-lg">
          <SeatEditingForm editSeat={editSeat} />
        </div>
        <div className="col-span-5">
          <Buttons
            totals={getTotalSeats()}
            save={saveData}
            reset={resetData}
            // toggle={togglePreview}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;
