import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import z from "zod";
import api, { signUrl } from "@/services/api";
import { useAuth } from "@/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const updateProfileSchema = z.object({
  email: z.email("Email không hợp lệ"),
  ho_ten: z.string().min(2).max(100),
  gioi_tinh: z.enum(["NAM", "NU", "KHAC"]),
  ngay_sinh: z.coerce.date(),
  so_dien_thoai: z
    .string()
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ")
    .optional(),
});

function FormProfile({ initData }) {
  const [open, setOpen] = useState(false);
  const { setUser } = useAuth();

  const profileForm = useForm({
    defaultValues: initData,
    onSubmit: ({ value }) => {
      api
        .put("/me", value)
        .then((res) => {
          toast.success("Cập nhật thành công", { position: "top-center" });
          setUser(res.data);
        })
        .catch(() => {
          toast.error("Cập nhật thất bại", { position: "top-center" });
        });
    },
    validators: {
      onSubmit: updateProfileSchema,
      onChange: updateProfileSchema,
    },
  });

  const uploadToR2Mutation = useMutation({
    mutationFn: ({ file, url }) => axios.put(url, file),
  });
  const getR2LinkMutation = useMutation({
    mutationFn: (file) => signUrl({ name: file.name }),
  });
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    // max size 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 10MB");
      e.target.value = null;
      return;
    }

    const { url, key } = await getR2LinkMutation.mutateAsync(file);
    await uploadToR2Mutation.mutateAsync({ file, url });
    profileForm.setFieldValue(
      "anh_dai_dien",
      `https://pub-851db7ad686448f389f5363660195143.r2.dev/${key}`
    );
  }

  return (
    <Card className={"max-w-3xl m-auto"}>
      <CardHeader>
        <CardTitle>Thông tin người dùng</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <profileForm.Field
              name="anh_dai_dien"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return field.state.value ? (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Ảnh đại diện</FieldLabel>
                    <img
                      className="size-36! m-auto object-cover rounded-full"
                      src={field.state.value}
                    />
                  </Field>
                ) : (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Hình ảnh</FieldLabel>
                    <div
                      className={`size-36! flex justify-center items-center m-auto border-dashed border-2 rounded-full ${isInvalid && "border-red-500"}`}
                    >
                      {!uploadToR2Mutation.isPending ? (
                        <>
                          <label
                            htmlFor={field.name}
                            className="bg-primary text-white rounded-full"
                          >
                            <Plus />
                          </label>
                          <Input
                            className="hidden"
                            id={field.name}
                            name={field.name}
                            onChange={handleImageChange}
                            type="file"
                            accept="image/*"
                          />
                        </>
                      ) : (
                        <h1>Uploading....</h1>
                      )}
                    </div>
                  </Field>
                );
              }}
            />
            <profileForm.Field
              name="ho_ten"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Họ tên</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="text"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <profileForm.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="text"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <profileForm.Field
              name="so_dien_thoai"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Số điện thoại</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="text"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <profileForm.Field
              name="gioi_tinh"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
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
            <profileForm.Field
              name="ngay_sinh"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className={"whitespace-nowrap"}
                      htmlFor={field.name}
                    >
                      Ngày sinh
                    </FieldLabel>
                    <div className="relative flex gap-2">
                      <Input
                        id="date"
                        value={formatDate(new Date(field.state.value))}
                        placeholder="June 01, 2025"
                        className="bg-background pr-10"
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          //   setValue(e.target.value);
                          //   if (isValidDate(date)) {
                          //     setDate(date);
                          //     setMonth(date);
                          //   }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpen(true);
                          }
                        }}
                      />
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                          >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Chọn ngày</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="end"
                          alignOffset={-8}
                          sideOffset={10}
                        >
                          <Calendar
                            mode="single"
                            selected={field.state.value}
                            captionLayout="dropdown"
                            onSelect={field.handleChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {isInvalid && <FieldError>aâ</FieldError>}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className={"flex-1"}
          size={"lg"}
          onClick={() => {
            profileForm.handleSubmit();
          }}
        >
          Cập nhật
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FormProfile;
