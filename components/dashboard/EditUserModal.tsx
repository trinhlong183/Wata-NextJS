"use client";

import { useState, useTransition, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUser } from "@/app/actions/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type UserProps = {
  id: string;
  email: string;
  name: string | null;
};

export default function EditUserModal({ user }: { user: UserProps }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const promise = updateUser(user.id, formData).then((result) => {
        setIsOpen(false);
        router.refresh(); // Tải lại bảng
        return result;
      });

      toast.promise(promise, {
        loading: "Đang cập nhật...",
        success: "Cập nhật thành công!",
        error: (err) => err.message || "Cập nhật thất bại!",
      });
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex h-7 items-center rounded-md border border-blue-300 bg-blue-50 px-2 text-xs font-medium text-blue-700 hover:bg-blue-100">
          Sửa
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              defaultValue={user.email}
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Tên</label>
            <Input
              name="name"
              type="text"
              defaultValue={user.name || ""}
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Mật khẩu mới (Tùy chọn)
            </label>
            <Input
              name="password"
              type="password"
              placeholder="Bỏ trống nếu không muốn đổi"
            />
          </div>

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
