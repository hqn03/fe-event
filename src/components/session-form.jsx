import api from "@/services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import DatePicker from "react-datepicker";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";

function SessionForm({ event }) {
  const [phienSuKienOpen, setPhienSuKienOpen] = useState(false);
  const [idPhienSuKienEdit, setIdPhienSuKienEdit] = useState("");

  const { eventId } = useParams({});
  const { data: phienSuKiens = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: () =>
      api.get(`manager/events/${eventId}/sessions`).then(({ data }) => data),
  });
  const queryClient = useQueryClient();
  const phienSuKienForm = useForm({
    defaultValues: {
      id_phien_su_kien: "",
      thoi_gian_bat_dau: new Date(event.ngay_bat_dau),
      thoi_gian_ket_thuc: new Date(event.ngay_ket_thuc),
      thoi_gian_mo_dat_ve: new Date(),
      thoi_gian_dong_dat_ve: new Date(),
    },
    onSubmit: ({ value }) => {
      console.log(value);
      if (value.id_phien_su_kien) {
        api
          .put(`manager/events/${eventId}/sessions`, value)
          .then(({ data }) => {
            queryClient.setQueryData(["sessions"], (prev) =>
              prev.map((s) =>
                s.id_phien_su_kien === data.id_phien_su_kien ? data : s
              )
            );
            toast.success("Cập phiên sự kiện thành công", {
              position: "top-center",
            });
          })
          .catch(({ data }) => {
            toast.error("Cập phiên sự kiện thất bại", {
              position: "top-center",
            });
          })
          .finally(() => {
            setIdPhienSuKienEdit("");
            phienSuKienForm.reset();
            setPhienSuKienOpen(false);
          });
      } else {
        api
          .post(`manager/events/${eventId}/sessions`, value)
          .then(({ data }) => {
            queryClient.setQueryData(["sessions"], (prev) => {
              return [...prev, data];
            });
            toast.success("Tạo phiên sự kiện thành công", {
              position: "top-center",
            });
          })
          .catch(() => {
            toast.error("Tạo phiên sự kiện thất bại", {
              position: "top-center",
            });
          })
          .finally(() => {
            setIdPhienSuKienEdit("");
            phienSuKienForm.reset();
            setPhienSuKienOpen(false);
          });
      }
    },
  });

  const handleSetPhienSuKienForm = (data) => {
    console.log(data);
    phienSuKienForm.setFieldValue("id_phien_su_kien", data.id_phien_su_kien);
    phienSuKienForm.setFieldValue(
      "thoi_gian_bat_dau",
      new Date(data.thoi_gian_bat_dau)
    );
    phienSuKienForm.setFieldValue(
      "thoi_gian_ket_thuc",
      data.thoi_gian_ket_thuc
    );
    phienSuKienForm.setFieldValue(
      "thoi_gian_mo_dat_ve",
      data.thoi_gian_mo_dat_ve
    );
    phienSuKienForm.setFieldValue(
      "thoi_gian_dong_dat_ve",
      data.thoi_gian_dong_dat_ve
    );
  };

  const handleDeleteSession = (sessionId) => {
    if (confirm("Xóa phiên sự kiện")) {
      api.delete(`sessions/${sessionId}`).then(() => {
        queryClient.setQueryData(["sessions"], (prev) => {
          return prev.filter((i) => i.id_phien_su_kien !== sessionId);
        });
        toast.success("Xóa phiên sự kiện thành công", {
          position: "top-center",
        });
      });
    }
  };

  return (
    <div className="p-4">
      {/* <div className="flex justify-end">
        <Button onClick={handleCreateUpdateSessionTickets}>Lưu</Button>
      </div> */}
      {phienSuKiens.length === 0 && <div>Không có phiên sự kiện</div>}

      {phienSuKiens.map((phienSuKien) => {
        return (
          <div
            key={phienSuKien.id_phien_su_kien}
            className="flex flex-col gap-2 border rounded-lg p-2 mt-4"
          >
            <div className="flex items-center justify-between gap-4 px-4">
              <h4 className=" font-semibold flex-1">
                {formatDateTime(phienSuKien.thoi_gian_bat_dau)} -{" "}
                {formatDateTime(phienSuKien.thoi_gian_ket_thuc)}
              </h4>
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={(e) => {
                  e.preventDefault();
                  handleSetPhienSuKienForm(phienSuKien);
                  setPhienSuKienOpen(true);
                }}
              >
                <Edit />
              </Button>
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteSession(phienSuKien.id_phien_su_kien);
                }}
              >
                <Trash />
              </Button>
            </div>
          </div>
        );
      })}

      {/* <Button>Tạo phiên sự kiện mới</Button> */}
      <div className="flex justify-center">
        <Button
          className={"mt-4"}
          variant="outline"
          onClick={() => {
            setPhienSuKienOpen(true);
          }}
        >
          Tạo phiên sự kiện
        </Button>
      </div>

      {/* PHIEN SU KIEN FORM */}
      <Dialog
        open={phienSuKienOpen}
        onOpenChange={() => {
          setPhienSuKienOpen(false);
          phienSuKienForm.reset();
        }}
      >
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {phienSuKienForm.getFieldValue("id_phien_su_kien")
                  ? "Cập nhật phiên sự kiện"
                  : "Tạo phiên sự kiện"}
              </DialogTitle>
              <DialogDescription>
                {phienSuKienForm.getFieldValue("id_phien_su_kien")
                  ? "Cập nhật phiên sự kiện, nhấn lưu để cập nhật."
                  : "Tạo phiên sự kiện mới, nhấn lưu để tạo."}
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="grid grid-cols-2 gap-8">
              <phienSuKienForm.Field
                name="thoi_gian_bat_dau"
                children={(field) => (
                  <Field>
                    <FieldLabel>Thời gian bắt đầu</FieldLabel>
                    <DatePicker
                      selected={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                      timeIntervals={30}
                      showTimeSelect
                      startDate={event?.ngay_bat_dau ?? null}
                      minDate={event?.ngay_bat_dau ?? null}
                      maxDate={event?.ngay_ket_thuc ?? null}
                      dateFormat="HH:mm  dd/MM/yyyy"
                      timeFormat="HH:mm"
                    />
                  </Field>
                )}
              />
              <phienSuKienForm.Field
                name="thoi_gian_ket_thuc"
                children={(field) => (
                  <Field>
                    <FieldLabel>Thời gian kết thúc</FieldLabel>
                    <DatePicker
                      selected={new Date(field.state.value)}
                      onChange={(value) => field.handleChange(value)}
                      showTimeSelect
                      timeIntervals={30}
                      minDate={event.ngay_bat_dau}
                      maxDate={event.ngay_ket_thuc}
                      dateFormat="HH:mm  dd/MM/yyyy"
                      timeFormat="HH:mm"
                    />
                  </Field>
                )}
              />
              <phienSuKienForm.Field
                name="thoi_gian_mo_dat_ve"
                children={(field) => (
                  <Field>
                    <FieldLabel>Thời gian mở đặt vé</FieldLabel>
                    <DatePicker
                      selected={new Date(field.state.value)}
                      onChange={(value) => field.handleChange(value)}
                      showTimeSelect
                      timeIntervals={30}
                      dateFormat="HH:mm  dd/MM/yyyy"
                      timeFormat="HH:mm"
                    />
                  </Field>
                )}
              />
              <phienSuKienForm.Field
                name="thoi_gian_dong_dat_ve"
                children={(field) => (
                  <Field>
                    <FieldLabel>Thời gian đóng đặt vé</FieldLabel>
                    <DatePicker
                      selected={new Date(field.state.value)}
                      onChange={(value) => field.handleChange(value)}
                      showTimeSelect
                      timeIntervals={30}
                      dateFormat="HH:mm  dd/MM/yyyy"
                      timeFormat="HH:mm"
                    />
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" onClick={phienSuKienForm.handleSubmit}>
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}

export default SessionForm;
