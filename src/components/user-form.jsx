import React from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./ui/field";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useForm } from "@tanstack/react-form";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState } from "react";
import { EyeIcon } from "lucide-react";
import { EyeOffIcon } from "lucide-react";
import { createUser, getRoles, updateUser } from "@/services/api";
import { toast } from "sonner";

function UserForm({ initalData, setEditingRecord }) {
  const queryClient = useQueryClient();
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    defaultValues: {
      id_nguoi_dung: initalData?.id_nguoi_dung ?? "",
      ho_ten: initalData?.ho_ten ?? "",
      email: initalData?.email ?? "",
      so_dien_thoai: initalData?.so_dien_thoai ?? "",
      ngay_sinh: initalData?.ngay_sinh ?? "",
      gioi_tinh: initalData?.gioi_tinh ?? "",
      id_vai_tro: initalData?.id_vai_tro ?? "",
      mat_khau: initalData?.mat_khau ?? "",
    },
    onSubmit: ({ value }) => {
      if (!!value.id_nguoi_dung) {
        toast.promise(updateMutation.mutateAsync(value), {
          loading: "Đang cập nhật người dùng",
          success: "Cập nhật thành công",
          error: "Cập thất bại",
          position: "top-center",
        });
      } else {
        toast.promise(createMutation.mutateAsync(value), {
          loading: "Đang tạo người dùng",
          success: "Tạo thành công",
          error: "Tạo thất bại",
          position: "top-center",
        });
      }
    },
  });

  const createMutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: createUser,
    onSuccess: ({ data }) => {
      setEditingRecord(null);
      queryClient.setQueryData(["users"], (old) => {
        return [data, ...old];
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: updateUser,
    onSuccess: ({ data }) => {
      setEditingRecord(null);
      queryClient.setQueryData(["users"], (old) => {
        const newData = old.map((e) =>
          e.id_nguoi_dung === data.id_nguoi_dung ? data : e
        );
        return newData;
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
              {initalData?.id_nguoi_dung
                ? "Chỉnh sửa người dùng"
                : "Tạo người dùng"}
            </DialogTitle>
            <DialogDescription>
              {initalData?.id_nguoi_dung
                ? "Chỉnh sửa thông tin người dùng. Nhấn lưu để hoàn tất việc chỉnh sửa"
                : "Tạo người dùng. Nhấn lưu để hoàn tất việc tạo"}
            </DialogDescription>
          </DialogHeader>
          <FieldSet>
            <form.Field
              name="ho_ten"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldLabel
                      className={"whitespace-nowrap"}
                      htmlFor={field.name}
                    >
                      Họ và tên
                    </FieldLabel>
                    <Input
                      className={"max-w-[280px]"}
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
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldLabel
                      className={"whitespace-nowrap"}
                      htmlFor={field.name}
                    >
                      Email
                    </FieldLabel>
                    <Input
                      className={"max-w-[280px]"}
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
              name="id_vai_tro"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldLabel
                      className={"whitespace-nowrap"}
                      htmlFor={field.name}
                    >
                      Vai tro
                    </FieldLabel>
                    <Select
                      disabled={!!initalData?.id_nguoi_dung}
                      value={Number(field.state.value)}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className={"w-[280px] max-w-[280px]"}>
                        <SelectValue placeholder="Chon vai tro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roles.map((role) => (
                            <SelectItem
                              key={role.id_vai_tro}
                              value={role.id_vai_tro}
                            >
                              {role.ten_vai_tro}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && <FieldError>aâ</FieldError>}
                  </Field>
                );
              }}
            />
            {!!initalData?.id_nguoi_dung || (
              <form.Field
                name="mat_khau"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="horizontal" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
                      <div className="w-[280px] relative">
                        <Input
                          className={"pr-12"}
                          type={showPassword ? "text" : "password"}
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {showPassword ? (
                          <EyeOffIcon
                            className="cursor-pointer absolute right-0 top-0 -translate-x-1/2 translate-y-1"
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <EyeIcon
                            className="cursor-pointer absolute right-0 top-0 -translate-x-1/2 translate-y-1"
                            onClick={() => setShowPassword(true)}
                          />
                        )}
                      </div>
                      {isInvalid && <FieldError>aâ</FieldError>}
                    </Field>
                  );
                }}
              />
            )}
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldDescription>Thông tin cá nhân</FieldDescription>
            <form.Field
              name="gioi_tinh"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Gioi tinh</FieldLabel>
                    <RadioGroup
                      className={"w-[280px] grid-cols-3"}
                      value={field.state.value || "NAM"}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <Field orientation="horizontal">
                        <RadioGroupItem value="NAM" id="gioi-tinh-nam" />
                        <FieldLabel htmlFor="gioi-tinh-nam">Nam</FieldLabel>
                      </Field>
                      <Field orientation="horizontal">
                        <RadioGroupItem value="NU" id="gioi-tinh-nu" />
                        <FieldLabel htmlFor="gioi-tinh-nu">Nữ</FieldLabel>
                      </Field>
                      <Field orientation="horizontal">
                        <RadioGroupItem value="KHAC" id="gioi-tinh-khac" />
                        <FieldLabel htmlFor="gioi-tinh-khac">Khác</FieldLabel>
                      </Field>
                    </RadioGroup>
                    {isInvalid && <FieldError>aâ</FieldError>}
                  </Field>
                );
              }}
            />
            <form.Field
              name="so_dien_thoai"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldLabel
                      className={"whitespace-nowrap"}
                      htmlFor={field.name}
                    >
                      So dien thoai
                    </FieldLabel>
                    <Input
                      className={"max-w-[280px]"}
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
              name="ngay_sinh"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldLabel
                      className={"whitespace-nowrap"}
                      htmlFor={field.name}
                    >
                      Ngày sinh
                    </FieldLabel>
                    <div className="w-[280px]">
                      <DatePicker
                        selected={field.state.value}
                        className={"w-[280px] border rounded-lg px-4 py-1"}
                        onChange={(value) => field.handleChange(value)}
                      />
                    </div>

                    {isInvalid && <FieldError>aâ</FieldError>}
                  </Field>
                );
              }}
            />
          </FieldSet>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </FieldGroup>
      </form>
    </div>
  );
}

export default UserForm;
