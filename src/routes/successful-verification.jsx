import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/successful-verification")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({});

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Xác thực thành công
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-sm text-muted-foreground">
            Tài khoản của bạn đã được xác thực thành công. Bạn có thể đăng nhập
            và sử dụng hệ thống.
          </p>

          <Button className="w-full" onClick={() => navigate({ to: "/login" })}>
            Đăng nhập
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
