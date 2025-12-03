import { useForm } from "@tanstack/react-form";
import React from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventType, updateEventType } from "@/services/api";
import { toast } from "sonner";

const eventTypeSchema = z.object({
  ten_loai_su_kien: z.string().nonempty("Không được để trống"),
});

function EventTypeForm({ initalData, setEditingRecord }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      id: initalData?.id ?? "",
      ten_loai_su_kien: initalData?.ten_loai_su_kien ?? "",
      duong_dan: initalData?.duong_dan ?? "",
    },
    validators: {
      onSubmit: eventTypeSchema,
    },
    onSubmit: ({ value }) => {
      if (value.id) {
        toast.promise(updateMutation.mutateAsync(value), {
          loading: "Đang lưu",
          error: "Lưu thất bại",
          success: "Lưu thành công",
          position: "top-center",
        });
      } else {
        toast.promise(createMutation.mutateAsync(value), {
          loading: "Đang tạo mới",
          error: "Tạo thất bại",
          success: "Tạo thành công",
          position: "top-center",
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateEventType(data),
    onSuccess: ({ data }) => {
      setEditingRecord(null);
      queryClient.setQueryData(["event-types"], (old) => {
        const updated = old.map((e) => (e.id === data.id ? data : e));
        return updated;
      });
      // queryClient.invalidateQueries({ queryKey: ["event-types"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createEventType(data),
    onSuccess: ({ data }) => {
      setEditingRecord(null);
      queryClient.setQueryData(["event-types"], (old) => {
        return [data, ...old];
      });
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <DialogHeader>
            <DialogTitle>
              {initalData?.id ? "Chỉnh sửa loại sự kiện" : "Tạo loại sự kiện"}
            </DialogTitle>
            <DialogDescription>
              {initalData?.id
                ? "Chỉnh sửa thông tin về loại sự kiện. Nhấn lưu để hoàn tất việc chỉnh sửa"
                : "Tạo loại sự kiện. Nhấn lưu để hoàn tất việc tạo"}
            </DialogDescription>
          </DialogHeader>
          <form.Field
            name="ten_loai_su_kien"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Tên loại sự kiện</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError>aâ</FieldError>}
                </Field>
              );
            }}
          />
          <form.Field
            name="duong_dan"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Đường dẫn</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>
                    {field.state.value
                      ? `/events/?type=${field.state.value}`
                      : "Nếu để trống hệ thống sẽ tự động tạo đường dẫn"}
                  </FieldDescription>
                </Field>
              );
            }}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </FieldGroup>
      </form>
    </div>
  );
}

export default EventTypeForm;
