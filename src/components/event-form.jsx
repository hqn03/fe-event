import "@mdxeditor/editor/style.css";
import {
  FieldContent,
  FieldDescription,
  FieldTitle,
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { Input } from "./ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import api, { createEvent, getEventTypes, signUrl } from "@/services/api";
import { useState } from "react";
import { Image } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useDebounce from "@/hooks/useDebounce";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import {
  MDXEditor,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  headingsPlugin,
  listsPlugin,
} from "@mdxeditor/editor";
import { useRef } from "react";
import { Button } from "./ui/button";
import { z } from "zod";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

function ChangeView({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords); // di chuyển map theo tọa độ mới
      map.invalidateSize(); // fix lỗi map chưa cập nhật
    }
  }, [coords, map]);

  return null;
}

const eventSchema = z
  .object({
    ten_su_kien: z.string().nonempty("Ten su kien khong duoc de trong"),
    hinh_anh: z.string().nonempty("Vui long gui anh"),
    id_loai_su_kien: z.string().nonempty("Chọn loại sự kiện"),
    ngay_bat_dau: z.coerce
      .date({ error: "Chọn ngày bắt đầu" })
      .refine((val) => val > new Date(), {
        error: "Ngày bắt đầu lớn hơn ngày hiện tại",
      }),
    ngay_ket_thuc: z.coerce.date({ error: "Chọn ngày kết thúc" }),
    dia_diem: z.string().nonempty("Vui long chon dia diem"),
    vi_do: z.number().min(-90).max(90),
    kinh_do: z.number().min(-180).max(180),
    mo_ta: z.string().min(100, { error: "It nhat 100 ki tu" }),
  })
  .refine((data) => data.ngay_ket_thuc >= data.ngay_bat_dau, {
    error: "Ngày kết thúc phải bằng hoặc lớn hơn ngày bắt đầu",
    path: ["ngay_ket_thuc"],
  });

//

