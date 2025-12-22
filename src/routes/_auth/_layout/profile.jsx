import { useAuth } from "@/auth";
import FormProfile from "@/components/form-profile";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/me").then((res) => res.data),
  });

  if (meQuery.isLoading) return <p>Loading....</p>;
  const { id, role, ...userData } = meQuery.data;

  return (
    <div className="m-auto p-8">
      <FormProfile initData={userData} />
    </div>
  );
}
