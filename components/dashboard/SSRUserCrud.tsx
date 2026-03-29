"use client";

import { FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createUser } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SSRUserCrud() {
  const router = useRouter();
  const [isCreating, startCreating] = useTransition();

  // function handleCreate(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   const formData = new FormData(form);

  //   startCreating(async () => {
  //     try {
  //       await createUser(formData);
  //       toast.success("Tao user thanh cong");
  //       form.reset();
  //       router.refresh();
  //     } catch (error) {
  //       const message =
  //         error instanceof Error ? error.message : "Tao user that bai";
  //       toast.error("Tao user that bai", {
  //         description: message,
  //       });
  //     }
  //   });
  // }
  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startCreating(async () => {
      try {
        await createUser(formData);
        toast.success("Tạo user thành công!");
        form.reset();
        router.refresh();
      } catch (error: any) {
        // Lấy đúng message đã được ném ra từ file actions.ts
        const errMessage = error.message || "Có lỗi xảy ra";
        
        // Gọi Toast hiển thị
        toast.error("Lỗi tạo người dùng", {
          description: errMessage,
        });
      }
    });
  }
  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <h3 className="mb-3 text-base font-semibold">Create user</h3>
      <form onSubmit={handleCreate} className="grid gap-2">
        <Input
          name="email"
          type="email"
          required
          placeholder="user@example.com"
        />
        <Input name="name" type="text" required placeholder="Nguyen Van A" />
        <Input name="password" type="password" required placeholder="******" />
        <Button type="submit" disabled={isCreating} className="w-fit">
          {isCreating ? "Dang tao..." : "Tao user"}
        </Button>
      </form>
    </div>
  );
}
