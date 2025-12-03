const Legend = () => (
  <div
    onContextMenu={(e) => e.preventDefault()}
    className="flex flex-gap-large flex-v-center legend"
  >
    <div>
      <strong>Legend</strong>
    </div>
    <div className="flex flex-gap-small flex-v-center">
      <div className="seat" /> Trống
    </div>
    <div className="flex flex-gap-small flex-v-center">
      <div className="seat active" /> Đã chọn
    </div>
    <div className="flex flex-gap-small flex-v-center">
      <div className="seat occupied" /> Đã đặt
    </div>
  </div>
);

export default Legend;
