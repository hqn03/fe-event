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

const CreatorPage = () => {
  const {
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
    editMapName,
    editStageName,
    saveData,
    resetData,
    togglePreview,
    handleOnDragEnd,
    editSeat,
  } = useCreatorPage();
  console.log(seatData);

  if (loading) {
    return <div className="container">Loading... Please wait.</div>;
  }

  if (preview) {
    return (
      <Preview
        seatData={seatData}
        // text={seatMap?.stageText}
        togglePreview={togglePreview}
      />
    );
  }

  return (
    <div className="grid grid-cols-5 p-4">
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
  );
};

export default CreatorPage;
