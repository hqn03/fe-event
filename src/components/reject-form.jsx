import React from "react";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { useForm } from "@tanstack/react-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEventApproval } from "@/services/api";
import { toast } from "sonner";

function RejectForm({ id, setId }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      ghi_chu: "",
      id: id,
      trang_thai: "TU_CHOI",
    },
    onSubmit: ({ value }) => {
      toast.promise(rejectMutation.mutateAsync(value), {
        loading: "Đang cập nhật",
        success: "Cập nhật thành công",
        error: "Cập nhật thất bại",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationKey: ["reject-event"],
    mutationFn: updateEventApproval,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["event-approvals"], (prev) => {
        return prev.filter(
          (e) => e.id_su_kien_phe_duyet !== data.id_su_kien_phe_duyet
        );
      });

      setId("");
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault(), form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="ghi_chu"
            children={(field) => {
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Ghi chú</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              );
            }}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Xác nhận</Button>
          </DialogFooter>
        </FieldGroup>
      </form>
    </div>
  );
}

export default RejectForm;
