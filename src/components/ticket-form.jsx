import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import { useForm } from "@tanstack/react-form";
import { Field, FieldGroup, FieldSet } from "./ui/field";
import { nanoid } from "nanoid";
import { Edit } from "lucide-react";
import { Trash } from "lucide-react";
import api, { createUpdateSessionTickets } from "@/services/api";
import { toast } from "sonner";
import { useEffect } from "react";
import { Ticket } from "lucide-react";
import { format, formatDate } from "date-fns";
import { useParams } from "@tanstack/react-router";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

function TicketForm() {
  const [loaiVeOpen, setLoaiVeOpen] = useState(false);

  const { eventId } = useParams({});
  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions-tickets"],
    queryFn: () =>
      api.get(`manager/events/${eventId}/tickets`).then(({ data }) => data),
  });
  const queryClient = useQueryClient();
  const loaiVeForm = useForm({
    defaultValues: {
      // id_loai_ve: "",
      ten_ve: "",
      gia_ve: 0,
      so_luong_con: 0,
      so_luong_mua_min: 1,
      so_luong_mua_max: 10,
      mo_ta: "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (value.id_loai_ve) {
          const { data } = await api.put(
            `manager/events/${eventId}/tickets`,
            value
          );
          queryClient.setQueryData(["sessions-tickets"], (prev) =>
            prev.map((session) => {
              return session.id_phien_su_kien !== data.id_phien_su_kien
                ? session
                : {
                    ...session,
                    loaiVes: session.loaiVes.map((ticket) =>
                      ticket.id_loai_ve !== data.id_loai_ve ? ticket : data
                    ),
                  };
            })
          );
          toast.success("Cập nhật vé thành công", {
            position: "top-center",
          });
          return;
        }

        const { data } = await api.post(
          `manager/events/${eventId}/tickets`,
          value
        );
        const mapped = Object.fromEntries(
          data.map((t) => [t.id_phien_su_kien, t.id_loai_ve])
        );

        queryClient.setQueryData(["sessions-tickets"], (prev) =>
          prev.map((session) => ({
            ...session,
            loaiVes: [
              ...session.loaiVes,
              {
                id_loai_ve: mapped[session.id_phien_su_kien],
                ...value,
              },
            ],
          }))
        );

        toast.success("Tạo vé thành công", { position: "top-center" });
      } catch (error) {
        console.log(error);
        toast.error(
          value.id_loai_ve ? "Cập nhật vé thất bại" : "Tạo vé thất bại",
          { position: "top-center" }
        );
      } finally {
        setLoaiVeOpen(false);
        loaiVeForm.reset();
      }
    },
  });

  const handleEditTicket = (ticket) => {
    loaiVeForm.setFieldValue("gia_ve", ticket.gia_ve);
    loaiVeForm.setFieldValue("mo_ta", ticket.mo_ta);
    loaiVeForm.setFieldValue("so_luong_con", ticket.so_luong_con);
    loaiVeForm.setFieldValue("so_luong_mua_max", ticket.so_luong_mua_max);
    loaiVeForm.setFieldValue("so_luong_mua_min", ticket.so_luong_mua_min);
    loaiVeForm.setFieldValue("ten_ve", ticket.ten_ve);
    loaiVeForm.setFieldValue("id_loai_ve", ticket.id_loai_ve);

    setLoaiVeOpen(true);
  };

  const handleDeleteTicket = (ticket) => {
    if (!confirm(`Bạn có muốn xóa vé ${ticket.ten_ve}`)) return;

    api
      .delete(`manager/events/${eventId}/tickets/${ticket.id_loai_ve}`)
      .then(({ data }) => {
        toast.success("Xóa vé thành công", { position: "top-center" });
        queryClient.setQueryData(["sessions-tickets"], (prev) =>
          prev.map((session) =>
            session.id_phien_su_kien !== data.id_phien_su_kien
              ? session
              : {
                  ...session,
                  loaiVes: session.loaiVes.filter(
                    (ticket) => ticket.id_loai_ve !== data.id_loai_ve
                  ),
                }
          )
        );
      })
      .catch(() => {
        toast.error("Xóa vé bị lỗi. Hãy thử lại", { position: "top-center" });
      });
  };
  return (
    <>
      {sessions.length === 0 && <div>Không có phiên sự kiện</div>}
      {sessions.map((session) => {
        return (
          <div key={session.id_phien_su_kien} className="mt-4">
            <div className="font-medium">
              {formatDate(session.thoi_gian_bat_dau, "HH:mm")}-
              {formatDate(session.thoi_gian_ket_thuc, "HH:mm dd/MM/yyyy")}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên vé</TableHead>
                  <TableHead>Giá vé</TableHead>
                  <TableHead>Số lượng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {session.loaiVes.map((ticket) => {
                  return (
                    <TableRow key={ticket.id_loai_ve}>
                      <TableCell>{ticket.ten_ve}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(ticket.gia_ve)}
                      </TableCell>
                      <TableCell>{ticket.so_luong_con}</TableCell>
                      <TableCell>
                        <div className="flex gap-4">
                          <Button
                            variant={"link"}
                            onClick={() => {
                              handleEditTicket(ticket);
                            }}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant={"link"}
                            onClick={() => handleDeleteTicket(ticket)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      })}

      <div className="flex justify-center">
        <Button
          className={"mt-4"}
          variant="outline"
          onClick={() => {
            setLoaiVeOpen(true);
          }}
        >
          Tạo vé
        </Button>
      </div>

      {/* LOAI VE FORM */}
      <Dialog
        open={loaiVeOpen}
        onOpenChange={() => {
          loaiVeForm.reset();
          setLoaiVeOpen(false);
        }}
      >
        <form>
          <DialogContent className="min-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {loaiVeForm.getFieldValue("id_loai_ve")
                  ? "Cập nhật vé"
                  : "Tạo vé"}
              </DialogTitle>
              <DialogDescription>
                {loaiVeForm.getFieldValue("id_loai_ve")
                  ? "Cập nhật vé, nhấn lưu để cập nhật."
                  : "Tạo vé mới, nhấn lưu để tạo."}
              </DialogDescription>
            </DialogHeader>
            <FieldSet className={"grid grid-cols-3"}>
              <loaiVeForm.Field
                name="ten_ve"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <Label>Tên vé</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type="text"
                      />
                    </Field>
                  );
                }}
              />
              <loaiVeForm.Field
                name="gia_ve"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <Label>Giá vé</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={Number(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        aria-invalid={isInvalid}
                        min={0}
                        type="number"
                      />
                    </Field>
                  );
                }}
              />
              <loaiVeForm.Field
                name="so_luong_con"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <Label>Số lượng</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        aria-invalid={isInvalid}
                        min={0}
                        type="number"
                      />
                    </Field>
                  );
                }}
              />
              <loaiVeForm.Field
                name="so_luong_mua_min"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <Label>Số lượng mua tối thiểu</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        aria-invalid={isInvalid}
                        min={0}
                        type="number"
                      />
                    </Field>
                  );
                }}
              />
              <loaiVeForm.Field
                name="so_luong_mua_max"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <Label>Số lượng mua tối đa</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        aria-invalid={isInvalid}
                        min={0}
                        type="number"
                      />
                    </Field>
                  );
                }}
              />
              <loaiVeForm.Field
                name="mo_ta"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field className={"col-span-2"}>
                      <Label>Mô tả</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type="text"
                      />
                    </Field>
                  );
                }}
              />
            </FieldSet>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" onClick={loaiVeForm.handleSubmit}>
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}

export default TicketForm;
