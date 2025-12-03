import { useSeatStore } from "@/stores/seat";
import React from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import useCreatorPage from "@/hooks/useCreatorPage";

function SeatEditingForm({ editSeat }) {
  const editingSeat = useSeatStore((s) => s.editingSeat);
  const setEditingSeat = useSeatStore((s) => s.setEditingSeat);

  if (editingSeat?.loai === "seat") {
    return (
      <form
        className="p-4"
        onSubmit={(e) => {
          e.preventDefault();
          editSeat(editingSeat);
        }}
      >
        <FieldGroup>
          <FieldSet>
            <Field>
              <FieldLabel>Mã số</FieldLabel>
              <Input
                value={editingSeat.ma_ghe}
                onChange={(e) => {
                  setEditingSeat({ ...editingSeat, ma_ghe: e.target.value });
                }}
              />
            </Field>
            <Field>
              <FieldLabel>Loại ghế / vé</FieldLabel>
              <Input
                value={editingSeat?.loai_ghe || ""}
                onChange={(e) => {
                  setEditingSeat({ ...editingSeat, loai_ghe: e.target.value });
                }}
              />
            </Field>
            <Field>
              <FieldLabel>Giá vé</FieldLabel>
              <Input
                value={editingSeat?.gia || 0}
                min={0}
                type={"number"}
                onChange={(e) => {
                  setEditingSeat({
                    ...editingSeat,
                    gia: Number(e.target.value),
                  });
                }}
              />
            </Field>
          </FieldSet>
          <Button type="submit">Lưu</Button>
        </FieldGroup>
      </form>
    );
  }

  return <></>;
}

export default SeatEditingForm;