function EventForm({ initData }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const form = useForm({
    defaultValues: initData
      ? { ...initData, id_loai_su_kien: String(initData.id_loai_su_kien) }
      : {
          ma_su_kien: "",
          hinh_anh: "",
          id_loai_su_kien: "",
          ten_su_kien: "",
          mo_ta: `## Giới thiệu sự kiện
Sự kiện [TEN_SU_KIEN] được tổ chức nhằm [MUC_DICH_SU_KIEN], hướng đến [DOI_TUONG_THAM_GIA], mang lại [GIA_TRI_MANG_LAI].

## Thời gian và địa điểm
Sự kiện diễn ra từ [THOI_GIAN_BAT_DAU] đến [THOI_GIAN_KET_THUC] tại [DIA_DIEM_TO_CHUC].

## Nội dung chương trình
Chương trình bao gồm các hoạt động chính như [NOI_DUNG_CHINH], được sắp xếp theo kế hoạch đã định.

## Lịch trình
Lịch trình dự kiến được triển khai theo các mốc thời gian [LICH_TRINH_CHUONG_TRINH].

## Khách mời
Sự kiện có sự tham gia của các khách mời gồm [KHACH_MOI].

## Đối tượng tham gia
Đối tượng tham gia bao gồm [DOI_TUONG_THAM_GIA].

## Thông tin bổ sung
[THONG_TIN_BO_SUNG]
`,
          ngay_bat_dau: "",
          ngay_ket_thuc: "",
          dia_diem: "",
          kinh_do: 0,
          vi_do: 0,
        },
    validators: {
      onSubmit: eventSchema,
      onChange: eventSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      if (initData) {
        api
          .put(`manager/events/${value.ma_su_kien}`, value)
          .then(({ data }) => {
            toast.success("Cập nhật thành công", { position: "top-center" });
            navigate({
              from: "/",
              to: "/manager/events/$eventId",
              params: { eventId: data.ma_su_kien },
              search: { type: "sessions" },
            });
          });
      } else {
        api
          .post("manager/events", value)
          .then((data) => {
            toast.promise("Tạo sự kiện thành công", { position: "top-center" });
            c;
            console.log(data);
            // navigate({
            //   from:"/",
            //   to:"/"
            // })
          })
          .catch(() => {
            toast.promise("Tạo sự kiện thất bại", { position: "top-center" });
          });
      }
      // if (pathname === "/manager/events/create") {
      //   toast.promise(creatEventMutation.mutateAsync(value), {
      //     loading: "Đang lưu",
      //     error: "Thất bại",
      //     success: "Tạo sự kiện thành công",
      //     position: "top-center",
      //   });
      // }
    },
  });

  const description = useRef(form.getFieldValue("mo_ta"));

  const [location, setLocation] = useState(form.getFieldValue("dia_diem"));
  const debouncedLocation = useDebounce(location, 500);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [formatedAddress, setFormatedAddress] = useState("");
  const [coords, setCoords] = useState([
    form.getFieldValue("vi_do"),
    form.getFieldValue("kinh_do"),
  ]);

  const { data: loaiSuKienData = [] } = useQuery({
    queryKey: ["event-types"],
    queryFn: () => getEventTypes(),
  });

  useEffect(() => {
    if (!debouncedLocation) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://maps.track-asia.com/api/v2/place/autocomplete/json?input=${location}&size=5&key=${"6854ba53649e0665385176128467019486"}&new_admin=true&include_old_admin=false`
        );
        console.log(res.data.predictions);
        setLocationSuggestions(res.data.predictions);
      } catch (err) {
        console.error(err);
      }
    };

    if (showLocationSuggestions) {
      fetchData();
    }

    console.log(debouncedLocation);
  }, [debouncedLocation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://maps.track-asia.com/api/v2/place/textsearch/json?language=vi&key=${"6854ba53649e0665385176128467019486"}&query=${formatedAddress}&new_admin=true`
        );
        form.setFieldValue("vi_do", res.data.results[0].geometry.location.lat);
        form.setFieldValue(
          "kinh_do",
          res.data.results[0].geometry.location.lng
        );
        setCoords([
          res.data.results[0].geometry.location.lat,
          res.data.results[0].geometry.location.lng,
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    if (formatedAddress) {
      fetchData();
    }

    return () => {
      setShowLocationSuggestions(false);
    };
  }, [formatedAddress]);

  const creatEventMutation = useMutation({
    mutationFn: (data) => createEvent(data),
    onSuccess: ({ data }) => {
      // navigate({
      //   to: "/manager/events",
      // });
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
    form.setFieldValue(
      "hinh_anh",
      `https://pub-851db7ad686448f389f5363660195143.r2.dev/${key}`
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    form.setFieldValue("mo_ta", description.current);
    form.handleSubmit();
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <form.Field
            name="hinh_anh"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return field.state.value ? (
                <Field>
                  <FieldLabel htmlFor={field.name}>Hình ảnh</FieldLabel>
                  <img src={field.state.value} />
                </Field>
              ) : (
                <Field>
                  <FieldLabel htmlFor={field.name}>Hình ảnh</FieldLabel>
                  <div
                    className={`border-2 border-dashed text-center *:mt-2 py-10 ${
                      isInvalid && "border-red-500"
                    }`}
                  >
                    {!uploadToR2Mutation.isPending ? (
                      <>
                        <Image className="mx-auto" size={48} />
                        <p className="">Chưa có hình ảnh</p>
                        <label className="bg-primary px-4 py-2 text-white inline-block rounded-lg">
                          Thêm hình ảnh
                          <Input
                            className="hidden"
                            id={field.name}
                            name={field.name}
                            onChange={handleImageChange}
                            type="file"
                            accept="image/*"
                          />
                        </label>
                      </>
                    ) : (
                      <h1>Uploading....</h1>
                    )}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="ten_su_kien"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Tên sự kiện</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="text"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <div className="grid grid-cols-3 gap-4">
            <form.Field
              name="id_loai_su_kien"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Loại sự kiện</FieldLabel>
                    <Select
                      value={String(field.state.value)}
                      onValueChange={field.handleChange}
                      aria-invalid={isInvalid}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chon loai su kien" />
                      </SelectTrigger>
                      <SelectContent>
                        {loaiSuKienData.map((e) => (
                          <SelectItem key={e.id} value={String(e.id)}>
                            {e.ten_loai_su_kien}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="ngay_bat_dau"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="space-y-3">
                    <FieldLabel htmlFor={field.name}>Ngày bắt đầu</FieldLabel>
                    <DatePicker
                      aria-invalid={isInvalid}
                      className={`border px-3 py-1 rounded-lg min-w-full! ${
                        isInvalid && "border-red-500"
                      }`}
                      selected={field.state.value}
                      id={field.name}
                      name={field.name}
                      onChange={(d) => {
                        d.setHours(0, 0, 0, 0);
                        field.handleChange(d);
                      }}
                      dateFormat={"dd/MM/yyyy"}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
                );
              }}
            />

            <form.Field
              name="ngay_ket_thuc"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="space-y-3">
                    <FieldLabel htmlFor={field.name}>Ngày kết thúc</FieldLabel>
                    <DatePicker
                      className={`border px-3 py-1 rounded-lg min-w-full! ${
                        isInvalid && "border-red-500"
                      }`}
                      selected={field.state.value}
                      id={field.name}
                      name={field.name}
                      onChange={(d) => {
                        d.setHours(23, 59, 0, 0);
                        field.handleChange(d);
                      }}
                      dateFormat={"dd/MM/yyyy"}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
                );
              }}
            />
          </div>

          <form.Field
            name="dia_diem"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="w-full overflow-hidden">
                  <FieldLabel className={"mb-4"} htmlFor={field.name}>
                    Địa điểm
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setShowLocationSuggestions(true);
                    }}
                    aria-invalid={isInvalid}
                    type="text"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {/* Gợi ý địa điểm */}
                  {showLocationSuggestions &&
                    locationSuggestions.length > 0 && (
                      <div className="absolute z-1500 w-full max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
                        {locationSuggestions.map((location, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setLocation(location.description);
                              setFormatedAddress(location.description);
                              form.setFieldValue(
                                "dia_diem",
                                location.description
                              );
                            }}
                            className="px-4 py-1 hover:bg-blue-50 cursor-pointer flex items-center space-x-2 border-b border-gray-100 last:border-b-0"
                          >
                            <span className="text-gray-700">
                              {location.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              );
            }}
          />

          {/* MAP */}
          <MapContainer
            id="map"
            className="map"
            center={coords}
            zoom={16}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords} />
            <ChangeView coords={coords} />
          </MapContainer>

          <form.Field
            name="mo_ta"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Mô tả</FieldLabel>
                  <MDXEditor
                    className={`prose border rounded-lg min-w-full max-h-[400px] overflow-scroll`}
                    markdown={description.current}
                    onChange={(v) => (description.current = v)}
                    plugins={[
                      toolbarPlugin({
                        toolbarContents: () => (
                          <>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <BlockTypeSelect />
                            <ListsToggle />
                          </>
                        ),
                      }),
                      headingsPlugin(),
                      listsPlugin(),
                    ]}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <Field className={"items-end"}>
            <Button
              type="submit"
              className={"max-w-24"}
              disabled={creatEventMutation.isPending}
            >
              Lưu
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default EventForm;
